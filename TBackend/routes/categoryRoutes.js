/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       required:
 *         - CG_name
 *       properties:
 *         CG_id:
 *           type: integer
 *         CG_name:
 *           type: string
 * tags:
 *   - name: Category
 *     description: Category management API
 * 
 * /categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Category]
 *     responses:
 *       '200':
 *         description: A list of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 *       '500':
 *         description: Error fetching categories
 * 
 *   post:
 *     summary: Create a new category
 *     tags: [Category]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - CG_name
 *             properties:
 *               CG_name:
 *                 type: string
 *     responses:
 *       '201':
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       '400':
 *         description: Category name is required
 *       '500':
 *         description: Error adding category
 * 
 * /categories/{id}:
 *   put:
 *     summary: Update a category by ID
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Category ID
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - CG_name
 *             properties:
 *               CG_name:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Category updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       '400':
 *         description: Category name is required
 *       '500':
 *         description: Error updating category
 * 
 *   delete:
 *     summary: Delete a category by ID
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Category ID
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Category deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Category deleted successfully
 *       '500':
 *         description: Error deleting category
 */

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
