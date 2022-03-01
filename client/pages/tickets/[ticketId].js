import { useRouter } from "next/router";
import useRequest from "../../hooks/use-request";

const ShowTicket = ({ ticket }) => {
  const router = useRouter();

  const { doRequest, errors } = useRequest({
    url: `/api/orders`,
    method: "post",
    body: {
      ticketId: ticket.id,
    },
    onSuccess: (order) => {
      router.push({
        pathname: "/orders/[orderId]",
        query: { orderId: order.id },
      });
    },
  });

  const test = () => {
    doRequest();
    console.log("test");
  };

  return (
    <div className="">
      <h1>Ticket</h1>
      <div>{ticket.title}</div>
      <div>{ticket.price}</div>
      <button className="btn btn-primary" onClick={test}>
        Purchase
      </button>
      {errors}
    </div>
  );
};

ShowTicket.getInitialProps = async (ctx, client) => {
  const { ticketId } = ctx.query;
  console.log("ticketId", ticketId);
  const { data } = await client.get(`/api/tickets/${ticketId}`);
  return { ticket: data };
};

export default ShowTicket;
