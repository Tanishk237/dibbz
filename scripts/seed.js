// scripts/seed.js
const { v4: uuidv4 } = require("uuid");
const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const restaurantCollection = db.collection("restaurants");

// Load and parse JSON
const data = require("../data/restaurantSample.json");
const restaurants = data.restaurants;

const seed = async () => {
  const batch = db.batch();

  restaurants.forEach((restaurant) => {
    const id = uuidv4();
    const docRef = restaurantCollection.doc(id);
    batch.set(docRef, { ...restaurant, id });
  });

  try {
    await batch.commit();
    console.log("🌱 Seeded restaurant data to Firestore!");
  } catch (error) {
    console.error("❌ Error seeding Firestore:", error);
  }
};

seed();
