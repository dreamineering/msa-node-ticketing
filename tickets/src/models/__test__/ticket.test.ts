import { Ticket } from "../ticket";

it("implements optimistic concurrency", async () => {
  // create an instance of a ticket
  const ticket = Ticket.build({
    title: "concert",
    price: 20,
    userId: "123",
  });

  // save the ticket to the database
  await ticket.save();

  // fetch the ticket twice
  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  // make two separate changes to the ticket
  firstInstance!.set({ price: 10 });
  secondInstance!.set({ price: 15 });

  // save the first fetched ticket
  await firstInstance!.save();

  // save the second fetched ticket and expect an error
  // This will fail due to version mismatch
  // await secondInstance!.save();

  // the following code is a workaround for Jest not working as expected
  // due to an issue with Jest and TypeScript

  // https://www.udemy.com/course/microservices-with-node-js-and-react/learn/lecture/19565130#notes
  //   expect(async () => {
  //     await secondInstance!.save();
  //   }).toThrow();

  try {
    await secondInstance!.save();
  } catch (err) {
    return;
  }

  throw new Error("Should not reach this point");
});

it("increments the version number when saving", async () => {
  const ticket = Ticket.build({
    title: "concert",
    price: 20,
    userId: "123",
  });

  await ticket.save();
  expect(ticket.version).toEqual(0);

  await ticket.save();
  expect(ticket.version).toEqual(1);

  await ticket.save();
  expect(ticket.version).toEqual(2);
});
