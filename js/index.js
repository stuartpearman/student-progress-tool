// Extending Date Method
Date.prototype.totalDays = function () {
  return Math.floor(this.getTime() / 86400000)
}

// Dates
const startDate = new Date(2017, 0, 9)
const endDate = new Date(2017, 4, 5)
const classLength = parseFloat(subtractDate(endDate, startDate))

// Elements
const dateInput = document.querySelector('.date-input')
const dateOuter = document.querySelector('.date-bar')
const dateInner = document.querySelector('.date-bar .progress-inner')
const gradeInput = document.querySelector('.grade-input')
const gradeOuter = document.querySelector('.grade-bar')
const gradeInner = document.querySelector('.grade-bar .progress-inner')
const projectedGrade = document.querySelector('.projected-grade')
const gradeBumpers = document.querySelectorAll('button.grade-bumper')

// Helpers
function subtractDate (date1, date2) {
  return date1.totalDays() - date2.totalDays()
}

function dateInputValue () {
  return subtractDate(dateInput.valueAsDate, startDate)
}

function getClassPct () {
  var currentDate = parseFloat(dateInputValue())
  return currentDate / classLength
}

function setDateBar () {
  var dateToWidth = parseFloat(dateOuter.clientWidth) * getClassPct()
  dateInner.style = 'width: ' + dateToWidth + 'px'
  setProjectedGrade()
}

function gradeToWidth () {
  return parseFloat(gradeOuter.clientWidth) * gradeInput.value * 0.25
}

function setGradeBar () {
  gradeInner.style = 'width: ' + gradeToWidth() + 'px'
  setProjectedGrade()
}

function setProjectedGrade () {
  var projectedWidth = gradeToWidth() / getClassPct()
  projectedGrade.style = 'width: ' + projectedWidth + 'px'
}

function bumpGrade (e) {
  gradeInput.value = Math.round((parseFloat(gradeInput.value) + parseFloat(e.target.dataset.increment)) * 100) / 100
  setGradeBar()
}

// Events
dateInput.addEventListener('input', setDateBar)
gradeInput.addEventListener('input', setGradeBar)
gradeBumpers.forEach(function (element, index) {
  element.addEventListener('click', bumpGrade)
})

// Init

dateInput.valueAsDate = new Date()
setDateBar()
