const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const multer = require('multer');
const path = require('path');

const app = express();
const port = 3000;

// Set up multer for parsing multipart/form-data
const upload = multer();

// Middleware for parsing JSON and urlencoded form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set up MySQL connection
const db = mysql.createConnection({
    host: "127.0.0.1",
    port: 3306,
    user: "root",
    password: "root",
    database: 'vc_lab'
});

db.connect(err => {
    if (err) {
        throw err;
    }
    console.log('MySQL connected...');
});

// Route to handle internship form submission
app.post('/submit-internship', upload.none(), (req, res) => {
    const { name, email, phone, college, resume, additional_info } = req.body;

    // Ensure that all fields are present
    if (!name || !email || !phone || !college || !resume) {
        return res.status(400).send('Missing required fields');
    }

    const sql = 'INSERT INTO InternshipForm (name, email, phone, college, resume, additional_info) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(sql, [name, email, phone, college, resume, additional_info], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('An error occurred while submitting the form.');
        }
        res.send('Internship registration submitted successfully');
    });
});

// Route to handle training form submission
app.post('/submit-training', upload.none(), (req, res) => {
    const { name, email, phone, program, payment, comments } = req.body;

    if (!name || !email || !phone || !program || !payment) {
        return res.status(400).send('Missing required fields');
    }

    const sql = 'INSERT INTO TrainingForm (name, email, phone_number, program_of_interest, paymentdrivelink, comments) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(sql, [name, email, phone, program, payment, comments], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('An error occurred while submitting the form.');
        }
        res.send('Training registration submitted successfully');
    });
});


app.post('/submit-team-application', upload.none(), (req, res) => {
    const { name, email, phone, specialization, linkedin, scopus, resumeLink } = req.body;

    // Ensure that all required fields are present
    if (!name || !email || !phone || !specialization || !linkedin || !resumeLink) {
        return res.status(400).send('Missing required fields');
    }

    const sql = 'INSERT INTO JoinForm (name, email, phone_number, specialization, resumedrivelink, linkedinprofilelink, scopusprofilelink) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [name, email, phone, specialization, resumeLink, linkedin, scopus], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('An error occurred while submitting the form.');
        }
        res.send('Application to join VC team submitted successfully');
    });
});

app.post('/submit-contact-form', upload.none(), (req, res) => {
    const { name, email, message } = req.body;

    // Ensure that all required fields are present
    if (!name || !email || !message) {
        return res.status(400).send('All fields are required');
    }

    // SQL query to insert the data into the contact_us table
    const sql = 'INSERT INTO contact_us (name, email, message) VALUES (?, ?, ?)';
    db.query(sql, [name, email, message], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('An error occurred while submitting the form.');
        }
        res.send('Message sent successfully');
    });
});






// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
