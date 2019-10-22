<template>
  <a-select @change="handleChange">
    <a-select-option v-for="item in lab" :key="item.id" :value="item.id" >{{ item.name }}</a-select-option>
  </a-select>
</template>

<script>
import { getAllResourceLab } from '@/api/resource'
export default {
  name: 'RlabSelect',
  data () {
    return {
      lab: []
    }
  },
  methods: {
    handleChange (value) {
      this.$emit('onChange', value)
    },
    initResourceLabData () {
      getAllResourceLab().then(res => {
        console.log('标签', res)
        if (res.success === true) {
          res.result.forEach(function (e) {
            e.value = e.id
            e.label = e.name
          })
          this.lab = res.result
        }
      })
    }
  },
  created () {
    this.initResourceLabData()
  }
}
</script>
