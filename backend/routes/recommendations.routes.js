const express = require("express");
const router = express.Router();
const { recommend } = require("../controllers/recommendations.controller");

// POST /api/recommendations
// Public — auth zorunlu değil, kimse malzemelere bakarak tarif alabilir
router.post("/", recommend);

module.exports = router;
