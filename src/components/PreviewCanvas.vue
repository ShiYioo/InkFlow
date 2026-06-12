<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { createTextRenderer } from '@/utils/textRenderer'
import { loadFont, BUILT_IN_FONTS } from '@/utils/fontLoader'

const canvasRef = ref(null)
const wrapperRef = ref(null)
let renderer = null
let resizeObserver = null
let debounceTimer = null

const props = defineProps({
  text: { type: String, default: '' },
  penConfig: { type: Object, required: true },
  renderWidth: { type: Number, default: 2481 },
  renderHeight: { type: Number, default: 3507 },
  backgroundImage: { type: [Object, null], default: null },
})

const emit = defineEmits(['exported'])

function renderToDisplay() {
  if (!renderer || !canvasRef.value || !wrapperRef.value) return

  renderer.updateConfig({
    text: props.text,
    ...props.penConfig,
  })

  const renderCanvas = document.createElement('canvas')
  renderer.renderToCanvas(renderCanvas, props.renderWidth, props.renderHeight)

  const displayCanvas = canvasRef.value
  const rect = wrapperRef.value.getBoundingClientRect()
  const displayW = rect.width
  const displayH = rect.height
  const dpr = window.devicePixelRatio || 1

  displayCanvas.width = displayW * dpr
  displayCanvas.height = displayH * dpr
  displayCanvas.style.width = displayW + 'px'
  displayCanvas.style.height = displayH + 'px'

  const dctx = displayCanvas.getContext('2d')
  dctx.setTransform(dpr, 0, 0, dpr, 0, 0)

  const imgRatio = props.renderWidth / props.renderHeight
  const canvasRatio = displayW / displayH
  let drawW, drawH, drawX, drawY

  if (imgRatio > canvasRatio) {
    drawW = displayW
    drawH = displayW / imgRatio
    drawX = 0
    drawY = (displayH - drawH) / 2
  } else {
    drawH = displayH
    drawW = displayH * imgRatio
    drawX = (displayW - drawW) / 2
    drawY = 0
  }

  dctx.fillStyle = '#eef3f9'
  dctx.fillRect(0, 0, displayW, displayH)
  dctx.drawImage(renderCanvas, drawX, drawY, drawW, drawH)
}

function debouncedRender() {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(async () => {
    await document.fonts.ready
    renderToDisplay()
  }, 150)
}

watch([
  () => props.text,
  () => props.penConfig,
  () => props.renderWidth,
  () => props.renderHeight,
], async () => {
  const fontCfg = BUILT_IN_FONTS.find(f => props.penConfig.fontFamily === f.family)
  if (fontCfg) await loadFont(fontCfg)
  await document.fonts.ready
  debouncedRender()
}, { deep: true })

watch(() => props.backgroundImage, (img) => {
  if (renderer) {
    renderer.setBackgroundImage(img)
    debouncedRender()
  }
})

onMounted(async () => {
  renderer = createTextRenderer()

  const defaultFont = BUILT_IN_FONTS[0]
  await loadFont(defaultFont)
  await document.fonts.ready

  renderer.updateConfig({
    text: props.text,
    ...props.penConfig,
  })

  if (props.backgroundImage) {
    renderer.setBackgroundImage(props.backgroundImage)
  }

  resizeObserver = new ResizeObserver(() => {
    debouncedRender()
  })
  if (wrapperRef.value) {
    resizeObserver.observe(wrapperRef.value)
  }

  renderToDisplay()
})

onUnmounted(() => {
  if (resizeObserver) resizeObserver.disconnect()
  clearTimeout(debounceTimer)
})

function handleExport() {
  if (!renderer) return
  renderer.updateConfig({ text: props.text, ...props.penConfig })
  const c = document.createElement('canvas')
  renderer.renderToCanvas(c, props.renderWidth, props.renderHeight)
  c.toBlob((blob) => {
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.download = `inkflow-${props.renderWidth}x${props.renderHeight}-${Date.now()}.png`
    link.href = url
    link.click()
    URL.revokeObjectURL(url)
    emit('exported')
  }, 'image/png')
}

function handleRender() { renderToDisplay() }

defineExpose({ handleExport, render: handleRender })
</script>

<template>
  <div class="preview-wrapper" ref="wrapperRef">
    <canvas ref="canvasRef" class="preview-canvas" />
  </div>
</template>

<style scoped>
.preview-wrapper {
  width: 100%;
  height: 100%;
  border-radius: var(--ba-radius-lg);
  overflow: hidden;
  box-shadow: var(--ba-shadow);
  border: 1px solid var(--ba-border-light);
  background: #eef3f9;
}

.preview-canvas {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
