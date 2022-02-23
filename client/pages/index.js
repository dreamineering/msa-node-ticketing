import Router from "next/router";

import buildClient from "../api/build-client";

const Home = ({ currentUser }) => {
  const onClick = () => {
    Router.push("/");
  };

  return (
    <div>
      <h1>Home</h1>

      <div>{currentUser ? currentUser.email : "You are not signed in"}</div>
      <button className="btn" onClick={onClick}>
        Home
      </button>
    </div>
  );
};

// Used on full refresh from server and from app when in app
// Cannot use getInitialProps and getServerSideProps together
Home.getInitialProps = async (ctx) => {
  const client = buildClient(ctx);
  const { data } = await client.get("/api/users/currentuser");
  return data;
};

export default Home;
