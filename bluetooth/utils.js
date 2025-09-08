/**
 * @param {string} url
 * @returns {Object}
 */
export function getQueryObject(url) {
  const search = url.substring(url.lastIndexOf('?') + 1)
  const obj = {}
  const reg = /([^?&=]+)=([^?&=]*)/g
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1)
    let val = decodeURIComponent($2)
    val = String(val)
    obj[name] = val
    return rs
  })
  return obj
}

export function GUID() {
  const dateTime = dayjs().format('YYYYMMDDHHmmss')
  const timestamp = dayjs().valueOf().toString()
  const randomSuffix = Math.random().toString().slice(2, 7)
  return dateTime + timestamp + randomSuffix.padEnd(5, '0')
}

/**
 *
 * @param {Date} end - 结束时间
 * @param {Date} start - 开始时间
 * @returns {string} - 时间差 'xx : xx : xx'
 */
export function getTimeDiff(end, start = new Date()) {
  const diffMs = Math.abs(dayjs(start).valueOf() - dayjs(end).valueOf())
  const totalSeconds = Math.floor(diffMs / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  return `${hours.toString().padStart(2, '0')} : ${minutes.toString().padStart(2, '0')} : ${seconds.toString().padStart(2, '0')}`
}

/**
 * 深度获取对象中的所有指定键的值
 * @param {Object} deviceConfig
 * @param {string} key
 * @returns
 */
export function deepGetValues(deviceConfig, key) {
  const serviceIds = new Set()
  JSON.stringify(deviceConfig, (i, value) => {
    if (i === key) serviceIds.add(value)
    return value
  })
  return Array.from(serviceIds)
}
