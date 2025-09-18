import express from "express";
import cors from "cors";
import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json()); 

const PORT = process.env.PORT || 5000;


const uri = process.env.MONGO_URI!;
const client = new MongoClient(uri, {
  serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true },
});


let usersCollection: any;
let onboardingCollection: any;
let qrCollection: any;


async function connectDB() {
  try {
    await client.connect();
    console.log("MongoDB connected!");

    const db = client.db("qr_app"); // your database name
    usersCollection = db.collection("users");
    onboardingCollection = db.collection("onboarding");
    qrCollection = db.collection("qrcodes");

  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
}


app.get("/", (req, res) => {
  res.send("Backend is running!");
});


app.get("/users", async (req, res) => {
  try {
    const users = await usersCollection.find({}).toArray();
    console.log("Fetched users:", users);
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).send("Error fetching users");
  }
});


app.post("/users", async (req, res) => {
  try {
    const newUser = req.body || {
      firebaseUid: "dummy999",
      name: "Test User",
      email: "test@example.com",
      authProvider: "google",
      createdAt: new Date(),
    };

    const result = await usersCollection.insertOne(newUser);
    console.log("Inserted user:", newUser);

    res.json({ message: "User inserted", userId: result.insertedId });
  } catch (err) {
    console.error("Error inserting user:", err);
    res.status(500).send("Error inserting user");
  }
});

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
