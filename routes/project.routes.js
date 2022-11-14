"use strict";
const express = require("express");

const projectController = require("../controllers/project.controller");

const router = express.Router();

router.get("/validate/:id", projectController.validateProject);

module.exports = router;