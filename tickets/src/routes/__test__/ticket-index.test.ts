import request from "supertest";
import { app } from "../../app";

const createTicket = (title: string, price: number) => {
  return request(app)
    .post("/api/tickets")
    .set("Cookie", global.getAuthCookie())
    .send({
      title,
      price,
    });
};

it("can fetch a list of tickets", async () => {
  await createTicket("One Good Thing", 10);
  await createTicket("Second Good Thing", 20);
  await createTicket("Third Good Thing", 30);

  const response = await request(app).get("/api/tickets").send().expect(200);

  expect(response.body.length).toEqual(3);
});
