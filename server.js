// server.js
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// Serve HTML files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/projects', (req, res) => {
    res.sendFile(path.join(__dirname, 'projects.html'));
});

app.get('/registration', (req, res) => {
    res.sendFile(path.join(__dirname, 'registration.html'));
});

app.get('/team', (req, res) => {
    res.sendFile(path.join(__dirname, 'team.html'));
});

// Handle login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    // Simple username and password check
    if (username === 'faculty' && password === 'password') {
        res.redirect('/dashboard');
    } else {
        res.send('Invalid username or password');
    }
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard.html'));
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
