const express = require("express");
const controller = require("../controllers/users");
const { getUserSchema } = require("../schemas/users/get");
const requestValidator = require("../middleware/requestValidator");
const { createUserSchema, userLoginSchema } = require("../schemas/users/post");

const router = express.Router();

router.get("/", controller.get.all);
router.get("/:id", requestValidator(getUserSchema), controller.get.byId);
router.post(
  "/signup",
  requestValidator(createUserSchema),
  controller.post.create
);
router.post("/login", requestValidator(userLoginSchema), controller.post.login);

module.exports = router;
