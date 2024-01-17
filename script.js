"use strict";

// Constants for time measurements
const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

// DOM Elements
const countdownForm = document.getElementById("countdownForm");
const inputContainer = document.getElementById("input-container");
const dateEl = document.getElementById("date-picker");
const countdownEl = document.getElementById("countdown");
const countdownElTitle = document.getElementById("countdown-title");
const countdownBtn = document.getElementById("countdown-button");
const timeElements = document.querySelectorAll("span");
const completeEl = document.getElementById("complete");
const completeElInfo = document.getElementById("complete-info");
const completeBtn = document.getElementById("complete-button");

// State variables
let countdownTitle = "";
let countdownDate = "";
let countdownValue = new Date();
let countdownActive;
let savedCountdown;

// Set minimum date input value to today's date
function setMinDate() {
  const today = new Date().toISOString().split("T")[0];
  dateEl.setAttribute("min", today);
}

// Update Countdown UI
function updateDOM() {
  countdownActive = setInterval(() => {
    const now = new Date().getTime();
    const distance = countdownValue - now;
    const days = Math.floor(distance / DAY);
    const hours = Math.floor((distance % DAY) / HOUR);
    const minutes = Math.floor((distance % HOUR) / MINUTE);
    const seconds = Math.floor((distance % MINUTE) / SECOND);

    if (distance < 0) {
      clearInterval(countdownActive);
      displayComplete();
    } else {
      displayCountdown(days, hours, minutes, seconds);
    }
  }, SECOND);
}

function displayCountdown(days, hours, minutes, seconds) {
  countdownElTitle.textContent = countdownTitle;
  timeElements[0].textContent = days;
  timeElements[1].textContent = hours;
  timeElements[2].textContent = minutes;
  timeElements[3].textContent = seconds;
  inputContainer.hidden = true;
  completeEl.hidden = true;
  countdownEl.hidden = false;
}

function displayComplete() {
  completeElInfo.textContent = `${countdownTitle} finished on ${countdownDate}`;
  countdownEl.hidden = true;
  completeEl.hidden = false;
}

// Update countdown
function updateCountdown(event) {
  event.preventDefault();
  countdownTitle = event.target[0].value;
  countdownDate = event.target[1].value;

  if (!countdownDate) {
    alert("Please select a date for the countdown.");
    return;
  }

  savedCountdown = { title: countdownTitle, date: countdownDate };
  localStorage.setItem("countdown", JSON.stringify(savedCountdown));
  countdownValue = new Date(countdownDate).getTime();
  updateDOM();
}

// Reset countdown
function resetCountdown() {
  countdownEl.hidden = true;
  completeEl.hidden = true;
  inputContainer.hidden = false;
  clearInterval(countdownActive);
  localStorage.removeItem("countdown");
  countdownTitle = "";
  countdownDate = "";
}

// Restore countdown from localStorage
function restorePreviousCountdown() {
  if (localStorage.getItem("countdown")) {
    savedCountdown = JSON.parse(localStorage.getItem("countdown"));
    ({ title: countdownTitle, date: countdownDate } = savedCountdown);
    countdownValue = new Date(countdownDate).getTime();
    updateDOM();
  }
}

// Event Listeners
countdownForm.addEventListener("submit", updateCountdown);
countdownBtn.addEventListener("click", resetCountdown);
completeBtn.addEventListener("click", resetCountdown);

// Initialization
function init() {
  setMinDate();
  restorePreviousCountdown();
}

init();
