import express, { Router, Request, Response } from "express";
import { NotFoundError } from "@stackmates/common";
import { Ticket } from "../models/ticket";

const router = express.Router();

router.get("/api/tickets/:id", async (req: Request, res: Response) => {
  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    throw new NotFoundError("No matching ticket");
  }

  res.status(200).send(ticket);
});

export { router as showTicketRouter };
