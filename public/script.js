class TempMail {
  constructor() {
    this.email = '';
    this.init();
  }

  init() {
    this.domainsSelect = document.getElementById('domainsSelect');
    this.prefixInput = document.getElementById('prefixInput');
    this.emailEl = document.getElementById('currentEmail');
    this.mailsEl = document.getElementById('mails');

    document.getElementById('btnRandom').onclick = () => this.randomEmail();
    document.getElementById('btnCreate').onclick = () => this.customEmail();
    document.getElementById('btnRefresh').onclick = () => this.loadInbox();
    document.getElementById('btnCopy').onclick = () => this.copyEmail();

    this.loadDomains();
  }

  async api(url) {
    const r = await fetch(url);
    if (!r.ok) throw new Error('API error');
    return r.json();
  }

  async loadDomains() {
    const domains = await this.api('/api/domains');
    this.domainsSelect.innerHTML = domains
      .map(d => `<option value="${d}">${d}</option>`)
      .join('');
  }

  async randomEmail() {
    const data = await this.api('/api/random');
    this.setEmail(data.email);
  }

  customEmail() {
    const prefix = this.prefixInput.value.trim();
    const domain = this.domainsSelect.value;

    if (!prefix) {
      alert('Vui lòng nhập username');
      return;
    }

    const email = `${prefix}@${domain}`;
    this.setEmail(email);
    this.prefixInput.value = '';
  }

  setEmail(email) {
    this.email = email;
    this.emailEl.textContent = email;
    document.getElementById('emailSection').classList.remove('hidden');
    this.loadInbox();
  }

  async loadInbox() {
    if (!this.email) return;

    const mails = await this.api(`/api/inbox/${this.email}`);

    if (!mails.length) {
      this.mailsEl.innerHTML = '📭 Chưa có email';
      return;
    }

    this.mailsEl.innerHTML = mails.map(m => `
      <div class="mail">
        <h4>${m.subject || '(Không tiêu đề)'}</h4>
        <p>${m.fromAddress || ''}</p>
        <a href="mail.html?id=${m.id}">📖 Đọc chi tiết</a>
      </div>
    `).join('');
  }

  copyEmail() {
    navigator.clipboard.writeText(this.email);

    const toast = document.getElementById('toast');
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 1500);
  }
}

new TempMail();
