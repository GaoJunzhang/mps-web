<template>
  <div id="components-layout-demo-basic">
    <a-layout>
      <a-layout-header>
        <a-row>
          <a-col :span="24">
            <a-button type="danger" @click="backeP">返回</a-button>
          </a-col>
        </a-row>
      </a-layout-header>
      <a-layout-content>
        <a-divider orientation="left"></a-divider>
        <a-form :form="form" @submit="handleSubmit">
          <a-form-item label="名称" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
            <a-input
              v-decorator="['name', { rules: [{ required: true, message: '请输入名称!' }] }]"
            />
          </a-form-item>
          <a-form-item label="备注" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
            <a-input
              v-decorator="['title']"
            />
          </a-form-item>
          <a-form-item label="标签" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
            <rlab-select
              @onChange="selectLab"
              v-decorator="['labId', { rules: [{ required: true, message: '请选择标签!' }] }]"
            ></rlab-select>
          </a-form-item>
          <a-form-item label="类型" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
            <rtype-select
              @onChange="selectType"
              v-decorator="['typeId', { rules: [{ required: true, message: '请选择类型!' }] }]"
            ></rtype-select>
          </a-form-item>
          <a-form-item label="描述" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
            <a-input
              v-decorator="['content', { rules: [{ required: true, message: '请输入名称!' }] }]"
            />
          </a-form-item>
          <a-form-item label="预览图" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
            <oss-choose
              @on-change="handleSelectImg"
              ref="ossi"
              v-decorator="['proImg', { rules: [{ required: true, message: '请选择预览图!' }] }]"
            ></oss-choose>
            <div class="upload-list" v-for="item in selectProImg" :key="item.id">
              <img :src="item.fileName" onerror="this.src='https://s2.ax1x.com/2019/07/19/ZviZM4.jpg'">
            </div>
          </a-form-item>
          <a-form-item label="预览视频" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
            <oss-choose
              @on-change="handleSelectVideo"
              ref="ossv"
              v-decorator="['proVideo', { rules: [{ required: true, message: '请选择预览视频!' }] }]"
            ></oss-choose>
            <div class="upload-list" v-for="item in selectProVideo" :key="item.id">
              <img :src="item.fileName" onerror="this.src='https://s2.ax1x.com/2019/07/19/ZviZM4.jpg'">
            </div>
          </a-form-item>
          <a-form-item label="资源文件" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
            <oss-choose
              @on-change="handleSelectFile"
              ref="ossf"
              v-decorator="['url', { rules: [{ required: true, message: '请选择资源文件!' }] }]"
            ></oss-choose>
            <div class="upload-list" v-for="item in selectFile" :key="item.id">
              <img :src="item.fileName" onerror="this.src='https://s2.ax1x.com/2019/07/19/ZviZM4.jpg'">
            </div>
          </a-form-item>
          <a-form-item label="预留1" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
            <a-input
              v-decorator="['filed1']"
            />
          </a-form-item>
          <a-form-item label="预留2" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
            <a-input
              v-decorator="['filed2']"
            />
          </a-form-item>
          <a-form-item label="预留3" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
            <a-input
              v-decorator="['filed3']"
            />
          </a-form-item>
          <a-form-item :wrapper-col="{ span: 12, offset: 5 }">
            <a-button type="primary" html-type="submit">
              保存
            </a-button>
          </a-form-item>
        </a-form>
      </a-layout-content>
    </a-layout>
  </div>
</template>

<script>
import RlabSelect from './RlabSelect'
import RtypeSelect from './RtypeSelect'
import OssChoose from './OssChoose'
import pick from 'lodash.pick'
import { addresource } from '@/api/resource'
export default {
  name: 'AddResource',
  props: {
    ossObj: {
      type: Object,
      default: null
    }
  },
  components: {
    RlabSelect,
    OssChoose,
    RtypeSelect
  },
  data () {
    return {
      formLayout: 'horizontal',
      form: this.$form.createForm(this, { name: 'coordinated' }),
      selectFile: [],
      selectProImg: [],
      selectProVideo: [],
      size: 0,
      rId: null
    }
  },
  methods: {
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          const param = values
          console.log('param', param)
          if (this.rId !== null) {
            param.id = this.rId
          }
          addresource(param).then(res => {
            if (res.success === true) {
              this.$message.info('添加成功')
              this.backeP()
            } else {
              this.$message.error('操作失败' + res.errorMsg)
            }
          })
        }
      })
    },
    backeP () {
      this.$emit('submited')
    },
    handleSelectFile (v) {
      const record = {}
      if (v.length > 0) {
        this.selectFile = []
        const file = v.pop()
        this.selectFile.push(file)
        record.url = file.fileName
        this.size = file.size
      } else {
        record.url = ''
        this.size = 0
      }
      const { form: { setFieldsValue } } = this
      this.$nextTick(() => {
        setFieldsValue(pick(record, 'url'))
      })
    },
    handleSelectVideo (v) {
      const record = {}
      if (v.length > 0) {
        this.selectProVideo = []
        const file = v.pop()
        this.selectProVideo.push(file)
        record.proVideo = file.fileName
      } else {
        record.proVideo = ''
      }
      const { form: { setFieldsValue } } = this
      this.$nextTick(() => {
        setFieldsValue(pick(record, 'proVideo'))
      })
    },
    handleSelectImg (v) {
      const record = {}
      if (v.length > 0) {
        this.selectProImg = []
        const file = v.pop()
        this.selectProImg.push(file)
        record.proImg = file.fileName
      } else {
        record.proImg = ''
      }
      const { form: { setFieldsValue } } = this
      this.$nextTick(() => {
        setFieldsValue(pick(record, 'proImg'))
      })
    },
    selectLab (v) {
      const record = {}
      record.labId = v
      const { form: { setFieldsValue } } = this
      this.$nextTick(() => {
        setFieldsValue(pick(record, 'labId'))
      })
    },
    selectType (v) {
      const record = {}
      record.typeId = v
      const { form: { setFieldsValue } } = this
      this.$nextTick(() => {
        setFieldsValue(pick(record, 'typeId'))
      })
    }
  },
  created () {
    console.log('this.obj', this.ossObj)
    if (this.ossObj !== null) {
      const imgObj = {}
      const videObj = {}
      const fileObj = {}
      imgObj.id = 1
      imgObj.fileName = this.ossObj.proImg
      videObj.id = 1
      videObj.fileName = this.ossObj.proVideo
      fileObj.id = 1
      fileObj.fileName = this.ossObj.url
      this.selectProImg.push(imgObj)
      this.selectProVideo.push(videObj)
      this.selectFile.push(fileObj)
      this.size = this.ossObj.size
      this.rId = this.ossObj.id
      const { form: { setFieldsValue } } = this
      this.$nextTick(() => {
        setFieldsValue(pick(this.ossObj, 'name', 'typeId', 'title', 'labId', 'content', 'proImg', 'proVideo', 'url', 'filed1', 'filed2', 'filed3'))
      })
    }
  }
}
</script>

<style>
  #components-layout-demo-basic {
    text-align: left;
  }
  #components-layout-demo-basic .ant-layout-header,
  #components-layout-demo-basic .ant-layout-footer {
    background: #fff;
    color: #fff;
  }
  #components-layout-demo-basic .ant-layout-footer {
    line-height: 1.5;
  }
  #components-layout-demo-basic .ant-layout-sider {
    background: #fff;
    color: #fff;
    line-height: 120px;
  }
  #components-layout-demo-basic .ant-layout-content {
    background: #fff;
    color: #fff;
    min-height: 120px;
    line-height: 120px;
  }
  #components-layout-demo-basic > .ant-layout {
    margin-bottom: 48px;
  }
  #components-layout-demo-basic > .ant-layout:last-child {
    margin: 0;
  }
  .upload-list {
    margin-top: 10px;
    display: inline-block;
    width: 60px;
    height: 60px;
    text-align: center;
    line-height: 60px;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0, 0, 0, .2);
    margin-right: 4px;
  }

  .upload-list img {
    width: 100%;
    height: 100%;
  }

  .upload-list:hover {
    display: block;
  }
</style>
