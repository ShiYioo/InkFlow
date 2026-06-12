<script setup>
import { ref, computed } from 'vue'
import { BUILT_IN_FONTS, loadFont, loadUploadedFont } from '@/utils/fontLoader'
import { loadPresetBackground } from '@/utils/paperTextures'

const REAL_PAPERS = [
  { id: 'paper-0', name: '草稿纸-实拍', path: '/papers/paper-0.png' },
  { id: 'paper-1', name: 'A4纸-纵向', path: '/papers/paper-1.png' },
  { id: 'paper-2', name: 'A4纸-横向', path: '/papers/paper-2.png' },
  { id: 'paper-20', name: '横线纸', path: '/papers/paper-20.png' },
  { id: 'paper-30', name: '红线信稿纸', path: '/papers/paper-30.png' },
  { id: 'paper-41', name: '红格子稿纸-实拍', path: '/papers/paper-41.png' },
  { id: 'paper-42', name: '黑格子稿纸', path: '/papers/paper-42.png' },
  { id: 'paper-43', name: '红格子稿纸-打印', path: '/papers/paper-43.png' },
]

const PAPER_PRESETS = {
  'paper-0': {
    fontSize: 32, lineSpacing: 47, marginTop: 332, marginBottom: 50, marginLeft: 150, marginRight: 110,
  },
  'paper-1': {
    fontSize: 62, lineSpacing: 100, marginTop: 80, marginBottom: 80, marginLeft: 60, marginRight: 60,
  },
  'paper-2': {
    fontSize: 62, lineSpacing: 100, marginTop: 80, marginBottom: 80, marginLeft: 60, marginRight: 60,
  },
  'paper-20': {
    fontSize: 40, lineSpacing: 58, marginTop: 243, marginBottom: 50, marginLeft: 90, marginRight: 95,
  },
  'paper-30': {
    fontSize: 46, lineSpacing: 67, marginTop: 156, marginBottom: 50, marginLeft: 133, marginRight: 134,
  },
  'paper-41': {
    fontSize: 36, lineSpacing: 52, marginTop: 300, marginBottom: 50, marginLeft: 30, marginRight: 40, wordSpacing: 2,
  },
  'paper-42': {
    fontSize: 33, lineSpacing: 74, wordSpacing: 18, marginTop: 270, marginBottom: 50, marginLeft: 106, marginRight: 120,
  },
  'paper-43': {
    fontSize: 25, lineSpacing: 64, wordSpacing: 15, marginTop: 180, marginBottom: 50, marginLeft: 71, marginRight: 77,
  },
}

const props = defineProps({
  text: { type: String, default: '' },
  penConfig: { type: Object, required: true },
  activeTab: { type: String, default: 'text' },
  backgroundFileName: { type: String, default: '' },
})

const emit = defineEmits([
  'update:text',
  'update:penConfig',
  'update:activeTab',
  'update:backgroundImage',
  'update:backgroundFileName',
  'render',
  'export',
])

const customFonts = ref([])
const loadingFontId = ref(null)
const isExpanded = ref(false)

const tabs = [
  { key: 'text', label: '文字', icon: '✎' },
  { key: 'pen', label: '笔迹', icon: '✒' },
  { key: 'paper', label: '纸张', icon: '☳' },
]

const allFonts = computed(() => [...BUILT_IN_FONTS, ...customFonts.value])

function updatePen(key, value) {
  emit('update:penConfig', { ...props.penConfig, [key]: value })
}

async function selectFont(font) {
  loadingFontId.value = font.id
  await loadFont(font)
  loadingFontId.value = null
  updatePen('fontFamily', font.family)
}

async function handleFontUpload(e) {
  const file = e.target.files?.[0]
  if (!file) return
  loadingFontId.value = 'upload'
  try {
    const fontConfig = await loadUploadedFont(file)
    customFonts.value.push(fontConfig)
    updatePen('fontFamily', fontConfig.family)
  } catch (err) {
    alert('字体加载失败')
  }
  loadingFontId.value = null
  e.target.value = ''
}

async function handleBgUpload(e) {
  const file = e.target.files?.[0]
  if (!file) return
  try {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      emit('update:backgroundImage', img)
      emit('update:backgroundFileName', file.name)
      emit('update:penConfig', {
        ...props.penConfig,
        renderWidth: img.width,
        renderHeight: img.height,
      })
    }
    img.onerror = () => alert('背景图片加载失败')
    img.src = url
  } catch (err) {
    alert('背景图片加载失败')
  }
  e.target.value = ''
}

function clearBackground() {
  emit('update:backgroundImage', null)
  emit('update:backgroundFileName', '')
  emit('update:penConfig', {
    ...props.penConfig,
    renderWidth: 2481,
    renderHeight: 3507,
    fontSize: 124,
    lineSpacing: 200,
    marginTop: 50,
    marginBottom: 50,
    marginLeft: 50,
    marginRight: 50,
    isUnderlined: true,
  })
}

async function selectRealPaper(paper) {
  try {
    const img = await loadPresetBackground(paper.path)
    emit('update:backgroundImage', img)
    emit('update:backgroundFileName', paper.name)
    const preset = PAPER_PRESETS[paper.id]
    emit('update:penConfig', {
      ...props.penConfig,
      renderWidth: img.width,
      renderHeight: img.height,
      isUnderlined: false,
      ...(preset || {}),
    })
  } catch (err) {
    alert('纸张背景加载失败')
  }
}

function isFontActive(font) {
  return props.penConfig.fontFamily === font.family
}

const presets = {
  a4: { renderWidth: 2481, renderHeight: 3507, fontSize: 124, lineSpacing: 200, marginTop: 50, marginBottom: 50, marginLeft: 50, marginRight: 50 },
  b5: { renderWidth: 2100, renderHeight: 2970, fontSize: 110, lineSpacing: 180, marginTop: 40, marginBottom: 40, marginLeft: 40, marginRight: 40 },
  small: { renderWidth: 1240, renderHeight: 1754, fontSize: 62, lineSpacing: 100, marginTop: 30, marginBottom: 30, marginLeft: 30, marginRight: 30 },
}

function applyPreset(name) {
  const p = presets[name]
  if (p) emit('update:penConfig', { ...props.penConfig, ...p })
}

const sampleTexts = [
  '亲爱的朋友：\n\n见字如面，展信舒颜。时光荏苒，转眼间已是深秋时节。窗外的枫叶渐渐染上了火红的色彩，落叶在微风中翩翩起舞。\n\n愿一切安好。',
  '春眠不觉晓，\n处处闻啼鸟。\n夜来风雨声，\n花落知多少。',
  '记录一下今天的感悟：\n\n生活就像一杯茶，不会苦一辈子，但总会苦一阵子。每一次的困难都是成长的机会，坚持下去就会看到不一样的风景。\n\n加油！',
]
</script>

<template>
  <div class="control-panel">
    <div class="panel-header">
      <div class="tab-bar">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          :class="['tab-btn', { active: activeTab === tab.key }]"
          @click="$emit('update:activeTab', tab.key)"
        >
          <span class="tab-icon">{{ tab.icon }}</span>
          <span class="tab-label">{{ tab.label }}</span>
        </button>
      </div>
    </div>

    <div class="panel-body">
      <div v-if="activeTab === 'text'" class="tab-content">
        <div class="control-group">
          <label class="control-label">输入文字</label>
          <textarea
            class="text-input"
            :value="text"
            placeholder="在此输入要模拟手写的文字..."
            rows="12"
            @input="$emit('update:text', $event.target.value)"
          />
        </div>
        <div class="sample-list">
          <button v-for="(s, i) in sampleTexts" :key="i" class="sample-btn" @click="$emit('update:text', s)">示例{{ i + 1 }}</button>
        </div>
      </div>

      <div v-if="activeTab === 'pen'" class="tab-content">
        <div class="control-group">
          <label class="control-label">字体选择</label>
          <div class="font-list">
            <button
              v-for="font in allFonts"
              :key="font.id"
              :class="['font-item', { active: isFontActive(font) }]"
              :disabled="loadingFontId === font.id"
              @click="selectFont(font)"
            >
              <span class="font-item-name" :style="{ fontFamily: font.family }">{{ font.name.charAt(0) }}</span>
              <span class="font-item-label">{{ loadingFontId === font.id ? '加载中...' : font.name }}</span>
            </button>
            <label class="font-item font-upload">
              <input type="file" accept=".ttf,.otf,.woff,.woff2" class="hidden" @change="handleFontUpload" />
              <span class="font-item-name upload-icon">+</span>
              <span class="font-item-label">{{ loadingFontId === 'upload' ? '加载中...' : '上传字体' }}</span>
            </label>
          </div>
        </div>

        <div class="params">
          <div class="section-title">基本参数</div>

          <div class="control-group">
            <label class="control-label">字体大小 <span class="val">{{ penConfig.fontSize }}</span></label>
            <input type="range" class="slider" min="8" max="200" step="1" :value="penConfig.fontSize" @input="updatePen('fontSize', +$event.target.value)" />
          </div>

          <div class="control-group">
            <label class="control-label">行间距 <span class="val">{{ penConfig.lineSpacing }}</span></label>
            <input type="range" class="slider" min="10" max="400" step="2" :value="penConfig.lineSpacing" @input="updatePen('lineSpacing', +$event.target.value)" />
          </div>

          <div class="control-group">
            <label class="control-label">字间距 <span class="val">{{ penConfig.wordSpacing }}</span></label>
            <input type="range" class="slider" min="0" max="20" step="1" :value="penConfig.wordSpacing" @input="updatePen('wordSpacing', +$event.target.value)" />
          </div>

          <div class="row-2">
            <div class="control-group">
              <label class="control-label-sm">上边距</label>
              <input type="number" class="num-input" :value="penConfig.marginTop" @input="updatePen('marginTop', +$event.target.value)" />
            </div>
            <div class="control-group">
              <label class="control-label-sm">下边距</label>
              <input type="number" class="num-input" :value="penConfig.marginBottom" @input="updatePen('marginBottom', +$event.target.value)" />
            </div>
          </div>
          <div class="row-2">
            <div class="control-group">
              <label class="control-label-sm">左边距</label>
              <input type="number" class="num-input" :value="penConfig.marginLeft" @input="updatePen('marginLeft', +$event.target.value)" />
            </div>
            <div class="control-group">
              <label class="control-label-sm">右边距</label>
              <input type="number" class="num-input" :value="penConfig.marginRight" @input="updatePen('marginRight', +$event.target.value)" />
            </div>
          </div>

          <label class="checkbox-label">
            <input type="checkbox" :checked="penConfig.isUnderlined" @change="updatePen('isUnderlined', $event.target.checked)" />
            <span class="checkbox-custom"></span>
            添加下划线
          </label>
          <label class="checkbox-label">
            <input type="checkbox" :checked="penConfig.enableEnglishSpacing" @change="updatePen('enableEnglishSpacing', $event.target.checked)" />
            <span class="checkbox-custom"></span>
            英文自动加空格
          </label>

          <button class="expand-btn" @click="isExpanded = !isExpanded">
            <span>{{ isExpanded ? '收起高级参数' : '展开高级参数' }}</span>
            <span class="expand-arrow" :class="{ rotated: isExpanded }">▼</span>
          </button>

          <div v-if="isExpanded" class="advanced-params">
            <div class="section-title">扰动参数</div>

            <div class="control-group">
              <label class="control-label">字体大小扰动 σ <span class="val">{{ penConfig.fontSizeSigma }}</span></label>
              <input type="range" class="slider" min="0" max="10" step="0.5" :value="penConfig.fontSizeSigma" @input="updatePen('fontSizeSigma', +$event.target.value)" />
            </div>
            <div class="control-group">
              <label class="control-label">字间距扰动 σ <span class="val">{{ penConfig.wordSpacingSigma }}</span></label>
              <input type="range" class="slider" min="0" max="10" step="0.5" :value="penConfig.wordSpacingSigma" @input="updatePen('wordSpacingSigma', +$event.target.value)" />
            </div>
            <div class="control-group">
              <label class="control-label">横向偏移 σ <span class="val">{{ penConfig.perturbXSigma }}</span></label>
              <input type="range" class="slider" min="0" max="10" step="0.5" :value="penConfig.perturbXSigma" @input="updatePen('perturbXSigma', +$event.target.value)" />
            </div>
            <div class="control-group">
              <label class="control-label">纵向偏移 σ <span class="val">{{ penConfig.perturbYSigma }}</span></label>
              <input type="range" class="slider" min="0" max="10" step="0.5" :value="penConfig.perturbYSigma" @input="updatePen('perturbYSigma', +$event.target.value)" />
            </div>
            <div class="control-group">
              <label class="control-label">旋转扰动 σ <span class="val">{{ penConfig.perturbThetaSigma }}</span></label>
              <input type="range" class="slider" min="0" max="0.3" step="0.01" :value="penConfig.perturbThetaSigma" @input="updatePen('perturbThetaSigma', +$event.target.value)" />
            </div>
            <div class="control-group">
              <label class="control-label">行间距扰动 σ <span class="val">{{ penConfig.lineSpacingSigma }}</span></label>
              <input type="range" class="slider" min="0" max="20" step="1" :value="penConfig.lineSpacingSigma" @input="updatePen('lineSpacingSigma', +$event.target.value)" />
            </div>
            <div class="control-group">
              <label class="control-label">墨迹深浅扰动 σ <span class="val">{{ penConfig.inkDepthSigma }}</span></label>
              <input type="range" class="slider" min="0" max="80" step="2" :value="penConfig.inkDepthSigma" @input="updatePen('inkDepthSigma', +$event.target.value)" />
            </div>

            <div class="section-title">涂改模拟</div>
            <div class="control-group">
              <label class="control-label">涂改出现概率 <span class="val">{{ (penConfig.strikethroughProbability * 100).toFixed(1) }}%</span></label>
              <input type="range" class="slider" min="0" max="0.05" step="0.001" :value="penConfig.strikethroughProbability" @input="updatePen('strikethroughProbability', +$event.target.value)" />
            </div>
            <div class="control-group">
              <label class="control-label">涂改线宽度 <span class="val">{{ penConfig.strikethroughWidth }}</span></label>
              <input type="range" class="slider" min="1" max="20" step="1" :value="penConfig.strikethroughWidth" @input="updatePen('strikethroughWidth', +$event.target.value)" />
            </div>
            <div class="control-group">
              <label class="control-label">涂改线长度标准差 <span class="val">{{ penConfig.strikethroughLengthSigma }}</span></label>
              <input type="range" class="slider" min="0" max="10" step="0.5" :value="penConfig.strikethroughLengthSigma" @input="updatePen('strikethroughLengthSigma', +$event.target.value)" />
            </div>
            <div class="control-group">
              <label class="control-label">涂改线宽度标准差 <span class="val">{{ penConfig.strikethroughWidthSigma }}</span></label>
              <input type="range" class="slider" min="0" max="10" step="0.5" :value="penConfig.strikethroughWidthSigma" @input="updatePen('strikethroughWidthSigma', +$event.target.value)" />
            </div>
            <div class="control-group">
              <label class="control-label">涂改线角度标准差 <span class="val">{{ penConfig.strikethroughAngleSigma }}°</span></label>
              <input type="range" class="slider" min="0" max="10" step="0.5" :value="penConfig.strikethroughAngleSigma" @input="updatePen('strikethroughAngleSigma', +$event.target.value)" />
            </div>
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'paper'" class="tab-content">
        <div class="section-title">真实纸张背景</div>
        <div class="paper-grid">
          <button
            v-for="p in REAL_PAPERS"
            :key="p.id"
            :class="['paper-btn', { active: backgroundFileName === p.name }]"
            @click="selectRealPaper(p)"
          >
            <img :src="p.path" class="paper-thumb" />
            <span class="paper-name">{{ p.name }}</span>
          </button>
        </div>

        <div class="section-title">纸张尺寸预设</div>
        <div class="preset-row">
          <button class="preset-btn" @click="applyPreset('a4')">A4</button>
          <button class="preset-btn" @click="applyPreset('b5')">B5</button>
          <button class="preset-btn" @click="applyPreset('small')">小尺寸</button>
        </div>

        <div class="row-2">
          <div class="control-group">
            <label class="control-label-sm">宽度 px</label>
            <input type="number" class="num-input" :value="penConfig.renderWidth" @input="updatePen('renderWidth', +$event.target.value)" />
          </div>
          <div class="control-group">
            <label class="control-label-sm">高度 px</label>
            <input type="number" class="num-input" :value="penConfig.renderHeight" @input="updatePen('renderHeight', +$event.target.value)" />
          </div>
        </div>

        <div class="section-title">背景图片</div>
        <div class="control-group">
          <div class="bg-upload-area">
            <label class="bg-upload-btn">
              <input type="file" accept="image/*" class="hidden" @change="handleBgUpload" />
              选择背景图片
            </label>
            <span v-if="backgroundFileName" class="bg-filename">{{ backgroundFileName }}</span>
            <button v-if="backgroundFileName" class="bg-clear" @click="clearBackground">清除</button>
          </div>
          <div class="bg-tip">上传背景图后将自动使用图片尺寸作为纸张大小</div>
        </div>
      </div>
    </div>

    <div class="panel-footer">
      <button class="btn btn-primary" @click="$emit('render')">
        <span class="btn-icon">▶</span> 预览
      </button>
      <button class="btn btn-outline" @click="$emit('export')">
        <span class="btn-icon">↓</span> 导出PNG
      </button>
    </div>
  </div>
</template>

<style scoped>
.control-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(12px);
  border-radius: var(--ba-radius-lg);
  border: 1px solid var(--ba-border-light);
  box-shadow: var(--ba-shadow);
  overflow: hidden;
  font-family: 'Noto Sans SC', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.panel-header {
  padding: 12px 14px 0;
  flex-shrink: 0;
}

.tab-bar {
  display: flex;
  gap: 4px;
  background: var(--ba-primary-bg);
  border-radius: var(--ba-radius);
  padding: 4px;
  border: 1px solid var(--ba-border-light);
}

.tab-btn {
  flex: 1;
  padding: 8px 4px;
  border: none;
  border-radius: calc(var(--ba-radius) - 2px);
  background: transparent;
  color: var(--ba-text-light);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--ba-transition);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-family: inherit;
}

.tab-icon {
  font-size: 14px;
  opacity: 0.7;
}

.tab-btn.active {
  background: #fff;
  color: var(--ba-primary);
  box-shadow: 0 1px 4px rgba(18, 137, 249, 0.12);
}

.tab-btn.active .tab-icon {
  opacity: 1;
}

.panel-body {
  flex: 1;
  overflow-y: auto;
  padding: 14px;
}

.tab-content { display: flex; flex-direction: column; gap: 10px; }

.control-group { display: flex; flex-direction: column; gap: 4px; }

.control-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  font-weight: 500;
  color: var(--ba-text);
}

.control-label-sm {
  font-size: 11px;
  color: var(--ba-text-light);
  margin-bottom: 2px;
}

.val {
  font-size: 11px;
  color: var(--ba-primary);
  background: var(--ba-primary-bg);
  padding: 1px 8px;
  border-radius: 4px;
  font-variant-numeric: tabular-nums;
  font-weight: 600;
}

.section-title {
  font-size: 11px;
  font-weight: 600;
  color: var(--ba-primary);
  padding-top: 10px;
  border-top: 1px solid var(--ba-border-light);
  margin-top: 4px;
  letter-spacing: 0.5px;
}

.text-input {
  width: 100%;
  min-height: 200px;
  padding: 10px 12px;
  border: 1px solid var(--ba-border);
  border-radius: var(--ba-radius);
  font-size: 13px;
  line-height: 1.6;
  color: var(--ba-text);
  background: #fff;
  resize: vertical;
  outline: none;
  font-family: inherit;
  transition: border-color var(--ba-transition);
}

.text-input:focus {
  border-color: var(--ba-primary);
  box-shadow: 0 0 0 3px rgba(18, 137, 249, 0.08);
}

.sample-list { display: flex; gap: 6px; }
.sample-btn {
  flex: 1;
  padding: 6px;
  border: 1px solid var(--ba-border);
  border-radius: var(--ba-radius-sm);
  background: #fff;
  color: var(--ba-text-light);
  font-size: 11px;
  cursor: pointer;
  transition: all var(--ba-transition);
  font-family: inherit;
}
.sample-btn:hover {
  border-color: var(--ba-primary);
  color: var(--ba-primary);
  background: var(--ba-primary-bg);
}

.font-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-height: 200px;
  overflow-y: auto;
}

.font-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border: 1px solid var(--ba-border-light);
  border-radius: var(--ba-radius);
  background: #fff;
  cursor: pointer;
  transition: all var(--ba-transition);
  font-family: inherit;
  width: 100%;
  text-align: left;
}

.font-item.active {
  border-color: var(--ba-primary);
  background: var(--ba-primary-bg);
}

.font-item:hover:not(.active):not(:disabled) {
  border-color: var(--ba-primary-border);
}

.font-item:disabled { opacity: 0.5; cursor: wait; }

.font-item-name { font-size: 18px; color: var(--ba-text); min-width: 28px; }
.font-item-label { font-size: 11px; color: var(--ba-text-light); }

.font-upload { border-style: dashed; border-color: var(--ba-primary-border); }
.upload-icon { color: var(--ba-primary) !important; font-size: 20px !important; }
.hidden { display: none; }

.params { display: flex; flex-direction: column; gap: 8px; }

.slider {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 4px;
  border-radius: 2px;
  background: var(--ba-primary-bg);
  outline: none;
  transition: background var(--ba-transition);
}

.slider:hover {
  background: rgba(18, 137, 249, 0.1);
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--ba-primary);
  cursor: pointer;
  box-shadow: 0 1px 4px rgba(18, 137, 249, 0.3);
  transition: transform var(--ba-transition);
}

.slider::-webkit-slider-thumb:hover {
  transform: scale(1.2);
}

.num-input {
  width: 100%;
  padding: 6px 8px;
  border: 1px solid var(--ba-border);
  border-radius: var(--ba-radius-sm);
  font-size: 12px;
  outline: none;
  background: #fff;
  color: var(--ba-text);
  transition: border-color var(--ba-transition);
  font-family: inherit;
}

.num-input:focus {
  border-color: var(--ba-primary);
  box-shadow: 0 0 0 3px rgba(18, 137, 249, 0.08);
}

.row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--ba-text);
  cursor: pointer;
  padding: 4px 0;
}

.checkbox-label input { accent-color: var(--ba-primary); }

.expand-btn {
  width: 100%;
  padding: 8px;
  border: 1px dashed var(--ba-primary-border);
  border-radius: var(--ba-radius);
  background: #fff;
  color: var(--ba-primary);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--ba-transition);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-family: inherit;
}
.expand-btn:hover {
  background: var(--ba-primary-bg);
  border-color: var(--ba-primary);
}

.expand-arrow {
  font-size: 10px;
  transition: transform var(--ba-transition);
}

.expand-arrow.rotated {
  transform: rotate(180deg);
}

.advanced-params { display: flex; flex-direction: column; gap: 8px; }

.preset-row { display: flex; gap: 6px; }
.preset-btn {
  flex: 1;
  padding: 8px;
  border: 1px solid var(--ba-border);
  border-radius: var(--ba-radius);
  background: #fff;
  color: var(--ba-text-light);
  font-size: 11px;
  cursor: pointer;
  transition: all var(--ba-transition);
  font-family: inherit;
}
.preset-btn:hover {
  border-color: var(--ba-primary);
  color: var(--ba-primary);
  background: var(--ba-primary-bg);
}

.bg-upload-area { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.bg-upload-btn {
  padding: 8px 14px;
  border: 1px solid var(--ba-border);
  border-radius: var(--ba-radius);
  background: #fff;
  color: var(--ba-text-light);
  font-size: 12px;
  cursor: pointer;
  transition: all var(--ba-transition);
}
.bg-upload-btn:hover {
  border-color: var(--ba-primary);
  color: var(--ba-primary);
}
.bg-filename {
  font-size: 11px;
  color: var(--ba-text);
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.bg-clear {
  font-size: 11px;
  color: #e74c3c;
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
}
.bg-tip { font-size: 10px; color: var(--ba-text-muted); margin-top: 4px; }

.paper-grid { display: flex; flex-direction: column; gap: 4px; }

.paper-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border: 1px solid var(--ba-border-light);
  border-radius: var(--ba-radius);
  background: #fff;
  cursor: pointer;
  transition: all var(--ba-transition);
  font-family: inherit;
}

.paper-btn.active {
  border-color: var(--ba-primary);
  background: var(--ba-primary-bg);
}

.paper-btn:hover:not(.active) {
  border-color: var(--ba-primary-border);
}

.paper-thumb {
  width: 32px;
  height: 42px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid var(--ba-border-light);
}

.paper-name { font-size: 12px; color: var(--ba-text); }

.panel-footer {
  display: flex;
  gap: 8px;
  padding: 12px 14px;
  border-top: 1px solid var(--ba-border-light);
  flex-shrink: 0;
}

.btn {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: var(--ba-radius);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: all var(--ba-transition);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.btn-icon { font-size: 12px; }

.btn-primary {
  background: linear-gradient(135deg, #1289f9, #4da6ff);
  color: #fff;
  box-shadow: 0 2px 8px rgba(18, 137, 249, 0.25);
}

.btn-primary:hover {
  box-shadow: 0 4px 16px rgba(18, 137, 249, 0.35);
  transform: translateY(-1px);
}

.btn-outline {
  background: #fff;
  color: var(--ba-primary);
  border: 1px solid var(--ba-primary-border);
}

.btn-outline:hover {
  background: var(--ba-primary-bg);
  border-color: var(--ba-primary);
}
</style>
