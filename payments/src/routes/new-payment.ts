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

import { natsWrapper } from "../nats-wrapper";
import { stripe } from "../stripe";

import { Order } from "../models/order";
import { Payment } from "../models/payment";
import { PaymentCreatedPublisher } from "./../events/publishers/payment-created-publisher";

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

    const charge = await stripe.charges.create({
      currency: "usd",
      amount: order.price * 100,
      source: token,
      description: `Charge for order ${order.id}`,
    });

    const payment = Payment.build({
      orderId: order.id,
      stripeId: charge.id,
    });
    await payment.save();
    await new PaymentCreatedPublisher(natsWrapper.client).publish({
      id: payment.id,
      orderId: payment.orderId,
      stripeId: payment.stripeId,
    });

    res.status(201).send({ id: payment.id });
  }
);

export { router as createPaymentRouter };
