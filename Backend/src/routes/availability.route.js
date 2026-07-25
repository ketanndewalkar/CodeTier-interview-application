import { Router } from "express";
import { authMiddleware, isAllowed } from "../middlewares/auth.middleware.js";
import { addBlock, createAvailability, getAvailability, removeBlock, updateAvailability } from "../controllers/availability.controller.js";

const router = Router();

router.use(authMiddleware, isAllowed("INTERVIEWER"));

router
  .route("/")
  .post(createAvailability)
  .get(getAvailability)
  .put(updateAvailability);

router.post("/blocks", addBlock);
router.delete("/blocks/:blockId", removeBlock);

export const AvailabilityRoutes = router;
