const userNameInput = document.getElementById("user-name");
const startBtn = document.getElementById("start-btn");
const contentComponent = document.getElementById("content");
const inputWrapper = document.getElementById("input-wrapper");

const counter = document.createElement("div");
counter.classList.add("count");

const tapper = document.createElement("button");
tapper.classList.add("tapper");
tapper.innerHTML = "tap";

const timer = document.createElement("div");
timer.classList.add("timer");

const error = document.createElement("div");
error.classList.add("error");

let userName;
let count = 0;
let timeLeft = 5;

const updateCount = () => {
  counter.innerHTML = count;
};

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

const apikey = urlParams.get("apikey");
const id = urlParams.get("id");

const sendScore = () => {
  fetch(`https://bq-server.onrender.com/api/result/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: apikey,
    },
    body: JSON.stringify({
      displayTitle: userName,
      additionalInfo: "",
      points: count,
    }),
  })
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((error) => console.error("Error:", error));
};

const startTimer = () => {
  timer.innerHTML = `left: ${timeLeft}s`;

  const interval = setInterval(() => {
    timeLeft = timeLeft - 1;
    timer.innerHTML = `left: ${timeLeft}s`;

    if (timeLeft <= 0) {
      clearInterval(interval);
      contentComponent.innerHTML = `
      <div class="results">
        <div>Thanks ${userName} for the game!</div>
        <div class="score">Your score is ${count}</div>
        <div>Look at the board now!</div>
      </div>
      `;
      sendScore();
    }
  }, 1000);
};

const showError = () => {
  error.innerHTML = "Name can not be empty";
  inputWrapper.append(error);
};

const startGame = () => {
  userName = userNameInput.value;
  contentComponent.innerHTML = "";
  contentComponent.append(counter);
  contentComponent.append(tapper);
  contentComponent.append(timer);

  updateCount();
  startTimer();
};

startBtn.addEventListener("click", () => {
  if (userNameInput.value) {
    startGame();
  } else {
    showError();
  }
});

tapper.addEventListener("click", () => {
  count++;
  updateCount();
});
