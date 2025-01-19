<template>
  <div>
    <el-button @click="isPopupVisible = true">打开弹窗</el-button>
    <el-dialog
        title="测试弹窗"
        :visible.sync="isPopupVisible"
        width="30%"
    >
      <p>这是一个测试弹窗。</p>
      <div class="dialog-footer">
        <el-button @click="isPopupVisible = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from "vue";

const isPopupVisible = ref(false);
</script>
