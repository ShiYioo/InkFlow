const loadedFonts = new Map()

const FONT_LIST = [
  { file: '李国夫手写体.ttf', name: '李国夫手写体', family: 'liguofu' },
  { file: '华阳手写体.ttf', name: '华阳手写体', family: '华阳手写' },
  { file: '云烟体.ttf', name: '云烟体', family: 'YYT' },
  { file: '青叶手写体.ttf', name: '青叶手写体', family: 'QYSXT' },
  { file: '神韵英子楷书.ttf', name: '神韵英子楷书', family: 'SYyingzikaishu' },

]

export const BUILT_IN_FONTS = FONT_LIST.map(f => ({
  id: f.family,
  name: f.name,
  family: f.family,
  file: f.file,
}))

export function isFontLoaded(id) {
  return loadedFonts.has(id)
}

export async function loadFont(fontItem) {
  if (loadedFonts.has(fontItem.id)) return true

  try {
    const resp = await fetch('/fonts/' + fontItem.file)
    if (!resp.ok) throw new Error('fetch failed: ' + resp.status)
    const buffer = await resp.arrayBuffer()
    const fontFace = new FontFace(fontItem.family, buffer)
    const loaded = await fontFace.load()
    document.fonts.add(loaded)
    loadedFonts.set(fontItem.id, true)
    return true
  } catch (e) {
    console.error('字体加载失败:', fontItem.name, e)
    return false
  }
}

export async function loadUploadedFont(file) {
  const name = file.name.replace(/\.ttf$/i, '')
  const buffer = await file.arrayBuffer()

  const testFace = new FontFace('probe', buffer)
  await testFace.load()
  const realFamily = testFace.family

  const family = 'Upload-' + Date.now()
  const fontFace = new FontFace(family, buffer)
  const loaded = await fontFace.load()
  document.fonts.add(loaded)
  loadedFonts.set(family, true)
  return { id: family, name: name, family: family, file: null }
}
