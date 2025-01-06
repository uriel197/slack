const express = require("express");
const router = express.Router();
const catchError = require("../lib/utils/catchError");
const isLoggedIn = require("../lib/utils/isLoggedIn");
const { messageService } = require("../lib/services");

router.get(
  "/api/v1/messages/:channelId",
  isLoggedIn,
  catchError(async (req, res) => {
    const { channelId } = req.params;
    const views = await messageService.getMessageViews(channelId);
    res.json(views);
  })
);

module.exports = router;
