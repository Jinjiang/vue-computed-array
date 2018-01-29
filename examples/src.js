import Vue from 'vue/dist/vue.common'
import getComputedArray from '../index.js'

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
})


// For testing.
global.vm = vm

// // You can test it like this.
// this.vm.result[0].foo.key = 6
// this.vm.list[1].id = 5
// this.vm.result = [{ foo: { key: 10, title: 'X' }}]
// this.vm.list = [{ id: 20, name: 'Z' }]
