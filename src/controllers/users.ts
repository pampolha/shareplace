import { HttpStatusCode } from "axios";
import Users, { emailIndex } from "../models/users";
import RequestError from "../utils/errors/requestError";
import { v4 as uuid } from "uuid";
import { NextFunction, Request, Response } from "express";

const { NotFound, InternalServerError, Ok, Created, Conflict } = HttpStatusCode;
const publicAttributes = ["id", "name", "email", "createdAt"];

const getAll = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await Users.scan().attributes(publicAttributes).exec();
    res.status(Ok).json({ users });
  } catch (err) {
    console.error(err);
    next(
      new RequestError(
        "Something went wrong while getting users",
        InternalServerError
      )
    );
  }
};

const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await Users.get(req.params.id, {
      attributes: publicAttributes,
    });
    if (!user)
      return next(new RequestError("No user found for the given id", NotFound));
    res.status(Ok).json({ user });
  } catch (err) {
    console.error(err);
    next(
      new RequestError(
        "Something went wrong while getting users",
        InternalServerError
      )
    );
  }
};

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body;
    const user = {
      id: uuid(),
      name,
      email,
      password,
    };
    if ((await Users.query("email").eq(email).using(emailIndex).exec()).count) {
      return next(
        new RequestError("User with given email already exists", Conflict)
      );
    }
    await Users.create(user);
    res.status(Created).json({ message: "User created", user });
  } catch (err) {
    console.error(err);
    next(
      new RequestError(
        "Something went wrong while creating user",
        InternalServerError
      )
    );
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const loginError = new RequestError(
      "Properties given do not match any user in the database",
      NotFound
    );
    const { email, password } = req.body;
    const userId = (
      await Users.query("email").eq(email).using(emailIndex).exec()
    )?.[0]?.id;
    if (!userId) return next(loginError);
    const authenticated =
      (
        await Users.query("id")
          .eq(userId)
          .and()
          .attribute("password")
          .eq(password)
          .exec()
      ).count > 0;
    if (!authenticated) return next(loginError);
    res.status(Ok).json({ message: "Login successful", userId });
  } catch (err) {
    console.error(err);
    next(
      new RequestError(
        "Something went wrong during user login",
        InternalServerError
      )
    );
  }
};

export default {
  get: {
    all: getAll,
    byId: getById,
  },
  post: {
    create,
    login,
  },
};
