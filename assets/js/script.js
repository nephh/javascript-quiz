// Setting an array of question objects.
var quizData = [
  {
    question: "What is JavaScript primarily used for?",
    answers: ["Styling web pages", "Creating database tables", "Adding interactivity to websites", "Sending emails"],
    correctAnswer: 2,
  },
  {
    question: "Which keyword is used to declare a variable in JavaScript?",
    answers: ["opt", "int", "variable", "var"],
    correctAnswer: 3,
  },
  {
    question: "What is the correct way to comment out a single line of JavaScript code?",
    answers: [
      "/* This is a comment */",
      "' This is a comment",
      "// This is a comment",
      "# This is a comment",
    ],
    correctAnswer: 2,
  },
  {
    question: "How do you access the first element of an array in JavaScript?",
    answers: ["arr[0]", "arr.first()", "arr.firstElement", "arr.first"],
    correctAnswer: 0,
  }
];

// Setting our variables
var leaderboardScores = [];
var score = 0;
var currentQuestion = 0;
var timeLeft = 60;
var timer = document.querySelector("#timer");
var quizEl = document.querySelector("#quizContainer");
var resultsEl = document.querySelector("#resultContainer");
var leaderboard = document.querySelector("#leaderboard");
var timerInterval;

// The function the will run on the Start Button. Hide our buttons and show the quiz.
function startQuiz() {
  document.querySelector("#startButton").style.display = "none";
  document.querySelector("#leaderboardButton").style.display = "none";
  quizEl.style.display = "block";
  leaderboard.style.display = "none";

  showQuestion();
  startTimer();
  timerInterval = setInterval(startTimer, 1000);
}

// Handling the start and leaderboard buttons
document.querySelector("#startButton").addEventListener("click", startQuiz);
document.querySelector("#leaderboardButton").addEventListener("click", function() {
  var storedScores = JSON.parse(localStorage.getItem("leaderboard"));

  if (storedScores !== null) {
    leaderboardScores = storedScores;
  }
  showLeaderboard();
});

// Timer function
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

// Looping through our array of questions and showing the current one.
function showQuestion() {
  var questionEl = document.querySelector("#question");
  var answersEl = document.querySelector("#answers");

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

// The function that will run when we select an answer.
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

// Moving to the next question
function nextQuestion() {
  currentQuestion++;

  if (currentQuestion < quizData.length) {
    showQuestion();
  } else {
    clearInterval(timerInterval);
    endQuiz();
  }
}

// Ending the quiz and calculating the users score. 
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

// Saving the users score and updating the leaderboard scores if the user wants.
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

// Storing user score in localStorage
function storeScore() {
  localStorage.setItem("leaderboard", JSON.stringify(leaderboardScores));
}

// Function that will handle showing the leaderboard
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
