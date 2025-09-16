import express from "express";
import User from "../models/user.ts";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.log("error");
  }
});

export default router;
