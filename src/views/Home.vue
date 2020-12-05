<template>
  <el-container class="home">
    <el-header>
      <el-row :gutter="10" style="margin-bottom: 4px">
        <el-col :span="6">
          <el-avatar :src="'/icons/200.png'" :size="48"></el-avatar>
        </el-col>
        <el-col :span="18" class="popup-title">
          Change settings here
        </el-col>
      </el-row>
    </el-header>
    <!------------------------>
    <el-main>
      <settings />
    </el-main>
    <!------------------------>
    <el-footer>
      Good luck!
    </el-footer>
  </el-container>
</template>

<script>
// @ is an alias to /src
import Settings from '@/components/Settings'

export default {
  name: 'Home',
  components: {
    Settings
  }
}
</script>
<style scoped>
.el-header {
  background: white;
  color: #050505;
}
.el-avatar.el-avatar--circle {
  margin-top: 6px
}
.popup-title {
  padding-top: 14px;
  font-size: 16px;
}
.el-main {
  background: #eff2f5;
  color: #050505;
}
.el-footer {
  background: white;
  color: #050505;
  font-size: 14px;
  padding-top: 12px;
}
</style>
