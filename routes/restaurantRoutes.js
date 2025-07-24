const express = require("express");
const router = express.Router();

const {
  createRestaurant,
  getAllRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
  deleteAllRestaurants,
} = require("../controller/restaurantCRUD");

// POST
router.post("/seed", createRestaurant);

// GET 
router.get("/", getAllRestaurants);

// GET 
router.get("/:id", getRestaurantById);

// PUT 
router.put("/:id", updateRestaurant);

// DELETE 
router.delete("/:id", deleteRestaurant);

//DELETE ALL
router.delete("/", deleteAllRestaurants);

module.exports = router;
