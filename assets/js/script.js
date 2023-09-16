var quizData = [
  {
    question: "What is the capital of France?",
    answers: ["Paris", "Madrid", "Rome", "Berlin"],
    correctAnswer: 0,
  },
  {
    question: "Which planet is known as the red planet?",
    answers: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswer: 1,
  },
  {
    question: "What is the largest ocean in the world?",
    answers: [
      "Atlantic Ocean",
      "Indian Ocean",
      "Arctic Ocean",
      "Pacific Ocean",
    ],
    correctAnswer: 3,
  },
];

var leaderboardScores = [];

var score = 0;
var currentQuestion = 0;
var timeLeft = 60;
var timer = document.querySelector("#timer");
var quizEl = document.querySelector("#quizContainer");
var resultsEl = document.querySelector("#resultContainer");
var leaderboard = document.querySelector("#leaderboard");
var timerInterval;

function startQuiz() {
  document.querySelector("#startButton").style.display = "none";
  document.querySelector("#leaderboardButton").style.display = "none";
  quizEl.style.display = "block";
  leaderboard.style.display = "none";

  showQuestion();
  startTimer();
  timerInterval = setInterval(startTimer, 1000);
}

document.querySelector("#startButton").addEventListener("click", startQuiz);
document.querySelector("#leaderboardButton").addEventListener("click", function() {
  var storedScores = JSON.parse(localStorage.getItem("leaderboard"));

  if (storedScores !== null) {
    leaderboardScores = storedScores;
  }
  showLeaderboard();
});


function startTimer() {
  timer.textContent = "Time Left: " + timeLeft;

  if (timeLeft === -1) {
    clearInterval(timerInterval);
    alert("You ran out of time!");
    timer.textContent = " ";
    endQuiz();
  }

  timeLeft--;
}

function showQuestion() {
  var questionEl = document.querySelector("#question");
  var answersEl = document.querySelector("#answers");
  var nextButton = document.querySelector("#nextButton");

  questionEl.textContent = quizData[currentQuestion].question;
  answersEl.textContent = "";

  quizData[currentQuestion].answers.forEach((option) => {
    var button = document.createElement("button");
    button.textContent = option;
    button.addEventListener("click", selectAnswer);
    answersEl.appendChild(button);
  });

  resultContainer.innerHTML = "";
}

function selectAnswer(event) {
  var selectedButton = event.target;
  var selectedAnswer = quizData[currentQuestion].answers.indexOf(
    selectedButton.textContent
  );
  var correctAnswer = quizData[currentQuestion].correctAnswer;

  if (selectedAnswer === correctAnswer) {
    score++;
  } else {
    timeLeft -= 5;
  }

  var resultsText = selectedAnswer === correctAnswer ? "Correct!" : "Wrong!";
  var resultsColor = selectedAnswer === correctAnswer ? "green" : "red";

  resultsEl.textContent = resultsText;
  resultsEl.style.color = resultsColor;

  setTimeout(nextQuestion, 750);
}

function nextQuestion() {
  currentQuestion++;

  if (currentQuestion < quizData.length) {
    showQuestion();
  } else {
    clearInterval(timerInterval);
    endQuiz();
  }
}

function endQuiz() {
  var endScore = document.createElement("h2");
  quizEl.style.display = "none";
  resultsEl.textContent = " ";
  resultsEl.style.color = "black";

  var scorePercent = Math.floor((score / quizData.length) * 100);
  endScore.textContent = "Your score is " + scorePercent + "%";
  resultContainer.appendChild(endScore);
  saveLastScore();
}

function saveLastScore() {
  var scorePercent = Math.floor((score / quizData.length) * 100);

  var storedScores = JSON.parse(localStorage.getItem("leaderboard"));

  if (storedScores !== null) {
    leaderboardScores = storedScores;
  }


  if (
    confirm(
      "Congratulations, your score is " +
        scorePercent +
        "%! Would you like to save your score?"
    )
  ) {
    var userInitials = prompt("Enter your initials.");
    var playerScore = userInitials.toLocaleUpperCase() + ": " + scorePercent + "%";
    leaderboardScores.push(playerScore);
    storeScore();
    showLeaderboard();
  } else {
    showLeaderboard();
  }
}

function storeScore() {
  localStorage.setItem("leaderboard", JSON.stringify(leaderboardScores));
}

function showLeaderboard() {
  leaderboard.innerHTML = "<h3> Recent Scores </h3>";
  leaderboard.style.display = "block";

  for (var i = 0; i < leaderboardScores.length; i++) {
    var currentScore = leaderboardScores[i];

    var li = document.createElement("li");
    li.textContent = currentScore;

    leaderboard.appendChild(li);
  }

  var scoreReset = document.createElement("button");
  scoreReset.textContent = "Reset Leaderboard";
  leaderboard.appendChild(scoreReset);

  scoreReset.addEventListener("click", function() {
    localStorage.clear();
    leaderboard.innerHTML = "<h3> Recent Scores </h3>";
  });
}
