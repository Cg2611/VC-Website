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




app.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.query('SELECT password FROM faculty WHERE username = ?', [username], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ success: false, message: 'Server error' });
        }

        if (results.length > 0) {
            const storedPassword = results[0].password;

            if (password === storedPassword) {
                return res.json({ success: true, redirectUrl: '/landing.html' });
            } else {
                return res.status(401).json({ success: false, message: 'Invalid username or password' });
            }
        } else {
            return res.status(401).json({ success: false, message: 'Invalid username or password' });
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
            user: '',
            pass: '',
        },
    });

    // Set up email data
    let mailOptions = {
        from: '',
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




// Express setup and MySQL connection should be initialized above this code

// Route to handle project deletion
app.delete('/faculty-ongoing-projects/:id', (req, res) => {
    const projectId = req.params.id;

    // First, fetch the project details to insert into completed_projects
    const fetchQuery = 'SELECT * FROM ongoingprojects WHERE id = ?';
    db.query(fetchQuery, [projectId], (fetchError, results) => {
        if (fetchError) {
            console.error('Error fetching project:', fetchError);
            res.status(500).send('Error fetching project.');
            return;
        }

        if (results.length > 0) {
            const project = results[0];
            const insertQuery = `
                INSERT INTO completed_projects (project_name, mentor_name, sponsor_name, description, image_url)
                VALUES (?, ?, ?, ?, ?)
            `;

            // Insert the project into completed_projects
            db.query(insertQuery, [project.project_name, project.mentor_name, project.sponsor_name, project.description, project.image_url], (insertError) => {
                if (insertError) {
                    console.error('Error inserting project into completed_projects:', insertError);
                    res.status(500).send('Error moving project to completed.');
                    return;
                }

                // Delete the project from ongoingprojects
                const deleteQuery = 'DELETE FROM ongoingprojects WHERE id = ?';
                db.query(deleteQuery, [projectId], (deleteError) => {
                    if (deleteError) {
                        console.error('Error deleting project:', deleteError);
                        res.status(500).send('Error deleting project.');
                        return;
                    }
                    res.status(200).send('Project moved to completed and deleted successfully!');
                });
            });
        } else {
            res.status(404).send('Project not found.');
        }
    });
});
// Route to handle deletion of a project (complete removal)
app.delete('/delete-project/:id', (req, res) => {
    const projectId = req.params.id;

    const deleteQuery = 'DELETE FROM ongoingprojects WHERE id = ?';
    db.query(deleteQuery, [projectId], (deleteError) => {
        if (deleteError) {
            console.error('Error deleting project:', deleteError);
            res.status(500).send('Error deleting project.');
            return;
        }
        res.status(200).send('Project deleted successfully!');
    });
});

// Route to handle adding a new project
app.post('/add-project', upload.single('image_url'), (req, res) => {
    const { project_name, mentor_name, sponsor_name, description } = req.body;
    const imageUrl = req.file.buffer; // Get the uploaded image as a buffer

    const query = `
        INSERT INTO ongoingprojects (project_name, mentor_name, sponsor_name, description, image_url)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(query, [project_name, mentor_name, sponsor_name, description, imageUrl], (err) => {
        if (err) {
            console.error('Error inserting project:', err);
            res.status(500).send('Failed to add project');
            return;
        }
        res.status(200).send('Project added successfully');
    });
});

// Route to fetch completed projects
app.get('/completed-projects', (req, res) => {
    const query = 'SELECT id, project_name, mentor_name, sponsor_name, description, image_url FROM completed_projects';
    
    db.query(query, (error, results) => {
        if (error) {
            console.error('Error fetching completed projects:', error);
            res.status(500).send('Failed to fetch completed projects');
            return;
        }
        res.json(results);
    });
});

// Route to handle deletion of a completed project
app.delete('/delete-completed-project/:id', (req, res) => {
    const projectId = req.params.id;

    const deleteQuery = 'DELETE FROM completed_projects WHERE id = ?';
    db.query(deleteQuery, [projectId], (deleteError) => {
        if (deleteError) {
            console.error('Error deleting completed project:', deleteError);
            res.status(500).send('Error deleting completed project.');
            return;
        }
        res.status(200).send('Completed project deleted successfully!');
    });
});



// app.get('/project-image/:id', (req, res) => {
//     const projectId = req.params.id;

//     // Query to fetch image data from database
//     const query = 'SELECT image_url FROM completed_projects WHERE id = ?';

//     db.query(query, [projectId], (error, result) => {
//         if (error) {
//             console.error('Error fetching image:', error);
//             res.status(500).send('Failed to fetch image');
//             return;
//         }

//         if (result.length > 0) {
//             const imageBuffer = result[0].image_url;
//             res.writeHead(200, { 'Content-Type': 'image/jpeg' }); // Adjust content type if needed
//             res.end(imageBuffer); // Send the image binary data
//         } else {
//             res.status(404).send('Image not found');
//         }
//     });
// });

// Route to serve image by project ID
app.get('/project-image/:id', (req, res) => {
    const projectId = req.params.id;
    const query = 'SELECT image_url FROM completed_projects WHERE id = ?';

    db.query(query, [projectId], (error, results) => {
        if (error) {
            console.error('Error fetching image:', error);
            res.status(500).send('Failed to fetch image');
            return;
        }

        if (results.length > 0) {
            res.writeHead(200, {'Content-Type': 'image/jpeg'});
            res.end(results[0].image_url);  // Send the image blob
        } else {
            res.status(404).send('Image not found');
        }
    });
});

app.get('/project-image1/:id', (req, res) => {
    const projectId = req.params.id;
    const query = 'SELECT image_url FROM completed_projects WHERE id = ?';

    db.query(query, [projectId], (error, results) => {
        if (error) {
            console.error('Error fetching image:', error);
            res.status(500).send('Failed to fetch image');
            return;
        }

        if (results.length > 0) {
            const image = results[0].image_url;

            // Ensure the content-type is set appropriately for the image
            res.writeHead(200, { 'Content-Type': 'image/jpeg' });
            res.end(image, 'binary');  // Send the binary image data
        } else {
            res.status(404).send('Image not found');
        }
    });
});


app.get('/faculty', (req, res) => {
    const query = 'SELECT id, name, email, specialization FROM faculty_list';
    db.query(query, (error, results) => {
        if (error) {
            console.error('Error fetching faculty members:', error);
            res.status(500).send('Failed to fetch faculty members');
            return;
        }
        res.json(results);
    });
});

// Fetch faculty member image
app.get('/faculty-image/:id', (req, res) => {
    const query = 'SELECT image FROM faculty_list WHERE id = ?';
    db.query(query, [req.params.id], (error, results) => {
        if (error) {
            console.error('Error fetching faculty image:', error);
            res.status(500).send('Failed to fetch faculty image');
            return;
        }
        if (results.length > 0) {
            res.type('image/jpeg').send(results[0].image);
        } else {
            res.status(404).send('Faculty member not found');
        }
    });
});

// Add a new faculty member
app.post('/add-faculty', upload.single('image'), (req, res) => {
    const { name, email, specialization } = req.body;
    const image = req.file.buffer;

    const query = 'INSERT INTO faculty_list (name, email, specialization, image) VALUES (?, ?, ?, ?)';
    db.query(query, [name, email, specialization, image], (error, results) => {
        if (error) {
            console.error('Error adding faculty member:', error);
            res.status(500).send('Failed to add faculty member');
            return;
        }
        res.sendStatus(200);
    });
});
// Route to handle deletion of a faculty member
app.delete('/delete-faculty/:id', (req, res) => {
    const facultyId = req.params.id;

    const deleteQuery = 'DELETE FROM faculty_list WHERE id = ?';
    db.query(deleteQuery, [facultyId], (deleteError) => {
        if (deleteError) {
            console.error('Error deleting faculty member:', deleteError);
            res.status(500).send('Error deleting faculty member.');
            return;
        }
        res.status(200).send('Faculty member deleted successfully!');
    });
});
// Route to get all interns
app.get('/interns', (req, res) => {
    const sql = 'SELECT * FROM intern_list';
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Route to add a new intern
app.post('/add-intern', upload.single('image'), (req, res) => {
    const { name, email, project } = req.body;
    const image = req.file.buffer;

    const sql = 'INSERT INTO intern_list (name, email, project, image) VALUES (?, ?, ?, ?)';
    db.query(sql, [name, email, project, image], (err) => {
        if (err) throw err;
        res.status(200).send('Intern added successfully');
    });
});

// Route to delete an intern
app.delete('/delete-intern/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM intern_list WHERE id = ?';
    db.query(sql, [id], (err) => {
        if (err) throw err;
        res.status(200).send('Intern deleted successfully');
    });
});

// Route to serve intern images
app.get('/intern-image/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT image FROM intern_list WHERE id = ?';
    db.query(sql, [id], (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            res.setHeader('Content-Type', 'image/jpeg');
            res.send(results[0].image);
        } else {
            res.status(404).send('Image not found');
        }
    });
});
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

