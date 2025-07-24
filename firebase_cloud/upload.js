
const path = require("path");

app.post("/upload", async (req, res) => {
  try {
    const filePath = path.join(__dirname, "images/test1.jpg"); 
    const destination = "restaurants/restaurant1.jpg"; 

    await bucket.upload(filePath, {
      destination,
      metadata: {
        contentType: "image/jpeg",
      },
    });

    res.send("File uploaded successfully!");
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).send("Failed to upload file.");
  }
});
