import express from "express";
import { SubCategoryControllers } from "./subCategory.controller.ts";
import validateRequest from "../../middleware/validateRequest.ts";
import { SubCategoryValidation } from "./subCategory.validation.ts";

import auth from "../../utils/auth.ts";
import { USER_ROLE } from "../users/user.constant.ts";

const router = express.Router();

router.post(
  "/",
  auth(),
  validateRequest(SubCategoryValidation.createSubCategoryZodSchema),
  SubCategoryControllers.createSubCategory,
);
router.get("/", auth(), SubCategoryControllers.getAllSubCategory);
router.get("/:id", auth(), SubCategoryControllers.getSubCategoryById);
router.get("/:slug", auth(), SubCategoryControllers.getSubCategoryBySlug);
router.put(
  "/:id",
  auth(),
  validateRequest(SubCategoryValidation.updateSubCategoryZodSchema),
  SubCategoryControllers.updateSubCategory,
);
router.patch("/:id/status", auth(), SubCategoryControllers.updateSubCategoryStatus);
router.delete("/:id", auth(), SubCategoryControllers.deleteSubCategory);

export const SubCategoryRoutes = router;
