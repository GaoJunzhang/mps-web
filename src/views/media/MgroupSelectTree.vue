<template>
  <a-tree-select
    style="width: 100%"
    :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
    :treeData="treeData"
    :loadData="onMgroupLoadData"
    :treeExpandedKeys="expandedKeys"
    @treeExpand="onExpandMgroup"
    @change="handelChange"
    placeholder="请选择媒体组织"
    :treeDefaultExpandAll="expandALl"
    :value="value"
  >
  </a-tree-select>
</template>

<script>
import { getMgroupList } from '@/api/mgroup'
export default {
  name: 'MgroupSelectTree',
  props: {
    mGroupId: {
      type: String,
      default: '2'
    },
    mGroupName: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      expandALl: true,
      value: '',
      treeData: [],
      expandedKeys: [],
      showSearch: false,
      searchKey: 0,
      hasChanged: false
    }
  },
  watch: {
    value (value) {
      if (this.hasChanged) {
        this.$emit('change', value)
      } else {
        this.$emit('change', this.mGroupId)
      }
    }
  },
  methods: {
    getAuhtSelectData (param) {
      const that = this
      getMgroupList(param).then(res => {
        res.result.forEach(obj => {
          obj.key = obj.key + ''
          obj.value = obj.key
        })
        that.treeData = res.result
        if (that.treeData.length > 0) {
          that.expandedKeys = [that.treeData[0].key]
          if (that.mGroupId) {
            that.value = that.mGroupName
          } else {
            that.value = [that.treeData[0].key]
          }
        }
      })
    },
    onMgroupLoadData (treeNode) {
      return getMgroupList({ id: treeNode.dataRef.key }).then(res => {
        res.result.forEach(obj => {
          obj.key = obj.key + ''
          obj.value = obj.key
        })
        treeNode.dataRef.children = res.result
        this.treeData = [...this.treeData]
      })
    },
    onExpandMgroup (expandedKeys) {
      this.expandedKeys = expandedKeys
    },
    handelChange (key, e) {
      this.value = key + ''
      this.hasChanged = true
    }
  },
  created () {
    this.getAuhtSelectData({})
  }
}
</script>
