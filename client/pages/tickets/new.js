import { useState } from "react";

import { useRequest } from "../../hooks/use-request";

const NewTicket = () => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("0.00");

  const { doRequest, errors } = useRequest({
    url: "/api/tickets",
    method: "post",
    body: {
      title,
      price,
    },
    onSuccess: (ticket) => console.log(ticket),
  });

  const onBlur = () => {
    let value = parseFloat(price);
    if (isNaN(value)) {
      setPrice("0.00");
    } else {
      setPrice(value.toFixed(2));
    }
  };

  const onSubmit = (event) => {
    event.preventDefault();
    onBlur();
    doRequest();
  };

  return (
    <div className="">
      <h1 className="">Create a Ticket</h1>
      <form className="" onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label htmlFor="">Price</label>
          <input
            type="text"
            onBlur={onBlur}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="form-control"
          />
        </div>
        <button className="btn btn-primary">Create</button>
        {errors}
      </form>
    </div>
  );
};

export default NewTicket;
