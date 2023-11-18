import RequestError from "../errors/requestError";
import axios, { HttpStatusCode } from "axios";
import { env } from "../../driver";

const key = env.geocoding_key;
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
  return data.results[0].geometry.location as { lat: Number; lng: Number };
};

export const getAddress = async (location: { lat: Number; lng: Number }) => {
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
  return data.results[0].formatted_address as string;
};
