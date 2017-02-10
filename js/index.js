'use strict';

// Extending Date Method
Date.prototype.totalDays = function () {
  return Math.floor(this.getTime() / 86400000);
};

// Dates
var startDate = new Date(2017, 0, 9);
var endDate = new Date(2017, 4, 5);
var classLength = parseFloat(subtractDate(endDate, startDate));

// Elements
var dateInput = document.querySelector('.date-input');
var dateOuter = document.querySelector('.date-bar');
var dateInner = document.querySelector('.date-bar .progress-inner');
var gradeInput = document.querySelector('.grade-input');
var gradeOuter = document.querySelector('.grade-bar');
var gradeInner = document.querySelector('.grade-bar .progress-inner');
var gradeBumpers = document.querySelectorAll('button.grade-bumper');

// Helpers
function subtractDate(date1, date2) {
  return date1.totalDays() - date2.totalDays();
}

function dateInputValue() {
  return subtractDate(dateInput.valueAsDate, startDate);
}

function getClassPct() {
  var currentDate = parseFloat(dateInputValue());
  return currentDate / classLength;
}

function setDateBar() {
  var dateToWidth = parseFloat(dateOuter.clientWidth) * getClassPct();
  dateInner.style = 'width: ' + dateToWidth + 'px';
}

function setGradeBar() {
  var gradeToWidth = parseFloat(gradeOuter.clientWidth) * gradeInput.value * 0.25;
  gradeInner.style = 'width: ' + gradeToWidth + 'px';
}

function bumpGrade(e) {
  gradeInput.value = Math.round((parseFloat(gradeInput.value) + parseFloat(e.target.dataset.increment)) * 100) / 100;
  setGradeBar();
}

// Events
dateInput.addEventListener('input', setDateBar);
gradeInput.addEventListener('input', setGradeBar);
gradeBumpers.forEach(function (element, index) {
  element.addEventListener('click', bumpGrade);
});

// Init

dateInput.valueAsDate = new Date();
setDateBar();