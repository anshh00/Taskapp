const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb+srv://ethara:etharaAI@ansh.w4qsvv5.mongodb.net/?appName=Ansh")
.then(()=>console.log("DB Connected"))
.catch(err=>console.log(err));

// Models
const User = mongoose.model("User", {
  email: String,
  password: String,
  role: String // admin or member
});

const Project = mongoose.model("Project", {
  name: String,
  createdBy: String
});

const Task = mongoose.model("Task", {
  title: String,
  status: String,
  projectId: String,
  assignedTo: String
});


app.post("/signup", async (req,res)=>{
  const user = await User.create(req.body);
  res.json(user);
});


app.post("/login", async (req,res)=>{
  const user = await User.findOne(req.body);
  if(user) res.json(user);
  else res.json({msg:"Invalid"});
});

app.post("/project", async (req,res)=>{
  const p = await Project.create(req.body);
  res.json(p);
});

app.post("/task", async (req,res)=>{
  const t = await Task.create(req.body);
  res.json(t);
});

app.get("/tasks", async (req,res)=>{
  const t = await Task.find();
  res.json(t);
});

app.listen(5000, ()=>console.log("Server running"));