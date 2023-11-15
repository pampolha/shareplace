const { Router } = require("express");
const controller = require("../controllers/places");
const { getPlaceSchema } = require("../schemas/places/get");
const { createPlaceSchema } = require("../schemas/places/post");
const { deletePlaceSchema } = require("../schemas/places/delete");
const { modifyPlaceSchema } = require("../schemas/places/patch");
const requestValidator = require("../middleware/requestValidator");

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

module.exports = router;
