"use strict"

const { Engine, Rule } = require("json-rules-engine");
const { getProjectById } = require("../utils/apiCaller");

const validateProjectRule = async (id) =>{
    const collectedData = await getProjectById(id);

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
      failedRules: []
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
        }
      }
    } while (isEvaluationFinished === false);
  
    return response;
  }

  module.exports = {
    validateProjectRule
  }