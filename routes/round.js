const fs = require('fs');
const { maxHeaderSize } = require('http');

function roundRoute(app) {
    let score = 0;
    let questions;
    let callAFriendUsed, halfBankUsed, askTheCrowdUsed = false;
    let isGameOver = false;
    
    fs.readFile('./data/questions.json', (err, content) => {
        if (err) throw err;
        else {
            questions = JSON.parse(content);
        };
    });
    
    app.get('/question', (req, res) => {
        if (score === questions.length) {
            res.json({
                winner: true,
            });
        } else if (isGameOver) {
            res.json({
                loser: true,
            });
        } else {
            const nextQuestion = questions[score];
            const { question } = nextQuestion;
            const answers = [];
            nextQuestion.answers.forEach(answer => answers.push(answer.content))
    
            res.json({
                question, answers
            });
        };
    });

    app.post('/answer/:index', (req, res) => {
        if (isGameOver) {
            res.json({
                loser: true,
            });
        };

        const { index } = req.params;
        const question = questions[score];
        const isCorrect = (question.answers[index].isCorrect === 'true');

        if (isCorrect) {
            score++;
        } else {
            isGameOver = true;
        };

        res.json({
            correct: isCorrect,
            score
        });
    });

    app.get('/help/friend', (req, res) => {
        if (callAFriendUsed) {
            return res.json({
                text: 'You cannot use this help anymore.'
            });
        };

        callAFriendUsed = true;

        const doesFriendKnowAnswer = Math.random() < 0.5;
        const question = questions[score];
        const correctAnswer = question.answers.filter(answer => answer.isCorrect === 'true')[0].content;

        res.json({
            doesFriendKnowAnswer,
            text: doesFriendKnowAnswer ? `I believe the answer is... "${correctAnswer}"` : 'Sorry but I don\'t know the answer...'
        });
    });

    app.get('/help/half', (req, res) => {
        if (halfBankUsed) {
            return res.json({
                text: 'You cannot use this help anymore.'
            });
        };
    
        halfBankUsed = true;
    
        const question = questions[score];
        const answersCopy = question.answers.filter(answer => answer.isCorrect !== 'true')
        answersCopy.splice(~~(Math.random() * answersCopy.length), 1);
    
        res.json({
            answersToRemove: answersCopy,
        });
    });

    app.get('/help/crowd', (req, res) => {
        if (askTheCrowdUsed) {
            return res.json({
                text: 'You cannot use this help anymore.'
            });
        };
    
        askTheCrowdUsed = true;

        let chart = [10, 20, 30, 40];

        for (let i = chart.length - 1; i > 0; i--) {
            const change = Math.floor(Math.random() * 20 - 10);
            chart[i] += change;
            chart[i - 1] -= change;
        }

        const question = questions[score];
        const correctAnswer = question.answers.filter((answer) => answer.isCorrect === 'true')[0];
        let indexOfCorrectAnswer = question.answers.indexOf(correctAnswer);

        [chart[3], chart[indexOfCorrectAnswer]] = [chart[indexOfCorrectAnswer], chart[3]];
        
        res.json({
            chart,
        });
    });
};

module.exports = roundRoute;
