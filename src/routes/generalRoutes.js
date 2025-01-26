const express = require("express");
const path = require("path");
const catchError = require("../lib/utils/catchError");
const router = express.Router();
const isLoggedInWithRedirect = require("../lib/utils/isLoggedInWithRedirect");
const { userService } = require("../lib/services");

router.get(
  "/",
  isLoggedInWithRedirect,
  catchError((req, res) => {
    res.sendFile(path.join(__dirname, "..", "..", "dist", "main.html"));
  })
);

router.get(
  "/register",
  catchError(async (req, res) => {
    res.sendFile(path.join(__dirname, "..", "views", "register.html"));
  })
);

router.get(
  "/login",
  catchError(async (req, res) => {
    res.sendFile(path.join(__dirname, "..", "views", "login.html"));
  })
);

router.get(
  "/logout",
  catchError(async (req, res) => {
    req.session.destroy();
    res.redirect("/login");
  })
);

router.post(
  "/register",
  catchError(async (req, res) => {
    const { username, password } = req.body;
    const user = await userService.registerUser(username, password);
    req.session.userId = user.id; /* 1 */
    res.redirect("/");
  })
);

router.post(
  "/login",
  catchError(async (req, res) => {
    const { username, password } = req.body;
    const user = await userService.loginUser(username, password);
    req.session.userId = user.id;
    res.redirect("/");
  })
);

module.exports = router;

/*
    ======================================
        COMMENTS - COMMENTS - COMMENTS
    ======================================

*** 1: The user.id property comes from how Mongoose maps the _id field of MongoDB documents to a more convenient id getter in JavaScript.
It provides a string representation of the _id field (which is an ObjectId type) for easier usage in JavaScript code.
console.log(user._id); // ObjectId("64b2d4e345abc12345678901")
console.log(user.id);  // "64b2d4e345abc12345678901" (string)

 i am not requiring mongoose in the file, how do i have access to mongoose user.id then?
The user object returned by userService.registerUser is a Mongoose document because registerUser uses this.Model (a Mongoose model) to create and save the user.
When you create or query documents using a Mongoose model, the returned object is an instance of a Mongoose document. This includes all virtual properties and methods, like user.id.
*/
