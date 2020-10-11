const question = document.querySelector('#question');

function fillQuestionElements(data) {
    question.innerText = data.question;
    data.answers.forEach((answer, index) => {
        const answerElement = document.querySelector(`#answer${Number(index) + 1}`);
        answerElement.innerText = answer;
    });
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
