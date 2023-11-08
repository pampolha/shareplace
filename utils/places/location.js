const axios = require("axios").default;
const dotenv = require("dotenv").config();
const RequestError = require("../../models/requestError");
const key = process.env.geocoding_key;

const getLocation = async (address) => {
  console.log('getLocation called');
  const encodedAddress = encodeURIComponent(address);
  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${key}`
  );
  const { data } = response;
  if (!data || data.status === "ZERO_RESULTS") {
    throw new RequestError("No location was found for the given address", 404);
  }
  return data.results[0].geometry.location;
};

const getAddress = async ({lat, lng}) => {
  console.log('getAddress called');

  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${key}`
  );
  const { data } = response;
  if (!data || data.status === "ZERO_RESULTS") {
    throw new RequestError("No location was found for the given location", 404);
  }
  return data.results[0].formatted_address;
}

module.exports = {getAddress, getlocation: getLocation};