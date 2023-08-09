import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezonePlugin from 'dayjs/plugin/timezone'
import customParseFormat from 'dayjs/plugin/customParseFormat'

import dayOfYear from 'dayjs/plugin/dayOfYear'

import advancedFormat from 'dayjs/plugin/advancedFormat'

import weekday from 'dayjs/plugin/weekday'

import localeData from 'dayjs/plugin/localeData'

import isBetween from 'dayjs/plugin/isBetween'

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

export default dayjs
