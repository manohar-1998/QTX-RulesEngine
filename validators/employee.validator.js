"use strict"

const { Engine, Rule } = require("json-rules-engine");
const {
    getAllEmployeesData,
    getEmployeeDataById,
    getEmpDataWithProjectId
} = require("../utils/apiCaller");

const employeeLocationValidation = new Rule({
  conditions: {
    all: [
      {
        fact: "EMP_DATA",
        path: "$.location",
        operator: "equal",
        value: "HYD"
      }
    ]
  }, 
  event: {
    type: "Employee Location Validation",
    params: {
      onSuccess: "TERMINATE",
      successMessage:"Rule Passed",
      successMessage: "Employee Rule Validation Passed",
      onFailure: "TERMINATE",
      failureMessage:"Rule Failed",
      failureMessage: "Employee Rule Validation Failed at Employee Location Validation"
    }
  }
})
const employeeStatusValidation = new Rule({
  conditions: {
    all: [
      {
        fact: "EMP_DATA",
        path: "$.employee_status",
        operator: "equal",
        value: "current employee"
      }
    ]
  },
  event: {
    type: "Employee Status Validation",
    params: {
      onSuccess: "FIRE_RULE",
      successRuleName: employeeLocationValidation,
      onFailure: "TERMINATE",
      failureMessage: "Employee not belongs to Hyderabad Location",
    }
  }
})
const documentValidationRule = new Rule({
  conditions: {
    all: [
      {
        fact: "EMP_DATA",
        path: "$.projects",
        operator: "equal",
        value: "FGS"
      }
    ]
  },
  event: {
    type: "Project Validation",
    params: {
      onSuccess: "FIRE_RULE",
      successRuleName: employeeStatusValidation,
      onFailure: "TERMINATE",
      failureMessage: "Employee does not belong to FGS project"
    }
  }
})

  const loadRuleAndRun = async (rule, collectedData) => {
    // Creating a new instance of engine
    let engine = new Engine([rule], { allowUndefinedFacts: true });
  

    // Loading facts
    engine.addFact("EMP_DATA", collectedData);
  
    // Evaluating rules
    let results = await engine.run();
  
    return results;
  };

  const validateEmployeeRule = async (id) =>{
    const collectedData = await getEmployeeDataById(id);
    let project_id = collectedData.project_id;
    const fgsProjectTeamList = await getEmpDataWithProjectId(project_id)

    let results = await loadRuleAndRun(
      documentValidationRule,
      collectedData
    );

    let isEvaluationFinished = false;
    let response = {
      status: "AMBIGUOUS",
      message: "The rule engine can't reach a deterministic outcome",
      evaluatedRules: [],
      successRules:[],
      failedRules: [],
      employeeStack: []
    };


 
  
    do {
      // Parsing the results to decide the next operation
      let resultAlmanac = results.almanac;
      let resultEvents = resultAlmanac.events;
      let successEvents = resultEvents.success;
      let failureEvents = resultEvents.failure;

  
      if (successEvents.length > 0) {
        response.evaluatedRules.push(successEvents[0].type);
        let data = successEvents[0].params;
        if (data.onSuccess === "TERMINATE") {
          response.successRules.push(successEvents[0].type);
          response.status = data.successStatus;
          response.message = data.successMessage;
          isEvaluationFinished = true;
        } else if (data.onSuccess === "FIRE_RULE") {
          response.successRules.push(successEvents[0].type);
          results = await loadRuleAndRun(
            data.successRuleName,
            collectedData
          );
        }
      } else {
        response.evaluatedRules.push(failureEvents[0].type);
        response.failedRules.push(failureEvents[0].type)
        let data = failureEvents[0].params;
        if (data.onFailure === "TERMINATE") {
          response.status = data.failureStatus;
          response.message = data.failureMessage;
          isEvaluationFinished = true;
        }else if (data.onFailure === "FIRE_RULE") {
          results = await loadRuleAndRun(
            data.failureRuleName,
            collectedData
          );
        } else if(response.failedRules.length === 0){
          console.log("Pass")
        }
      }
    } while (isEvaluationFinished === false);
  
    return response;
  }

  module.exports = {
    validateEmployeeRule
  }