const dummyPlaces = require("../../models/dummyPlaces");

const placeAlreadyExists = (location, address) => {
  const locationPredicate = location
    ? (place) =>
        place.location.lng === location.lng &&
        place.location.lat === location.lat
    : () => false;
  const addressPredicate = address
    ? (place) => place.address === address
    : () => false;
  return (
    dummyPlaces.some(locationPredicate) || dummyPlaces.some(addressPredicate)
  );
};

module.exports = placeAlreadyExists;
