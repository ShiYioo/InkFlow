<script setup>
import { ref, reactive, watch } from 'vue'
import PreviewCanvas from './components/PreviewCanvas.vue'
import ControlPanel from './components/ControlPanel.vue'

const canvasRef = ref(null)
const activeTab = ref('text')
const backgroundImage = ref(null)
const backgroundFileName = ref('')

const text = ref('亲爱的朋友：\n\n见字如面，展信舒颜。时光荏苒，转眼间已是深秋时节。窗外的枫叶渐渐染上了火红的色彩，落叶在微风中翩翩起舞。\n\n今日提笔写信，只为将这份思念寄予远方的你。愿你在繁忙的日子里，也能停下脚步，看看窗外的风景，感受这秋日独有的宁静与美好。\n\n祝\n一切顺利')

const penConfig = reactive({
  fontSize: 124,
  fontFamily: 'liguofu',
  lineSpacing: 200,
  marginTop: 50,
  marginBottom: 50,
  marginLeft: 50,
  marginRight: 50,
  wordSpacing: 1,
  lineSpacingSigma: 0,
  fontSizeSigma: 2,
  wordSpacingSigma: 2,
  perturbXSigma: 3,
  perturbYSigma: 3,
  perturbThetaSigma: 0.05,
  inkDepthSigma: 30,
  isUnderlined: true,
  enableEnglishSpacing: false,
  endChars: '，。',
  strikethroughProbability: 0.005,
  strikethroughLengthSigma: 2,
  strikethroughWidthSigma: 2,
  strikethroughAngleSigma: 2,
  strikethroughWidth: 8,
  renderWidth: 2481,
  renderHeight: 3507,
})

function handleRender() {
  canvasRef.value?.render()
}

function handleExport() {
  canvasRef.value?.handleExport()
}
</script>

<template>
  <div class="app-layout">
    <header class="app-header">
      <div class="header-inner">
        <div class="brand">
          <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
            <rect width="28" height="28" rx="8" fill="url(#bg)" />
            <path d="M8 20L14 7L20 20" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M10 16H18" stroke="white" stroke-width="2" stroke-linecap="round" />
            <defs><linearGradient id="bg" x1="0" y1="0" x2="28" y2="28"><stop stop-color="#3a7bd5" /><stop offset="1" stop-color="#5b9bd5" /></linearGradient></defs>
          </svg>
          <h1 class="brand-title">InkFlow</h1>
          <span class="brand-sub">手写模拟器</span>
        </div>
        <span class="size-info">{{ penConfig.renderWidth }} × {{ penConfig.renderHeight }}</span>
      </div>
    </header>

    <main class="app-main">
      <section class="preview-section">
        <PreviewCanvas
          ref="canvasRef"
          :text="text"
          :pen-config="penConfig"
          :render-width="penConfig.renderWidth"
          :render-height="penConfig.renderHeight"
          :background-image="backgroundImage"
        />
      </section>

      <aside class="sidebar">
        <ControlPanel
          v-model:text="text"
          :pen-config="penConfig"
          :active-tab="activeTab"
          :background-file-name="backgroundFileName"
          @update:pen-config="Object.assign(penConfig, $event)"
          @update:active-tab="activeTab = $event"
          @update:background-image="backgroundImage = $event"
          @update:background-file-name="backgroundFileName = $event"
          @render="handleRender"
          @export="handleExport"
        />
      </aside>
    </main>
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  background: #f5f5f5;
}

.app-header {
  flex-shrink: 0;
  background: #fff;
  border-bottom: 1px solid #eee;
  z-index: 10;
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
}

.brand-title {
  font-size: 18px;
  font-weight: 700;
  color: #3a7bd5;
}

.brand-sub {
  font-size: 11px;
  color: #999;
  background: #f0f2f5;
  padding: 2px 8px;
  border-radius: 10px;
}

.size-info {
  font-size: 11px;
  color: #999;
  font-variant-numeric: tabular-nums;
}

.app-main {
  flex: 1;
  display: flex;
  gap: 12px;
  padding: 12px;
  min-height: 0;
}

.preview-section {
  flex: 1;
  min-width: 0;
  min-height: 0;
}

.sidebar {
  width: 340px;
  flex-shrink: 0;
  min-height: 0;
  overflow: hidden;
}

@media (max-width: 900px) {
  .app-main { flex-direction: column; }
  .sidebar { width: 100%; max-height: 50vh; }
  .preview-section { min-height: 40vh; }
}
</style>
