import express from "express";
import { v4 as uuidv4 } from "uuid";
import User from "../models/usermodel.js";
import { authenticateToken } from "../auth/auth.js";


const router = express.Router();

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next).catch(next));
};

//Get
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const users = await User.find();
    res.status(200).json(users);
  })
);

// Create
router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { firstName, lastName, age } = req.body;

    if (!firstName || !lastName || !age) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const user = new User({
      firstName,
      lastName,
      age,
      id: uuidv4(), // Auto-generate unique ID
    });

    const savedUser = await user.save();
    res.status(201).json(savedUser);
  })
);

//Update
router.patch(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { firstName, lastName, age } = req.body;

    // Update the user in the database
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { firstName, lastName, age },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(updatedUser);
  })
);

//Read
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  })
);

//Delete
router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  })
);


// aunthentication
router.get("/", authenticateToken, asyncHandler(async (req, res) => {
  const users = await User.find();
  res.status(200).json(users);
}));

router.post("/", authenticateToken, asyncHandler(async (req, res) => {
  // Logic for creating a user
}));



export default router;
