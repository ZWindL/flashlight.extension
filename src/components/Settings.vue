<template>
  <!-- 两个按钮 -->
  <div>
    <el-row>
      <el-col :span="24">
        <el-switch
          v-model="on"
          active-text="On"
          inactive-text="Off"
        >
        </el-switch>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="4">
        亮度
      </el-col>
      <el-col :span="20">
        <el-slider
          v-model="brightness"
          :min="0"
          :max="100"
        >
        </el-slider>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="4">
        大小
      </el-col>
      <el-col :span="20">
        <el-slider
          v-model="size"
          :min="1"
          :max="200"
        >
        </el-slider>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'Settings',
  data () {
    return {
      // 默认设置
      on: false,
      brightness: 1,
      size: 30
    }
  },
  methods: {
    // 保存设置
    saveSettings () {
      browser.runtime.sendMessage({
        action: 'saveSettings',
        data: {
          on: this.on,
          brightness: this.cBrightness,
          size: this.cSize
        }
      }).then(resp => {
        this.on = resp.on
        this.brightness = resp.brightness * 100
        this.size = resp.size - 20
      })
    }
  },
  watch: {
    // 选项改变时保存
    on () {
      this.saveSettings()
    },
    brightness () {
      this.saveSettings()
    },
    size () {
      this.saveSettings()
    }
  },
  computed: {
    cBrightness () {
      return (this.brightness / 100).toFixed(1)
    },
    cSize () {
      return this.size + 20
    }
  },
  mounted () {
    // 加载设置
    browser.runtime.sendMessage({
      action: 'loadSettings'
    }).then(resp => {
      console.debug('Done: ', resp)
      this.on = resp.on
      this.brightness = resp.brightness * 100
      this.size = resp.size - 20
    }).catch(e => console.debug('========= error occurred when loading settings: ', e))
  }
}
</script>

<style scoped>
.el-row {
  margin: 6px 0 6px 0;
}
</style>
