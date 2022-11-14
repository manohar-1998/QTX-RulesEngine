"use strict"

const { Engine, Rule } = require("json-rules-engine");
const {
    getRule01Data,
    getRule01DataById
} = require("../utils/apiCaller");



let engine = new Engine([rule], { allowUndefinedFacts: true });
engine.addFact('account-information', function (params, almanac) {
    console.log('loading account information...')
    return almanac.factValue('accountId')
      .then((accountId) => {
        return apiClient.getAccountInformation(accountId)
      })
  })

  const validateInitialRule = async () =>{
    const sourceData = await getRule01Data();
    const collectedData = await getRule01DataById(id);
  }

  module.exports = {
    validateInitialRule
  }