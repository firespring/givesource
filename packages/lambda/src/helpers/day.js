const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
const timezonePlugin = require('dayjs/plugin/timezone')
const customParseFormat = require('dayjs/plugin/customParseFormat')

const dayOfYear = require('dayjs/plugin/dayOfYear')

const advancedFormat = require('dayjs/plugin/advancedFormat')

const weekday = require('dayjs/plugin/weekday')

const localeData = require('dayjs/plugin/localeData')

const isBetween = require('dayjs/plugin/isBetween')

dayjs.extend(utc)
dayjs.extend(timezonePlugin)
dayjs.extend(customParseFormat)
dayjs.extend(dayOfYear)
dayjs.extend(advancedFormat)
dayjs.extend(weekday)
dayjs.extend(localeData)
dayjs.extend(isBetween)

// isBetween

// dayjs.extend((o, c, dayjs) => {
//   const proto = c.prototype
//   const parseDate = (cfg) => {
//     const { date, utc } = cfg
//      console.log('parseDate', date)
//     if (date === '' || date === undefined) {
//       // console.log('parseDate', date)
//       return Date.now()
//     }
//     return date
//   }
//
//   const oldParse = proto.parse
//   // proto.parse = function (cfg) {
//   //   cfg.date = parseDate.bind(this)(cfg)
//   //   oldParse.bind(this)(cfg)
//   // }
//   proto.parse = function (cfg) {
//     try {
//       oldParse.bind(this)(cfg)
//     } catch (e) {
//       console.error('caught', e)
//       //cfg.date = 'Invalid Date'
//     }
//   }
//
// })

console.log('providing day.js!!!!!!')

module.exports = dayjs
