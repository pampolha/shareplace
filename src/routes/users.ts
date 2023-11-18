import express from "express";
import controller from "../controllers/users";
import { getUserSchema } from "../schemas/users/get";
import requestValidator from "../middleware/requestValidator";
import { createUserSchema, userLoginSchema } from "../schemas/users/post";

const router = express.Router();

router.get("/", controller.get.all);
router.get("/:id", requestValidator(getUserSchema), controller.get.byId);
router.post(
  "/signup",
  requestValidator(createUserSchema),
  controller.post.create
);
router.post("/login", requestValidator(userLoginSchema), controller.post.login);

export default router;
