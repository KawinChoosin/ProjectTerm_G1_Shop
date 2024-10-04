const express = require("express");
const prisma = require("../prisma/client");

const router = express.Router();

// GET all categories
router.get("/", async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: "Error fetching categories" });
  }
});

// POST a new category
router.post("/", async (req, res) => {
  const { CG_name } = req.body;

  try {
    if (!CG_name) {
      return res.status(400).json({ error: "Category name is required" });
    }

    const newCategory = await prisma.category.create({
      data: {
        CG_name,
      },
    });

    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ error: "Error adding category" });
  }
});

// PUT (update) a category by ID
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { CG_name } = req.body;

  try {
    if (!CG_name) {
      return res.status(400).json({ error: "Category name is required" });
    }

    const updatedCategory = await prisma.category.update({
      where: { CG_id: parseInt(id, 10) },
      data: { CG_name },
    });

    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(500).json({ error: "Error updating category" });
  }
});

// DELETE a category by ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.category.delete({
      where: { CG_id: parseInt(id, 10) },
    });
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting category" });
  }
});

module.exports = router;
