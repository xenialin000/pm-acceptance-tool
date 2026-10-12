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
          <label for="feature-name">功能名稱</label>
          <input id="feature-name" name="featureName" type="text" placeholder="例如：會員重設密碼">
        </div>
        <div class="field">
          <label for="user-role">使用者角色</label>
          <input id="user-role" name="userRole" type="text" placeholder="例如：忘記密碼的已註冊會員">
        </div>
        <div class="field">
          <label for="original-requirement">原始需求</label>
          <textarea id="original-requirement" name="originalRequirement" rows="5" placeholder="例如：會員可以輸入註冊信箱，收到重設密碼連結，並設定新密碼。"></textarea>
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
        <button type="button" aria-describedby="static-preview-note">產生驗收條件</button>
        <p id="static-preview-note" class="form-note">目前為靜態預覽，按鈕尚未提供產生功能。</p>
      </form>
    </section>
    <section class="panel result-panel" aria-labelledby="result-title">
      <h2 id="result-title">驗收條件結果</h2>
      <p class="panel-description">產生後的驗收條件將顯示於此。</p>
      <div class="empty-state">
        <h3>尚未產生驗收條件</h3>
        <p>請先在表單填寫功能需求。此版本僅展示介面，尚不會產生結果。</p>
      </div>
    </section>
  </div>
</main>
`
