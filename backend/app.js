const express = require("express");
const { ObjectId } = require("mongodb");
const { getStudentsCollection } = require("./db");

const app = express();
app.use(express.json({ limit: "1mb" }));

function validStudent(name, department) {
  return typeof name === "string" && name.trim().length > 0 &&
    typeof department === "string" && department.trim().length > 0;
}

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "GAMEZONE API is running." });
});

// READ: retrieve all student records
app.get("/api/students", async (req, res) => {
  try {
    const students = await getStudentsCollection();
    const records = await students.find({}).sort({ _id: -1 }).toArray();
    res.status(200).json(records);
  } catch (error) {
    console.error("Fetch students error:", error);
    res.status(500).json({ error: "Unable to fetch students. Check MONGO_URI." });
  }
});

// CREATE: add a student record
app.post("/api/students", async (req, res) => {
  try {
    const { name, department } = req.body || {};
    if (!validStudent(name, department)) {
      return res.status(400).json({ error: "Name and department are required." });
    }

    const student = { name: name.trim(), department: department.trim() };
    const collection = await getStudentsCollection();
    const result = await collection.insertOne(student);

    res.status(201).json({ _id: result.insertedId, ...student, message: "Student added successfully." });
  } catch (error) {
    console.error("Add student error:", error);
    res.status(500).json({ error: "Unable to add student." });
  }
});

// UPDATE: edit a student record
app.put("/api/students/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, department } = req.body || {};

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid student ID." });
    }
    if (!validStudent(name, department)) {
      return res.status(400).json({ error: "Name and department are required." });
    }

    const collection = await getStudentsCollection();
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { name: name.trim(), department: department.trim() } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Student not found." });
    }

    res.status(200).json({ message: "Student updated successfully." });
  } catch (error) {
    console.error("Update student error:", error);
    res.status(500).json({ error: "Unable to update student." });
  }
});

// DELETE: remove a student record
app.delete("/api/students/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid student ID." });
    }

    const collection = await getStudentsCollection();
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Student not found." });
    }

    res.status(200).json({ message: "Student deleted successfully." });
  } catch (error) {
    console.error("Delete student error:", error);
    res.status(500).json({ error: "Unable to delete student." });
  }
});

module.exports = app;