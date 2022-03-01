import { useEffect, useState } from "react";
import StripeCheckout from "react-stripe-checkout";
import useRequest from "../../hooks/use-request";

const OrderPage = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const { doRequest, errors } = useRequest({
    url: "/api/payments",
    method: "post",
    body: {
      orderId: order.id,
    },
    onSuccess: (payment) => console.log(payment),
  });

  // https://stripe.com/docs/checkout/quickstart?client=next

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
      <div>
        <StripeCheckout
          token={({ id }) => doRequest({ token: id })}
          stripeKey="pk_test_51K04MkH3rL7sTzUUFVH4yQWk9EqTiQCBTJB81HdxHjocIyfZ7lz6DGhYtQ1y8kalmnLsEiDD9DkfbszBxjJiTWEI00aAMZjGeb"
          amount={order.ticket.price * 100}
          email={currentUser.email}
        />
        {errors}
      </div>
    </div>
  );
};

OrderPage.getInitialProps = async (ctx, client, currentUser) => {
  const { orderId } = ctx.query;
  const { data } = await client.get(`/api/orders/${orderId}`);
  return { order: data };
};

export default OrderPage;
