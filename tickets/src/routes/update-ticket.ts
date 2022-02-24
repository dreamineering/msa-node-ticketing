import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  validateRequest,
  requireAuth,
  NotAuthorisedError,
  NotFoundError,
} from "@stackmates/common";
import { Ticket } from "../models/ticket";

const router = express.Router();

router.put(
  "/api/tickets/:id",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be provided and be greater than 0"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      throw new NotFoundError("No ticket here");
    }

    if (ticket.userId !== req.currentUser!.id) {
      throw new NotAuthorisedError();
    }

    res.send(ticket);
  }
);

export { router as updateTicketRouter };
