<template>
  <a-drawer
    :title="$t('task.chooseTemplate')"
    placement="right"
    :width="600"
    :closable="false"
    :visible="visible"
    @close="handleCancel"
    :wrapStyle="{height: 'calc(100% - 108px)',overflow: 'auto',paddingBottom: '108px'}"
  >
    <a-form layout="vertical">
      <a-row :gutter="16">
        <a-col span="8">
          <a-form-item :label="$t('task.name')">
            <a-input v-model="queryParam.name" :placeholder="$t('task.taskPlaceholder')" />
          </a-form-item>
        </a-col>
        <a-col span="8">
          <a-form-item :label="$t('task.direction')">
            <a-select
              v-model="queryParam.screen"
              :placeholder="$t('common.choosePlaceholder')"
              default-value
            >
              <a-select-option value>{{ $t('common.all') }}</a-select-option>
              <a-select-option value="0">{{ $t('task.horizontal') }}</a-select-option>
              <a-select-option value="1">{{ $t('task.vertical') }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col span="8">
          <a-button style="float:right" type="primary" @click="loadData">{{ $t('common.search') }}</a-button>
        </a-col>
      </a-row>
    </a-form>

    <a-list
      :grid="{ gutter: 8, column: 3 }"
      :dataSource="data"
      :loading="loading"
      :pagination="pagination"
    >
      <a-list-item slot="renderItem" slot-scope="item">
        <a-card :bodyStyle="{padding:'5px'}" @click="onClickTemplate(item.id)">
          <div class="card-name">
            <a-checkbox :checked="item.id===selectedId"></a-checkbox>
            <span :title="item.name">{{ item.name }}</span>
          </div>
          <template-preview :areas="item" />
          <template class="ant-card-actions" slot="actions">
            <a-icon type="edit" @click="onEditTemplate(item)" />
            <a-icon type="delete" @click="onDelTemplate(item)" />
          </template>
        </a-card>
      </a-list-item>
    </a-list>
    <div style="width:100%;height:75px;"></div>
    <div :style="footStyle">
      <a-button style="marginRight: 8px" @click="handleCancel">{{ $t('common.cancel') }}</a-button>
      <a-button @click="handleSubmit" type="primary">{{ $t('common.ok') }}</a-button>
    </div>
    <component ref="model" :is="currentModel" @ok="handleModelOk" @close="handleModelClose"></component>
  </a-drawer>
</template>

<script>
import { getTemplateList, delTemplate } from '@/api/template'
import SaveTemplateWin from './SaveTemplateWin'
import TemplatePreview from './TemplatePreview'

export default {
  components: {
    SaveTemplateWin,
    TemplatePreview
  },
  data () {
    return {
      footStyle: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        borderTop: '1px solid #e8e8e8',
        padding: '10px 16px',
        textAlign: 'right',
        left: 0,
        background: '#fff',
        borderRadius: '0 0 4px 4px'
      },
      queryParam: {},
      pagination: {
        onChange: (page) => {
          this.loadData()
        },
        current: 1,
        pageSize: 9
      },
      visible: false,
      loading: false,
      data: [],
      selectedId: 0,
      currentModel: ''
    }
  },
  created () {
    this.loadData()
  },
  methods: {
    show (params) {
      this.visible = true
    },
    handleSubmit () {
      var obj = this.data.find(item => item.id === this.selectedId)
      if (!obj) {
        this.$notification['error']({
          message: this.$t('common.error'),
          description: this.$t('task.templateChoosePlaceholder'),
          duration: 4
        })
        return
      }
      this.$emit('ok', obj)
    },
    handleCancel () {
      this.visible = false
      this.$emit('close')
    },
    loadData () {
      this.loading = true
      var parameter = {
        pageNo: this.pagination.current,
        pageSize: this.pagination.pageSize
      }
      getTemplateList(Object.assign(parameter, this.queryParam)).then(res => {
        if (res.code === 200) {
          this.loading = false
          const r = res.result
          this.pagination.total = r.totalCount

          if (r.data.length === 0 && this.pagination.current > 1) {
            this.localPagination.current--
            this.loadData()
            return
          }
          this.data = r.data
        } else {
          this.$notification['error']({
            message: this.$t('common.error'),
            description: res.errMsg || this.$t('common.tryLater'),
            duration: 4
          })
        }
        this.selectedId = 0
        this.loading = false
      }, () => {
        this.loading = false
      })
    },
    handleModelOk () {
      this.loadData()
      this.currentModel = ''
    },
    handleModelClose () {
      this.currentModel = ''
    },
    onEditTemplate (area) {
      this.currentModel = 'SaveTemplateWin'
      this.$nextTick(() => {
        this.$refs.model.show({
          templateId: area.id,
          name: area.name,
          width: area.width,
          height: area.height,
          areas: JSON.stringify(area.areas)
        })
      })
    },
    onDelTemplate (obj) {
      var that = this
      this.$confirm({
        title: this.$t('task.delTemplateTitle', [obj.name]),
        content: this.$t('task.delContent'),
        okType: 'danger',
        onOk () {
          return delTemplate(obj.id).then(res => {
            if (res.code === 200) {
              that.loadData()
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
    onClickTemplate (id) {
      this.selectedId = id
    }
  }
}
</script>

<style lang="less" scoped>
.card-name {
  background: transparent;
  border-bottom: 1px solid #e8e8e8;
  padding: 4px 12px;
  border-radius: 2px 2px 0 0;
  zoom: 1;
  margin-bottom: -1px;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.85);
  font-weight: 500;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
  display: inline-block;
  width: 100%;
}
</style>
