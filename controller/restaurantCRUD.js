const { v4: uuidv4 } = require("uuid");
const { admin, db } = require("../firebase");
const path = require("path");
const fs = require("fs");

const restaurantCollection = db.collection("restaurants");

//Loading data
const loadRestaurantData = () => {
  const restaurantsDir = path.join(__dirname, "../data/restaurants");
  const restaurantIds = fs.readdirSync(restaurantsDir);
  const restaurants = [];

  restaurantIds.forEach((id) => {
    const detailsPath = path.join(restaurantsDir, id, "details.json");

    if (!fs.existsSync(detailsPath)) {
      console.warn(`Missing details.json for restaurant ${id}`);
      return;
    }

    const details = JSON.parse(fs.readFileSync(detailsPath, "utf-8"));

    const menuPath = path.join(restaurantsDir, id, "menu");
    const menuItems = [];

    if (fs.existsSync(menuPath)) {
      const menuFiles = fs.readdirSync(menuPath);
      menuFiles.forEach((file) => {
        const itemPath = path.join(menuPath, file);
        const itemData = JSON.parse(fs.readFileSync(itemPath, "utf-8"));
        menuItems.push(itemData);
      });
    }

    restaurants.push({
      ...details,
      id,
      menu: menuItems,
    });
  });

  return restaurants;
};

// CREATE
const createRestaurant = async (req, res) => {
  try {
    const restaurants = loadRestaurantData();
    const batch = db.batch();

    restaurants.forEach((restaurant) => {
      const docId = uuidv4();
      const docRef = restaurantCollection.doc(docId);
      batch.set(docRef, { ...restaurant, firebaseId: docId });
    });

    await batch.commit();
    res.status(201).send({ message: "Seeded restaurant data successfully." });
  } catch (error) {
    console.error("Seeding error:", error);
    res.status(500).send("Failed to seed restaurant data.");
  }
};

// READ (All)
const getAllRestaurants = async (req, res) => {
  try {
    const snapshot = await restaurantCollection.get();
    const restaurants = [];

    snapshot.forEach((doc) => {
      restaurants.push(doc.data());
    });

    res.status(200).json(restaurants);
  } catch (error) {
    console.error("Read Error:", error);
    res.status(500).send("Failed to fetch restaurants");
  }
};

const getRestaurantById = async (req, res) => {
  try {
    const id = req.params.id;
    const doc = await restaurantCollection.doc(id).get();

    if (!doc.exists) {
      return res.status(404).send("Restaurant not found");
    }

    res.status(200).json(doc.data());
  } catch (error) {
    console.error("Fetch One Error:", error);
    res.status(500).send("Failed to fetch restaurant");
  }
};

// UPDATE
const updateRestaurant = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;

    if (!data || typeof data !== "object" || Array.isArray(data)) {
      return res.status(400).send("Invalid update data");
    }

    await restaurantCollection.doc(id).update(data);
    res.status(200).send("Restaurant updated");
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).send("Failed to update restaurant");
  }
};

// DELETE
const deleteRestaurant = async (req, res) => {
  try {
    const id = req.params.id;
    await restaurantCollection.doc(id).delete();
    res.status(200).send("Restaurant deleted");
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).send("Failed to delete restaurant");
  }
};


const deleteAllRestaurants = async (req, res) => {
  try {
    const snapshot = await restaurantCollection.get();

    if (snapshot.empty) {
      return res.status(200).send("No restaurants to delete.");
    }

    const batch = db.batch();

    snapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();

    res.status(200).send("All restaurants deleted successfully.");
  } catch (error) {
    console.error("Delete All Error:", error);
    res.status(500).send("Failed to delete all restaurants");
  }
};

module.exports = {
  createRestaurant,
  getAllRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
  deleteAllRestaurants,
};
