import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');

  const API_URL = 'http://localhost:5000/tasks';

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(API_URL);
      setTasks(res.data);
    } catch (err) {
      console.error("Error fetching tasks", err);
    }
  };

  const addTask = async () => {
    if (!title.trim()) return;
    try {
      const res = await axios.post(API_URL, { title });
      setTasks([...tasks, res.data]);
      setTitle('');
    } catch (err) {
      console.error("Error adding task", err);
    }
  };

  const toggleComplete = async (id, completed) => {
    try {
      // Note: Make sure your backend has a PUT route for this!
      const res = await axios.put(`${API_URL}/${id}`, { completed: !completed });
      setTasks(tasks.map(t => t._id === id ? res.data : t));
    } catch (err) {
      // If you haven't added the PUT route yet, this will fail
      console.log("Update route not found, just updating local state for now");
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTasks(tasks.filter(t => t._id !== id));
    } catch (err) {
      console.error("Error deleting task", err);
    }
  };

  return (
    <div className="app-container">
      <h1><i className="fa-solid fa-list-check"></i> My Tasks</h1>
      
      <div className="input-group">
        <input 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          placeholder="Add a new task..." 
          onKeyPress={(e) => e.key === 'Enter' && addTask()}
        />
        <button className="add-btn" onClick={addTask}>
          <i className="fa-solid fa-plus"></i>
        </button>
      </div>

      <ul>
        {tasks.map(task => (
          <li key={task._id}>
            <div className="task-content" onClick={() => toggleComplete(task._id, task.completed)}>
              <i className={`fa-solid ${task.completed ? 'fa-circle-check completed' : 'fa-circle'} check-icon`}></i>
              <span className={`task-text ${task.completed ? 'completed-text' : ''}`}>
                {task.title}
              </span>
            </div>
            
              {/* --- REDESIGNED DELETE BUTTON --- */}
      <button className="delete-btn-modern" onClick={() => deleteTask(task._id)}>
        <i className="fa-solid fa-trash"></i>
        <span>Delete</span>
      </button>
      {/* --------------------------------- */}
      
          </li>
        ))}
      </ul>

      {tasks.length === 0 && (
        <div className="empty-state">
          <i className="fa-solid fa-feather" style={{display: 'block', fontSize: '2rem', marginBottom: '10px'}}></i>
          No tasks found. Start by adding one!
        </div>
      )}
    </div>
  );
}

export default App;