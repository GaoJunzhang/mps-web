<template>
  <a-layout-sider
    width="280"
    breakpoint="lg"
    :collapsed="!show"
    collapsedWidth="30"
    style="background:#FFF"
    @collapse="onMgroupCollapse"
  >
    <a-card :title="$t('mgroup.mgroup')" v-show="show" style="height:100%">
      <a-button slot="extra" shape="circle" icon="left" size="small" @click="onClickExpand" />
      <a-button-group>
        <a-button icon="plus" @click="onAddMgroup" :title="$t('common.new')" :disabled="selectMgroupNode.key <= 0" />
        <a-button icon="edit" @click="onEditMgroup" :title="$t('common.edit')" :disabled="selectMgroupNode.key <= 0" />
        <a-button icon="delete" @click="onDelMgroup" :title="$t('common.del')" :disabled="selectMgroupNode.key <= 0" />
        <a-button icon="reload" @click="onReloadMgroup" :title="$t('common.reload')" />
        <a-button icon="search" @click="onSearchMgroup" :title="$t('common.search')" />
      </a-button-group>
      <a-tooltip placement="bottom" :title="searchTipTitle" trigger :visible="showToolTip">
        <a-input-search
          style="margin-top: 8px"
          v-show="showSearch"
          :placeholder="$t('mgroup.mgroupPlaceholder')"
          @change="onSearchNameChange"
          @search="onMgroupSearchChange"
        />
      </a-tooltip>
      <a-tree
        showIcon
        :loadedKeys="loadedKeys"
        :expandedKeys="expandedKeys"
        :autoExpandParent="autoExpandParent"
        :loadData="onMgroupLoadData"
        :treeData="mgroupTreeData"
        :filterTreeNode="filterMgroupNode"
        @select="onSelectMgroup"
        @expand="onExpandMgroup"
      >
        <a-icon slot="share" type="folder-add" />
        <a-icon slot="noShare" type="folder" />
      </a-tree>
    </a-card>
    <a-button
      v-show="!show"
      shape="circle"
      icon="right"
      size="small"
      @click="onClickExpand"
      style="margin:16px 3px"
    />
    <component ref="model" :is="current" @ok="handleOk" @close="handleClose"></component>
  </a-layout-sider>
</template>

<script>
import MgroupForm from './Mgroup'
import { getMgroupList, delMgroup, getMgroupByName } from '@/api/mgroup'

export default {
  components: {
    MgroupForm
  },
  data () {
    return {
      show: true,
      showSearch: false,
      loadedKeys: [],
      expandedKeys: [],
      autoExpandParent: false,
      mgroupTreeData: [],
      selectMgroupNode: { key: 0 },
      current: '',
      searchNamePage: 0,
      searchKey: 0,
      showToolTip: false,
      searchTipTitle: ''
    }
  },
  created () {
    this.loadMgroups({})
  },
  methods: {
    loadMgroups (param) {
      getMgroupList(param).then(res => {
        res.result.forEach(obj => {
          if (obj.share === 1) {
            obj.slots = { icon: 'share' }
          } else {
            obj.slots = { icon: 'noShare' }
          }
        })
        this.mgroupTreeData = res.result
        if (this.mgroupTreeData.length > 0) {
          this.expandedKeys = [this.mgroupTreeData[0].key]
        }
      })
    },
    onClickExpand () {
      this.show = !this.show
    },
    setExpand (expand) {
      if (expand !== 'undefined') {
        this.show = !expand
      }
    },
    onMgroupCollapse (collapse) {
      this.setExpand(collapse)
    },
    onSelectMgroup (key, e) {
      if (e.selected) {
        this.selectMgroupNode = e.node.dataRef
      } else {
        this.selectMgroupNode = { key: 0 }
      }

      this.$emit('mgroupChange', this.selectMgroupNode)
    },
    onMgroupLoadData (treeNode) {
      return getMgroupList({ id: treeNode.dataRef.key }).then(res => {
        res.result.forEach(obj => {
          if (obj.share === 1) {
            obj.slots = { icon: 'share' }
          } else {
            obj.slots = { icon: 'noShare' }
          }
        })
        treeNode.dataRef.children = res.result
        if (res.result.length <= 0) {
          var isLoaded = this.loadedKeys.findIndex(item => item === treeNode.dataRef.key)
          if (isLoaded < 0) {
            this.loadedKeys.push(treeNode.dataRef.key)
          }
        }
        this.mgroupTreeData = [...this.mgroupTreeData]
      })
    },
    onExpandMgroup (expandedKeys) {
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    onAddMgroup () {
      if (this.selectMgroupNode.key <= 0) {
        this.$notification['error']({
          message: this.$t('common.error'),
          description: this.$t('mgroup.chooseError'),
          duration: 4
        })
        return
      }

      this.current = 'MgroupForm'
      this.$nextTick(() => {
        this.$refs.model.add(this.selectMgroupNode.key)
      })
    },
    onEditMgroup () {
      if (this.selectMgroupNode.key <= 0) {
        this.$notification['error']({
          message: this.$t('common.error'),
          description: this.$t('mgroup.chooseError'),
          duration: 4
        })
        return
      }

      this.current = 'MgroupForm'
      this.$nextTick(() => {
        this.$refs.model.edit(this.selectMgroupNode)
      })
    },
    onDelMgroup () {
      if (this.selectMgroupNode.key <= 0) {
        this.$notification['error']({
          message: this.$t('common.error'),
          description: this.$t('mgroup.chooseError'),
          duration: 4
        })
        return
      }
      var that = this
      this.$confirm({
        title: this.$t('mgroup.delTitle', [this.selectMgroupNode.title]),
        content: this.$t('mgroup.delContent'),
        okType: 'danger',
        onOk () {
          return delMgroup(that.selectMgroupNode.key).then(res => {
            if (res.code === 200) {
              that.selectMgroupNode = { key: 0 }
              that.reloadMgroup(res.result)
            } else {
              that.$notification['error']({
                message: this.$t('common.error'),
                description: res.errMsg || this.$t('common.tryLater'),
                duration: 4
              })
            }
          })
        }
      })
    },
    onSearchMgroup () {
      this.showSearch = !this.showSearch
    },
    onReloadMgroup () {
      this.reloadMgroup(this.selectMgroupNode.key)
    },
    reloadMgroup (key) {
      if (key <= 0) {
        this.expandedKeys = []
        this.loadedKeys = []
        this.loadMgroups({})
      } else {
        var isLoaded = this.loadedKeys.findIndex(item => item === key)
        if (isLoaded >= 0) {
          this.loadedKeys.splice(isLoaded, 1)
        }

        var isExpand = this.expandedKeys.findIndex(item => item === key)
        if (isExpand >= 0) {
          this.expandedKeys.splice(isExpand, 1)
        }
        this.clearTreeChild(key, this.mgroupTreeData)
        this.expandedKeys.push(key)
      }
    },
    clearTreeChild (key, data) {
      var found = false
      data.forEach(obj => {
        if (found) {
          return found
        }

        if (obj.key === key) {
          obj.children = []
          found = true
        } else if (obj.children && obj.children.length >= 0) {
          found = this.clearTreeChild(key, obj.children)
        }
      })
      return found
    },
    handleOk (key) {
      this.current = ''
      this.reloadMgroup(key)
    },
    handleClose () {
      this.current = ''
    },
    onSearchNameChange () {
      this.searchNamePage = 0
      this.searchKey = 0
    },
    onMgroupSearchChange (name) {
      var param = {
        name: name,
        page: ++this.searchNamePage
      }
      var that = this
      getMgroupByName(param).then(res => {
        if (res.code === 200) {
          var result = res.result
          if (result.data && result.data.length > 0) {
            // result.data.forEach(key => {
            //   var exist = that.expandedKeys.findIndex(item => item === key)
            //   if (exist < 0) {
            //     that.expandedKeys.push(key)
            //   }
            // })
            that.searchKey = result.key
            that.expandedKeys = result.data
            console.log(that.expandedKeys)
          } else if (result.totalCount <= 0) {
            that.showSearchToolTip(this.$t('mgroup.searchNoResult'))
          } else {
            that.searchNamePage = 0
            that.showSearchToolTip(this.$t('mgroup.searchNoMoreResult'))
          }
        }
      })
    },
    showSearchToolTip (title) {
      this.searchTipTitle = title
      this.showToolTip = true
      setTimeout(() => {
        this.showToolTip = false
      }, 2000)
    },
    filterMgroupNode (node) {
      return this.showSearch && node.dataRef.key === this.searchKey
    },
    getSelected () {
      return this.selectMgroupNode.key <= 0 ? '' : this.selectMgroupNode.key
    },
    getSelectedNode () {
      return this.selectMgroupNode.key <= 0 ? null : this.selectMgroupNode
    }
  }
}
</script>
