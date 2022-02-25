import express, { Request, Response } from "express";
import { body } from "express-validator";
import { requireAuth, validateRequest } from "@stackmates/common";

const router = express.Router();

router.post("/api/orders", async (req: Request, res: Response) => {
  res.send({});
});

export { router as createOrderRouter };
