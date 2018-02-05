/*
 * @Author: u14e 
 * @Date: 2018-02-05 18:03:01 
 * @Last Modified by: u14e
 * @Last Modified time: 2018-02-05 18:08:38
 */

export function addClass (el, className) {
  if (hasClass(el, className)) return

  let newClass = el.className.split(' ')
  newClass.push(className)
  el.className = newClass.join(' ')
}

export function hasClass (el, className) {
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
  return reg.test(el.className)
}
