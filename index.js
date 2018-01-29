const def = (obj, key, val, enumerable) => {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  })
}

const arrayProto = Array.prototype

const methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]

function patch (src, dest, getter, setter) {
  def(src, 'push', (...args) => {
    const result = arrayProto.push.apply(src, args)
    const distArgs = args.map(setter)
    dest.push(...distArgs)
    return result
  })
  def(src, 'pop', (...args) => {
    dest.pop()
    return arrayProto.pop.apply(src, args)
  })
  def(src, 'shift', (...args) => {
    dest.shift()
    return arrayProto.shift.apply(src, args)
  })
  def(src, 'unshift', (...args) => {
    const result = arrayProto.unshift.apply(src, args)
    const distArgs = args.map(setter)
    dest.unshift(...distArgs)
    return result
  })
  def(src, 'splice', function (...args) {
    const result = arrayProto.splice.apply(src, ...args)
    const distArgs = args.map((value, index) => {
      if (index < 2) {
        return value
      } else {
        return setter(value)
      }
    })
    dest.splice(...distArgs)
    return result
  })
  def(src, 'reverse', function (...args) {
    const result = arrayProto.reverse.apply(src)
    dest.reverse()
    return result
  })
}

export default function getComputedArray (arrayGetter, itemGetter, itemSetter) {
  return {
    get: function () {
      const arr = arrayGetter.call(this)
      const computedArray = arr.map(itemGetter)
      patch(computedArray, arr, itemGetter, itemSetter)
      return computedArray
    },
    set: function (arr) {
       return arr.map(itemSetter)
    }
  }
}
