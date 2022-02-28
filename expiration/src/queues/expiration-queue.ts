import Queue from "bull";

import { natsWrapper } from "../nats-wrapper";
import { ExpirationCompletePublisher } from "./../events/publishers/expiration-complete-publisher";

interface Payload {
  orderId: string;
}

const expirationQueue = new Queue<Payload>("order:expiration", {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

expirationQueue.process(async (job) => {
  console.log(
    "expiration service expiration:complete event for orderId: ",
    job.data.orderId
  );

  new ExpirationCompletePublisher(natsWrapper.client).publish({
    orderId: job.data.orderId,
  });
});

export { expirationQueue };
