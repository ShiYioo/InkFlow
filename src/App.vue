<script setup>
import { ref, reactive, onMounted } from 'vue'
import PreviewCanvas from './components/PreviewCanvas.vue'
import ControlPanel from './components/ControlPanel.vue'
import { preloadAllFonts } from './utils/fontLoader'

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
  strikethroughWidth: 3,
  renderWidth: 2481,
  renderHeight: 3507,
})

function handleRender() {
  canvasRef.value?.render()
}

function handleExport() {
  canvasRef.value?.handleExport()
}

onMounted(() => {
  preloadAllFonts()
})
</script>

<template>
  <div class="app-layout">
    <div class="deco-orb deco-orb-1"></div>
    <div class="deco-orb deco-orb-2"></div>
    <div class="deco-orb deco-orb-3"></div>

    <header class="app-header">
      <div class="header-inner">
        <div class="brand">
          <div class="brand-icon">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <rect width="28" height="28" rx="8" fill="url(#brand-grad)" />
              <path d="M7 20L14 7L21 20" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M9.5 16H18.5" stroke="white" stroke-width="2" stroke-linecap="round" />
              <defs><linearGradient id="brand-grad" x1="0" y1="0" x2="28" y2="28"><stop stop-color="#1289f9" /><stop offset="1" stop-color="#4da6ff" /></linearGradient></defs>
            </svg>
          </div>
          <div class="brand-text">
            <h1 class="brand-title">InkFlow</h1>
            <span class="brand-sub">手写模拟器</span>
          </div>
        </div>
        <div class="header-info">
          <span class="size-badge">{{ penConfig.renderWidth }} × {{ penConfig.renderHeight }}</span>
        </div>
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
  background: var(--ba-bg);
  background-image:
    radial-gradient(ellipse at 15% 80%, rgba(18, 137, 249, 0.04) 0%, transparent 50%),
    radial-gradient(ellipse at 85% 15%, rgba(18, 137, 249, 0.03) 0%, transparent 50%);
  position: relative;
}

.deco-orb {
  position: fixed;
  border-radius: 50%;
  filter: blur(60px);
  pointer-events: none;
  z-index: 0;
}

.deco-orb-1 {
  width: 300px;
  height: 300px;
  background: rgba(18, 137, 249, 0.08);
  top: -80px;
  left: 10%;
  animation: float 12s ease-in-out infinite;
}

.deco-orb-2 {
  width: 220px;
  height: 220px;
  background: rgba(255, 158, 205, 0.06);
  bottom: -60px;
  right: 20%;
  animation: float 15s ease-in-out infinite reverse;
}

.deco-orb-3 {
  width: 180px;
  height: 180px;
  background: rgba(77, 166, 255, 0.07);
  top: 50%;
  left: 45%;
  animation: float 18s ease-in-out infinite;
}

.app-header {
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  z-index: 10;
  animation: fadeInDown 0.6s ease both;
  position: relative;
}

.app-header::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 1px;
  background-color: rgba(18, 137, 249, 0.12);
}

.app-header::before {
  content: "";
  position: absolute;
  bottom: 0;
  left: 24px;
  transform: translateY(40%);
  width: 32px;
  height: 2px;
  background-color: var(--ba-primary);
  border-radius: 1px;
  z-index: 1;
}

@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-20px); }
  to   { opacity: 1; transform: translateY(0); }
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 24px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  animation: bounceIn 0.8s var(--ba-bounce) 0.2s both;
}

.brand-text {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.brand-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--ba-primary);
  letter-spacing: -0.5px;
  animation: fadeInUp 0.6s ease 0.3s both;
}

.brand-sub {
  font-size: 11px;
  color: var(--ba-text-muted);
  background: var(--ba-primary-bg);
  padding: 2px 10px;
  border-radius: 20px;
  border: 1px solid var(--ba-border-light);
  animation: fadeInUp 0.6s ease 0.4s both;
}

.size-badge {
  font-size: 11px;
  color: #fff;
  background: var(--ba-primary);
  padding: 3px 12px;
  border-radius: 4px;
  font-variant-numeric: tabular-nums;
  font-weight: 600;
  animation: fadeInUp 0.6s ease 0.5s both;
}

.app-main {
  flex: 1;
  display: flex;
  gap: 16px;
  padding: 16px;
  min-height: 0;
}

.preview-section {
  flex: 1;
  min-width: 0;
  min-height: 0;
  animation: fadeInUp 0.7s ease 0.3s both;
}

.sidebar {
  width: 350px;
  flex-shrink: 0;
  min-height: 0;
  overflow: hidden;
  animation: slideInRight 0.7s ease 0.4s both;
}

@media (max-width: 900px) {
  .app-main { flex-direction: column; }
  .sidebar { width: 100%; max-height: 50vh; }
  .preview-section { min-height: 40vh; }
}
</style>
