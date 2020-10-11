const question = document.querySelector('#question');

function fillQuestionElements(data) {
    question.innerText = data.question;
    for (const i in data.answers) {
        const answerElement = document.querySelector(`#answer${parseInt(i) + 1}`);
        answerElement.innerText = data.answers[i];
    }
}

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
