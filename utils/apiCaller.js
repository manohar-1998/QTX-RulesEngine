"use strict";

const axios = require("axios");
const dotenv = require("dotenv");

// Fix for accepting insecure connections
const https = require("https");

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

dotenv.config({ debug: true });

const DB_API_URL = process.env.DB_API_PORT;

// const getProjectsData = async () =>{
//     let dataResponse = null;
//      try{
//         dataResponse = await axios.get(`${DB_API_URL}/api/projects`,{httpsAgent});
//      }
// }

const getRule01Data = async () =>{
    let dataResponse = null;

    try {
        dataResponse = await axios.get(`${DB_API_URL}/api/rule01`,{ httpsAgent });
        console.log("Rule Data = ",dataResponse);
        return dataResponse;
    }
    catch(error){
        console.log("Error Occurred at Rule Data = ",error)
        throw error;
    }
}

const getRule01DataById = async (id) => {
  let dataResponse = null;

  try {
    dataResponse = await axios.get(
      `${DB_API_URL}/api/rule01/${id}`,
      { httpsAgent }
    );
    console.log("Rule Data By ID =",dataResponse)
    let data = dataResponse.data.data[0];

    return data;
  } catch (error) {
    throw error;
  }
};

const getAllEmployeesData = async (req, res) => {

  let dataResponse = null;

  try {
    dataResponse = await axios.get(`${DB_API_URL}/api/employee`, {httpsAgent});
    return dataResponse;
  }
  catch (error) {
    return error;
  }
};

const getEmployeeDataById = async (id) => {
  let dataResponse = null;

  try {
    dataResponse = await axios.get(
      `${DB_API_URL}/api/employee/${id}`,
      { httpsAgent }
    );
    let data = dataResponse.data.respose[0];

    return data;
  } catch (error) {
    throw error;
  }
};

const getEmpDataWithProjectId = async (project_id) => {
  let dataResponse = null;
  try {
    dataResponse = await axios.get(
      `${DB_API_URL}/api/employee/project/${project_id}`, {httpsAgent}
    );
    let data = dataResponse.data;
    return data
  } catch (error) {
    throw error;
  }
}

const getAllProjects = async (req, res) => {
  let dataResponse = null;

  try{
    dataResponse = await axios.get(`${DB_API_URL}/api/project`,{httpsAgent});
    return dataResponse;
  } catch (error){
    throw error;
  }
}

const getProjectById = async (projectId) => {
  let dataResponse = null;
  try{
    dataResponse = await axios.get(
      `${DB_API_URL}/api/project/${projectId}`,
      { httpsAgent }
    );
    let data = dataResponse.data[0];
    console.log("Data Check=",dataResponse.data[0]);
    return data;
  } catch (error) {
    throw error;
  }
}


module.exports = {
    getRule01Data,
    getRule01DataById,
    getAllEmployeesData,
    getEmployeeDataById,
    getEmpDataWithProjectId,
    getAllProjects,
    getProjectById
}