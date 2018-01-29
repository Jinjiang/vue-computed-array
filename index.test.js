import Vue from 'vue'
import getComputedArray from 'vue-computed-array'

test('it works', () => {
  const vm = new Vue({
    data: {
      list: [{ id: 1, name: 'A' }]
    },
    computed: {
      result: getComputedArray({
        get () { return this.list },
        set (v) { this.list = v }
      }, {
        get: v => ({ key: v.id, title: v.name }),
        set: v => ({ id: v.key, name: v.title })
      })
    }
  })
  expect(vm.result).toEqual([{ key: 1, title: 'A' }])
})
