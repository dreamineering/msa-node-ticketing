import { useRequest } from "../../hooks/use-request";

const ShowTicket = ({ ticket }) => {
  const { doRequest, errors } = useRequest({
    url: `/api/orders`,
    method: "post",
    body: {
      ticketId: ticket.id,
    },
    onSuccess: (order) => {
      console.log("order", order);
    },
  });

  return (
    <div className="">
      <h1>Ticket</h1>
      <div>{ticket.title}</div>
      <div>{ticket.price}</div>
      <button className="btn btn-primary" onClick={doRequest}>
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
