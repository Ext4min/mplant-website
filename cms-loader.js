/**
 * mplant CMS-Loader
 * Lädt Inhalte aus content/*.json und füllt die Seiten dynamisch.
 */
(function() {
  'use strict';

  function getValue(obj, path) {
    return path.split('.').reduce((acc, key) => acc && acc[key], obj);
  }

  const files = [
    'hero', 'aktuell', 'oeffnungszeiten_ribbon', 'aktuelles_teaser', 'aktuelles',
    'saeulen', 'pflanzenhof', 'sortiment', 'galabau', 'galerie',
    'karriere_teaser', 'kontakt', 'stimmen',
    'karriere_kopf', 'vorteile', 'stellen', 'bewerbung'
  ];

  Promise.all(
    files.map(name =>
      fetch('content/' + name + '.json', { cache: 'no-cache' })
        .then(r => r.ok ? r.json() : {})
        .catch(() => ({}))
    )
  ).then(results => {
    const data = {};
    files.forEach((name, i) => { data[name] = results[i] || {}; });
    applyAll(data);
  });

  function applyAll(data) {
    applySimpleBindings(data);
    applyKontaktLinks(data);
    applyMaps(data);
    applyAktuell(data);
    applyRibbon(data);
    applyAktuellesTeaser(data);
    applyAktuellesSeite(data);
    applyKarriereTeaser(data);
    applySortiment(data);
    applyGalabau(data);
    applyGalerie(data);
    applyStimmen(data);
    applyVorteile(data);
    applyStellen(data);
  }

  function applySimpleBindings(data) {
    document.querySelectorAll('[data-cms]').forEach(el => {
      const path = el.getAttribute('data-cms');
      const value = getValue(data, path);
      if (value === undefined || value === null) return;
      if (el.tagName === 'IMG') {
        el.setAttribute('src', value);
      } else {
        el.textContent = value;
      }
    });
  }

  function applyKontaktLinks(data) {
    document.querySelectorAll('[data-cms-tel-href]').forEach(el => {
      const value = getValue(data, el.getAttribute('data-cms-tel-href'));
      if (value) el.setAttribute('href', 'tel:' + value);
    });
    document.querySelectorAll('[data-cms-mailto]').forEach(el => {
      const value = getValue(data, el.getAttribute('data-cms-mailto'));
      if (value) el.setAttribute('href', 'mailto:' + value);
    });
    document.querySelectorAll('[data-cms-mailto-bewerbung]').forEach(el => {
      const value = getValue(data, el.getAttribute('data-cms-mailto-bewerbung'));
      if (value) el.setAttribute('href', 'mailto:' + value + '?subject=Bewerbung%20bei%20mplant');
    });
    document.querySelectorAll('[data-cms-instagram-href]').forEach(el => {
      const username = (data.kontakt && data.kontakt.instagram) || '';
      if (username) el.setAttribute('href', 'https://www.instagram.com/' + username);
    });
    document.querySelectorAll('[data-cms-instagram]').forEach(el => {
      const username = (data.kontakt && data.kontakt.instagram) || '';
      if (username) {
        el.setAttribute('href', 'https://www.instagram.com/' + username);
        el.textContent = '@' + username;
      }
    });
  }

  function applyMaps(data) {
    const adresse = data.kontakt && data.kontakt.adresse;
    if (!adresse) return;
    const fullQuery = encodeURIComponent((adresse.strasse || '') + ', ' + (adresse.plz_ort || ''));
    document.querySelectorAll('[data-cms-mapsrc]').forEach(el => {
      el.setAttribute('src', 'https://www.google.com/maps?q=' + fullQuery + '&hl=de&z=15&output=embed');
    });
    document.querySelectorAll('[data-cms-mapslink]').forEach(el => {
      el.setAttribute('href', 'https://www.google.com/maps/search/?api=1&query=' + fullQuery);
    });
  }

  // ---- Aktuell im Hof: dezenter Streifen ----
  function applyAktuell(data) {
    const strip = document.querySelector('[data-cms-aktuell]');
    if (!strip) return;
    const cfg = data.aktuell || {};
    if (cfg.anzeigen === false) {
      strip.style.display = 'none';
      return;
    }
    strip.style.display = '';
  }


  // ---- Öffnungszeiten-Schleife (Ecken-Ribbon) ----
  function applyRibbon(data) {
    const ribbon = document.querySelector('[data-cms-ribbon]');
    if (!ribbon) return;
    const cfg = data.oeffnungszeiten_ribbon || {};
    if (cfg.anzeigen === false) {
      ribbon.style.display = 'none';
      return;
    }
    const saison = ribbon.querySelector('[data-ribbon-saison]');
    const hinweis = ribbon.querySelector('[data-ribbon-hinweis]');
    if (saison) saison.textContent = cfg.saison || '';
    if (hinweis) hinweis.textContent = cfg.hinweis || '';
  }

  // ---- Aktuelles-Teaser Button auf Startseite ----
  function applyAktuellesTeaser(data) {
    const el = document.querySelector('[data-cms-aktuelles-teaser]');
    if (!el) return;
    const cfg = data.aktuelles_teaser || {};
    if (cfg.anzeigen === false) {
      el.style.display = 'none';
    }
  }

  // ---- Aktuelles-Seite: Kopf + Kacheln ----
  function applyAktuellesSeite(data) {
    const container = document.querySelector('[data-cms-aktuelles-kacheln]');
    if (!container) return;
    const a = data.aktuelles || {};
    const kacheln = a.kacheln || [];
    container.innerHTML = '';
    kacheln.forEach(k => {
      const card = document.createElement('div');
      card.className = 'bg-surface-container-lowest border border-outline-variant/15 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow flex flex-col';
      card.innerHTML =
        '<div class="aspect-[4/3] overflow-hidden bg-surface-container-highest">' +
          '<img loading="lazy" class="w-full h-full object-cover kachel-bild">' +
        '</div>' +
        '<div class="p-6 flex-grow flex flex-col">' +
          '<h3 class="text-xl font-bold text-brand-dark mb-2 kachel-titel"></h3>' +
          '<p class="text-on-surface-variant kachel-text"></p>' +
        '</div>';
      const img = card.querySelector('.kachel-bild');
      if (k.bild) img.src = k.bild;
      img.alt = k.titel || 'Aktuell im Hof';
      card.querySelector('.kachel-titel').textContent = k.titel || '';
      card.querySelector('.kachel-text').textContent = k.text || '';
      container.appendChild(card);
    });
  }

  function applyKarriereTeaser(data) {
    const teaser = document.querySelector('[data-cms-teaser]');
    if (!teaser) return;
    const cfg = data.karriere_teaser;
    if (cfg && cfg.anzeigen === false) {
      teaser.style.display = 'none';
    }
  }

  function applySortiment(data) {
    const s = data.sortiment;
    if (!s) return;
    const k1bg = document.querySelector('[data-cms-sortiment-kachel1-bg]');
    if (k1bg && s.kachel1 && s.kachel1.bild) k1bg.setAttribute('src', s.kachel1.bild);
    const k4img = document.querySelector('[data-cms-sortiment-kachel4-img]');
    if (k4img && s.kachel4 && s.kachel4.bild) k4img.setAttribute('src', s.kachel4.bild);
    const k7img = document.querySelector('[data-cms-sortiment-kachel7-img]');
    if (k7img && s.kachel7 && s.kachel7.bild) k7img.setAttribute('src', s.kachel7.bild);
  }

  // ---- GaLaBau: 6 Leistungs-Kacheln + waagerechter Zeitstrahl ----
  function applyGalabau(data) {
    const g = data.galabau;
    if (!g) return;

    const heroImg = document.querySelector('[data-cms-galabau-bild]');
    if (heroImg && g.bild) heroImg.setAttribute('src', g.bild);

    const container = document.querySelector('[data-cms-galabau-leistungen]');
    if (container && g.leistungen) {
      container.innerHTML = '';
      g.leistungen.forEach(l => {
        const card = document.createElement('div');
        card.className = 'bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-xl hover:bg-white/10 transition-colors';
        card.innerHTML =
          '<span class="material-symbols-outlined text-4xl mb-5 text-brand-green leistung-icon"></span>' +
          '<h3 class="text-xl font-bold mb-3 leistung-titel"></h3>' +
          '<p class="opacity-80 text-sm leading-relaxed leistung-text"></p>';
        card.querySelector('.leistung-icon').textContent = l.icon || 'yard';
        card.querySelector('.leistung-titel').textContent = l.titel || '';
        card.querySelector('.leistung-text').textContent = l.text || '';
        container.appendChild(card);
      });
    }

    // WAAGERECHTER ZEITSTRAHL: 4 Punkte mit Verbindungslinie
    const timelineContainer = document.querySelector('[data-cms-galabau-timeline]');
    if (timelineContainer && g.ablauf && g.ablauf.schritte) {
      const schritte = g.ablauf.schritte;
      timelineContainer.innerHTML = '';

      // Wrapper mit relative positioning für die Linie
      const wrapper = document.createElement('div');
      wrapper.className = 'relative';

      // Waagerechte Verbindungslinie (nur auf Desktop sichtbar)
      const line = document.createElement('div');
      line.className = 'hidden md:block absolute top-8 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-brand-green/30 via-brand-green to-brand-green/30 pointer-events-none';
      wrapper.appendChild(line);

      // Grid mit 4 Spalten
      const grid = document.createElement('div');
      grid.className = 'relative grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4';

      schritte.forEach((s, i) => {
        const step = document.createElement('div');
        step.className = 'flex flex-col items-center text-center relative timeline-step';
        step.innerHTML =
          '<div class="w-16 h-16 rounded-full bg-brand-green text-white flex items-center justify-center font-bold text-2xl shadow-lg ring-4 ring-brand-dark relative z-10 timeline-nummer"></div>' +
          '<h4 class="font-bold mt-5 mb-2 text-lg timeline-titel"></h4>' +
          '<p class="text-sm opacity-80 max-w-[240px] timeline-text"></p>';
        step.querySelector('.timeline-nummer').textContent = s.nummer || (i + 1);
        step.querySelector('.timeline-titel').textContent = s.titel || '';
        step.querySelector('.timeline-text').textContent = s.text || '';
        grid.appendChild(step);
      });

      wrapper.appendChild(grid);
      timelineContainer.appendChild(wrapper);
    }
  }

  function applyGalerie(data) {
    const container = document.querySelector('[data-cms-galerie]');
    if (!container) return;
    const bilder = (data.galerie && data.galerie.bilder) || [];
    const layouts = [
      { wrap: 'md:col-span-2 aspect-video rounded-tr-full overflow-hidden shadow-lg' },
      { wrap: 'aspect-square rounded-xl overflow-hidden shadow-lg' },
      { wrap: 'aspect-square rounded-xl overflow-hidden shadow-lg' },
      { wrap: 'md:col-span-2 aspect-[21/9] rounded-bl-full overflow-hidden shadow-lg' }
    ];
    const fallback = { wrap: 'aspect-square rounded-xl overflow-hidden shadow-lg' };
    container.innerHTML = '';
    bilder.forEach((b, i) => {
      const layout = layouts[i] || fallback;
      const div = document.createElement('div');
      div.className = layout.wrap;
      const img = document.createElement('img');
      img.src = b.bild;
      img.alt = b.titel || 'Eindruck vom Hof';
      img.className = 'w-full h-full object-cover';
      img.loading = 'lazy';
      div.appendChild(img);
      container.appendChild(div);
    });
  }

  function applyStimmen(data) {
    const container = document.querySelector('[data-cms-stimmen]');
    if (!container) return;
    const rezensionen = (data.stimmen && data.stimmen.rezensionen) || [];
    const bgVariants = ['bg-primary-fixed', 'bg-secondary-fixed'];
    const fgVariants = ['text-brand-green-darker', 'text-on-secondary-fixed'];
    container.innerHTML = '';
    rezensionen.forEach((r, i) => {
      const card = document.createElement('div');
      card.className = 'bg-surface-container-lowest p-8 rounded-xl shadow-sm border border-outline-variant/10 flex flex-col';
      const stars = document.createElement('div');
      stars.className = 'flex gap-1 mb-4';
      for (let s = 0; s < 5; s++) {
        const star = document.createElement('span');
        star.className = 'material-symbols-outlined text-brand-green';
        star.style.fontVariationSettings = "'FILL' 1";
        star.textContent = 'star';
        stars.appendChild(star);
      }
      card.appendChild(stars);
      const quote = document.createElement('blockquote');
      quote.className = 'italic text-lg text-on-surface-variant leading-relaxed mb-6 flex-grow';
      quote.textContent = '„' + (r.text || '') + '"';
      card.appendChild(quote);
      const author = document.createElement('div');
      author.className = 'flex items-center gap-4';
      const initialDiv = document.createElement('div');
      const v = i % 2;
      initialDiv.className = 'w-12 h-12 rounded-full ' + bgVariants[v] + ' flex items-center justify-center font-bold ' + fgVariants[v];
      initialDiv.textContent = r.initialen || '';
      const nameDiv = document.createElement('div');
      const name = document.createElement('div');
      name.className = 'font-bold text-brand-dark';
      name.textContent = r.name || '';
      const source = document.createElement('div');
      source.className = 'text-sm text-zinc-500';
      source.textContent = r.quelle || 'Google-Rezension';
      nameDiv.appendChild(name);
      nameDiv.appendChild(source);
      author.appendChild(initialDiv);
      author.appendChild(nameDiv);
      card.appendChild(author);
      container.appendChild(card);
    });
  }

  function applyVorteile(data) {
    const container = document.querySelector('[data-cms-vorteile]');
    if (!container) return;
    const vorteile = (data.vorteile && data.vorteile.vorteile) || [];
    container.innerHTML = '';
    vorteile.forEach(v => {
      const card = document.createElement('div');
      card.className = 'bg-surface-container-lowest border border-outline-variant/15 rounded-xl p-8 shadow-sm';
      card.innerHTML =
        '<div class="w-14 h-14 bg-brand-green rounded-full flex items-center justify-center mb-5">' +
          '<span class="material-symbols-outlined text-white text-3xl"></span>' +
        '</div>' +
        '<h3 class="text-xl font-bold text-brand-dark mb-3"></h3>' +
        '<p class="text-on-surface-variant leading-relaxed"></p>';
      card.querySelector('.material-symbols-outlined').textContent = v.icon || 'star';
      card.querySelector('h3').textContent = v.titel || '';
      card.querySelector('p').textContent = v.text || '';
      container.appendChild(card);
    });
  }

  function applyStellen(data) {
    const container = document.querySelector('[data-cms-stellen]');
    if (!container) return;
    const stellen = (data.stellen && data.stellen.stellen) || [];
    container.innerHTML = '';
    stellen.forEach(s => {
      const details = document.createElement('details');
      details.className = 'job-card bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/15 overflow-hidden';
      const summary = document.createElement('summary');
      summary.className = 'p-8 hover:bg-primary-fixed/30 transition-colors';
      summary.innerHTML =
        '<div class="flex items-center justify-between gap-6">' +
          '<div class="flex items-center gap-5 flex-grow">' +
            '<div class="w-14 h-14 bg-brand-green rounded-full flex items-center justify-center flex-shrink-0">' +
              '<span class="material-symbols-outlined text-white text-3xl job-icon"></span>' +
            '</div>' +
            '<div>' +
              '<h3 class="text-xl md:text-2xl font-bold text-brand-dark mb-1 job-titel"></h3>' +
              '<div class="flex flex-wrap gap-x-4 gap-y-1 text-sm text-on-surface-variant">' +
                '<span class="inline-flex items-center gap-1"><span class="material-symbols-outlined text-base">schedule</span> <span class="job-art"></span></span>' +
                '<span class="inline-flex items-center gap-1"><span class="material-symbols-outlined text-base">location_on</span> <span class="job-ort"></span></span>' +
                '<span class="inline-flex items-center gap-1"><span class="material-symbols-outlined text-base">event</span> <span class="job-verfuegbar"></span></span>' +
              '</div>' +
            '</div>' +
          '</div>' +
          '<span class="material-symbols-outlined chevron text-brand-green text-3xl flex-shrink-0">expand_more</span>' +
        '</div>';
      summary.querySelector('.job-icon').textContent = s.icon || 'work';
      summary.querySelector('.job-titel').textContent = s.titel || '';
      summary.querySelector('.job-art').textContent = s.art || '';
      summary.querySelector('.job-ort').textContent = s.ort || '';
      summary.querySelector('.job-verfuegbar').textContent = s.verfuegbar_ab || '';
      details.appendChild(summary);

      const body = document.createElement('div');
      body.className = 'details-body px-8 pb-8 pt-2 border-t border-outline-variant/15';

      const grid = document.createElement('div');
      grid.className = 'grid grid-cols-1 md:grid-cols-2 gap-10 mt-6';

      const aufgabenCol = document.createElement('div');
      aufgabenCol.innerHTML =
        '<h4 class="font-bold text-brand-dark text-lg mb-4 flex items-center gap-2">' +
          '<span class="material-symbols-outlined text-brand-green">handyman</span>Ihre Aufgaben</h4>' +
        '<ul class="space-y-3 text-on-surface-variant aufgaben-list"></ul>';
      const aufgabenList = aufgabenCol.querySelector('.aufgaben-list');
      (s.aufgaben || []).forEach(item => {
        const li = document.createElement('li');
        li.className = 'flex gap-3';
        li.innerHTML = '<span class="material-symbols-outlined text-brand-green text-base mt-1 flex-shrink-0">check</span><span></span>';
        li.querySelector('span:last-child').textContent = item.text || '';
        aufgabenList.appendChild(li);
      });
      grid.appendChild(aufgabenCol);

      const anfCol = document.createElement('div');
      anfCol.innerHTML =
        '<h4 class="font-bold text-brand-dark text-lg mb-4 flex items-center gap-2">' +
          '<span class="material-symbols-outlined text-brand-green">person_check</span>Was Sie mitbringen</h4>' +
        '<ul class="space-y-3 text-on-surface-variant anf-list"></ul>';
      const anfList = anfCol.querySelector('.anf-list');
      (s.anforderungen || []).forEach(item => {
        const li = document.createElement('li');
        li.className = 'flex gap-3';
        li.innerHTML = '<span class="material-symbols-outlined text-brand-green text-base mt-1 flex-shrink-0">check</span><span></span>';
        li.querySelector('span:last-child').textContent = item.text || '';
        anfList.appendChild(li);
      });
      grid.appendChild(anfCol);
      body.appendChild(grid);

      const vorBlock = document.createElement('div');
      vorBlock.className = 'mt-10 bg-primary-fixed/40 p-6 rounded-lg';
      vorBlock.innerHTML =
        '<h4 class="font-bold text-brand-dark text-lg mb-4 flex items-center gap-2">' +
          '<span class="material-symbols-outlined text-brand-green">card_giftcard</span>Was wir bieten</h4>' +
        '<div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-on-surface-variant text-sm vor-grid"></div>';
      const vorGrid = vorBlock.querySelector('.vor-grid');
      (s.vorteile || []).forEach(item => {
        const d = document.createElement('div');
        d.className = 'flex gap-2';
        d.innerHTML = '<span class="material-symbols-outlined text-brand-green text-base mt-0.5">check_circle</span><span></span>';
        d.querySelector('span:last-child').textContent = item.text || '';
        vorGrid.appendChild(d);
      });
      body.appendChild(vorBlock);

      const cta = document.createElement('div');
      cta.className = 'mt-8 text-center';
      cta.innerHTML = '<a href="#bewerbung" class="cta-gradient text-on-primary px-8 py-4 rounded-full font-bold shadow-md hover:shadow-lg transition-all inline-flex items-center gap-2">Auf diese Stelle bewerben <span class="material-symbols-outlined">arrow_forward</span></a>';
      body.appendChild(cta);

      details.appendChild(body);
      container.appendChild(details);
    });
  }
})();
