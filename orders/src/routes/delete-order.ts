import express, { Request, Response } from "express";

import {
  requireAuth,
  OrderStatus,
  NotFoundError,
  NotAuthorisedError,
} from "@stackmates/common";
import { Order } from "../models/order";

const router = express.Router();

router.delete(
  "/api/orders/:orderId",
  requireAuth,
  async (req: Request, res: Response) => {
    // cancel the order
    const { orderId } = req.params;
    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError("Order not found");
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorisedError();
    }

    order.status = OrderStatus.Cancelled;
    await order.save();

    res.status(204).send(order);
  }
);

export { router as deleteOrderRouter };
