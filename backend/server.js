const express = require('express'); // Fixed typo: express
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express(); // Fixed typo: express
app.use(cors());
app.use(express.json()); // Fixed typo: express

// 1. Fixed the URI (Corrected 'mngodb' to 'mongodb' and added missing '?')
const CLOUD_MONGO_URI = 'mongodb+srv://sanjyotiafalake_db_user:Sanjyoti%40123@cluster0.woqbntd.mongodb.net/taskdb?retryWrites=true&w=majority';

// 2. Connect to MongoDB
// This will try the .env file first, then your Cloud Atlas, then local
const connectionString = process.env.MONGO_URI || CLOUD_MONGO_URI;

mongoose.connect(connectionString)
    .then(() => console.log("✅ MongoDB Connected Successfully"))
    .catch(err => {
        console.error("❌ MongoDB Connection Error:");
        console.error(err);
    });

// Task model
const TaskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    completed: { type: Boolean, default: false }
}); 

const Task = mongoose.model('Task', TaskSchema);

// 3. Routes with Try/Catch (This prevents the 500 Error crash)
app.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/tasks', async (req, res) => {
    try {
        const newTask = new Task(req.body);
        await newTask.save();
        res.json(newTask);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/tasks/:id', async (req, res) => {
    try {
        const result = await Task.findByIdAndDelete(req.params.id);
        if (!result) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.json({ message: 'Task deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});