const express = require("express");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(express.json());

const events = [];

app.get("/", (req, res) => {
  res.send("Open Webhook Inbox running.");
});

app.post("/webhook", (req, res) => {
  const event = {
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    payload: req.body
  };

  events.push(event);

  console.log("Received webhook:", event);

  res.json({
    success: true,
    event
  });
});

app.get("/events", (req, res) => {
  res.json(events);
});

app.post("/replay/:id", (req, res) => {
  const event = events.find(e => e.id === req.params.id);

  if (!event) {
    return res.status(404).json({
      error: "Event not found"
    });
  }

  console.log("Replaying event:", event);

  res.json({
    success: true,
    replayed: event
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});