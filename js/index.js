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

const lessonsElem = document.querySelector('.unsorted')
const lessonMap = document.querySelector('.lesson-map')

const bucketForm = document.querySelector('#newBucket')
const bucketInput = document.querySelector('.bucket-input')
const bucketShifts = document.querySelectorAll('.bucket-shift')

// Helpers

function insertAfter (newNode, referenceNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling)
}

// -+ Date functions

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

// -+ Progress bars

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

// Grade control buttons
function bumpGrade (e) {
  gradeInput.value = (parseFloat(gradeInput.value) + parseFloat(e.target.dataset.increment)).toFixed(2)
  setGradeBar()
}

// -+ Lesson planner functions

function toggleLesson (e) {
  e.target.dataset.completed = e.target.dataset.completed === 'true' ? 'false' : 'true'
  addLessons()
}

function initLessons () {
  lessons.forEach(function (lesson, i) {
    if (!lesson.completed) {
      lesson.completed = false
    }
    lessonNode = document.createElement('li')
    lessonGp = '<span class="gradepoint">' + lesson.gp + '</span> '
    lessonNode.innerHTML = lessonGp + lesson.name
    lessonNode.classList.add('lessons--item')
    lessonNode.dataset.name = lesson.name
    lessonNode.dataset.gradepoint = lesson.gp
    lessonNode.dataset.completed = lesson.completed
    lessonNode.addEventListener('click', toggleLesson)
    lessonsElem.appendChild(lessonNode)
  })
}

function addLessons () {
  var totalGPA = 0.00
  document.querySelectorAll('.lessons--item').forEach(function (lesson, i) {
    if (lesson.dataset.completed === 'true') {
      totalGPA += parseFloat(lesson.dataset.gradepoint)
    }
  })
  gradeInput.value = totalGPA.toFixed(2)
  setGradeBar()
}

// -+ Milestone (bucket) Functions

function shiftBtn (direction) {
  var btn = document.createElement('button')
  btn.classList.add('bucket-shift')
  btn.dataset.shift = direction
  btn.addEventListener('click', moveMilestone)
  return btn
}

function createMilestone (heading) {
  var milestone = document.createElement('section')
  var milestoneHeader = document.createElement('header')
  var milestoneHeading = document.createElement('h3')
  var upButton = shiftBtn('up')
  var downButton = shiftBtn('down')
  var deleteButton = shiftBtn('delete')

  milestoneHeading.textContent = heading
  milestoneHeader.appendChild(milestoneHeading)
  milestoneHeader.appendChild(upButton)
  milestoneHeader.appendChild(downButton)
  milestoneHeader.appendChild(deleteButton)
  milestone.appendChild(milestoneHeader)
  lessonMap.insertBefore(milestone, lessonsElem)
  Sortable.create(milestone, {
    group: 'milestones',
    draggable: '.lessons--item'
  })
}

function moveMilestone (e) {
  var milestone = e.target.parentNode.parentNode,
    parent = milestone.parentNode,
    prev = milestone.previousElementSibling,
    next = milestone.nextElementSibling
  if (e.target.dataset.shift === 'up' && prev) {
    oldChild = parent.removeChild(milestone)
    parent.insertBefore(oldChild, prev)
  } else if (e.target.dataset.shift === 'down' && next) {
    oldChild = parent.removeChild(milestone)
    insertAfter(oldChild, next)
  } else if (e.target.dataset.shift === 'delete') {
    milestone.querySelectorAll('.lessons--item').forEach(function (element) {
      lessonsElem.appendChild(element)
    })
    parent.removeChild(milestone)
  }
}

// Make lists sortable
function sortableInit () {
  var doneLessons = document.querySelector('.lesson-map .done')
  var unsortedLessons = document.querySelector('.lesson-map .unsorted')
  var sample = document.querySelector('.sample')

  Sortable.create(doneLessons, {
    group: 'milestones',
    draggable: '.lessons--item',
    onAdd: function (e) {
      e.item.dataset.completed = 'true'
      addLessons()
    }
  })
  Sortable.create(unsortedLessons, {
    group: 'milestones',
    draggable: '.lessons--item'
  })
  Sortable.create(sample, {
    group: 'milestones',
    draggable: '.lessons--item'
  })
}

// Events

dateInput.addEventListener('input', setDateBar)
gradeInput.addEventListener('input', setGradeBar)

bucketForm.addEventListener('submit', function (e) {
  e.preventDefault()
  var headingText = bucketInput.value
  bucketInput.value = ''
  createMilestone(headingText)
  return false
})
bucketShifts.forEach(function (element, i) {
  element.addEventListener('click', moveMilestone)
})

gradeBumpers.forEach(function (element, index) {
  element.addEventListener('click', bumpGrade)
})

// Initializers

dateInput.valueAsDate = new Date()
setDateBar()
initLessons()
sortableInit()

