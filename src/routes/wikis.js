const express = require("express");
const router = express.Router();

const wikiController = require("../controllers/wikiController");
const User = require("../../src/db/models").User;
const collaboratorController = require("../controllers/collaboratorController");

router.get("/wikis", wikiController.index);
router.get("/wikis/new", wikiController.new);
router.post("/wikis/create", wikiController.create);
router.get("/wikis/:id", wikiController.show);
router.post("/wikis/:id/destroy", wikiController.destroy);
router.get("/wikis/:id/edit", wikiController.edit);
router.post("/wikis/:id/update", wikiController.update);

router.post("/wikis/:id/collaborators/add", collaboratorController.add);
router.post("/wikis/:id/collaborators/:userId/remove", collaboratorController.remove);

module.exports = router;