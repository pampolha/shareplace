const dummyUsers = require("../models/dummyUsers");
const RequestError = require("../utils/places/errors/requestError");
const uuid = require("uuid").v4;

const getAll = (req, res) => {
  res.status(200).json({ users: dummyUsers });
};

const getById = (req, res) => {
  const user = dummyUsers.find((el) => el.id === req.params.id);
  if (!user) throw new RequestError("No user found for the given id", 404);
  res.status(200).json({ user });
};

const create = (req, res) => {
  const { name, email, password } = req.body;
  const user = {
    id: uuid(),
    name,
    email,
    password,
  };
  if (dummyUsers.some((el) => el.email === email))
    throw new RequestError("User with given email already exists", 409);
  dummyUsers.push(user);
  res.status(201).json({ message: "User created", user });
};

const login = (req, res) => {
  const { name, email, password } = req.body;
  const user = dummyUsers.find(
    (el) => el.email === email && el.password === password
  );
  if (!user)
    throw new RequestError(
      "Properties given do not match any user in the database",
      404
    );
  res.status(200).json({ message: "Login successful", user });
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
