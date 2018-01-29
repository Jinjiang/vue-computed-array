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

const walk = (map, currentPath, bindings) => {
  for (const key in map) {
    const value = map[key]
    if (typeof value === 'object') {
      currentPath.push(key)
      walk(value, currentPath, bindings)
      currentPath.pop()
    } else if (typeof value === 'string') {
      const path = currentPath.slice()
      bindings.push({
        targetGetter: obj => path.reduce((result, name) => {
          if (result && result.hasOwnProperty(name)) {
            return result[name]
          }
        }, obj),
        key, value
      })
    }
  }
}

const parseReactiveMap = (map) => {
  if (!map) {
    return v => v
  }
  const bindings = []
  const currentPath = []
  walk(map, currentPath, bindings)
  return (src, dest) => {
    bindings.forEach(({ targetGetter, key, value }) => {
      const target = targetGetter(src)
      if (target) {
        Object.defineProperty(target, key, {
          get () { return dest[value] },
          set (v) { dest[value] = v }
        })
      }
      return src
    })
  }
}

export default function getComputedArray (array, item) {
  const parseItem = parseReactiveMap(item.map)
  return {
    get: function () {
      const arr = array.get.call(this)
      const computedArray = arr.map(src => {
        const dest = item.get(src)
        parseItem(dest, src)
        return dest
      })
      patch(computedArray, arr, item.get, item.set)
      return computedArray
    },
    set: function (arr) {
      array.set.call(this, arr.map(item.set))
    }
  }
}
