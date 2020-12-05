window.browser = require('webextension-polyfill')

let localSettings = {
  on: true,
  brightness: 1,
  size: 30
}

// 加载设置
async function loadSettings () {
  const rst = await browser.runtime.sendMessage({
    action: 'loadSettings'
  })
  localSettings = {
    ...localSettings,
    ...rst
  }
  applySettings()
}

// 应用设置
function applySettings () {
  const idStr = 'ext-flashlight-style'
  let elStyle = document.getElementById(idStr)
  if (elStyle === null) {
    elStyle = document.createElement('style')
    elStyle.id = idStr
    document.body.append(elStyle)
  }
  elStyle.textContent = `
  :root {
    --cursorX: 50vw;
    --cursorY: 50vh;
  }
  :root:before {
    content: '';
    display: ${localSettings.on ? 'block' : 'none'};
    width: 100%;
    height: 100%;
    position: fixed;
    pointer-events: none;
    background: radial-gradient(
      circle ${localSettings.size}px at var(--cursorX) var(--cursorY),
      rgba(0,0,0,0) 0%,
      rgba(0,0,0,${(1.0 - localSettings.brightness).toFixed(1)}) 80%,
      rgba(0,0,0,.95) 100%
    );
    z-index: 9999999999999;
  }
  `
}

// 获取当前 tab 的状态

// 开启手电
/*
function turnOn () {
  localSettings.on = true
  applySettings()
}

// 关闭手电
function turnOff () {
  localSettings.on = false
  applySettings()
}
 */

// 监听消息
browser.runtime.onMessage.addListener(message => {
  if (!('action' in message)) {
    return
  }
  switch (message.action) {
    // 更新设置
    case 'updateSettings':
      console.debug('updateSettings: ', message)
      localSettings = { ...localSettings, ...message.data }
      applySettings()
      break
    default:
      break
  }
})

loadSettings().then()

function update (e) {
  const x = e.clientX || e.touches[0].clientX
  const y = e.clientY || e.touches[0].clientY

  document.documentElement.style.setProperty('--cursorX', x + 'px')
  document.documentElement.style.setProperty('--cursorY', y + 'px')
}

document.addEventListener('mousemove', update)
document.addEventListener('touchmove', update)
