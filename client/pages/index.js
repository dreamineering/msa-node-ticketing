import Router from "next/router";
// import buildClient from "../api/build-client";

const Home = ({ currentUser, tickets }) => {
  const onClick = () => {
    Router.push("/");
  };

  const ticketList = tickets.map((ticket) => {
    return (
      <tr key={ticket.id}>
        <td>{ticket.title}</td>
        <td>{ticket.price}</td>
      </tr>
    );
  });

  return (
    <div>
      <h1>Tickets</h1>

      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>{ticketList}</tbody>
      </table>
      <div>{currentUser ? currentUser.email : "You are not signed in"}</div>
    </div>
  );
};

// Used on full refresh from server and from app when in app
// Cannot use getInitialProps and getServerSideProps together

Home.getInitialProps = async (ctx, client, currentUser) => {
  const { data } = await client.get("/api/tickets");
  return { tickets: data };
};

export default Home;
