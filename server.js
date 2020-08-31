var express = require("express");
var cors = require('cors')
// var bodyParser = require('body-parser')
// var fs = require('fs');
var mainCtrl = require("./controllers/mainctrl.js");

var app = express();
var http = require('http').createServer(app);
const io = require("socket.io")(http)

var path = require('path');
const formidable = require('formidable');

const readline = require('readline');
var spawn = require('child_process').spawn;

app.use(cors())

app.set("view engine", "ejs");
var pid=null

// app.use(bodyParser.urlencoded({ extended: true }))
// app.use(bodyParser.json())


app.get("/", (req, res) => {
    res.render("index.ejs");
});


app.post("/start", (req, res) => {
    console.log("start training....")
    var uploadsPath = path.join(__dirname, '/uploads/')
    var form = new formidable.IncomingForm();

    form.on('fileBegin', function (name, file) {
        file.path = uploadsPath + file.name
    })
    // form.uploadDir = uploadsPath;
    // form.keepExtensions = true;
    form.parse(req, function (err, fields, files) {
        if (err) {
            next(err);
            return;
        }
        if (JSON.stringify(files) == "{}") {
            console.log("No files uploaded...")
            res.json({ "results": "No file uploaded" });
            return;
        }
        // console.log(fields);
        // console.log(files)
        // console.log(files.uploadfile.path)


        // *****************call python********************
        pid=spawn('python', ['-u','myScript.py',files.uploadfile.path,fields.task,fields.algorithms,fields.totalTime,fields.model,fields.criterion],{ 
            // windowsVerbatimArguments: true,
            cwd:'./PythonScripts/',
          })
          pid.stdout.on('data', (data) => {
            console.log("stdout:" + data)
        });

        readline.createInterface({
            input: pid.stdout,
            terminal: false
        }).on('line', function (line) {
            console.log("line:" + line);
            io.emit('testmsg', line)
        });
        pid.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });
        pid.on('close', (code) => {
            
            console.log(`child process exited with code ${code}`);
            pid=null;
        });
        // *****************call python end********************

        res.json({ "results": "ok" });
    })

});


app.post("/stop", (req, res) => {
    if (pid){
        console.log("====>killing process:"+pid.pid)
        pid.kill()
        pid=null
        res.json({ "results": "process killed ok" });
    }
    else{
        res.json({ "results": "no process running" });
    }

})


app.get("/download", (req, res) => {
    // console.log(__dirname)
    console.log("download file=====>")
	res.download(path.join(__dirname,"/PythonScripts/","currentModel.mdl"))
	// res.sendFile(path.join(__dirname,"/download/","1.h5"))  //same as res.download
});


app.use(express.static("public"));


io.on('connection', (socket) => {
    console.log('A user connected, user ID: ' + socket.id);
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
    // io.emit('testmsg', "hahaha" + socket.id)
});



app.use(function (req, res) {
    res.send("404 page not found..");
});


http.listen(3000, () => {
    console.log('HTTP Server is running on: http://localhost:3000');
});


