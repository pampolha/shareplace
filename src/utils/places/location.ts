import RequestError from "../errors/requestError";
import axios, { HttpStatusCode } from "axios";
import getEnv from "../getEnv";

const env = getEnv();
const key = env.geocoding_key;
const desiredResultIndex = 0;
const { NotFound } = HttpStatusCode;

export const getLocation = async (address: string) => {
  const encodedAddress = encodeURIComponent(address);
  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${key}`
  );
  const { data } = response;
  if (!data || data.status === "ZERO_RESULTS") {
    throw new RequestError(
      "No location was found for the given address",
      NotFound
    );
  }
  return data.results[desiredResultIndex].geometry.location as {
    lat: number;
    lng: number;
  };
};

export const getAddress = async (location: { lat: number; lng: number }) => {
  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.lat},${location.lng}&key=${key}`
  );
  const { data } = response;
  if (!data || data.status === "ZERO_RESULTS") {
    throw new RequestError(
      "No location was found for the given location",
      NotFound
    );
  }
  return data.results[desiredResultIndex].formatted_address as string;
};
