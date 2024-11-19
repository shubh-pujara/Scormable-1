// Select video and question elements
const video = document.getElementById('myVideo');
const questionContainer = document.getElementById('questionContainer');
const questionText = document.getElementById('questionText');
const answerForm = document.getElementById('answerForm');
const resultsContainer = document.getElementById('resultsContainer');
const resultsList = document.getElementById('resultsList');

// Define questions with time markers
const questions = [
    {
        time: 7,
        type: "mcq",
        question: "Which principle ensures individuals know how their data is being collected and used?",
        options: { A: "Data Minimization", B: "Transparency", C: "Purpose Limitation" },
        correctAnswer: "B"
    },
    {
        time: 14,
        type: "trueFalse",
        question: "Transparency in data privacy means that individuals should know how their data will be collected, used, shared ? ",
        correctAnswer: true
    },
    {
        time: 20,
        type: "selectImage",
        question: "What do you think? which is more secure way?",
        options: [
            { id: 'img1', src: '2fa.png', alt: 'Image 1' },
            { id: 'img2', src: 'pin.gif', alt: 'Image 2' },
        ],
        correctAnswer: 'img1'
    }
];

let currentQuestionIndex = 0;

// Check the video time and pause at question times
video.ontimeupdate = function() {
    if (currentQuestionIndex < questions.length && Math.floor(video.currentTime) === questions[currentQuestionIndex].time) {
        pauseForQuestion(questions[currentQuestionIndex]);
    }
};

// Event listener to show results when video ends
video.onended = function() {
    showResults();
};

function pauseForQuestion(questionObj) {
    video.pause();
    questionContainer.style.display = 'block';
    questionText.textContent = questionObj.question;
    answerForm.innerHTML = '';  // Clear previous options

    if (questionObj.type === "mcq") {
        for (let option in questionObj.options) {
            answerForm.innerHTML += `
                <input type="radio" name="answer" value="${option}" id="${option}">
                <label for="${option}">${questionObj.options[option]}</label><br>
            `;
        }
    } else if (questionObj.type === "trueFalse") {
        answerForm.innerHTML += `
            <input type="radio" name="answer" value="true" id="true">
            <label for="true">True</label><br>
            <input type="radio" name="answer" value="false" id="false">
            <label for="false">False</label><br>
        `;
    } else if (questionObj.type === "selectImage") {
        questionObj.options.forEach(option => {
            answerForm.innerHTML += `
                <input type="radio" name="answer" value="${option.id}" id="${option.id}" class="image-option">
                <label for="${option.id}">
                    <img src="${option.src}" alt="${option.alt}" style="width: 100px; height: auto;">
                </label><br>
            `;
        });
    }
}

function submitAnswer() {
    const selectedAnswer = answerForm.elements['answer'].value;
    
    if (!selectedAnswer) {
        alert("Please select an answer!");
        return;
    }

    const questionObj = questions[currentQuestionIndex];
    const userAnswers = JSON.parse(localStorage.getItem('userAnswers')) || [];
    userAnswers.push({
        question: questionObj.question,
        selectedAnswer: selectedAnswer,
        correctAnswer: questionObj.correctAnswer,
        isCorrect: (questionObj.type === "selectImage") ? selectedAnswer === questionObj.correctAnswer : (selectedAnswer === questionObj.correctAnswer.toString())
    });
    localStorage.setItem('userAnswers', JSON.stringify(userAnswers));

    questionContainer.style.display = 'none';
    currentQuestionIndex++;
    
    if (currentQuestionIndex < questions.length) {
        video.play();
    } else {
        video.pause(); // Ensure the video is paused if it’s already done
        showResults();
    }
}

function showResults() {
    video.pause();
    video.controls = false;
    resultsContainer.style.display = 'block';
    const userAnswers = JSON.parse(localStorage.getItem('userAnswers')) || [];
    resultsList.innerHTML = '';

    userAnswers.forEach((answer, index) => {
        const resultItem = document.createElement('li');
        resultItem.textContent = `Question ${index + 1}: ${answer.question} - Your answer: ${answer.selectedAnswer} - ${answer.isCorrect ? "Correct" : "Incorrect"}`;
        resultsList.appendChild(resultItem);
    });
}
