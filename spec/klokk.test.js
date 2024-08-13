var test = require('node:test')
var assert = require('node:assert')

var klokk = require('../index.js')

var DIFF = 10

var result
var expected

var second = 1000
var minute = 60 * second
var hour = 60 * minute
var day = 24 * hour
var week = 7 * day

function now(diff = 0) {
  return new Date().getTime() + diff
}

function next(day = 0, h = 0, m = 0, s = 0) {
  var now = new Date()
  now.setDate(now.getDate() + ((day + (7 - now.getDay())) % 7))
  now.setHours(h)
  now.setMinutes(m)
  now.setSeconds(s)
  now.setMilliseconds(0)

  var diff = now - new Date()
  if (diff < 0) {
    now.setDate(now.getDate() + 7)
  }

  return now
}

test('basic timer strings', async () => {
  result = klokk.next('now')
  expected = now()
  var diff = expected - result.getTime()
  assert.ok(diff >= 0 && diff < DIFF)

  result = klokk.next('10 seconds from now')
  expected = now(10 * second)
  var diff = expected - result.getTime()
  assert.ok(diff >= 0 && diff < DIFF)

  result = klokk.next('1 minute from now')
  expected = now(1 * minute)
  diff = expected - result.getTime()
  assert.ok(diff >= 0 && diff < DIFF)

  result = klokk.next('24 hours from now')
  expected = now(24 * hour)
  diff = expected - result.getTime()
  assert.ok(diff >= 0 && diff < DIFF)

  result = klokk.next('5 days from now')
  expected = now(5 * day)
  diff = expected - result.getTime()
  assert.ok(diff >= 0 && diff < DIFF)

  result = klokk.next('1 week from now')
  expected = now(1 * week)
  diff = expected - result.getTime()
  assert.ok(diff >= 0 && diff < DIFF)

  result = klokk.next('next tuesday at 12:00')
  expected = next(2, 12)
  assert.equal(expected.getTime(), result.getTime())
})

test('advanced timer strings', async () => {
  var now = new Date()
  var today = now.getDay()
  var hours = now.getHours()
  var tomorrow = today + 1

  result = klokk.next('monday to friday at 04')
  var nextDay = tomorrow > 5 ? 1 : tomorrow
  expected = next(nextDay, 4)
  assert.equal(expected.getTime(), result.getTime())

  result = klokk.next('monday, tuesday, wednesday, friday at 04')

  if (today == 3) {
    nextDay = 5
  } else if ([5, 6].includes(today)) {
    nextDay = 1
  } else {
    nextDay = tomorrow
  }

  expected = next(nextDay, 4)
  assert.equal(expected.getTime(), result.getTime())

  result = klokk.next('every monday at 04')
  expected = next(1, 4)
  assert.equal(expected.getTime(), result.getTime())

  result = klokk.next('every friday at 03:00 and 19:30')
  expected = next(5, 3)
  assert.equal(expected.getTime(), result.getTime())

  result = klokk.next(
    'every friday at 03:00, sunday at 04, saturday at 10:30:30'
  )
  nextDay = 5
  var time = [3]
  if (today == 5 && hours > 3) {
    nextDay = 6
    time = [10, 30, 30]
  } else if (today == 6 && hours > 10) {
    nextDay = 1
    time = [4]
  }
  expected = next(nextDay, ...time)
  assert.equal(expected.getTime(), result.getTime())

  result = klokk.next('every 10 seconds')

  expected = new Date()
  expected.setSeconds(expected.getSeconds() + 10)
  var diff = expected.getTime() - result.getTime()
  assert.ok(diff >= 0 && diff < DIFF)
})
