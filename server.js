import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const app = express();
const port = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const submissionPath = path.join(__dirname, 'Submission.json');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// GET all submissions
app.get("/api/submission", (req, res) => {
    try {
        if (!fs.existsSync(submissionPath)) {
            return res.json([]);
        }
        const data = fs.readFileSync(submissionPath, 'utf-8');
        res.json(JSON.parse(data));
    } catch (err) {
        console.log(err);
        res.json([]);
    }
});

// POST new submission
app.post("/submit", (req, res) => {
    const { username: url, description } = req.body;

    let submissions = [];
    try {
        const data = fs.readFileSync(submissionPath, 'utf8');
        submissions = JSON.parse(data);
    } catch (err) {
        submissions = [];
    }

    submissions.push({
        id: Date.now().toString(), // UNIQUE ID
        url,
        description,
        timeStamp: new Date().toISOString()
    });

    fs.writeFileSync(submissionPath, JSON.stringify(submissions, null, 2));
    res.json({ success: true });
});

// PUT edit submission
app.put("/api/submission/:id", (req, res) => {
    try {
        const id = req.params.id;
        const { url, description } = req.body;
        const data = fs.readFileSync(submissionPath, 'utf-8');
        let submissions = JSON.parse(data);

        const index = submissions.findIndex(s => s.id === id);
        if (index === -1) {
            return res.status(404).json({ success: false, message: "Not found" });
        }

        submissions[index].url = url || submissions[index].url;
        submissions[index].description = description || submissions[index].description;

        fs.writeFileSync(submissionPath, JSON.stringify(submissions, null, 2));
        res.json({ success: true, submission: submissions[index] });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false });
    }
});

// DELETE by ID (not index)
app.delete("/api/submission/:id", (req, res) => {
    try {
        const id = req.params.id;
        const data = fs.readFileSync(submissionPath, 'utf-8');
        let submissions = JSON.parse(data);

        const newSubmissions = submissions.filter(s => s.id !== id);

        if (newSubmissions.length === submissions.length) {
            return res.status(404).json({ success: false, message: "Not found" });
        }

        fs.writeFileSync(submissionPath, JSON.stringify(newSubmissions, null, 2));
        res.json({ success: true, message: "Deleted successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false });
    }
});

app.listen(port, () => {
    console.log(`App is working on ${port}`);
});