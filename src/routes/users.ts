import express from "express";
import controller from "../controllers/users";
import { getUserSchema } from "../validation/users/get";
import { createUserSchema, userLoginSchema } from "../validation/users/post";
import requestValidator from "../middleware/requestValidator";

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
