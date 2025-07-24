const express = require("express");
const cors = require("cors");
const { admin, db } = require("./firebase");
const bucket = admin.storage().bucket();
require("dotenv").config();
const app = express();


app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  req.db = db;
  req.bucket = bucket;
  next();
});

const restaurantRoutes = require("./routes/restaurantRoutes");
app.use("/restaurant", restaurantRoutes);

app.get("/", (req, res) => res.send("Dibbz Backend Running"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));