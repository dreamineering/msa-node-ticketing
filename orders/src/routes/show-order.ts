import express, { Request, Response } from "express";

import { requireAuth, NotFoundError } from "@stackmates/common";

import { Order } from "../models/order";
import { NotAuthorisedError } from "./../../../common/src/errors/not-authorised-error";

const router = express.Router();

router.get(
  "/api/orders/:orderId",
  requireAuth,
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.orderId).populate("ticket");

    if (!order) {
      throw new NotFoundError("Order not found");
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorisedError();
    }

    res.send(order);
  }
);

export { router as showOrderRouter };
