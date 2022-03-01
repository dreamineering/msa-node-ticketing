import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  requireAuth,
  validateRequest,
  BadRequestError,
  NotFoundError,
  OrderStatus,
  NotAuthorisedError,
} from "@stackmates/common";
import { Order } from "../models/order";

const router = express.Router();

router.post(
  "/api/payments",
  requireAuth,
  [body("token").not().isEmpty(), body("orderId").not().isEmpty()],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;
    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError("Order not found");
    }

    // requireAuth has already checked that currentUser is set
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorisedError();
    }

    // Make sure the order is not already cancelled or complete
    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError("Order is already cancelled");
    }

    // Make sure the order is not already completed
    if (order.status === OrderStatus.Complete) {
      throw new BadRequestError("Order is already completed");
    }

    res.send({ success: true });
  }
);

export { router as createPaymentRouter };
