import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

router.get("/api/users/currentuser", (req, res) => {
  if (!req.session?.jwt) {
    return res.status(401).send({ currentUser: null });
  }

  try {
    const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY!);
    // console.log("payload", payload);
    res.status(200).send({ currentUser: payload });
  } catch (err) {
    res.status(401).send({ currentUser: null });
  }
});

export { router as currentUserRouter };
