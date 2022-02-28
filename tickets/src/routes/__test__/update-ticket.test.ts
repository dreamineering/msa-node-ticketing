import request from "supertest";
import mongoose from "mongoose";
import { app } from "../../app";
import { natsWrapper } from "../../nats-wrapper";
import { Ticket } from "../../models/ticket";

const createTicket = (title: string, price: number) => {
  return request(app)
    .post("/api/tickets")
    .set("Cookie", global.getAuthCookie())
    .send({
      title,
      price,
    });
};

it("returns 404 if the provided id does not exist", async () => {
  // Arrange
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", global.getAuthCookie())
    .send({
      title: "Bogus",
      price: 20,
    })
    .expect(404);
});

it("returns 401 if user not authenticated", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: "Bogus",
      price: 20,
    })
    .expect(401);
});

it("returns 401 if user does not own the ticket", async () => {
  const ticket = await createTicket("Edit Me", 20);

  await request(app)
    .put(`/api/tickets/${ticket.body.id}`)
    .set("Cookie", global.getAuthCookie())
    .send({
      title: "Bogus",
      price: 20,
    })
    .expect(401);
});

it("returns 400 if user provides invalid title and price", async () => {
  const userCookie = global.getAuthCookie();
  const ticket = await request(app)
    .post("/api/tickets")
    .set("Cookie", userCookie)
    .send({
      title: "Surfboard",
      price: 50,
    });

  await request(app)
    .put(`/api/tickets/${ticket.body.id}`)
    .set("Cookie", userCookie)
    .send({
      title: "",
      price: 40,
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${ticket.body.id}`)
    .set("Cookie", userCookie)
    .send({
      title: "Bogus",
      price: 0,
    })
    .expect(400);
});

// happy path
it("returns 200 if everything is good", async () => {
  const userCookie = global.getAuthCookie();
  const ticket = await request(app)
    .post("/api/tickets")
    .set("Cookie", userCookie)
    .send({
      title: "Surfboard",
      price: 50,
    });

  // Good
  await request(app)
    .put(`/api/tickets/${ticket.body.id}`)
    .set("Cookie", userCookie)
    .send({
      title: "UnBogus",
      price: 55,
    })
    .expect(200);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${ticket.body.id}`)
    .send();

  // Assert
  expect(ticketResponse.body.title).toEqual("UnBogus");
  expect(ticketResponse.body.price).toEqual(55);
});

it("publishes an event", async () => {
  const userCookie = global.getAuthCookie();
  const ticket = await request(app)
    .post("/api/tickets")
    .set("Cookie", userCookie)
    .send({
      title: "Surfboard",
      price: 50,
    });

  // Good
  await request(app)
    .put(`/api/tickets/${ticket.body.id}`)
    .set("Cookie", userCookie)
    .send({
      title: "UnBogus",
      price: 55,
    })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it("rejects updates if the ticket is reserved", async () => {
  const userCookie = global.getAuthCookie();
  const ticket = await request(app)
    .post("/api/tickets")
    .set("Cookie", userCookie)
    .send({
      title: "Surfboard",
      price: 50,
    });

  // Add an orderId to the ticket to make it reserved
  const editTicket = await Ticket.findById(ticket.body.id);
  editTicket!.set({
    orderId: new mongoose.Types.ObjectId().toHexString(),
  });
  editTicket!.save();

  // Should not be able to save because the ticket has an orderId
  // and their is logic to protect edting a "reserved" ticket
  await request(app)
    .put(`/api/tickets/${ticket.body.id}`)
    .set("Cookie", userCookie)
    .send({
      title: "UnBogus",
      price: 55,
    })
    .expect(400);
});
