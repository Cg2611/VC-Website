const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const multer = require('multer');
const path = require('path');
const nodemailer = require('nodemailer'); // Add Nodemailer

const app = express();
const port = 3000;

// Set up multer for parsing multipart/form-data
const upload = multer();

// Middleware for parsing JSON and urlencoded form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const session = require('express-session');

app.use(session({
    secret: 'your_secret_key', // replace with your own secret
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // use 'true' if using HTTPS
}));
// Set up MySQL connection
const db = mysql.createConnection({
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: 'root',
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

// Route to handle team application form submission
app.post('/submit-team-application', upload.none(), (req, res) => {
    const { name, email, phone, specialization, linkedin, scopus, resumeLink } = req.body;

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

// Route to handle contact form submission
app.post('/submit-contact-form', upload.none(), (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).send('All fields are required');
    }

    const sql = 'INSERT INTO contact_us (name, email, message) VALUES (?, ?, ?)';
    db.query(sql, [name, email, message], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('An error occurred while submitting the form.');
        }
        res.send('Message sent successfully');
    });
});

// Route to handle login
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.query('SELECT password FROM faculty WHERE username = ?', [username], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Server error');
        }

        if (results.length > 0) {
            const storedPassword = results[0].password;

            if (password === storedPassword) {
                res.redirect('/landing.html');
            } else {
                res.status(401).send('Invalid username or password');
            }
        } else {
            res.status(401).send('Invalid username or password');
        }
    });
});

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes to fetch data
app.get('/contact-us-data', (req, res) => {
    let query = 'SELECT * FROM contact_us';
    const params = [];
    if (req.query.start_date && req.query.end_date) {
        query += ' WHERE created_at BETWEEN ? AND ?';
        params.push(req.query.start_date, req.query.end_date);
    }
    db.query(query, params, (error, results) => {
        if (error) throw error;
        res.json(results);
    });
});

app.get('/training-data', (req, res) => {
    let query = 'SELECT * FROM TrainingForm';
    const params = [];
    if (req.query.start_date && req.query.end_date) {
        query += ' WHERE created_at BETWEEN ? AND ?';
        params.push(req.query.start_date, req.query.end_date);
    }
    db.query(query, params, (error, results) => {
        if (error) throw error;
        res.json(results);
    });
});

app.get('/internship-data', (req, res) => {
    let query = 'SELECT * FROM InternshipForm';
    const params = [];
    if (req.query.start_date && req.query.end_date) {
        query += ' WHERE created_at BETWEEN ? AND ?';
        params.push(req.query.start_date, req.query.end_date);
    }
    db.query(query, params, (error, results) => {
        if (error) throw error;
        res.json(results);
    });
});

app.get('/join-us-data', (req, res) => {
    let query = 'SELECT * FROM JoinForm';
    const params = [];
    if (req.query.start_date && req.query.end_date) {
        query += ' WHERE created_at BETWEEN ? AND ?';
        params.push(req.query.start_date, req.query.end_date);
    }
    db.query(query, params, (error, results) => {
        if (error) throw error;
        res.json(results);
    });
});

app.post('/submit_request', upload.none(), (req, res) => {
    const { name, email, project, description, dataset } = req.body;

    if (!name || !email || !project || !description || !dataset) {
        return res.status(400).send('Missing required fields');
    }

    const query = 'INSERT INTO dataset_requests (name, email, project, description, dataset) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [name, email, project, description, dataset], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('An error occurred while submitting the request.');
        }
        res.send('Request submitted successfully');
    });
});

app.get('/dataset-request-data', (req, res) => {
    let query = 'SELECT * FROM dataset_requests';
    const params = [];
    if (req.query.start_date && req.query.end_date) {
        query += ' WHERE created_at BETWEEN ? AND ?';
        params.push(req.query.start_date, req.query.end_date);
    }
    db.query(query, params, (error, results) => {
        if (error) {
            console.error('Error fetching dataset request data:', error);
            return res.status(500).send('Server error');
        }
        res.json(results);
    });
});

// Route to handle email sending
app.post('/send-mail', upload.none(), async (req, res) => {
    const { to, subject, message } = req.body;

    if (!to || !subject || !message) {
        return res.status(400).send('All fields are required');
    }

    // Create a transporter
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'onlytechzie@gmail.com',
            pass: 'monutantech@2003',
        },
    });

    // Set up email data
    let mailOptions = {
        from: 'onlytechzie@gmail.com',
        to: to,
        subject: subject,
        text: message,
    };

    try {
        // Send mail
        await transporter.sendMail(mailOptions);
        res.send('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send('Failed to send email');
    }
});
// Endpoint to get ongoing projects
// API to get ongoing projects
// Route to fetch all ongoing projects without images
app.get('/ongoing-projects', (req, res) => {
    const query = 'SELECT id, project_name, mentor_name, sponsor_name, description FROM ongoingprojects';
    
    db.query(query, (error, results) => {
        if (error) {
            console.error('Error fetching projects:', error);
            res.status(500).send('Failed to fetch projects');
            return;
        }
        res.json(results);
    });
});

// Route to serve image by project ID
app.get('/project-image/:id', (req, res) => {
    const projectId = req.params.id;

    const query = 'SELECT image_url FROM ongoingprojects WHERE id = ?';

    db.query(query, [projectId], (error, result) => {
        if (error) {
            console.error('Error fetching image:', error);
            res.status(500).send('Failed to fetch image');
            return;
        }

        if (result.length > 0) {
            res.writeHead(200, {'Content-Type': 'image/jpeg'});
            res.end(result[0].image_url);  // Send the image blob
        } else {
            res.status(404).send('Image not found');
        }
    });
});




// Handle form submission to add a new project
app.post('/add-project', upload.single('image_url'), (req, res) => {
    const { project_name, mentor_name, sponsor_name, description } = req.body;
    const imageUrl = req.file.buffer; // Get the uploaded image as a buffer

    const query = `
        INSERT INTO ongoingprojects (project_name, mentor_name, sponsor_name, description, image_url)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(query, [project_name, mentor_name, sponsor_name, description, imageUrl], (err, result) => {
        if (err) {
            console.error('Error inserting project:', err);
            res.status(500).send('Failed to add project');
            return;
        }
        res.status(200).send('Project added successfully');
    });
});
// Logout route


app.get('/logout', (req, res) => {
    // Destroy the session
    req.session.destroy((err) => {
        if (err) {
            console.error('Error during logout:', err);
            res.status(500).send('Failed to log out');
            return;
        }
        // Redirect to the index.html page
        res.redirect('/index.html');
    });
});
// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

