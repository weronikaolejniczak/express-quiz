const fs = require('fs');

function roundRoute(app) {
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
}

module.exports = roundRoute;
