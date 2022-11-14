"use strict";

const express = require("express");

const employeeController = require("../controllers/employee.controller");

const router = express.Router();

router.get("/validate/:id", employeeController.validateEmployee);

module.exports = router;