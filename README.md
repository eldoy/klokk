# Klokk

Timer strings.

### Install

```
npm i klokk
```

### Usage

```js
var klokk = require('klokk')

// Get next date time
var next = klokk.next('1 hour from now')
```

Example strings supported, all numbers can be exchanged:

- now
- 10 seconds from now
- 1 minute from now
- 24 hours from now
- 5 days from now
- 1 week from now
- next tuesday at 12:00
- monday to friday at 04
- monday, tuesday, wednesday, friday at 04
- every friday at 03:00 and 19:30
- every friday at 03:00, sunday at 04, saturday at 10:30:30
- every 10 seconds

Created by [Eldøy Projects](https://eldoy.com)
