window.browser = require('webextension-polyfill')

// 默认设置
let settings = {
  // 默认开启
  on: true,
  // 亮度 0 ~ 1
  brightness: 1,
  // 大小
  size: 30
}

// 从本地存储读取设置
browser.storage.local.get('settings').then(rst => {
  if ('settings' in rst) {
    settings = {
      ...settings,
      ...rst.settings
    }
  }
}).catch(e => console.debug('========== error occurred when reading settings from local storage: ', e))

// 保存设置到本地
async function saveSettings (settingsData) {
  console.debug('saving data', settingsData)
  settings = { ...settings, ...settingsData }
  try {
    await browser.storage.local.set(settings)
    // 发送更新给各个 tab
    browser.tabs.query({
      currentWindow: true
    }).then(tabs => {
      console.debug(tabs)
      tabs.forEach(tab => {
        browser.tabs.sendMessage(tab.id, {
          action: 'updateSettings',
          data: settings
        })
      })
    })
    return settings
  } catch (e) {
    console.debug('<><><><><><><><><><> saving status: ', e)
  }
}

// 监听 message 消息
browser.runtime.onMessage.addListener(message => {
  if (!('action' in message)) {
    return
  }
  switch (message.action) {
    case 'loadSettings':
      return Promise.resolve(settings)
    case 'saveSettings':
      return saveSettings(message.data)
    default:
      console.debug(message)
      break
  }
})
