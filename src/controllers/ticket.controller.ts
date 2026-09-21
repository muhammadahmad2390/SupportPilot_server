import { Ticket, validateUpdateTicketStatus } from "../models/ticket.model.ts";
import type { Request, Response } from "express";
import type {
  ticketsFilter,
  ticket,
  ticketStatusUpdate,
} from "../types/ticket.ts";
import { Types } from "mongoose";

const validStatuses = ["open", "resolved", "escalated"];

export const getTickets = async (
  req: Request<{}, {}, {}, ticketsFilter>,
  res: Response<ticket[] | { message: string }>,
) => {
  if (req.query.status && !validStatuses.includes(req.query.status as string)) {
    return res.status(400).json({ message: "Invalid status filter" });
  }

  try {
    const filter = req.query.status ? { status: req.query.status } : {};
    const tickets = await Ticket.find(filter);
    return res.status(200).json(tickets);
  } catch (err) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const getTicekt = async (
  req: Request<{ id: string }>,
  res: Response<ticket | { message: string }>,
) => {
  const isValidId = Types.ObjectId.isValid(req.params.id);
  if (!isValidId) return res.status(400).json({ message: "invalid id" });

  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket)
      return res.status(404).json({ message: "No ticket with this id found" });

    return res.status(200).json(ticket);
  } catch (err) {
    return res.status(500).json({ message: "something went wrong" });
  }
};

export const updateStatus = async (
  req: Request<{ id: string }, {}, ticketStatusUpdate>,
  res: Response<ticket | { message: string }>,
) => {
  const isValidId = Types.ObjectId.isValid(req.params.id);
  if (!isValidId) return res.status(400).json({ message: "invalid id" });
  const { error } = validateUpdateTicketStatus(req.body);
  if (error) return res.status(400).json({ message: error.message });

  try {
    const updatedTicket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true },
    );
    if (!updatedTicket)
      return res.status(404).json({ message: "No ticket with this id found" });
    return res.status(200).json(updatedTicket);
  } catch (err) {
    return res.status(500).json({ message: "something went wrong" });
  }
};
