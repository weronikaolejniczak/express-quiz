const fs = require('fs');

function roundRoute(app) {
    let score = 0;
    let questions;
    let callAFriendUsed, halfBankUsed, askTheCrowdUsed = false;
    let isGameOver = false;
    
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
        }
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
        }

        res.json({
            correct: isCorrect,
            score
        });
    })

    app.get('/help/friend', (req, res) => {
        if (callAFriendUsed) {
            return res.json({
                text: 'You cannot use this help anymore.'
            });
        }

        callAFriendUsed = true;

        const doesFriendKnowAnswer = Math.random() < 0.5;
        const question = questions[score];
        const correctAnswer = question.answers.filter(answer => answer.isCorrect === 'true')[0].content;

        res.json({
            doesFriendKnowAnswer,
            text: doesFriendKnowAnswer ? `I believe the answer is... "${correctAnswer}"` : 'Sorry but I don\'t know the answer...'
        });
    });
}

module.exports = roundRoute;
