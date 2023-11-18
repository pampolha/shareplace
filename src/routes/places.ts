import { Router } from "express";
import controller from "../controllers/places";
import { getPlaceSchema } from "../schemas/places/get";
import { createPlaceSchema } from "../schemas/places/post";
import { deletePlaceSchema } from "../schemas/places/delete";
import { modifyPlaceSchema } from "../schemas/places/patch";
import requestValidator from "../middleware/requestValidator";

const router = Router();

router.get("/:id", requestValidator(getPlaceSchema), controller.get.byId);
router.get("/user/:id", requestValidator(getPlaceSchema), controller.get.byUserId);
router.post("/", requestValidator(createPlaceSchema), controller.post.create);
router.delete("/:id", requestValidator(deletePlaceSchema), controller.delete.byId);
router.delete(
  "/user/:id",
  requestValidator(deletePlaceSchema),
  controller.delete.byUserId
);
router.patch("/:id", requestValidator(modifyPlaceSchema), controller.patch.modify);

export default router;
