const app = require("./src/app");
const mongoose = require("mongoose");
const config = require("./src/config");

mongoose
  .connect(config.url)
  .then(() => {
    console.log("Connected to MongoDB successfully!");
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}...`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
    // process.exit(1);
  });

// Handle unhandled promise rejections
process.on("unhandledRejection", (error) => {
  console.error("Unhandled rejection:", error.message);
  process.exit(1);
});
