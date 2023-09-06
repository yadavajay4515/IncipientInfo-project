const express = require("express");
const router = express.Router();
const Role = require("../models/role");

// Create a new role
router.post("/roles", async (req, res) => {
  try {
    console.log(req.body);
    const { name } = req.body;

    const role = new Role({ name });
    await role.save();
    res.status(201).json(role);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// Read all roles
router.get("/roles", async (req, res) => {
  try {
    const roles = await Role.find({});
    res.status(200).json(roles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// Update a role by ID
router.put("/roles/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const updatedRole = await Role.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );
    if (!updatedRole) {
      return res.status(404).json({ error: "Role not found" });
    }
    res.status(200).json(updatedRole);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/roles/:id", async (req, res) => {
  try {
    const { id } = req.params;

    let note = await Role.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Not Found");
    }

    note = await Role.findByIdAndDelete(req.params.id);
    res.json({ Success: "role has been deleted", note: note });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
