import { NextFunction, Request, Response } from "express";
import RequestError from "../utils/errors/requestError";
import { getAddress, getLocation } from "../utils/places/location";
import Places, { placesSchema } from "../models/places";
import { HttpStatusCode } from "axios";
import { v4 as uuid } from "uuid";

const userIdIndex = (
  placesSchema.getAttributeValue("userId").index as { name?: string }
).name;
if (!userIdIndex) throw new Error("User id index is not defined");

const { NotFound, InternalServerError, Ok, Created } = HttpStatusCode;

const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const place = await Places.get(req.params.id);
    if (!place)
      return next(new RequestError("No place found for given id", NotFound));
    res.status(Ok).json(place);
  } catch (err) {
    console.error(err);
    next(
      new RequestError(
        "Something went wrong while getting places",
        InternalServerError
      )
    );
  }
};

const getByUserId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const queryResult = await Places.query("userId")
      .eq(req.params.id)
      .using(userIdIndex)
      .exec();
    if (!queryResult.count)
      return next(
        new RequestError("No places found for given user id", NotFound)
      );
    const places = await Places.batchGet(queryResult.map((item) => item.id));
    res.status(Ok).json({ places });
  } catch (err) {
    console.error(err);
    next(
      new RequestError(
        "Something went wrong while getting places",
        InternalServerError
      )
    );
  }
};

const deleteById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const place = await Places.get(req.params.id);
    if (!place)
      return next(new RequestError("No place found for given id", NotFound));
    await Places.delete(req.params.id);
    res.status(Ok).json({ message: "Place deleted", place });
  } catch (err) {
    console.error(err);
    next(
      new RequestError(
        "Something went wrong while deleting places",
        InternalServerError
      )
    );
  }
};

const deleteByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const queryResult = await Places.query("userId")
      .eq(req.params.id)
      .using(userIdIndex)
      .exec();
    if (!queryResult.count)
      return next(
        new RequestError("No places found for given user id", NotFound)
      );
    const placesids = queryResult.map((item) => item.id);
    const places = await Places.batchGet(placesids);
    await Places.batchDelete(placesids);
    res.status(Ok).json({ message: "Places deleted", places });
  } catch (err) {
    console.error(err);
    next(
      new RequestError(
        "Something went wrong while deleting places",
        InternalServerError
      )
    );
  }
};

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, description, location, address, userId } = req.body;
    const place = {
      id: uuid(),
      title,
      description,
      location: location ?? getLocation(address),
      address: address ?? getAddress(location),
      userId,
    };
    await Places.create(place);
    res.status(Created).json({ message: "Place created", place });
  } catch (err) {
    console.error(err);
    next(
      new RequestError(
        "Something went wrong while creating places",
        InternalServerError
      )
    );
  }
};

const modify = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const existingPlace = await Places.get(req.params.id);
    if (!existingPlace)
      return next(
        new RequestError("No place found for the given id", NotFound)
      );
    const { title, description, location, address } = req.body;
    const changes = {
      title: title ?? existingPlace.title,
      description: description ?? existingPlace.description,
      location: location ?? existingPlace.location,
      address: address ?? existingPlace.address,
    };
    const newPlace = await Places.update(req.params.id, changes);
    res.status(Ok).json({
      message: "Place modified",
      previousPlace: existingPlace,
      newPlace,
    });
  } catch (err) {
    console.error(err);
    next(
      new RequestError(
        "Something went wrong while modifiyng places",
        InternalServerError
      )
    );
  }
};

export default {
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
