export function createTextRenderer() {
  const config = {
    text: '',
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
  }

  const RENDER_KEYS = new Set(Object.keys(config))

  let backgroundImage = null

  function setBackgroundImage(img) {
    backgroundImage = img
  }

  function gaussRandom(sigma) {
    if (sigma === 0) return 0
    let u = 0, v = 0
    while (u === 0) u = Math.random()
    while (v === 0) v = Math.random()
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v) * sigma
  }

  function processEnglishSpacing(text) {
    if (!config.enableEnglishSpacing) return text
    return text.replace(/([a-zA-Z0-9.,!?;:'"()\-_]+)/g, (m) => m.length > 1 ? ' ' + m + ' ' : m)
  }

  function createBackground(ctx, width, height) {
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, width, height)

    if (config.isUnderlined) {
      ctx.strokeStyle = 'rgba(180, 200, 220, 0.4)'
      ctx.lineWidth = 1
    let y = config.marginTop
      while (y < height - config.marginBottom) {
        ctx.beginPath()
        ctx.moveTo(config.marginLeft, y)
        ctx.lineTo(width - config.marginRight, y)
        ctx.stroke()
        y += config.lineSpacing
      }
    }
  }

  function wrapText(ctx, text, maxWidth, fontSize) {
    const lines = []
    const paragraphs = text.split('\n')
    const endChars = config.endChars || ''

    ctx.font = `${fontSize}px ${config.fontFamily}`

    for (const para of paragraphs) {
      if (para === '') { lines.push(''); continue }

      const charWidths = []
      for (let i = 0; i < para.length; i++) {
        charWidths[i] = ctx.measureText(para[i]).width
      }

      let currentLine = ''
      let currentWidth = 0
      for (let i = 0; i < para.length; i++) {
        const char = para[i]
        const charWidth = charWidths[i]

        if (currentLine === '') {
          currentLine = char
          currentWidth = charWidth
          continue
        }

        if (currentWidth + charWidth > maxWidth) {
          if (endChars.includes(char)) {
            currentLine += char
            lines.push(currentLine)
            currentLine = ''
            currentWidth = 0
          } else {
            lines.push(currentLine)
            currentLine = char
            currentWidth = charWidth
          }
        } else {
          currentLine += char
          currentWidth += charWidth
        }
      }
      if (currentLine) lines.push(currentLine)
    }
    return lines
  }

  function renderToCanvas(targetCanvas, width, height) {
    const canvas = targetCanvas || document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')

    if (backgroundImage) {
      ctx.drawImage(backgroundImage, 0, 0, width, height)
    } else {
      createBackground(ctx, width, height)
    }

    if (!config.text.trim()) return canvas

    const text = processEnglishSpacing(config.text)
    const maxWidth = width - config.marginLeft - config.marginRight
    const baseFontSize = config.fontSize

    const lines = wrapText(ctx, text, maxWidth, baseFontSize)
    let y = config.marginTop + config.lineSpacing

    const endCharsSet = new Set((config.endChars || '').split('').concat(' '))
    const allChars = text.split('').filter(c => !endCharsSet.has(c))

    function pickWrongChar() {
      if (allChars.length === 0) return 'X'
      return allChars[Math.floor(Math.random() * allChars.length)]
    }

    function drawStrikethrough(ctx, x, y, charFontSize, ink) {
      const lineLength = charFontSize * Math.SQRT2
      const lengthSigma = config.strikethroughLengthSigma
      const angleSigma = config.strikethroughAngleSigma
      const widthSigma = config.strikethroughWidthSigma
      const lineWidth = config.strikethroughWidth

      const startX = x + (1 / 7) * lineLength
      const startY = y - charFontSize + (1 / 7) * lineLength

      const actualLength = lineLength + gaussRandom(lengthSigma)
      const actualAngle = 45 + gaussRandom(angleSigma)
      const actualWidth = Math.max(1, lineWidth + gaussRandom(widthSigma))

      const rad = actualAngle * Math.PI / 180
      const endX = startX + actualLength * Math.cos(rad) * (5 / 7)
      const endY = startY + actualLength * Math.sin(rad) * (5 / 7)

      ctx.strokeStyle = `rgba(0,0,0,${(ink / 255).toFixed(3)})`
      ctx.lineWidth = actualWidth
      ctx.beginPath()
      ctx.moveTo(startX, startY)
      ctx.lineTo(endX, endY)
      ctx.stroke()
    }

    for (let li = 0; li < lines.length; li++) {
      const line = lines[li]
      const lineSpacingVar = config.lineSpacing + gaussRandom(config.lineSpacingSigma)

      if (y + lineSpacingVar > height - config.marginBottom) break
      if (line === '') { y += lineSpacingVar; continue }

      let x = config.marginLeft

      for (let ci = 0; ci < line.length; ci++) {
        const char = line[ci]
        const charFontSize = Math.max(10, baseFontSize + gaussRandom(config.fontSizeSigma))
        const px = gaussRandom(config.perturbXSigma)
        const py = gaussRandom(config.perturbYSigma)
        const pr = gaussRandom(config.perturbThetaSigma)
        const ink = Math.max(30, Math.min(255, 255 - gaussRandom(config.inkDepthSigma)))

        if (Math.random() < config.strikethroughProbability && !endCharsSet.has(char)) {
          const wrongChar = pickWrongChar()
          const wrongFontSize = Math.max(10, baseFontSize + gaussRandom(config.fontSizeSigma))
          const wrongPx = gaussRandom(config.perturbXSigma)
          const wrongPy = gaussRandom(config.perturbYSigma)
          const wrongPr = gaussRandom(config.perturbThetaSigma)
          const wrongInk = Math.max(30, Math.min(255, 255 - gaussRandom(config.inkDepthSigma)))

          const originX = x

          ctx.font = `${wrongFontSize}px ${config.fontFamily}`
          ctx.save()
          ctx.translate(x + wrongPx, y + wrongPy)
          ctx.rotate(wrongPr)
          ctx.fillStyle = `rgba(0,0,0,${(wrongInk / 255).toFixed(3)})`
          ctx.textBaseline = 'alphabetic'
          ctx.fillText(wrongChar, 0, 0)
          ctx.restore()

          const wrongWidth = ctx.measureText(wrongChar).width
          drawStrikethrough(ctx, originX, y, wrongFontSize, wrongInk)

          x += wrongWidth + config.wordSpacing + gaussRandom(config.wordSpacingSigma)
          if (x > width - config.marginRight) break
        }

        ctx.font = `${charFontSize}px ${config.fontFamily}`
        ctx.save()
        ctx.translate(x + px, y + py)
        ctx.rotate(pr)
        ctx.fillStyle = `rgba(0,0,0,${(ink / 255).toFixed(3)})`
        ctx.textBaseline = 'alphabetic'
        ctx.fillText(char, 0, 0)
        ctx.restore()

        x += ctx.measureText(char).width + config.wordSpacing + gaussRandom(config.wordSpacingSigma)
        if (x > width - config.marginRight) break
      }
      y += lineSpacingVar
    }

    return canvas
  }

  function updateConfig(newConfig) {
    for (const key of RENDER_KEYS) {
      if (key in newConfig) config[key] = newConfig[key]
    }
  }

  function getConfig() { return { ...config } }

  function exportImage(w, h) {
    const c = document.createElement('canvas')
    renderToCanvas(c, w || 2481, h || 3507)
    return c.toDataURL('image/png')
  }

  return { renderToCanvas, updateConfig, getConfig, setBackgroundImage, exportImage }
}
