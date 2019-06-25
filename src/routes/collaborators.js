const express = require("express");
const router = express.Router();

const collaboratorController = require("../controllers/collaboratorController");

router.post("/wikis/:id/collaborators/add", collaboratorController.add);
router.post("/wikis/:id/collaborators/:userId/remove", collaboratorController.remove);

module.exports = router;