<template>
  <div style="background-color: #ececec; padding: 20px;">
    <a-row :gutter="8">
      <a-col :span="24">
        <a-button type="danger" @click="close">返回</a-button>
        <a-button type="danger" @click="submit">保存</a-button>
      </a-col>
      <a-col :span="12">
        <a-card :bordered="false">
          <div class="table-operator">
            <a-button
              icon="setting"
              @click="() => visible=true"
            >选择设备类型</a-button>
          </div>
          <a-table :columns="columns" :dataSource="data" size="middle">
            <span slot="action" slot-scope="text, record">
              <a-button icon="delete" type="danger" @click="removeDtype(record)">移除</a-button>
            </span>
          </a-table>
        </a-card>
      </a-col>
      <a-col :span="12">
        <a-card :bordered="false">
          <div class="table-operator">
            <a-button
              icon="setting"
              @click="() => visible1=true"
            >选择资源类型</a-button>
          </div>
          <a-table :columns="columns1" :dataSource="data1" size="middle">
            <span slot="action1" slot-scope="text, record">
              <a-button icon="delete" type="danger" @click="removeRtype(record)">移除</a-button>
            </span>
          </a-table>
        </a-card>
      </a-col>
    </a-row>
    <a-drawer
      title="设备类型"
      placement="right"
      :closable="false"
      @close="onClose"
      :visible="visible"
      :width="800"
    >
      <device-list :isParent="false" @addDr="addDtype"></device-list>
    </a-drawer>
    <a-drawer
      title="资源类型"
      placement="right"
      :closable="false"
      @close="onClose1"
      :visible="visible1"
      :width="800"
    >
      <resource-type :isParent="false" @addRr="addRtype"></resource-type>
    </a-drawer>
  </div>
</template>

<script>
import deviceList from './deviceList'
import resourceType from './resourceType'
import { batchSaveRtypeDtype } from '@/api/device'
export default {
  name: 'DTypeallotRtype',
  components: {
    deviceList,
    resourceType
  },
  data () {
    return {
      visible: false,
      visible1: false,
      columns: [
        {
          title: '资源类型名称',
          dataIndex: 'name'
        },
        {
          title: '备注',
          dataIndex: 'remark'
        },
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      columns1: [
        {
          title: '资源类型名称',
          dataIndex: 'name'
        },
        {
          title: '备注',
          dataIndex: 'remark'
        },
        {
          title: '操作',
          dataIndex: 'action1',
          scopedSlots: { customRender: 'action1' }
        }
      ],
      data: [],
      data1: []
    }
  },
  methods: {
    submit () {
      const that = this
      if (that.data.length <= 0) {
        that.$message.warning('请选择设备类型')
        return
      }
      if (that.data1.length <= 0) {
        that.$message.warning('请选择资源类型')
        return
      }
      var dtIds = []
      var rtIds = []
      this.data.forEach(function (v, k) {
        dtIds.push(v.id)
      })
      this.data1.forEach(function (v, k) {
        rtIds.push(v.id)
      })
      const param = {}
      param.dtIds = dtIds
      param.rtIds = rtIds
      batchSaveRtypeDtype(param).then(res => {
        if (res.success === true) {
          this.$message.info('添加成功')
          this.close()
        }
      })
    },
    close () {
      this.$emit('close')
    },
    addDtype (record) {
      const that = this
      // this.$message.info('已添加', v.name)
      const data = that.data
      for (let i = 0; i < data.length; i++) {
        if (data[i].id === record.id) {
          that.$message.warning('【' + record.name + '】已添加过')
          return
        }
      }
      that.$message.info('添加【' + record.name + '】成功')
      that.data.push(record)
    },
    addRtype (record) {
      const that = this
      const data = that.data1
      for (let i = 0; i < data.length; i++) {
        if (data[i].id === record.id) {
          that.$message.warning('【' + record.name + '】已添加过')
          return
        }
      }
      this.$message.info('已添加' + record.name)
      this.data1.push(record)
    },
    onClose () {
      this.visible = false
    },
    onClose1 () {
      this.visible1 = false
    },
    removeRtype (v) {
      this.data1.splice(this.data1.findIndex(item => item.id === v.id), 1)
    },
    removeDtype (v) {
      this.data.splice(this.data.findIndex(item => item.id === v.id), 1)
    }
  }
}
</script>

<style scoped>

</style>
