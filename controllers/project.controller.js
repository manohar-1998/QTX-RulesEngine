"use strict";

const projectValidator = require("../validators/project.validator");

const validateProject = async (req, res, next) => {
    let id = req.params.id;
    // ID here is the single employee ID with his own data
    // Use current persons project name with and iterate whole employee table and sort same project employees
    // Check for same role, then check employee status with location

    try {
        let result = await projectValidator.validateProjectRule(id);
        res.status(200).json(result);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};

module.exports = { validateProject };
