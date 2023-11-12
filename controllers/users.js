const Users = require("../models/users");
const RequestError = require("../utils/places/errors/requestError");
const uuid = require("uuid").v4;

const publicAttributes = ["id", "name", "email", "createdAt"];

const getAll = async (req, res, next) => {
  try {
    const users = await Users.scan().attributes(publicAttributes).exec();
    await res.status(200).json({ users });
  } catch (err) {
    console.error(err);
    next(new RequestError("Something went wrong while getting users", 500));
  }
};

const getById = async (req, res, next) => {
  try {
    const user = await Users.get(req.params.id, {
      attributes: publicAttributes,
    });
    if (!user) return next(new RequestError("No user found for the given id", 404));
    res.status(200).json({ user });
  } catch (err) {
    console.error(err);
    next(new RequestError("Something went wrong while getting users", 500));
  }
};

const create = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const user = {
      id: uuid(),
      name,
      email,
      password,
    };
    if (
      (await Users.query("email").eq(email).using("email-index").exec()).count
    ) {
      return next(
        new RequestError("User with given email already exists", 409)
      );
    }
    await Users.create(user);
    res.status(201).json({ message: "User created", user });
  } catch (err) {
    console.error(err);
    next(new RequestError("Something went wrong while creating user", 500));
  }
};

const login = async (req, res, next) => {
  try {
    const loginError = new RequestError(
      "Properties given do not match any user in the database",
      404
    );
    const { email, password } = req.body;
    const userId = (
      await Users.query("email").eq(email).using("email-index").exec()
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
    res.status(200).json({ message: "Login successful", userId });
  } catch (err) {
    console.error(err);
    next(new RequestError("Something went wrong during user login", 500));
  }
};

module.exports = {
  get: {
    all: getAll,
    byId: getById,
  },
  post: {
    create,
    login,
  },
};
