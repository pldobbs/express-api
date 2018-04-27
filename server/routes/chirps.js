const express = require("express");
const chirpStore = require("../../chirpstore");

let router = express.Router();

router.post("/", (req, res) => {
  console.log(req.body);
  chirpStore.CreateChirp(req.body);
  res.sendStatus(200);
});

router.get("/", (req, res) => {
  res.send(chirpStore.GetChirps());
});

router.get("/:id", (req, res) => {
  res.send(chirpStore.GetChirp(req.params.id));
});

router.put("/:id", (req, res) => {
  chirpStore.UpdateChirp(req.params.id, req.body);
  res.sendStatus(200);
});

router.delete("/:id", (req, res) => {
  chirpStore.DeleteChirp(req.params.id);
  res.sendStatus(200);
});
module.exports = router;
