const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const MONGO_URL = process.env.MONGO_URL || "mongodb+srv://ethara:etharaAI@ansh.w4qsvv5.mongodb.net/?appName=Ansh";

mongoose.connect(MONGO_URL)
.then(() => console.log("DB Connected"))
.catch(err => console.log("DB Error:", err));



const User = mongoose.model("User", {
  email: String,
  password: String,
  role: String   // admin / member
});

const Project = mongoose.model("Project", {
  name: String,
  createdBy: String
});

const Task = mongoose.model("Task", {
  title: String,
  status: {
    type: String,
    default: "Pending"
  },
  projectId: String,
  assignedTo: String
});

app.post("/signup", async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.body.email,
      password: req.body.password
    });

    if (user) res.json({ message: "Login successful", user });
    else res.json({ message: "Invalid credentials" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/project", async (req, res) => {
  try {
    const project = await Project.create({
      name: req.body.name,
      createdBy: req.body.createdBy || "unknown"
    });

    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/task", async (req, res) => {
  try {
    const { title, status, assignedTo, projectId } = req.body;

    if (!title) {
      return res.json({ message: "Title is required" });
    }

    const task = await Task.create({
      title: title,
      status: status || "Pending",   // ✅ default fix
      assignedTo: assignedTo || "unassigned",
      projectId: projectId || "default"
    });

    res.json(task);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});