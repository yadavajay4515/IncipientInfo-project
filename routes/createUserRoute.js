const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
// const Role = require("../models/role");
const UserImage = require("../models/userImageModel");

// Create a new user

// POST /users
router.post("/users", async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      password,
      phone,
      code,
      roles, // An array of role IDs
      images, // An array of image filenames or paths
    } = req.body;

    // Create a new user
  const user = new User({
      first_name,
      last_name,
      email,
      password,
      phone,
      code,
      roles, // Assign roles to the user
    });

    // Handle images
    if (images && images.length > 0) {
      const userImages = images.map(
        (image) => new UserImage({ user_id: user._id, image })
      );
      await UserImage.insertMany(userImages);
    }

    // Save the user to the database
    await user.save();

    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, {
      deleted_at: new Date(),
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});


// Read all users with assigned roles (excluding deleted records)
router.get("/users/with-roles", async (req, res) => {
  try {
    const usersWithRoles = await User.find({ deleted_at: null }).populate(
      "roles"
    );

    res.json(usersWithRoles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /users/:id
router.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate("roles")
      .populate("images");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// PUT /users/:id
router.put("/users/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update user fields
    user.first_name = req.body.first_name || user.first_name;
    user.last_name = req.body.last_name || user.last_name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;
    user.code = req.body.code || user.code;

    // Update roles if provided in the request
    if (req.body.roles) {
      user.roles = req.body.roles;
    }

    // Handle image updates (delete old images and add new ones)
    if (req.body.images) {
      // Delete old images here
      const oldImages = await UserImage.find({ user_id: userId });
      await Promise.all(oldImages.map((image) => image.remove()));

      // Add new images to the user's images array
      const newImages = req.body.images.map(
        (image) => new UserImage({ user_id: userId, image })
      );
      await UserImage.insertMany(newImages);
    }

    // Update the user in the database
    await user.save();

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
