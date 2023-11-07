const dummyPlaces = require("../models/dummyPlaces");
const RequestError = require("../models/requestError");
const uuid = require("uuid").v4;

const getById = (req, res) => {
  const place = dummyPlaces.find((place) => place.id === req.params.id);
  if (!place) throw new RequestError("No place found for given id", 404);
  res.status(200).json(place);
};

const getByUserId = (req, res) => {
  const userPlaces = dummyPlaces.filter(
    (place) => place.creatorId === req.params.id
  );
  if (!userPlaces.length)
    throw new RequestError("No place found for given user id", 404);
  res.status(200).json(userPlaces);
};

const deleteById = (req, res) => {
  const placeIndex = dummyPlaces.findIndex((el) => el.id === req.params.id);
  if (!placeIndex) throw new RequestError("No place found for given id", 404);
  const place = dummyPlaces.at(placeIndex);
  dummyPlaces.splice(placeIndex, 1);
  res.status(200).json({ message: "Place deleted", place });
};

const deleteByUserId = (req, res) => {
  const hasPlaces = dummyPlaces.some((el) => el.creatorId === req.params.id);
  // if (!hasPlaces)
  //   throw new RequestError("No place found for given user id", 404);
  const places = [];
  dummyPlaces.forEach((el, i) => {
    if (el.creatorId === req.params.id) {
      places.push(el);
      dummyPlaces.splice(i, 1);
    }
  });
  res.status(200).json({ message: "Place(s) deleted", places });
};

const create = (req, res) => {
  const { title, description, coordinates, address, creatorId } = req.body;
  const place = {
    id: uuid(),
    title,
    description,
    location: coordinates,
    address,
    creatorId,
  };
  // if (Object.values(place).some((val) => !val))
  //   throw new RequestError(
  //     "Place must have properties: title, description, coordinates, address, creatorId"
  //   );
  dummyPlaces.push(place);
  res.status(201).json({ message: "Place created", place });
};

const modify = (req, res) => {
  const placeIndex = dummyPlaces.findIndex((el) => el.id === req.params.id);
  if (!placeIndex) throw new RequestError("No place found for given id", 404);
  const newProperties = new Object(
    ({ title, description, coordinates, address, creatorId } = req.body)
  );
  // if (!Object.values(newProperties).length)
  //   throw new RequestError("No properties were given", 422);
  const place = dummyPlaces.at(placeIndex);
  const newPlace = Object.fromEntries(
    Object.entries(place).map((entry) => {
      entry[1] = newProperties[entry[0]] ?? entry[1];
      return entry;
    })
  );
  dummyPlaces.splice(placeIndex, 1, newPlace);
  res
    .status(200)
    .json({ message: "Place modified", previousPlace: place, newPlace });
};

module.exports = {
  get: {
    byId: getById,
    byUserId: getByUserId,
  },
  delete: {
    byId: deleteById,
    byUserId: deleteByUserId,
  },
  post: {
    create,
  },
  patch: {
    modify,
  },
};