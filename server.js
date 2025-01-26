const app = require("./src/app");
const mongoose = require("mongoose");
const config = require("./src/config");
const port = process.env.PORT || 3000;

mongoose.connect(config.url);

app.listen(port, () => console.log(`server connected on port ${port}...`));

process.on("unhandledRejection", (e) => {
  console.log(e.message);
  process.exit(1);
});

/*
=============================================
        COMMENTS - COMMENTS - COMMENTS
=============================================

*** Explanations/Http-networkFlow
to read which of the files server as the entry point for the app

*/
