const RequestError = require("../utils/errors/requestError");
const { getAddress, getlocation } = require("../utils/places/location");
const Places = require("../models/places");
const uuid = require("uuid").v4;

const getById = async (req, res, next) => {
  try {
    const place = await Places.get(req.params.id);
    if (!place)
      return next(new RequestError("No place found for given id", 404));
    res.status(200).json(place);
  } catch (err) {
    console.error(err);
    next(new RequestError("Something went wrong while getting places", 500));
  }
};

const getByUserId = async (req, res, next) => {
  try {
    const queryResult = await Places.query("userId")
      .eq(req.params.id)
      .using("userId-index")
      .exec();
    if (!queryResult.count)
      return next(new RequestError("No places found for given user id", 404));
    const places = await Places.batchGet(queryResult.map((item) => item.id));
    res.status(200).json({ places });
  } catch (err) {
    console.error(err);
    next(new RequestError("Something went wrong while getting places", 500));
  }
};

const deleteById = async (req, res, next) => {
  try {
    const place = await Places.get(req.params.id);
    if (!place)
      return next(new RequestError("No place found for given id", 404));
    await Places.delete(req.params.id);
    res.status(200).json({ message: "Place deleted", place });
  } catch (err) {
    console.error(err);
    next(new RequestError("Something went wrong while deleting places", 500));
  }
};

const deleteByUserId = async (req, res, next) => {
  try {
    const queryResult = await Places.query("userId")
      .eq(req.params.id)
      .using("userId-index")
      .exec();
    if (!queryResult.count)
      return next(new RequestError("No places found for given user id", 404));
    const placesids = queryResult.map((item) => item.id);
    const places = await Places.batchGet(placesids);
    await Places.batchDelete(placesids);
    res.status(200).json({ message: "Places deleted", places });
  } catch (err) {
    console.error(err);
    next(new RequestError("Something went wrong while deleting places", 500));
  }
};

const create = async (req, res, next) => {
  try {
    const { title, description, location, address, userId } = req.body;
    const place = {
      id: uuid(),
      title,
      description,
      location: location ?? getlocation(address),
      address: address ?? getAddress(location),
      userId,
    };
    await Places.create(place);
    res.status(201).json({ message: "Place created", place });
  } catch (err) {
    console.error(err);
    next(new RequestError("Something went wrong while creating places", 500));
  }
};

const modify = async (req, res, next) => {
  try {
    const existingPlace = await Places.get(req.params.id);
    if (!existingPlace)
      return next(new RequestError("No place found for the given id", 404));
    const { title, description, location, address } = req.body;
    const changes = {
      title: title ?? existingPlace.title,
      description: description ?? existingPlace.description,
      location: location ?? existingPlace.location,
      address: address ?? existingPlace.address,
    };
    const newPlace = await Places.update(req.params.id, changes);
    res
      .status(200)
      .json({
        message: "Place modified",
        previousPlace: existingPlace,
        newPlace,
      });
  } catch (err) {
    console.error(err);
    next(new RequestError("Something went wrong while modifiyng places", 500));
  }
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
