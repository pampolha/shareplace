import { NextFunction, Request, Response } from "express";
import RequestError from "../utils/errors/requestError";
import { getAddress, getLocation } from "../utils/places/location";
import Places, { userIdIndex } from "../models/places";
import { HttpStatusCode } from "axios";
import { v4 as uuid } from "uuid";
import { AnyItem } from "dynamoose/dist/Item";

const { NotFound, InternalServerError, Ok, Created } = HttpStatusCode;

const userPlacesIds = async (req: Request) =>
  Array.from(
    await Places.query("userId")
      .eq(req.params.id)
      .attributes(["id"])
      .using(userIdIndex)
      .exec()
  );

const manipulateBatchData = async (
  operation: "get" | "delete",
  placesIds: AnyItem[]
) => {
  const places = [];
  const batchLimit = 100;
  for (
    let startIndex = 0;
    startIndex < placesIds.length;
    startIndex += batchLimit
  ) {
    const ids = placesIds
      .slice(startIndex, startIndex + batchLimit)
      .map((item) => item.id);
    const batchResult = await Places.batchGet(ids);
    places.push(...batchResult);
    if (operation === "delete") await Places.batchDelete(ids);
  }
  return places;
};

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
    const placesIds = await userPlacesIds(req);
    if (!placesIds.length) {
      return next(
        new RequestError("No places found for given user id", NotFound)
      );
    }
    const places = await manipulateBatchData("get", placesIds);
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
    const placesIds = await userPlacesIds(req);
    if (!placesIds.length) {
      return next(
        new RequestError("No places found for given user id", NotFound)
      );
    }
    const places = await manipulateBatchData("delete", placesIds);
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
