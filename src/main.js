import './style.css'
import heroImg from './assets/hero.png'
import javascriptLogo from './assets/javascript.svg'
import viteLogo from './assets/vite.svg'

document.querySelector('#app').innerHTML = `
<main id="center" lang="zh-Hant">
  <div class="hero">
    <img src="${heroImg}" class="base" width="170" height="179">
    <img src="${javascriptLogo}" class="framework" alt="JavaScript logo"/>
    <img src="${viteLogo}" class="vite" alt="Vite logo" />
  </div>
  <div>
    <h1>PM 驗收條件產生器</h1>
    <p>把模糊需求轉換成清楚、可測試的驗收條件</p>
  </div>
  <div class="workspace">
    <section class="panel" aria-labelledby="requirements-title">
      <h2 id="requirements-title">填寫功能需求</h2>
      <p class="panel-description">整理功能背景與限制，讓驗收條件更清楚。</p>
      <form class="requirements-form">
        <div class="field">
          <label for="feature-name">功能名稱（必填）</label>
          <input id="feature-name" name="featureName" type="text" required placeholder="例如：會員重設密碼">
        </div>
        <div class="field">
          <label for="user-role">使用者角色（必填）</label>
          <input id="user-role" name="userRole" type="text" required placeholder="例如：忘記密碼的已註冊會員">
        </div>
        <div class="field">
          <label for="original-requirement">原始需求（必填）</label>
          <textarea id="original-requirement" name="originalRequirement" rows="5" required placeholder="例如：會員可以輸入註冊信箱，收到重設密碼連結，並設定新密碼。"></textarea>
        </div>
        <div class="field">
          <label for="platform">使用平台</label>
          <select id="platform" name="platform">
            <option value="web">Web</option>
            <option value="app">iOS / Android App</option>
            <option value="unity-vr">Unity / VR</option>
          </select>
        </div>
        <div class="field">
          <label for="additional-constraints">補充限制 <span class="optional">（選填）</span></label>
          <textarea id="additional-constraints" name="additionalConstraints" rows="4" placeholder="例如：重設連結在 30 分鐘後失效，新密碼至少需要 8 個字元。"></textarea>
        </div>
        <button type="submit" aria-describedby="rule-draft-note">產生驗收條件</button>
        <p id="rule-draft-note" class="form-note">依填寫內容產生規則式草稿，驗收條件仍需人工檢視。</p>
        <button id="clear-all" class="secondary-button" type="button">清除全部</button>
        <p id="draft-status" role="status" aria-live="polite" aria-atomic="true"></p>
      </form>
    </section>
    <section class="panel result-panel" aria-labelledby="result-title">
      <h2 id="result-title">驗收條件結果</h2>
      <p class="panel-description">產生後的規則式草稿將顯示於此。</p>
      <div id="acceptance-result" aria-live="polite" aria-atomic="true">
        <div class="empty-state">
          <h3>尚未產生驗收條件</h3>
          <p>請先填寫必填欄位，再產生規則式草稿。</p>
        </div>
      </div>
      <button id="copy-result" type="button" hidden aria-describedby="copy-status">複製結果</button>
      <p id="copy-status" role="status" aria-live="polite" aria-atomic="true"></p>
    </section>
  </div>
</main>
`

const form = document.querySelector('.requirements-form')
const result = document.querySelector('#acceptance-result')
const requiredFields = [...form.querySelectorAll('[required]')]
const copyButton = document.querySelector('#copy-result')
const copyStatus = document.querySelector('#copy-status')
const clearButton = document.querySelector('#clear-all')
const draftStatus = document.querySelector('#draft-status')
const draftKey = 'pm-acceptance-tool:draft:v1'
const draftFieldNames = [
  'featureName', 'userRole', 'originalRequirement', 'platform', 'additionalConstraints',
]
const emptyResult = result.firstElementChild.cloneNode(true)
const saveErrorMessage = '草稿無法保存，請勿依賴重新整理後還原內容。'
let saveErrorReported = false
let latestResultText = ''
let resultVersion = 0
let copyResetTimer

function restoreDraft() {
  let stored
  try {
    stored = window.localStorage.getItem(draftKey)
  } catch {
    draftStatus.textContent = '無法讀取本機草稿，仍可填寫表單與產生驗收條件。'
    return
  }
  if (stored === null) return

  let draft
  try {
    draft = JSON.parse(stored)
    if (draft === null || typeof draft !== 'object' || Array.isArray(draft)) {
      throw new Error('Invalid draft')
    }
  } catch {
    try {
      window.localStorage.removeItem(draftKey)
      draftStatus.textContent = '草稿資料無效，已移除，請重新填寫。'
    } catch {
      draftStatus.textContent = '草稿資料無效，且無法刪除本機草稿；重新載入時可能再次出現此提示。'
    }
    return
  }

  draftFieldNames.forEach((name) => {
    const field = form.elements.namedItem(name)
    if (!Object.hasOwn(draft, name) || typeof draft[name] !== 'string') return
    if (name === 'platform' && ![...field.options].some((option) => option.value === draft[name])) return
    field.value = draft[name]
  })
}

function saveDraft() {
  const draft = Object.fromEntries(
    draftFieldNames.map((name) => [name, form.elements.namedItem(name).value]),
  )
  try {
    window.localStorage.setItem(draftKey, JSON.stringify(draft))
    if (draftStatus.textContent) draftStatus.textContent = ''
  } catch {
    // Report write failures only once per page visit, including after recovery.
    if (!saveErrorReported) {
      draftStatus.textContent = saveErrorMessage
      saveErrorReported = true
    }
  }
}

restoreDraft()
draftFieldNames.forEach((name) => {
  const field = form.elements.namedItem(name)
  field.addEventListener(name === 'platform' ? 'change' : 'input', saveDraft)
})

clearButton.addEventListener('click', () => {
  resultVersion += 1
  clearTimeout(copyResetTimer)
  form.reset()
  requiredFields.forEach((field) => field.setCustomValidity(''))
  latestResultText = ''
  result.replaceChildren(emptyResult.cloneNode(true))
  copyButton.hidden = true
  copyButton.disabled = false
  copyButton.textContent = '複製結果'
  copyStatus.textContent = ''

  try {
    window.localStorage.removeItem(draftKey)
    draftStatus.textContent = '已清除全部表單內容與驗收結果。'
  } catch {
    draftStatus.textContent = '畫面已清空，但無法刪除本機草稿；重新載入時可能再次還原。'
  }
  form.elements.namedItem('featureName').focus()
})

copyButton.addEventListener('click', async () => {
  if (!latestResultText || copyButton.disabled) return

  const version = resultVersion
  const textToCopy = latestResultText
  clearTimeout(copyResetTimer)
  copyButton.disabled = true
  copyButton.textContent = '複製中…'
  copyStatus.textContent = ''

  try {
    await navigator.clipboard.writeText(textToCopy)
    if (version !== resultVersion) return

    copyButton.textContent = '已複製'
    copyStatus.textContent = '結果已複製到剪貼簿。'
    copyResetTimer = setTimeout(() => {
      if (version !== resultVersion) return
      copyButton.textContent = '複製結果'
      copyStatus.textContent = ''
    }, 2000)
  } catch {
    if (version !== resultVersion) return

    copyButton.textContent = '複製結果'
    copyStatus.textContent = '無法複製結果，請手動選取結果文字後複製。'
  } finally {
    if (version === resultVersion) copyButton.disabled = false
  }
})

requiredFields.forEach((field) => {
  field.addEventListener('input', () => {
    field.setCustomValidity('')
  })
})

form.addEventListener('submit', (event) => {
  event.preventDefault()

  const values = Object.fromEntries(
    [...new FormData(form)].map(([name, value]) => [name, value.trim()]),
  )

  requiredFields.forEach((field) => {
    field.setCustomValidity(values[field.name] ? '' : '請填寫此欄位，不能只輸入空白。')
  })

  if (!form.reportValidity()) return

  const platform = form.elements.namedItem('platform')
  const platformLabel = platform.selectedOptions[0].textContent.trim()
  const given = `使用者為「${values.userRole}」，使用平台為「${platformLabel}」。`
    + (values.additionalConstraints ? `補充限制：${values.additionalConstraints}` : '')

  const draft = document.createElement('div')
  draft.className = 'acceptance-draft'

  const title = document.createElement('h3')
  title.textContent = `功能名稱：${values.featureName}`
  draft.append(title)

  const conditions = [
    ['Given', given],
    ['When', `使用者操作「${values.featureName}」功能。`],
    ['Then', values.originalRequirement],
  ]

  conditions.forEach(([label, content]) => {
    const paragraph = document.createElement('p')
    const heading = document.createElement('strong')
    heading.textContent = `${label}：`
    paragraph.append(heading, document.createTextNode(content))
    draft.append(paragraph)
  })

  result.replaceChildren(draft)
  latestResultText = [
    title.textContent,
    ...conditions.map(([label, content]) => `${label}：${content}`),
  ].join('\n\n')
  resultVersion += 1
  clearTimeout(copyResetTimer)
  copyButton.hidden = false
  copyButton.disabled = false
  copyButton.textContent = '複製結果'
  copyStatus.textContent = ''
})
