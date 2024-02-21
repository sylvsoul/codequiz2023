// variables to keep track of quiz state
var currentQuestionIndex = 0;
var time = questions.length * 15;
var timerId;

// variables to reference DOM elements
var questionsEl = document.getElementById("questions");
var timerEl = document.getElementById("time");
var choicesEl = document.getElementById("choices");
var submitBtn = document.getElementById("submit");
var startBtn = document.getElementById("start");
var initialsEl = document.getElementById("initials");
var feedbackEl = document.getElementById("feedback");
var titleScreen = document.querySelector("#title-section");
var questionScreen = document.querySelector("#questions");
var endScreen = document.querySelector("#end-screen");
var questionTitle = document.querySelector("#question-title");


// sound effects
var sfxRight = new Audio("assets/smw_correct.wav");
var sfxWrong = new Audio("assets/smw_incorrect.wav");
var sfxFinish = new Audio("assets/smw_fortress_clear.wav");

function startQuiz() {
  // hide start screen

  titleScreen.setAttribute("class" , "hide");
  
  // un-hide questions section

  questionScreen.setAttribute("class" , "show")

  // start timer

  timerId = setInterval(clockTick , 1000);

  // show starting time

  timerEl.html = time ;

  getQuestion();
}

var userCorrect = 0;

function calculateScore() {
  userCorrect += 10;
  return userCorrect; // Add this line to return the updated score
}


function getQuestion() {
  // get current question object from array
  var currentQuestion = questions[currentQuestionIndex];
  // update title with current question
  questionTitle.textContent = currentQuestion.title;

  // clear out any old question choices
  choicesEl.textContent = " ";
  // loop over choices
  currentQuestion.choices.forEach(function(choiceOptions, i){
  // create new button for each choice
  // attach click event listener to each choice
  // display on the page
  var choiceNode = document.createElement("button");
      choiceNode.setAttribute("class", "choice");
      choiceNode.setAttribute("value", choiceOptions);
  

      // will list out choice number and what it is
      choiceNode.textContent = i + 1 + ". " + choiceOptions;
  
      // attach click event listener to each choice
      choiceNode.onclick = questionClick;
  
      // display on the page
      choicesEl.appendChild(choiceNode);

  })
 
  
}


function questionClick() {
  // check if user guessed wrong
  if (this.value !== questions[currentQuestionIndex].answer) {
    // penalize time
    time -= 15;

   // display new time on page
    timerEl.html = time;

    //play sound for incorrect
    sfxWrong.play();

    feedbackEl.textContent = "Wrong!";
  } else {

    feedbackEl.textContent = "Correct!";
    calculateScore();
    sfxRight.play();
  }

  // flash right/wrong feedback on page for half a second
  feedbackEl.setAttribute("class", "feedback");
  setTimeout(function() {
    feedbackEl.setAttribute("class", "feedback hide");
  }, 1000);

  // move to next question
  currentQuestionIndex++;

  // check if we've run out of questions
  if (currentQuestionIndex === questions.length) {
    quizEnd();
  } else {
    getQuestion();
  }
}


function quizEnd() {
  // stop timer
  clearInterval(timerId);
  // show end screen;
  // show final score
  endScreen.setAttribute("class" , "show");
  // hide questions section
  questionScreen.setAttribute("class" , "hide");
  //play sound for incorrect
  sfxFinish.play();

  // Display final score
  // Assuming there's an element with the ID 'final-score' to show the score
  var finalScoreEl = document.getElementById("final-score");
  finalScoreEl.textContent = "Your final score is: " + userCorrect;

  // Alternatively, if you want to use the 'scoreDisplay' div as shown before:
  document.getElementById('scoreDisplay').textContent = "Your final score is: " + userCorrect;
}
//}

function clockTick() {
  // update time
  time-- ;
  timerEl.textContent = time ;
  // check if user ran out of time
  if ( time < 0 ){
    quizEnd();
  }
}



function saveHighscore() {
    // get value of input box
    var initials = initialsEl.value.trim();
  
    // make sure value wasn't empty
    if (initials !== "") {
      // get saved scores from localstorage, or if not any, set to empty array
      var highscores =
        JSON.parse(window.localStorage.getItem("highscores")) || [];
  
      // format new score object for current user
      var newScore = {
        score: userCorrect,
        initials: initials
      };
  
      // save to localstorage
      highscores.push(newScore);
      window.localStorage.setItem("highscores", JSON.stringify(highscores));
  
      // redirect to next page
      window.location.href = "highscore.html";
    }
  }

function checkForEnter(event) {
  if (event.key === "Enter") {
    saveHighscore();
  }
}

// user clicks button to submit initials
submitBtn.onclick = saveHighscore;

// user clicks button to start quiz
startBtn.onclick = startQuiz;

initialsEl.onkeyup = checkForEnter;
