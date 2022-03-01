import { useEffect, useState } from "react";

const OrderPage = ({ order }) => {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      const secondsLeft = Math.round(msLeft / 1000);
      setTimeLeft(secondsLeft);
    };

    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);

    // cleanup
    return () => {
      clearInterval(timerId);
    };
  }, [order]);

  if (timeLeft < 0) {
    return <div>Order Expired</div>;
  }

  return (
    <div className="">
      <h1>Order</h1>

      <div>Time left to pay {timeLeft} seconds</div>
    </div>
  );
};

OrderPage.getInitialProps = async (ctx, client) => {
  const { orderId } = ctx.query;
  console.log("orderId", orderId);
  const { data } = await client.get(`/api/orders/${orderId}`);
  return { order: data };
};

export default OrderPage;
