# vue-computed-array

`v0.1.x`: _That means it's not recommended for production environment now._

## Installation

``` bash
npm install vue-computed-array
```

## Usage

``` js
import Vue from 'vue'
import getComputedArray from 'vue-computed-array'

const vm = new Vue({
  el: '#app',
  data: {
    list: [
      { id: 1, name: 'A' },
      { id: 2, name: 'B' },
      { id: 3, name: 'C' }
    ]
  },
  computed: {
    result: getComputedArray({
      get () { return this.list },
      set (v) { this.list = v }
    }, {
      get: v => { return { foo: { key: v.id, title: v.name }}},
      set: v => { return { id: v.foo.key, name: v.foo.title }},
      map: { foo: { key: 'id' }}
    })
  },
  methods: {
    add () {
      const result = this.result
      result.push({
        key: result.length + 1,
        title: String.fromCharCode(65 + result.length)
      })
    }
  }
}
```

And then you can test it like this:

``` js
// Mutate the computed array.
vm.add()

// Change a property of the computed item.
vm.result[0].foo.key = 6

// Change a property of the original item.
vm.list[1].id = 5

// Set a new array to the computed array.
vm.result = [{ foo: { key: 10, title: 'X' }}]

// Set a new array to the original array.
vm.list = [{ id: 20, name: 'Z' }]
```

## API

### `function getComputedArray(arrayInfo, itemInfo)`

#### `arrayInfo`

* `get(): any`: Get value of the original array.
* `set(v): void`: Set value to the original array.

#### `itemInfo`

* `get(): any`: Get a computed array item from a original array item.
* `set(v): void`: Get a original array item from a computed array item.
* `map: Object`: `optional` the reactive map of properties between computed array item to original array item. The key and the path is for the computed array item and the value is the key of the original array item.
