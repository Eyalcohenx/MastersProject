var express = require('Express');
var app = express();
var fs = require("fs");
var router = express.Router();
var logic = require("./GameLogic.js");
var path = require('path');
var workers = require('./Workers.js');

const DB_FILE = "db.csv";
const ANS_FILE = "answers.tsv";
const ANS_DIR = "answers/";

// for development only 
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(express.json());
app.use(express.static('public'))

function saveToDB(obj) {
    let str = "";
    str += obj.workerId + ",";
    str += obj.assignmentId + ",";
    str += obj.hitId + ",";
    str += obj.advice.join(" ") + ",";
    str += obj.reward + ",";
    str += obj.choices.join(" ") + ",";
    str += obj.results.join(" ") + ",";
    str += obj.userStats.timeToReadInstructions + ",";
    str += obj.userStats.timeToTakeQuiz + ",";
    str += obj.userStats.quizWrongTriesCounter + ",";
    str += obj.userStats.answerTimePerRound.join(" ") + "\n";

    fs.appendFileSync(DB_FILE, str, (e) => {
        console.log("db was saved");
    });
}

router.get("/getDistributions", (req, res) => {
    let workerId = req.query.workerId;
    console.log(workerId)
    // if (workers.isWorkerExist(workerId)) {
    //     res.status(200).json({repeatedWorker: true});
    //     return;
    // }
    let distribution = logic.initGame(2, workerId);

    res.status(200).json({"machines": distribution});
});

router.post("/postAnswers", (req, res) => {
    let str = "";
    let obj = req.body;

    str += obj.workerId + "\t"
    str += obj.assignmentId + "\t"
    str += obj.q1 + "\t"
    str += obj.q2 + "\t"
    str += obj.q3 + "\t"
    str += obj.q4 + "\t"
    str += obj.q5 + "\n"

    fs.appendFileSync(ANS_FILE, str, (e) => {
        console.log("answers was saved");
    });

    res.status(200).json({msg: "ok"});
})

router.get("/getAgentsAdvice", (req, res) => {
    let workerId = req.query.workerId;
    console.log(workerId)
    res.status(200).json({"advice": logic.agentAdvice(workerId)});
})

router.post("/postResults", (req, res) => {
    let obj = req.body;

    saveToDB(obj);
    logic.removeSession(obj.workerId);
    res.status(200).json({msg: "ok"});
})

router.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + 'public/index.html'));
});

app.use("/", router);

app.listen(3001, (e) => {
    console.log("listens on 3001");
});