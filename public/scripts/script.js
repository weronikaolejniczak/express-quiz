const question = document.querySelector('#question');
const gameBoard = document.querySelector('#game-board');
const status = document.querySelector('#scoreboard > h2');

function fillQuestionElements(data) {
    if (data.winner === true) {
        gameBoard.style.display = 'none';
        status.innerText = 'WINNER!'
    } else if (data.loser === true) {
        gameBoard.style.display = 'none';
        status.innerText = 'You lost. Try again!'
    } else {
        question.innerText = data.question;
        data.answers.forEach((answer, index) => {
            const answerElement = document.querySelector(`#answer${Number(index) + 1}`);
            answerElement.innerText = answer;
        });
    }
};

function showNextQuestion() {
    fetch('/question', {
        method: 'GET',
    })
        .then(res => res.json())
        .then(data => {
            fillQuestionElements(data);
        })
        .catch(err => {
            console.log(err);
        });
};

showNextQuestion();

function sendAnswer(answerIndex) {
    fetch(`/answer/${answerIndex}`, {
        method: 'POST',
    })
        .then(res => res.json())
        .then(data => {
            handleAnswerFeedback(data);
        })
        .catch(err => {
            console.log(err);
        });
}

const buttons = document.querySelectorAll('button');
for (const button of buttons) {
    button.addEventListener('click', function() {
        const answerIndex = this.dataset.answer;
        sendAnswer(Number(answerIndex));
    })
}

const scoreSpan = document.querySelector('#score');

function handleAnswerFeedback(data) {
    scoreSpan.innerText = data.score;
    showNextQuestion();
}
