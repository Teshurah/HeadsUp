const categories = {
  Animals: {
    icon: "🐶",
    words: [
      "Lion", "Tiger", "Elephant", "Giraffe", "Monkey", "Zebra", "Panda", "Kangaroo",
      "Dolphin", "Shark", "Penguin", "Crocodile", "Rabbit", "Horse", "Dog", "Cat",
      "Snake", "Eagle", "Owl", "Frog"
    ]
  },
  Movies: {
    icon: "🎬",
    words: [
      "Titanic", "Avatar", "Frozen", "Shrek", "Spider-Man", "Batman", "Superman",
      "Harry Potter", "The Lion King", "Finding Nemo", "Toy Story", "Black Panther",
      "Moana", "Cinderella", "Minions", "The Avengers", "Jumanji", "Aladdin"
    ]
  },
  Food: {
    icon: "🍕",
    words: [
      "Pizza", "Burger", "Sushi", "Pasta", "Ice Cream", "Chocolate", "Hot Dog",
      "Taco", "Donut", "Cake", "Chicken", "Fries", "Pancakes", "Waffles",
      "Popcorn", "Sandwich", "Noodles", "Cupcake"
    ]
  },
  Jobs: {
    icon: "💼",
    words: [
      "Doctor", "Teacher", "Police Officer", "Firefighter", "Chef", "Driver",
      "Pilot", "Nurse", "Farmer", "Actor", "Singer", "Artist", "Engineer",
      "Dentist", "Mechanic", "Cashier", "Lawyer", "Security Guard"
    ]
  },
  Sports: {
    icon: "⚽",
    words: [
      "Soccer", "Rugby", "Cricket", "Tennis", "Basketball", "Golf", "Boxing",
      "Swimming", "Running", "Cycling", "Volleyball", "Baseball", "Hockey",
      "Wrestling", "Skating", "Surfing"
    ]
  },
  "Famous People": {
    icon: "🌟",
    words: [
      "Taylor Swift", "Beyoncé", "Cristiano Ronaldo", "Messi", "The Rock",
      "Rihanna", "Drake", "Ariana Grande", "MrBeast", "Kim Kardashian",
      "Will Smith", "Zendaya", "Elon Musk", "Oprah", "Justin Bieber"
    ]
  },
  "Random Things": {
    icon: "🎲",
    words: [
      "Toothbrush", "Laptop", "Phone", "Car", "Umbrella", "Shoes", "Backpack",
      "Mirror", "Chair", "Table", "Clock", "Glasses", "Remote", "Pillow",
      "Blanket", "Candle", "Bottle", "Keys"
    ]
  },
  "South African": {
    icon: "🇿🇦",
    words: [
      "Braai", "Bunny Chow", "Loadshedding", "Springboks", "Bafana Bafana",
      "Durban", "Cape Town", "Johannesburg", "Table Mountain", "Taxi",
      "Biltong", "Koeksister", "Boerewors", "Soweto", "Proteas"
    ]
  }
};

const homeScreen = document.getElementById("home-screen");
const readyScreen = document.getElementById("ready-screen");
const gameScreen = document.getElementById("game-screen");
const resultScreen = document.getElementById("result-screen");

const categoryGrid = document.getElementById("category-grid");
const selectedCategoryTitle = document.getElementById("selected-category-title");
const wordDisplay = document.getElementById("word-display");
const timerDisplay = document.getElementById("timer");

const startBtn = document.getElementById("start-btn");
const backBtn = document.getElementById("back-btn");
const correctBtn = document.getElementById("correct-btn");
const wrongBtn = document.getElementById("wrong-btn");
const playAgainBtn = document.getElementById("play-again-btn");
const homeBtn = document.getElementById("home-btn");

const correctCount = document.getElementById("correct-count");
const wrongCount = document.getElementById("wrong-count");
const correctList = document.getElementById("correct-list");
const wrongList = document.getElementById("wrong-list");

let selectedCategory = "";
let wordQueue = [];
let currentWord = "";
let correctWords = [];
let wrongWords = [];
let timeLeft = 60;
let timer;
let gameActive = false;
let motionReady = true;
let startingTilt = null;

function showScreen(screen) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  screen.classList.add("active");
}

function loadCategories() {
  categoryGrid.innerHTML = "";

  Object.keys(categories).forEach(category => {
    const card = document.createElement("div");
    card.className = "category-card";

    card.innerHTML = `
      <span>${categories[category].icon}</span>
      <p>${category}</p>
    `;

    card.addEventListener("click", () => {
      selectedCategory = category;
      selectedCategoryTitle.textContent = category;
      showScreen(readyScreen);
    });

    categoryGrid.appendChild(card);
  });
}

function shuffleWords(words) {
  return [...words].sort(() => Math.random() - 0.5);
}

function startGame() {
  wordQueue = shuffleWords(categories[selectedCategory].words);
  correctWords = [];
  wrongWords = [];
  timeLeft = 60;
  gameActive = true;
  startingTilt = null;

  showScreen(gameScreen);
  nextWord();
  startTimer();
  enableMotionControls();
}

function startTimer() {
  timerDisplay.textContent = timeLeft;

  timer = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = timeLeft;

    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

function nextWord() {
  if (wordQueue.length === 0) {
    wordQueue = shuffleWords(categories[selectedCategory].words);
  }

  currentWord = wordQueue.shift();
  wordDisplay.textContent = currentWord;
}

function markCorrect() {
  if (!gameActive) return;

  correctWords.push(currentWord);
  flashScreen("#25d366");
  nextWord();
}

function markWrong() {
  if (!gameActive) return;

  wrongWords.push(currentWord);
  flashScreen("#ff3b30");
  nextWord();
}

function flashScreen(color) {
  document.body.style.background = color;

  setTimeout(() => {
    document.body.style.background = "linear-gradient(135deg, #ff7a18, #af002d, #319197)";
  }, 250);
}

function endGame() {
  clearInterval(timer);
  gameActive = false;

  correctCount.textContent = correctWords.length;
  wrongCount.textContent = wrongWords.length;

  correctList.innerHTML = "";
  wrongList.innerHTML = "";

  correctWords.forEach(word => {
    const li = document.createElement("li");
    li.textContent = word;
    correctList.appendChild(li);
  });

  wrongWords.forEach(word => {
    const li = document.createElement("li");
    li.textContent = word;
    wrongList.appendChild(li);
  });

  showScreen(resultScreen);
}

function enableMotionControls() {
  if (typeof DeviceOrientationEvent !== "undefined" &&
      typeof DeviceOrientationEvent.requestPermission === "function") {

    DeviceOrientationEvent.requestPermission()
      .then(permissionState => {
        if (permissionState === "granted") {
          window.addEventListener("deviceorientation", handleOrientation);
        }
      })
      .catch(console.error);

  } else {
    window.addEventListener("deviceorientation", handleOrientation);
  }
}

function handleOrientation(event) {
  if (!gameActive || !motionReady) return;

  const tilt = event.beta;

  if (tilt === null) return;

  if (startingTilt === null) {
    startingTilt = tilt;
    return;
  }

  const difference = tilt - startingTilt;

  if (difference > 25) {
    motionReady = false;
    markCorrect();
    resetMotion();
  }

  if (difference < -25) {
    motionReady = false;
    markWrong();
    resetMotion();
  }
}

function resetMotion() {
  setTimeout(() => {
    startingTilt = null;
    motionReady = true;
  }, 900);
}

startBtn.addEventListener("click", startGame);
backBtn.addEventListener("click", () => showScreen(homeScreen));
correctBtn.addEventListener("click", markCorrect);
wrongBtn.addEventListener("click", markWrong);

playAgainBtn.addEventListener("click", startGame);
homeBtn.addEventListener("click", () => showScreen(homeScreen));

loadCategories();
