import Link from "next/link";

const OrdersPage = ({ orders }) => {
  console.log("orders", orders);
  return (
    <div className="page-content">
      <h1>My Orders</h1>

      <ul>
        {orders.map((order) => {
          return (
            <li key={order.id}>
              <Link href={`/orders/${order.id}`}>
                <a>
                  {order.ticket.title} - {order.status}
                </a>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

OrdersPage.getInitialProps = async (ctx, client, currentUser) => {
  const { data } = await client.get("/api/orders");
  return { orders: data };
};

export default OrdersPage;
