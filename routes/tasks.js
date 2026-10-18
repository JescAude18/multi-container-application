const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const Task = require('../models/Task');

// GET /api/tasks - Récupérer toutes les tâches
router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({
            message: 'Failed to retrieve tasks',
            error: error.message
        });
    }
});

// GET /api/tasks/:id - Récupérer une tâche par son ID
router.get('/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                message: 'Task not found'
            });
        }

        res.status(200).json(task);
    } catch (error) {
        if (error instanceof mongoose.Error.CastError) {
            return res.status(400).json({
                message: 'Invalid task ID'
            });
        }

        res.status(500).json({
            message: 'Failed to retrieve task',
            error: error.message
        });
    }
});

// POST /api/tasks - Créer une tâche
router.post('/', async (req, res) => {
    try {
        const task = await Task.create({
            title: req.body.title,
            completed: req.body.completed
        });

        res.status(201).json(task);
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            return res.status(400).json({
                message: 'Invalid task data',
                error: error.message
            });
        }

        res.status(500).json({
            message: 'Failed to create task',
            error: error.message
        });
    }
});

// PUT /api/tasks/:id - Remplacer une tâche
router.put('/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(
            req.params.id,
            {
                title: req.body.title,
                completed: req.body.completed
            },
            {
                returnDocument: 'after',
                runValidators: true,
                overwrite: true
            }
        );

        if (!task) {
            return res.status(404).json({
                message: 'Task not found'
            });
        }

        res.status(200).json(task);
    } catch (error) {
        if (error instanceof mongoose.Error.CastError) {
            return res.status(400).json({
                message: 'Invalid task ID or data'
            });
        }

        if (error instanceof mongoose.Error.ValidationError) {
            return res.status(400).json({
                message: 'Invalid task data',
                error: error.message
            });
        }

        res.status(500).json({
            message: 'Failed to replace task',
            error: error.message
        });
    }
});

// PATCH /api/tasks/:id - Modifier partiellement une tâche
router.patch('/:id', async (req, res) => {
    try {
        const updates = {};

        if (req.body.title !== undefined) {
            updates.title = req.body.title;
        }

        if (req.body.completed !== undefined) {
            updates.completed = req.body.completed;
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                message: 'Provide at least one field to update'
            });
        }

        const task = await Task.findByIdAndUpdate(
            req.params.id,
            updates,
            {
                returnDocument: 'after',
                runValidators: true
            }
        );

        if (!task) {
            return res.status(404).json({
                message: 'Task not found'
            });
        }

        res.status(200).json(task);
    } catch (error) {
        if (error instanceof mongoose.Error.CastError) {
            return res.status(400).json({
                message: 'Invalid task ID or data'
            });
        }

        if (error instanceof mongoose.Error.ValidationError) {
            return res.status(400).json({
                message: 'Invalid task data',
                error: error.message
            });
        }

        res.status(500).json({
            message: 'Failed to update task',
            error: error.message
        });
    }
});

// DELETE /api/tasks/:id - Supprimer une tâche
router.delete('/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);

        if (!task) {
            return res.status(404).json({
                message: 'Task not found'
            });
        }

        res.status(200).json({
            message: 'Task deleted successfully',
            task
        });
    } catch (error) {
        if (error instanceof mongoose.Error.CastError) {
            return res.status(400).json({
                message: 'Invalid task ID'
            });
        }

        res.status(500).json({
            message: 'Failed to delete task',
            error: error.message
        });
    }
});

module.exports = router;
