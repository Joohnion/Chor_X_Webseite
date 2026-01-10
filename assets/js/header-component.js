class MeinHeader extends HTMLElement {
  async connectedCallback() {
    let data;
    try {
      // JSON laden (Pfad ggf. anpassen, falls data-Ordner woanders liegt)
      const response = await fetch('/data/site-config.json');
      data = await response.json();
    } catch (e) {
      console.error("Inhalte konnten nicht geladen werden", e);
      return;
    }

    // 1. Header & Banner generieren
    // Nutzt data.Banner.text für das rotierende Banner
    this.innerHTML = `
        <header class="site-header">
          <div class="header-inner">
              <a href="/index.html">
                <img src="/assets/images/ChorX_Symbol.png" class="logo-img" alt="Symbol">
              </a>
              <nav class="main-nav">
                <ul class="nav-list">
                    <li><a href="/pages/ueber-uns/">Über uns</a></li>
                    <li><a href="/pages/mitsingen/">Mitsingen</a></li>
                    <li><a href="/pages/konzerte/">Konzerte</a></li>
                    <li><a href="/pages/chorga/">Vorstand</a></li>
                    <li><a href="/pages/chorfahrt/">Chorfahrt</a></li>
                    <li><a href="/pages/impressum/">Impressum</a></li>
                </ul>
              </nav>
              <a href="/index.html">
                <img src="/assets/images/logo.png" class="logo-img" alt="Logo">
              </a>
          </div>
        </header>
        <div id="side-banner">
          <div class="rotated-text">
            <p>${data.Banner.text}</p>
          </div>
        </div>
    `;

// Optional: Menü schließen, wenn ein Link geklickt wird
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        menu.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

    // 2. Seiteninhalte dynamisch verteilen
    this.updatePageContent(data);
  }

  updatePageContent(data) {
    const path = window.location.pathname;
    let pageData = null;

    // Erkennung der aktuellen Seite anhand der URL
    if (path === '/' || path.includes('index.html')) {
      pageData = data.Startseite;
    } else if (path.includes('ueber-uns')) {
      pageData = data.Ueber_uns;
    } else if (path.includes('mitsingen')) {
      pageData = data.Mitsingen;
    } else if (path.includes('konzerte')) {
      pageData = data.Konzerte;
    } else if (path.includes('chorga')) {
      pageData = data.Vorstand;
    } else if (path.includes('chorfahrt')) {
      pageData = data.Chorfahrt;
    } else if (path.includes('impressum')) {
      pageData = data.Impressum;
    }

    if (!pageData) return;

    // Titel im Browser-Tab setzen (beachtet unterschiedliche Keys in deiner JSON)
    document.title = pageData.title_in_Reiter || pageData.title_im_Reiter || "Chor X";

    // Willkommens-Titel befüllen (ID: welcome-title)
    const welcomeTitleEl = document.getElementById('welcome-title');
    if (welcomeTitleEl && pageData.welcome_title) {
        welcomeTitleEl.textContent = pageData.welcome_title;
    }

    // Haupttext befüllen (ID: page-text)
    const textEl = document.getElementById('page-text');
    if (textEl && pageData.text) {
        textEl.textContent = pageData.text;
    }

    // Spezielle Felder für die Mitsingen-Seite
    if (path.includes('mitsingen')) {
        const addrEl = document.getElementById('address-box');
        if (addrEl && pageData.Addresse) {
            addrEl.innerHTML = pageData.Addresse; // innerHTML wegen <br> in der JSON
        }
        const subEl = document.getElementById('sub-signature');
        if (subEl && pageData.Sub_Unterschrift) {
            subEl.textContent = pageData.Sub_Unterschrift;
        }
    }
    
    // Spezielle Felder für die Startseite (welcome_text vs text)
    const welcomeTextEl = document.getElementById('welcome-text');
    if (welcomeTextEl && pageData.welcome_text) {
        welcomeTextEl.textContent = pageData.welcome_text;
    }
  }
}
customElements.define('mein-header', MeinHeader);