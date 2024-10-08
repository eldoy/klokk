var weekdays = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday'
]

function is(unit, str) {
  return [str, `${str}s`].includes(unit)
}

function addDiff(diff, d) {
  var [value, unit] = diff.split(' ')

  value = parseInt(value)

  date = new Date(d)

  if (is(unit, 'second')) {
    date.setTime(date.getTime() + value * 1000)
  } else if (is(unit, 'minute')) {
    date.setTime(date.getTime() + value * 60 * 1000)
  } else if (is(unit, 'hour')) {
    date.setTime(date.getTime() + value * 60 * 60 * 1000)
  } else if (is(unit, 'day')) {
    date.setDate(date.getDate() + value)
  } else if (is(unit, 'week')) {
    date.setDate(date.getDate() + value * 7)
  } else if (is(unit, 'month')) {
    date.setMonth(date.getMonth() + value)
  } else if (is(unit, 'year')) {
    date.setFullYear(date.getFullYear() + value)
  }

  return date
}

function nextDay(day, h = 0, m = 0, s = 0) {
  if (typeof day == 'string') {
    day = weekdays.indexOf(day)
  }

  var date = new Date()
  date.setDate(date.getDate() + ((day + (7 - date.getDay())) % 7))
  date.setHours(parseInt(h))
  date.setMinutes(parseInt(m))
  date.setSeconds(parseInt(s))
  date.setMilliseconds(0)

  var diff = date - new Date()
  if (diff < 0) {
    date.setDate(date.getDate() + 7)
  }

  return date
}

function getFirstDate(dates) {
  return dates.filter((day) => day > new Date()).sort((a, b) => a - b)[0]
}

function getNext(days, h, m, s) {
  return getFirstDate(days.map((day) => nextDay(day, h, m, s)))
}

function processEvery(str) {
  if (str.includes('and')) {
    var [date, time] = str.split(' at ')
    date = date.replace('every', 'next')
    time = time.split(' and ')
    return getFirstDate(time.map((t) => parse(`${date} at ${t}`)))
  } else {
    var next = str.replace('every', 'next')
    return parse(next)
  }
}

function parse(str) {
  if (!str) return

  var now = new Date()

  if (str.includes('now')) {
    if (str == 'now') {
      return now
    }
    if (str.includes('from')) {
      var [diff] = str.split(' from ')
      return addDiff(diff, now)
    }
  }

  if (str.includes('at')) {
    var [date, time] = str.split(' at ')
    var [h, m, s] = time.split(':')

    if (date.includes('next')) {
      var [, day] = date.split(' ')
      return nextDay(day, h, m, s)
    }

    if (date.includes('to')) {
      var [from, to] = date.split(' to ')
      var fromIdx = weekdays.indexOf(from)
      var toIdx = weekdays.indexOf(to)
      var days = weekdays.slice(fromIdx, toIdx + 1)

      return getNext(days, h, m, s)
    }

    if (date.includes(',')) {
      var days = date.split(',').map((v) => v.trim())
      return getNext(days, h, m, s)
    }
  }

  if (str.includes('every')) {
    if (str.includes('at')) {
      if (str.includes(',')) {
        str = str.replace('every', '')
        return getFirstDate(
          str.split(',').map((v) => parse(`next ${v.trim()}`))
        )
      } else {
        return processEvery(str)
      }
    } else {
      str = str.replace('every', '').trim()
      return addDiff(str, now)
    }
  }
}

function next(str) {
  return parse(str)
}

module.exports = { next }
