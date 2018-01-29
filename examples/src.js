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
    result: getComputedArray(
      function () { return this.list },
      v => { return { key: v.id, title: v.name }},
      v => { return { id: v.key, name: v.title }}
    )
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

global.vm = vm
