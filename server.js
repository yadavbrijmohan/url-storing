import express from 'express';
import cors from 'cors'
import bodyParser, { json } from 'body-parser';
import path from 'path'
import { fileURLToPath } from 'url';
import fs from 'fs';


const app = express();
const port = 3000;
const __filename = fileURLToPath( import.meta.url);
const __dirname = path.dirname(__filename);
const submissionPath = path.join(__dirname,'Submission.json')
//MiddleWare thing
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json())
app.use(express.static("public"));

app.get("/",(req, res) =>{
    res.sendFile(path.join(__dirname , 'public' , 'index.html'));
});
// Handle Form Submission
app.post("/submit", (req, res ) => {
    const url = req.body.username;
    const description = req.body.description;
    // Read Existing data:
    let Submission = [];
    try {
        const data = fs.readFileSync(submissionPath,'utf8');
        Submission = JSON.parse(data)

    } catch (err) {
        console.log(err);
    }
    Submission.push({
        url,
        description,
        timeStamp: new Date().toISOString()
    })
    // Write it into the sumbissions
    fs.writeFileSync(submissionPath,JSON.stringify(Submission,null, 2));

    console.log(`User Submitted: ${url}`);
    console.log(`Description: ${description}`)
    res.redirect('/');
});
// API endpoint to get submissions as JSON
app.get("/api/submission", (req, res) =>{
    try{
        const submission = fs.readFileSync(submissionPath,'utf-8');
        res.json(JSON.parse(submission));
    }
    catch(err){
        console.log("File doesnot exits");
    }
    
})
app.delete("/api/submission/:index", (req, res) => {
    try{
        const index = parseInt(req.params.index);
        const data = fs.readFileSync(submissionPath,'utf-8');
        let submission = JSON.parse(data);

        if(index>=0 && index<submission.length){
        submission.splice(index,1);
        fs.writeFileSync(submissionPath,JSON.stringify(submission,null,2));
        res.json({ success: true, message: "Submission deleted successfully" })
        }
        else{
            res.status(404).json({ success: false, message: "Submission not found" });
        }

    }
    catch(err){
        console.error($`Error found ${err}`)
    }
    
})

app.listen(3000,() => {
    console.log(`App is working on ${port}`);
})