// 作品集线上复核：检查是否已更新到「6 个项目 + 待办清单（Vue 版）」
import { spawn } from 'node:child_process'
import { mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const url = process.argv[2] || 'https://longdandan-dev.github.io/my-portfolio/'
const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
const PORT = 9404
const profile = mkdtempSync(join(tmpdir(), 'pf-online-'))
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const OUT = 'D:\\A-前端学习 -new\\04-截图'

const edge = spawn(EDGE, ['--headless=new', '--disable-gpu', '--mute-audio', '--hide-scrollbars',
  `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`, '--window-size=1440,900', 'about:blank'],
  { stdio: 'ignore' })

const PROBE = `
(() => {
  const txt = document.body.innerText
  const countEl = document.querySelector('[data-works-count]')
  const namesEl = document.querySelector('[data-works-names]')
  const meta = document.querySelector('meta[name="description"]')
  return {
    title: document.title,
    metaDesc: meta ? meta.content : '',
    worksCount: countEl ? countEl.textContent.trim() : null,
    worksNames: namesEl ? namesEl.textContent.trim() : null,
    hasTodoVue: txt.includes('待办清单（Vue 版）') || txt.includes('待办清单(Vue 版)'),
    hasMusicPlayer: txt.includes('音乐播放器'),
    cardCount: document.querySelectorAll('article, .card, .project, li.project').length,
    links: [...document.querySelectorAll('a')].map(a => a.href).filter(h => h.includes('github.io')).length,
    overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
    bodyHead: txt.slice(0, 200),
  }
})()
`

try {
  let wsUrl = null
  for (let i = 0; i < 40 && !wsUrl; i++) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json()
      const p = list.find((t) => t.type === 'page' && t.webSocketDebuggerUrl)
      if (p) wsUrl = p.webSocketDebuggerUrl
    } catch {}
    if (!wsUrl) await sleep(250)
  }
  const ws = new WebSocket(wsUrl)
  await new Promise((res, rej) => { ws.addEventListener('open', res); ws.addEventListener('error', rej) })
  let id = 0
  const waiting = new Map()
  const consoleMsgs = []
  ws.addEventListener('message', (ev) => {
    const m = JSON.parse(ev.data)
    if (m.method === 'Runtime.consoleAPICalled') {
      consoleMsgs.push({ type: m.params.type, text: (m.params.args || []).map((a) => a.value ?? '').join(' ').slice(0, 120) })
    }
    if (m.method === 'Runtime.exceptionThrown') {
      consoleMsgs.push({ type: 'exception', text: (m.params.exceptionDetails?.exception?.description || '').slice(0, 160) })
    }
    if (m.id && waiting.has(m.id)) {
      const { resolve } = waiting.get(m.id)
      waiting.delete(m.id)
      resolve(m.result)
    }
  })
  const send = (method, params = {}) =>
    new Promise((resolve) => {
      const myId = ++id
      waiting.set(myId, { resolve })
      ws.send(JSON.stringify({ id: myId, method, params }))
    })

  await send('Page.enable')
  await send('Runtime.enable')
  await send('Network.enable')
  await send('Network.setCacheDisabled', { cacheDisabled: true })   // 别让旧 HTML 被缓存骗到我们

  const ev = async (expr) => {
    const r = await send('Runtime.evaluate', { expression: expr, returnByValue: true })
    return r && r.result ? r.result.value : null
  }

  // 轮询：等到页面显示 6 个项目（最多等 4 分钟）
  let info = null
  for (let i = 1; i <= 16; i++) {
    await send('Page.navigate', { url })
    await sleep(6000)
    info = await ev(PROBE)
    const ok = info && (info.worksCount === '6' || (info.hasTodoVue && String(info.metaDesc).includes('6')))
    console.log(`第 ${i} 次尝试：worksCount=${info?.worksCount}　含待办Vue=${info?.hasTodoVue}　meta=${String(info?.metaDesc).slice(0, 30)}…　${ok ? '✅ 已更新' : '⏳ 还没'}`)
    if (ok) break
    await sleep(8000)
  }

  console.log('\n=== 线上实际内容 ===')
  console.log(JSON.stringify(info, null, 2))

  const bad = consoleMsgs.filter((m) => ['error', 'warning', 'exception'].includes(m.type))
  console.log(`\n控制台：${bad.length === 0 ? '✅ 0 红 0 黄' : '❌ 有 ' + bad.length + ' 条'}`)
  for (const m of bad.slice(0, 4)) console.log(`   [${m.type}] ${m.text}`)

  // 出截图存档
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false })
  await send('Page.navigate', { url })
  await sleep(4000)
  const s1440 = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true })
  writeFileSync(join(OUT, '阶段1-作品集-线上-6项目-桌面1440.png'), Buffer.from(s1440.data, 'base64'))

  await send('Emulation.setDeviceMetricsOverride', { width: 375, height: 812, deviceScaleFactor: 1, mobile: true })
  await send('Page.navigate', { url })
  await sleep(4000)
  const s375 = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true })
  writeFileSync(join(OUT, '阶段1-作品集-线上-6项目-手机375.png'), Buffer.from(s375.data, 'base64'))
  console.log('\n📷 截图已存：阶段1-作品集-线上-6项目-{桌面1440,手机375}.png')

  ws.close()
} finally {
  edge.kill()
}
