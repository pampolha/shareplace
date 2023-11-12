const axios = require("axios").default;
const { configDotenv } = require("dotenv");
const RequestError = require("./errors/requestError");
const key = process.env.geocoding_key;
const env = configDotenv()?.parsed;

const getLocation = async (address) => {
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