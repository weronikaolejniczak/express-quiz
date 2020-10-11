const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

const port = process.env.PORT || 3000;
const hostname = 'localhost';

app.listen(port, () => {
    console.log(`Server is listening at http://${hostname}:${port}/`)
});

app.use(express.static(
    path.join(__dirname, 'public'),
))

let score = 0;
//let callAFriendUsed, askTheCrowdUsed, halfBankUsed = false;
let questions;

fs.readFile('./data/questions.json', (err, content) => {
    if (err) throw err;
    else {
        questions = JSON.parse(content);
    }
});

app.get('/question', (req, res) => {
    if (score === questions.length) {
        res.json({
            winner: true,
        });
    } else {
        const nextQuestion = questions[score];
        const { question } = nextQuestion;
        const answers = [];
        nextQuestion.answers.forEach(answer => answers.push(answer.content))

        res.json({
            question, answers
        });
    }
});
