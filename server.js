const app = require("./src/app");
const mongoose = require("mongoose");

mongoose
  .connect("mongodb://127.0.0.1:27017/local")
  .then(() => {
    console.log("Connected to MongoDB successfully!");
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}...`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  });

// Handle unhandled promise rejections
process.on("unhandledRejection", (error) => {
  console.error("Unhandled rejection:", error.message);
  process.exit(1);
});
