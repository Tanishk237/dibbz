const { v4: uuidv4 } = require("uuid");
const { admin, db } = require("../firebase");
const restaurantSample = require("../data/restaurants/01/details.json");
const restaurantCollection = db.collection("restaurants");

// CREATE

const createRestaurant = async (req, res) => {
  try {
    const data = require("../data/restaurants/01/details.json");
    const restaurants = data.restaurants;
    const batch = db.batch();

    restaurants.forEach((restaurant) => {
      const id = uuidv4();
      const docRef = restaurantCollection.doc(id);
      batch.set(docRef, { ...restaurant, id });
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

    if (!data || typeof data !== 'object' || Array.isArray(data)) {
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

// EXPORTING ALL CONTROLLERS
module.exports = {
  createRestaurant,
  getAllRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant
};