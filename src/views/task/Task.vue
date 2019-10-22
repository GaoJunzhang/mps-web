<template>
  <div class="task">
    <div class="task-header">
      <div class="main">
        <div class="row">
          <a-breadcrumb class="breadcrumb">
            <a-breadcrumb-item>
              <a-dropdown>
                <a class="ant-dropdown-link">{{ currentSectionName }}</a>
                <a-menu slot="overlay" @click="onMenuChooseSection">
                  <a-menu-item v-for="section in sections" :key="section.k">
                    <a-icon type="calendar" />
                    {{ section.n }}
                  </a-menu-item>
                  <a-menu-divider />
                  <a-menu-item key="add">
                    <a-icon type="plus" />
                    {{ $t('common.new') }}
                  </a-menu-item>
                </a-menu>
              </a-dropdown>
            </a-breadcrumb-item>
            <a-breadcrumb-item>
              <a-dropdown>
                <a class="ant-dropdown-link">{{ currentTemplateName }}</a>
                <a-menu slot="overlay" @click="onMenuChooseTemplate">
                  <a-menu-item v-for="template in templates" :key="template.k">
                    <a-icon type="bars" />
                    {{ template.n }}
                  </a-menu-item>
                  <a-menu-divider />
                  <a-menu-item key="add">
                    <a-icon type="plus" />
                    {{ $t('common.new') }}
                  </a-menu-item>
                </a-menu>
              </a-dropdown>
            </a-breadcrumb-item>
          </a-breadcrumb>
          <div class="action">
            <a-button-group style="margin-right: 4px;">
              <a-button>预览</a-button>
              <a-button>审核</a-button>
              <a-button>
                <a-icon type="ellipsis" />
              </a-button>
            </a-button-group>
            <a-button type="primary">保存</a-button>
          </div>
        </div>
        <a-row v-show="fullscreen">
          <div style="height:24px" />
        </a-row>
        <a-row v-show="!fullscreen">
          <a-collapse
            size="small"
            defaultActiveKey="template"
            :activeKey="headerCollapseActiveKey"
            :bordered="false"
            @change="onChangeCollapsePanel"
          >
            <a-collapse-panel key="task">
              <template slot="header">
                {{ $t('task.section') + $t('task.property') }}
                <a-button
                  icon="delete"
                  size="small"
                  type="danger"
                  style="float:right"
                  @click.stop="delSection"
                ></a-button>
              </template>
              <a-form layout="inline">
                <a-row>
                  <a-col span="12">
                    <a-form-item :label="$t('task.validTime')">
                      <a-time-picker
                        :placeholder="$t('task.startTime')"
                        :allowEmpty="false"
                        :value="current.sectionProp.startTime"
                        @change="currentSectionStartTimeChange"
                      />
                      <a-time-picker
                        :placeholder="$t('task.endTime')"
                        :allowEmpty="false"
                        :value="current.sectionProp.endTime"
                        @change="currentSectionEndTimeChange"
                      />
                    </a-form-item>
                  </a-col>
                  <a-col span="12">
                    <a-form-item :label="$t('task.validDate')">
                      <a-date-picker
                        :placeholder="$t('task.startDate')"
                        :value="current.sectionProp.startDate"
                        @change="currentSectionStartDateChange"
                      />
                      <a-date-picker
                        :placeholder="$t('task.endDate')"
                        :value="current.sectionProp.endDate"
                        @change="currentSectionEndDateChange"
                      />
                    </a-form-item>
                  </a-col>
                </a-row>
              </a-form>
            </a-collapse-panel>
            <a-collapse-panel
              :header="$t('task.template') + $t('task.property')"
              key="template"
              style="border:0px"
            >
              <a-form layout="inline">
                <a-row>
                  <a-col span="8">
                    <a-form-item :label="$t('task.duration')">
                      <a-time-picker
                        :allowEmpty="false"
                        :placeholder="$t('task.durationPlaceholder')"
                        :value="current.templateProp.duration"
                        @change="currentTemplateDurationChange"
                      />
                    </a-form-item>
                  </a-col>
                </a-row>
              </a-form>
            </a-collapse-panel>
          </a-collapse>
        </a-row>
        <div class="page-menu-tabs" v-show="!fullscreen">
          <a-tabs
            :tabBarStyle="{margin: 0}"
            :activeKey="current.template"
            @change="onTabChooseTemplate"
          >
            <a-tab-pane v-for="template in templates" :tab="template.n" :key="template.k"></a-tab-pane>
            <template slot="tabBarExtraContent">
              <a-button-group size="small">
                <a-button icon="plus" @click="addTemplate"></a-button>
                <a-button type="danger" icon="delete" @click="delTemplate"></a-button>
              </a-button-group>
            </template>
          </a-tabs>
        </div>
      </div>
    </div>
    <div class="task-content">
      <template-edit ref="templateEdit" @fullscreen="onTemplateFullscreen" />
    </div>
    <component ref="model" :is="currentModel" @ok="handleModelOk" @close="handleModelClose"></component>
  </div>
</template>

<script>
import set from 'lodash.set'
import moment from 'moment'
import AddTemplateWin from './modules/win/AddTemplateWin'
import AddSectionWin from './modules/win/AddSectionWin'
import TemplateEdit from './modules/TemplateEdit'
// import { saveTask } from '@/api/task'

export default {
  name: 'TaskEdit',
  components: {
    AddTemplateWin,
    AddSectionWin,
    TemplateEdit
  },
  data () {
    return {
      fullscreen: false,
      headerCollapseActiveKey: ['template'],
      currentModel: '',
      glbKey: 0,
      current: {
        section: '1',
        template: '1',
        templateProp: {
          duration: null
        },
        sectionProp: {
          startTime: null,
          endTime: null,
          startDate: null,
          endDate: null
        }
      },
      taskId: 0,
      sections: [],
      templates: []
    }
  },
  filters: {
  },
  created () {
    this.loadData()
  },
  computed: {
    currentSectionName () {
      var obj = this.sections.find(item => item.k === this.current.section)
      return obj ? obj.n : 'Unknown'
    },
    currentTemplateName () {
      var obj = this.templates.find(item => item.k === this.current.template)
      return obj ? obj.n : 'Unknown'
    }
  },
  methods: {
    moment,
    getKey (prefix) {
      return prefix + (++this.glbKey)
    },
    loadData () {
      this.sections = [{
        n: this.$t('task.section') + '1',
        t: [
          {
            n: this.$t('task.template') + '1'
          }
        ]
      }]
      this.sections.forEach(sec => {
        sec.k = this.getKey('sec')
        sec.t.forEach(tem => {
          tem.k = this.getKey('tem')
        })
      })
      this.changeSection(this.sections[0].k)
    },
    onMenuChooseSection (menu) {
      if (menu.key === 'add') {
        this.addSection()
        return
      }
      this.changeSection(menu.key)
    },
    onMenuChooseTemplate (menu) {
      if (menu.key === 'add') {
        this.addTemplate()
        return
      }
      this.changeTemplate(menu.key)
    },
    onTabChooseTemplate (key) {
      this.changeTemplate(key)
    },
    changeTemplate (key) {
      this.current.template = key
      var obj = this.templates.find(item => item.k === key)
      this.current.templateProp.duration = moment(obj.d && obj.d.length === 8 ? obj.d : '23:59:59', 'HH:mm:ss')
      this.$nextTick(() => {
        if (!obj.a) {
          obj.a = []
        }
        this.$refs.templateEdit.loadData(obj.a)
      })
    },
    changeSection (key) {
      this.current.section = key

      var obj = this.sections.find(item => item.k === this.current.section)
      if (obj) {
        this.templates = obj.t
        this.changeTemplate(this.templates[0].k)
        this.current.sectionProp = {
          startTime: moment(obj.st && obj.st.length === 8 ? obj.st : '00:00:00', 'HH:mm:ss'),
          endTime: moment(obj.et && obj.et.length === 8 ? obj.et : '23:59:59', 'HH:mm:ss'),
          startDate: (obj.sd && obj.sd.length === 10) ? moment(obj.sd, 'YYYY-MM-DD') : null,
          endDate: (obj.ed && obj.ed.length === 10) ? moment(obj.ed, 'YYYY-MM-DD') : null
        }
      }
    },
    addSection () {
      this.currentModel = 'AddSectionWin'
      this.$nextTick(() => {
        this.$refs.model.show()
      })
    },
    addTemplate () {
      this.currentModel = 'AddTemplateWin'
      this.$nextTick(() => {
        this.$refs.model.show()
      })
    },
    delSection () {
      if (this.sections.length <= 1) {
        this.$notification['error']({
          message: this.$t('common.error'),
          description: this.$t('task.atLeastOne') + this.$t('task.section'),
          duration: 4
        })
        return
      }

      var sectionIdx = -1
      var obj = this.sections.find((item, idx) => {
        sectionIdx = idx
        return item.k === this.current.section
      })
      var that = this
      this.$confirm({
        title: this.$t('task.delSection', [obj.n]),
        content: this.$t('task.delSectionContent'),
        okType: 'danger',
        onOk () {
          return new Promise((resolve, reject) => {
            that.sections.splice(sectionIdx, 1)
            that.changeSection(that.sections[0].k)
            resolve()
          }).catch((e) => console.log('error', e))
        }
      })
    },
    delTemplate () {
      if (this.templates.length <= 1) {
        this.$notification['error']({
          message: this.$t('common.error'),
          description: this.$t('task.atLeastOne') + this.$t('task.template'),
          duration: 4
        })

        return
      }
      var templateIdx = -1
      var obj = this.templates.find((item, idx) => {
        templateIdx = idx
        return item.k === this.current.template
      })
      var that = this
      this.$confirm({
        title: this.$t('task.delTemplate', [obj.n]),
        content: this.$t('task.delTemplateContent'),
        okType: 'danger',
        onOk () {
          return new Promise((resolve, reject) => {
            that.templates.splice(templateIdx, 1)
            that.changeTemplate(that.templates[0].k)
            resolve()
          }).catch((e) => console.log('error', e))
        }
      })
    },
    changeTemplateProp (key, value) {
      var obj = this.templates.find(item => item.k === this.current.template)
      if (obj) {
        set(obj, key, value)
      }
    },
    changeSectionProp (key, value) {
      var obj = this.sections.find(item => item.k === this.current.section)
      if (obj) {
        set(obj, key, value)
      }
    },
    currentTemplateDurationChange (time, timeStr) {
      this.changeTemplateProp('d', timeStr)
      this.current.templateProp.duration = time
    },
    currentSectionStartTimeChange (time, timeStr) {
      this.changeSectionProp('st', timeStr)
      this.current.sectionProp.startTime = time
    },
    currentSectionEndTimeChange (time, timeStr) {
      this.changeSectionProp('et', timeStr)
      this.current.sectionProp.endTime = time
    },
    currentSectionStartDateChange (date, dateStr) {
      this.changeSectionProp('sd', dateStr)
      this.current.sectionProp.startDate = date
    },
    currentSectionEndDateChange (date, dateStr) {
      this.changeSectionProp('ed', dateStr)
      this.current.sectionProp.endDate = date
    },
    handleModelOk (val) {
      switch (this.currentModel) {
        case 'AddTemplateWin': {
          var obj = this.sections.find(item => item.k === this.current.section)
          var temKey = this.getKey('tem')
          obj.t.push({
            k: temKey,
            n: val.name,
            d: val.duration.format('HH:mm:ss')
          })
          this.changeTemplate(temKey)
          break
        }
        case 'AddSectionWin': {
          var secKey = this.getKey('sec')
          var sec = {
            k: secKey,
            n: val.name,
            st: val.st.format('HH:mm:ss'),
            et: val.et.format('HH:mm:ss'),
            sd: val.sd ? val.sd.format('YYYY-MM-DD') : null,
            ed: val.ed ? val.ed.format('YYYY-MM-DD') : null,
            t: [{
              k: this.getKey('tem'),
              n: this.$t('task.template'),
              d: '23:59:59'
            }]
          }
          this.sections.push(sec)
          this.changeSection(secKey)
          break
        }
      }
      this.currentModel = ''
    },
    handleModelClose () {
      this.currentModel = ''
    },
    onChangeCollapsePanel () {
      this.$refs.templateEdit.onResize()
    },
    onTemplateFullscreen (val) {
      this.fullscreen = val
    }
  }
}
</script>

<style lang="less" scoped>
.task {
  display: flex;
  flex-direction: column;
  height: 100%;

  .task-content {
    margin-top: 48px;
    margin-bottom: 24px;
    flex-grow: 1;
    background: #fff;
    display: flex;
  }

  .task-header {
    flex: 0 0 auto;
    background: #fff;
    padding: 24px 24px 0;

    margin: -24px;
    .main {
      width: 100%;
      flex: 0 1 auto;

      .row {
        display: flex;
        width: 100%;

        .breadcrumb {
          flex: auto;
          line-height: 32px;
        }

        .action {
          margin-left: 56px;
          min-width: 266px;
          flex: 0 1 auto;
          text-align: right;
          &:empty {
            display: none;
          }
        }
      }
    }
  }
}
.description-list {
  .title {
    color: rgba(0, 0, 0, 0.85);
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 16px;
  }

  /deep/ .term {
    color: rgba(0, 0, 0, 0.85);
    display: table-cell;
    line-height: 20px;
    margin-right: 8px;
    padding-bottom: 16px;
    white-space: nowrap;

    &:not(:empty):after {
      content: ':';
      margin: 0 8px 0 2px;
      position: relative;
      top: -0.5px;
    }
  }

  /deep/ .content {
    color: rgba(0, 0, 0, 0.65);
    display: table-cell;
    min-height: 22px;
    line-height: 22px;
    padding-bottom: 16px;
    width: 100%;
    &:empty {
      content: ' ';
      height: 38px;
      padding-bottom: 16px;
    }
  }
}
</style>
