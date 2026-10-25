import './style.css';

const icons = {
  capture: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7.5h3l1.5-2h7L17 7.5h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>',
  library: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5h16v13H4z"/><path d="m10 9 5 3-5 3z"/></svg>',
  cloud: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.2 18.5H17a4 4 0 0 0 .2-8 5.5 5.5 0 0 0-10.6-1.1 4.6 4.6 0 0 0 .6 9.1Z"/><path d="M12 14v5m-2-3 2 2 2-2"/></svg>',
  settings: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="m19.4 15 .1.1 1.2 1-1.2 2.1-1.5-.6-.1.1a8 8 0 0 1-1.7 1l-.2 1.6h-2.4l-.3-1.6a8 8 0 0 1-1.9-.8l-1.4.7-1.5-1.8 1.1-1.2a7 7 0 0 1-.4-2l-1.5-.7.7-2.3 1.6.1a7 7 0 0 1 1.3-1.5l-.3-1.6 2.2-.9.9 1.4a8 8 0 0 1 2.1-.1l.9-1.4 2.2.9-.3 1.6a8 8 0 0 1 1.3 1.5l1.6-.1.7 2.3-1.5.7a7 7 0 0 1-.4 2Z"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>',
  plus: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 6 10 6-10 6z"/></svg>',
  upload: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 16V4m-4 4 4-4 4 4"/><path d="M5 14v5h14v-5"/></svg>',
  trash: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16m-10 0V4h4v3m-8 0 1 13h10l1-13M10 11v5m4-5v5"/></svg>',
  close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>',
  check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6"/></svg>',
  download: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v13m-4-4 4 4 4-4"/><path d="M5 19v2h14v-2"/></svg>',
  edit: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>',
  search: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>',
  sun: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>',
  moon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',
};

const THEME_KEY = 'velex-clip-theme';

function getStoredTheme() {
  try {
    return localStorage.getItem(THEME_KEY) || 'dark';
  } catch {
    return 'dark';
  }
}

function applyTheme(theme) {
  const selectedTheme = theme === 'light' ? 'light' : 'dark';
  state.theme = selectedTheme;
  document.documentElement.setAttribute('data-theme', selectedTheme);
  try {
    localStorage.setItem(THEME_KEY, selectedTheme);
  } catch (error) {
    console.error('Tema tercihi kaydedilemedi:', error);
  }
}

const state = {
  theme: getStoredTheme(),
  page: 'capture',
  recorder: null,
  stream: null,
  chunks: [],
  startedAt: 0,
  selectedSeconds: [15, 30, 60, 120].includes(Number(localStorage.getItem('velex-clip-replay-seconds')))
    ? Number(localStorage.getItem('velex-clip-replay-seconds'))
    : 30,
  captureSources: [],
  selectedSourceName: '',
  hasAudio: false,
  sourcePickerOpen: false,
  clips: [],
  searchQuery: '',
  filterStatus: 'all',
  sortBy: 'newest',
  renamingClip: null,
  objectUrls: [],
  db: null,
  interval: null,
  pendingChunk: null,
  saving: false,
  trimming: false,
  trimClip: null,
  trimUrl: null,
  testingConnection: false,
  connectionTestResult: null,
  activeCloudId: localStorage.getItem('velex-clip-active-cloud') || 'filebase',
  checkingUpdate: false,
  updateResult: null,
  updater: {
    status: 'idle',
    version: null,
    releaseDate: null,
    releaseNotes: null,
    progress: null,
    error: null,
  },
};

const EMBEDDED_PROVIDERS = {
  filebase: {
    id: 'filebase',
    name: 'Filebase',
    badge: '5 GB Kalıcı · Kartsız',
    type: 's3',
    quota: '5 GB Kalıcı · Kredi Kartı İstemez',
    configured: true,
    config: {
      provider: 's3',
      s3Endpoint: 'https://s3.filebase.io',
      s3Bucket: 'velex-stroge',
      s3Region: 'us-east-1',
      s3AccessKeyId: 'B521137EF187A1143F3B',
      s3SecretAccessKey: 'ykjCBAaVgPgnT5V6FHZFalB75Ytitgw7mGgW9IKT',
      s3PublicUrl: '',
    },
  },
  r2: {
    id: 'r2',
    name: 'Cloudflare R2',
    badge: '10 GB Free',
    type: 's3',
    quota: '10 GB Kalıcı · $0 Egress',
    configured: true,
    config: {
      provider: 's3',
      s3Endpoint: 'https://77b8ab0686cc8803aaae1a80ffa492a3.eu.r2.cloudflarestorage.com',
      s3Bucket: 'velex-clips',
      s3Region: 'auto',
      s3AccessKeyId: 'c8fbfbbc7f7227809dcae2c8a0dc730a',
      s3SecretAccessKey: '7947401cfb0eaa98d2fa9bc13159db282102b2cc039d4ff5609790dd8107268f',
      s3PublicUrl: '',
    },
  },
  b2: {
    id: 'b2',
    name: 'Backblaze B2',
    badge: 'Kredi Kartı İstemez',
    type: 's3',
    quota: '10 GB Kalıcı · S3 Uyumlu',
    configured: false,
    config: {
      provider: 's3',
      s3Endpoint: '',
      s3Bucket: '',
      s3Region: 'us-west-004',
      s3AccessKeyId: '',
      s3SecretAccessKey: '',
      s3PublicUrl: '',
    },
  },
  supabase: {
    id: 'supabase',
    name: 'Supabase Storage',
    badge: 'Kredi Kartı İstemez',
    type: 'supabase',
    quota: '1 GB Kalıcı · REST API',
    configured: false,
    config: {
      provider: 'supabase',
      url: '',
      apiKey: '',
      bucket: '',
      accessToken: '',
    },
  },
};

function getActiveCloudProvider() {
  return EMBEDDED_PROVIDERS[state.activeCloudId] || EMBEDDED_PROVIDERS.filebase;
}

function cloudConfig() {
  return getActiveCloudProvider().config;
}

// Initial theme apply
applyTheme(state.theme);

let APP_VERSION = '0.1.4';
const OFFICIAL_GITHUB_REPO = 'zenxy177/Vexel-Clip';
const UPDATE_SETTINGS_KEY = 'velex-clip-update-settings';

function getUpdateSettings() {
  try {
    const raw = localStorage.getItem(UPDATE_SETTINGS_KEY);
    if (!raw) {
      return {
        sourceType: 'github',
        githubRepo: OFFICIAL_GITHUB_REPO,
        customUrl: '',
        autoCheck: true,
        lastCheckedAt: null,
        lastResult: null,
      };
    }
    const data = JSON.parse(raw);
    const repo = (data.githubRepo && data.githubRepo !== 'velex-clip/velex-clip')
      ? data.githubRepo
      : OFFICIAL_GITHUB_REPO;
    return {
      sourceType: data.sourceType === 'custom' ? 'custom' : 'github',
      githubRepo: repo,
      customUrl: data.customUrl || '',
      autoCheck: data.autoCheck !== false,
      lastCheckedAt: data.lastCheckedAt || null,
      lastResult: data.lastResult || null,
    };
  } catch {
    return {
      sourceType: 'github',
      githubRepo: OFFICIAL_GITHUB_REPO,
      customUrl: '',
      autoCheck: true,
      lastCheckedAt: null,
      lastResult: null,
    };
  }
}

function saveUpdateSettings(settings) {
  try {
    localStorage.setItem(UPDATE_SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Güncelleme ayarları kaydedilemedi:', error);
  }
}

function parseSemver(versionStr) {
  const clean = String(versionStr || '').trim().replace(/^[vV]/, '');
  const [core] = clean.split('-');
  const parts = core.split('.').map((p) => parseInt(p, 10) || 0);
  while (parts.length < 3) parts.push(0);
  return parts;
}

function compareSemver(current, target) {
  const [cMaj, cMin, cPat] = parseSemver(current);
  const [tMaj, tMin, tPat] = parseSemver(target);
  if (tMaj !== cMaj) return tMaj - cMaj;
  if (tMin !== cMin) return tMin - cMin;
  return tPat - cPat;
}

function openUrl(url) {
  if (window.velexDesktop?.openExternal) {
    window.velexDesktop.openExternal(url).catch((err) => showToast(`Bağlantı açılamadı: ${err.message}`, 'error'));
  } else {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}

async function checkForUpdates(silent = false) {
  if (state.checkingUpdate) return;
  state.checkingUpdate = true;
  if (!silent) render();

  const settings = getUpdateSettings();
  let result = null;

  try {
    if (settings.sourceType === 'custom') {
      if (!settings.customUrl) throw new Error('Özel sürüm JSON URL adresi boş bırakılamaz.');
      const res = await fetch(settings.customUrl, { cache: 'no-store' });
      if (!res.ok) throw new Error(`Sürüm sunucusu yanıt vermedi (${res.status}): ${res.statusText}`);
      const data = await res.json();
      const latestVer = String(data.version || '').replace(/^[vV]/, '');
      if (!latestVer) throw new Error('JSON yanıtında geçerli bir "version" alanı bulunamadı.');
      const hasUpdate = compareSemver(APP_VERSION, latestVer) > 0;
      result = {
        success: true,
        currentVersion: APP_VERSION,
        latestVersion: latestVer,
        hasUpdate,
        name: data.name || `Velex Clip v${latestVer}`,
        notes: data.notes || '',
        downloadUrl: data.downloadUrl || data.url || settings.customUrl,
        publishedAt: data.publishedAt ? new Date(data.publishedAt).getTime() : Date.now(),
      };
    } else {
      const repo = (settings.githubRepo || OFFICIAL_GITHUB_REPO).trim()
        .replace(/^https?:\/\/github\.com\//i, '')
        .replace(/\.git$/i, '')
        .replace(/\/+$/, '');
      if (!repo.includes('/')) throw new Error('Geçersiz GitHub repository formatı. "kullanici/repo" biçiminde olmalıdır.');
      const endpoint = `https://api.github.com/repos/${repo}/releases/latest`;
      const res = await fetch(endpoint, {
        headers: { Accept: 'application/vnd.github.v3+json' },
        cache: 'no-store',
      });
      if (res.status === 404) {
        result = {
          success: true,
          currentVersion: APP_VERSION,
          latestVersion: APP_VERSION,
          hasUpdate: false,
          name: `Velex Clip v${APP_VERSION}`,
          notes: 'Resmi depoda henüz yeni bir yayın (Release) bulunmuyor. Mevcut sürümünüz güncel.',
          downloadUrl: `https://github.com/${repo}/releases`,
          publishedAt: null,
        };
      } else if (!res.ok) {
        if (res.status === 403) throw new Error('GitHub API istek sınırı aşıldı. Lütfen birkaç dakika sonra tekrar deneyin.');
        throw new Error(`GitHub API hatası (${res.status}): ${res.statusText}`);
      } else {
        const data = await res.json();
        const rawTag = String(data.tag_name || data.name || '').trim();
        const latestVer = rawTag.replace(/^[vV]/, '');
        const hasUpdate = compareSemver(APP_VERSION, latestVer) > 0;
        const exeAsset = data.assets?.find((a) => a.name.endsWith('.exe'));
        result = {
          success: true,
          currentVersion: APP_VERSION,
          latestVersion: latestVer,
          hasUpdate,
          name: data.name || `Velex Clip ${rawTag}`,
          notes: data.body || '',
          downloadUrl: exeAsset?.browser_download_url || data.html_url,
          publishedAt: data.published_at ? new Date(data.published_at).getTime() : Date.now(),
        };
      }
    }

    settings.lastCheckedAt = Date.now();
    settings.lastResult = result;
    saveUpdateSettings(settings);
    state.updateResult = result;

    if (!silent) {
      if (result.hasUpdate) {
        showToast(`Yeni sürüm mevcut: v${result.latestVersion}!`, 'success');
      } else {
        showToast(`Velex Clip güncel (v${APP_VERSION}). En son sürümdesiniz.`, 'success');
      }
    }
  } catch (error) {
    result = {
      success: false,
      error: error instanceof Error ? error.message : 'Güncelleme denetlenirken bir hata oluştu.',
    };
    state.updateResult = result;
    if (!silent) {
      showToast(result.error, 'error');
    }
  } finally {
    state.checkingUpdate = false;
    render();
  }
}

const app = document.querySelector('#app');
const formatTime = (seconds) => {
  const safeSeconds = Math.max(0, Math.floor(seconds));
  return `${String(Math.floor(safeSeconds / 60)).padStart(2, '0')}:${String(safeSeconds % 60).padStart(2, '0')}`;
};
const formatDate = (timestamp) => new Intl.DateTimeFormat('tr-TR', { dateStyle: 'medium', timeStyle: 'short' }).format(timestamp);
const formatBytes = (bytes) => {
  if (!bytes || bytes <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
};
const icon = (name) => icons[name] || '';

const QUALITY_SETTINGS_KEY = 'velex-clip-quality-settings';

const QUALITY_PRESETS = {
  resolutions: [
    { id: 'source', label: 'Kaynak', hint: 'Orijinal ekran / pencere boyutu' },
    { id: '1080p', label: '1080p', hint: 'Full HD (Maks 1920×1080)' },
    { id: '720p', label: '720p', hint: 'HD (Maks 1280×720)' },
  ],
  fpsList: [
    { value: 60, label: '60 FPS', hint: 'Akıcı (Oyun için tavsiye edilir)' },
    { value: 30, label: '30 FPS', hint: 'Standart (Masaüstü / Tasarruf)' },
  ],
  bitrates: [
    { value: 8000000, label: '8 Mbps', hint: 'Yüksek kalite (~60 MB/dk)' },
    { value: 5000000, label: '5 Mbps', hint: 'Dengeli (~37 MB/dk)' },
    { value: 2500000, label: '2.5 Mbps', hint: 'Tasarruflu (~19 MB/dk)' },
  ],
};

function getQualitySettings() {
  try {
    const raw = localStorage.getItem(QUALITY_SETTINGS_KEY);
    if (!raw) return { resolution: 'source', fps: 60, bitrate: 8000000 };
    const data = JSON.parse(raw);
    return {
      resolution: ['source', '1080p', '720p'].includes(data.resolution) ? data.resolution : 'source',
      fps: [30, 60].includes(Number(data.fps)) ? Number(data.fps) : 60,
      bitrate: [2500000, 5000000, 8000000].includes(Number(data.bitrate)) ? Number(data.bitrate) : 8000000,
    };
  } catch {
    return { resolution: 'source', fps: 60, bitrate: 8000000 };
  }
}

function saveQualitySettings(settings) {
  try {
    localStorage.setItem(QUALITY_SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Kalite ayarları kaydedilemedi:', error);
  }
}

function openDatabase() {
  const DB_NAME = 'velex-clip-library';
  const DB_VERSION = 2;

  const tryOpen = (version) => {
    return new Promise((resolve, reject) => {
      if (!window.indexedDB) {
        return reject(new Error('IndexedDB bu ortamda desteklenmiyor.'));
      }
      const request = indexedDB.open(DB_NAME, version);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains('clips')) {
          db.createObjectStore('clips', { keyPath: 'id' });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error('Klip kitaplığı açılamadı.'));
    });
  };

  return tryOpen(DB_VERSION).then((db) => {
    if (!db.objectStoreNames.contains('clips')) {
      db.close();
      return new Promise((resolve, reject) => {
        const delReq = indexedDB.deleteDatabase(DB_NAME);
        delReq.onsuccess = delReq.onerror = () => {
          tryOpen(DB_VERSION + 1).then(resolve).catch(reject);
        };
      });
    }
    return db;
  });
}

function sourcePickerDialog() {
  return `<div class="dialog-backdrop" data-action="close-source-picker"><section class="trim-dialog source-picker-dialog" role="dialog" aria-modal="true" aria-labelledby="source-picker-title"><div class="dialog-head"><div><span class="control-label">MASAÜSTÜ YAKALAMA</span><h2 id="source-picker-title">Kayıt kaynağı seç</h2></div><button class="icon-button" data-action="close-source-picker" aria-label="Kapat">${icon('close')}</button></div><p class="picker-help">Tam ekranı, oyunu veya belirli bir uygulama penceresini seç.</p>${state.captureSources.length ? `<div class="source-picker-list">${state.captureSources.map((source) => `<button class="source-choice" data-action="select-source" data-source-id="${escapeAttribute(source.id)}"><img src="${escapeAttribute(source.thumbnail)}" alt=""><span>${escapeHtml(source.name)}</span>${source.icon ? `<img class="source-app-icon" src="${escapeAttribute(source.icon)}" alt="">` : ''}</button>`).join('')}</div>` : '<div class="queue-empty">Kayıt kaynağı bulunamadı. Kaynağı açıp tekrar dene.</div>'}<div class="dialog-actions"><button class="text-button" data-action="refresh-sources">Listeyi yenile</button><button class="outline-button" data-action="close-source-picker">İptal</button></div></section></div>`;
}

function databaseRequest(mode, action, value) {
  return new Promise((resolve, reject) => {
    if (!state.db) {
      return reject(new Error('Klip veritabanı hazır değil.'));
    }
    if (!state.db.objectStoreNames.contains('clips')) {
      return reject(new Error('Klip tablosu bulunamadı.'));
    }
    try {
      const transaction = state.db.transaction('clips', mode);
      const request = action === 'getAll'
        ? transaction.objectStore('clips').getAll()
        : transaction.objectStore('clips')[action](value);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error('Klip kitaplığına erişilemedi.'));
      transaction.onabort = () => reject(transaction.error || new Error('Klip kitaplığı işlemi tamamlanamadı.'));
    } catch (err) {
      reject(err);
    }
  });
}

async function loadClips() {
  try {
    state.clips = (await databaseRequest('readonly', 'getAll')).sort((a, b) => b.createdAt - a.createdAt);
  } catch (error) {
    console.error('Klipler yüklenirken hata oluştu:', error);
    state.clips = state.clips || [];
  }
  render();
}

function pageContent() {
  if (state.page === 'library') return libraryPage();
  if (state.page === 'cloud') return cloudPage();
  if (state.page === 'settings') return settingsPage();
  return capturePage();
}

function shell() {
  return `
    <div class="app-shell">
      <aside class="rail" aria-label="Ana menü">
        <a class="brand" href="#" data-page="capture" aria-label="Velex Clip ana sayfa">
          <span class="brand-mark"><span></span><span></span><span></span></span>
          <span class="brand-name">velex<span>clip</span></span>
        </a>
        <div class="rail-label">ÇALIŞMA ALANI</div>
        <nav class="nav-list">
          <button class="nav-item ${state.page === 'capture' ? 'active' : ''}" data-page="capture">${icon('capture')}<span>Yakalama</span><kbd>01</kbd></button>
          <button class="nav-item ${state.page === 'library' ? 'active' : ''}" data-page="library">${icon('library')}<span>Klip kitaplığı</span><kbd>${state.clips.length}</kbd></button>
          <button class="nav-item ${state.page === 'cloud' ? 'active' : ''}" data-page="cloud">${icon('cloud')}<span>Bulut aktarımı</span><i class="nav-dot"></i></button>
        </nav>
        <div class="rail-bottom">
          <div class="rail-tip"><span class="tip-led"></span><span>Yerel kayıt<br><strong>Her zaman sende</strong></span></div>
          <button class="nav-item ${state.page === 'settings' ? 'active' : ''}" data-page="settings">${icon('settings')}<span>Ayarlar</span></button>
          <button class="rail-version-btn" data-page="settings" title="Sürüm bilgisi ve güncellemeler">VELEX CLIP <span>${APP_VERSION}</span>${state.updater?.status === 'available' || state.updater?.status === 'downloaded' || state.updateResult?.hasUpdate ? '<i class="update-pulse-dot" title="Yeni sürüm mevcut!"></i>' : ''}</button>
        </div>
      </aside>
      <main class="main-area">
        <header class="topbar">
          <div class="breadcrumbs"><span>VELEX CLIP</span><b>/</b><strong>${pageTitle()}</strong></div>
          <div class="topbar-right">
            <button type="button" class="theme-toggle-btn" data-action="toggle-theme" title="${state.theme === 'dark' ? 'Açık temaya geç' : 'Siyah temaya geç'}" aria-label="Temayı değiştir">
              ${state.theme === 'dark' ? icon('sun') : icon('moon')}
              <span>${state.theme === 'dark' ? 'AÇIK TEMA' : 'SİYAH TEMA'}</span>
            </button>
            <span class="system-indicator"><i></i> SİSTEM HAZIR</span>
            <span class="topbar-divider"></span>
            <span class="avatar">V</span>
          </div>
        </header>
        ${pageContent()}
      </main>
      ${state.trimClip ? trimDialog() : ''}
      ${state.sourcePickerOpen ? sourcePickerDialog() : ''}
      ${state.renamingClip ? renameDialog() : ''}
      <div class="toast-region" aria-live="polite"></div>
    </div>`;
}

function pageTitle() {
  return ({ capture: 'Yakalama', library: 'Klip kitaplığı', cloud: 'Bulut aktarımı', settings: 'Ayarlar' })[state.page];
}

function capturePage() {
  const active = Boolean(state.recorder && state.recorder.state === 'recording');
  const elapsed = active ? (Date.now() - state.startedAt) / 1000 : 0;
  const buffered = Math.min(state.selectedSeconds, Math.max(0, elapsed));
  const percent = Math.round((buffered / state.selectedSeconds) * 100);
  const filledTicks = Math.floor((percent / 100) * 48);
  const quality = getQualitySettings();
  const qualityLabel = `${quality.fps} FPS · ${(quality.bitrate / 1000000).toFixed(0)} Mbps · ${quality.resolution === 'source' ? 'KAYNAK' : quality.resolution.toUpperCase()}`;
  return `
    <section class="workspace capture-workspace">
      <div class="page-heading">
        <div><h1>Son anı yakala.</h1><p>${active && percent < 100 ? `Tampon doluyor: şu ana kadar ${formatTime(buffered)} kaydedildi. Kayıt sürdükçe klip süresi artar.` : `Kayıt önceden başlamış gibi, son ${state.selectedSeconds} saniyen hazır.`}</p></div>
        <span class="session-chip ${active ? 'is-live' : ''}"><i></i>${active ? 'YAKALAMA AÇIK' : 'KAYNAK BEKLİYOR'}</span>
      </div>
      <div class="capture-grid">
        <section class="capture-bench" aria-label="Klip yakalama paneli">
          <div class="bench-header">
            <div class="bench-title"><span class="bench-number">A</span><h2>Yakalama istasyonu</h2></div>
            <div class="bench-meta-right">
              <button class="quality-profile-pill" data-page="settings" title="Kayıt kalitesini ve FPS ayarını değiştir">
                <span class="profile-dot"></span>
                <span class="profile-text">${qualityLabel}</span>
              </button>
              <span class="bench-serial">VX—01 / ${active ? 'REC' : 'STANDBY'}</span>
            </div>
          </div>
          <div class="source-view ${active ? 'source-live' : ''}">
            <div class="source-grid"></div>
            ${active ? '<video class="source-feed" autoplay muted playsinline></video>' : ''}
            ${active ? `<div class="source-active"><span class="recording-mark"><i></i> CANLI KAYIT</span><span class="recording-time">${formatTime(elapsed)}</span><span class="source-subtitle">${escapeHtml(state.selectedSourceName || 'Ekran ve seçilen pencere kaydediliyor')} · ${state.hasAudio ? 'Ses Açık' : 'Ses Yok'}</span></div>` : `<div class="source-empty"><span class="source-icon">${icon('capture')}</span><strong>Bir kaynak seç</strong><span>Oyun, uygulama penceresi veya ekran</span></div>`}
            <span class="viewfinder-corner top-left"></span><span class="viewfinder-corner top-right"></span><span class="viewfinder-corner bottom-left"></span><span class="viewfinder-corner bottom-right"></span>
            <span class="source-label">${active ? `SOURCE 01 · ${quality.fps}FPS · ${state.hasAudio ? 'AUDIO ON' : 'VIDEO ONLY'}` : `STANDBY · ${quality.fps}FPS`}</span>
          </div>
          <div class="bench-controls">
            <div class="setting-row">
              <div><span class="control-label">GERİ SARMA SÜRESİ</span><span class="control-hint">Kısayol bu kadarını klibe dönüştürür</span></div>
              <div class="duration-select" role="group" aria-label="Geri sarma süresi">
                ${[15, 30, 60, 120].map((seconds) => `<button class="duration-option ${state.selectedSeconds === seconds ? 'selected' : ''}" data-duration="${seconds}" ${active ? 'disabled' : ''}>${seconds}<small>sn</small></button>`).join('')}
              </div>
            </div>
            <label class="audio-toggle"><input id="capture-audio" type="checkbox" ${active ? 'disabled' : ''}><span class="toggle-track"></span><span class="toggle-copy"><strong>Sistem sesini yakala</strong><small>Kaynak pencere destekliyorsa ses de kaydedilir</small></span></label>
          </div>
          <div class="bench-footer">
            <button class="source-button" data-action="${active ? 'stop' : 'start'}">${active ? '<span class="stop-square"></span> Kaydı durdur' : `${icon('plus')} ${window.velexDesktop ? 'Ekran veya pencere seç' : 'Kaynak seç'}`}</button>
            <button class="save-button" data-action="save" ${!active || percent < 1 ? 'disabled' : ''}>${icon('capture')} <span>Klip al</span><kbd>Ctrl&nbsp;Shift&nbsp;S</kbd></button>
          </div>
        </section>
        <aside class="rewind-panel">
          <div class="rewind-head"><span class="control-label">GERİ SARMA BANDI</span><span class="rewind-live"><i></i>${active ? 'TAMPON DOLUYOR' : 'BEKLEMEDE'}</span></div>
          <div class="rewind-readout"><strong>${formatTime(buffered)}</strong><span>/ ${formatTime(state.selectedSeconds)}</span></div>
          <div class="rewind-track" aria-label="Kayıt tamponu doluluk oranı"><div class="track-markers">${Array.from({ length: 9 }, (_, index) => `<span>${formatTime(Math.round(state.selectedSeconds * index / 8))}</span>`).join('')}</div><div class="track-bar"><div class="track-fill" style="transform:scaleX(${percent / 100})"></div><div class="track-ticks">${Array.from({ length: 48 }, (_, index) => `<i class="${index < filledTicks ? 'filled' : ''}"></i>`).join('')}</div><span class="playhead" style="left:${percent}%"></span></div></div>
          <div class="rewind-foot"><span>${active ? `${Math.max(0, state.selectedSeconds - buffered).toFixed(0)} sn daha dolduruluyor` : 'Kayıt kaynağı başlatılmadı'}</span><span>${percent}%</span></div>
          <div class="shortcut-note"><kbd>CTRL</kbd><b>+</b><kbd>SHIFT</kbd><b>+</b><kbd>S</kbd><span>Klip al</span></div>
          <p class="permission-note">${active ? 'Sekme açık kaldığı sürece tampon kayıt devam eder.' : 'Tarayıcı, ekran paylaşımı için iznini isteyecek. Kaydı istediğin zaman durdurabilirsin.'}</p>
        </aside>
      </div>
      <section class="recent-strip">
        <div class="strip-title"><div><span class="control-label">YEREL KİTAPLIK</span><h2>Son klipler</h2></div><button class="text-button" data-page="library">Tümünü gör ${icon('arrow')}</button></div>
        ${state.clips.length ? `<div class="recent-list">${state.clips.slice(0, 3).map((clip) => recentClip(clip)).join('')}</div>` : `<div class="empty-recent"><span class="empty-index">—</span><span>İlk klibini aldığında burada görünecek.</span></div>`}
      </section>
      <div class="platform-note">${window.velexDesktop ? 'Masaüstü modu: pencereyi kapatırsan kayıt tepsiye küçülerek sürer. Global Ctrl+Shift+S ile klip alabilir, sistem tepsisinden kaydı durdurabilirsin.' : 'Tarayıcı modu sınırı: sayfa açıkken yakalama ve sayfa odaklı kısayol. Arka planda / global kısayolla kullanım masaüstü uygulama entegrasyonu gerektirir.'}</div>
    </section>`;
}

function recentClip(clip) {
  return `<article class="recent-item"><div class="recent-thumb"><span class="thumb-play">${icon('play')}</span></div><div class="recent-details"><strong>${escapeHtml(clip.name)}</strong><span>${formatDate(clip.createdAt)} · ${formatTime(clip.duration)}</span></div><button class="icon-button" data-action="trim" data-id="${clip.id}" aria-label="${escapeHtml(clip.name)} klibini düzenle">${icon('arrow')}</button></article>`;
}

function getFilteredClips() {
  let list = [...state.clips];
  if (state.searchQuery.trim()) {
    const q = state.searchQuery.trim().toLowerCase();
    list = list.filter((clip) => clip.name.toLowerCase().includes(q));
  }
  if (state.filterStatus === 'cloud') {
    list = list.filter((clip) => Boolean(clip.uploadedAt));
  } else if (state.filterStatus === 'local') {
    list = list.filter((clip) => !clip.uploadedAt);
  }
  if (state.sortBy === 'oldest') {
    list.sort((a, b) => a.createdAt - b.createdAt);
  } else if (state.sortBy === 'duration') {
    list.sort((a, b) => b.duration - a.duration);
  } else if (state.sortBy === 'size') {
    list.sort((a, b) => b.blob.size - a.blob.size);
  } else {
    list.sort((a, b) => b.createdAt - a.createdAt);
  }
  return list;
}

function renameDialog() {
  const clip = state.renamingClip;
  if (!clip) return '';
  return `<div class="dialog-backdrop" data-action="close-rename"><section class="trim-dialog rename-dialog" role="dialog" aria-modal="true" aria-labelledby="rename-title"><div class="dialog-head"><div><span class="control-label">KİTAPLIK YÖNETİMİ</span><h2 id="rename-title">Klibi yeniden adlandır</h2></div><button class="icon-button" data-action="close-rename" aria-label="Kapat">${icon('close')}</button></div><form id="rename-form" class="rename-form"><label><span>YENİ KLİP ADI</span><input id="rename-input" type="text" maxlength="80" value="${escapeAttribute(clip.name)}" required autofocus></label><div class="dialog-actions"><button class="text-button" type="button" data-action="close-rename">İptal</button><button class="save-button" type="submit">Kaydet ${icon('arrow')}</button></div></form></section></div>`;
}

function libraryPage() {
  const filtered = getFilteredClips();
  const hasClips = state.clips.length > 0;
  return `<section class="workspace library-workspace"><div class="page-heading"><div><h1>Klip kitaplığı</h1><p>Kliplerin bu cihazda saklanır. Yeniden adlandırabilir, filtreleyebilir veya dışa aktarabilirsin.</p></div><span class="library-count">${String(filtered.length).padStart(2, '0')} <small>/ ${state.clips.length} KLİP</small></span></div>${hasClips ? `<div class="library-controls-bar"><div class="library-search-box"><span class="search-icon">${icon('search')}</span><input id="library-search" class="library-search-input" type="search" placeholder="Klip adıyla ara..." value="${escapeAttribute(state.searchQuery)}">${state.searchQuery ? `<button class="clear-search-btn" data-action="clear-search" aria-label="Aramayı temizle">${icon('close')}</button>` : ''}</div><div class="library-filter-group"><div class="filter-pills" role="radiogroup" aria-label="Aktarım durumu filtresi"><button class="filter-pill ${state.filterStatus === 'all' ? 'active' : ''}" data-filter-status="all">Tümü (${state.clips.length})</button><button class="filter-pill ${state.filterStatus === 'local' ? 'active' : ''}" data-filter-status="local">Yalnızca Cihazda</button><button class="filter-pill ${state.filterStatus === 'cloud' ? 'active' : ''}" data-filter-status="cloud">Bulutta Aktarılmış</button></div><div class="sort-select-wrapper"><label for="library-sort" class="sort-label">SIRALA:</label><select id="library-sort" class="library-sort-select"><option value="newest" ${state.sortBy === 'newest' ? 'selected' : ''}>En yeni</option><option value="oldest" ${state.sortBy === 'oldest' ? 'selected' : ''}>En eski</option><option value="duration" ${state.sortBy === 'duration' ? 'selected' : ''}>Süre (En uzun)</option><option value="size" ${state.sortBy === 'size' ? 'selected' : ''}>Boyut (En büyük)</option></select></div></div></div>${filtered.length ? `<div class="clip-list">${filtered.map((clip) => clipRow(clip)).join('')}</div>` : `<div class="library-empty filter-empty"><h2>Eşleşen klip bulunamadı.</h2><p>"${escapeHtml(state.searchQuery)}" araması veya seçili filtre ile eşleşen klip yok.</p><button class="outline-button" data-action="reset-filters">Filtreleri temizle</button></div>`}` : `<div class="library-empty"><div class="empty-graphic"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div><h2>Burada henüz klip yok.</h2><p>Yakalama istasyonuna dön, bir ekran seç ve istediğin anı kaydet.</p><button class="source-button" data-page="capture">${icon('capture')} Yakalamaya dön</button></div>`}</section>`;
}

function clipRow(clip) {
  const url = URL.createObjectURL(clip.blob);
  state.objectUrls.push(url);
  return `<article class="clip-row"><div class="clip-preview"><video src="${url}" preload="metadata" controls aria-label="${escapeHtml(clip.name)} önizlemesi"></video><span class="duration-badge">${formatTime(clip.duration)}</span></div><div class="clip-meta"><div class="clip-name-wrap"><strong title="${escapeAttribute(clip.name)}">${escapeHtml(clip.name)}</strong><button class="icon-button rename-icon-btn" data-action="open-rename" data-id="${clip.id}" title="Adı değiştir" aria-label="${escapeHtml(clip.name)} adını değiştir">${icon('edit')}</button></div><span>${formatDate(clip.createdAt)} · ${Math.round(clip.blob.size / 1024 / 1024 * 10) / 10} MB</span><div class="clip-badges"><span class="local-badge"><i></i> BU CİHAZDA</span>${clip.uploadedAt ? `<span class="cloud-badge"><i></i> BULUTTA AKTARILDI</span>` : ''}</div></div><div class="clip-actions"><button class="outline-button" data-action="download" data-id="${clip.id}">${icon('download')} İndir</button><button class="outline-button" data-action="trim" data-id="${clip.id}">Düzenle</button><button class="outline-button upload-action ${clip.uploadedAt ? 'uploaded' : ''}" data-action="upload" data-id="${clip.id}">${icon('upload')} ${clip.uploadedAt ? 'Tekrar aktar' : 'Buluta aktar'}</button><button class="icon-button danger-icon" data-action="delete" data-id="${clip.id}" aria-label="Klibi sil">${icon('trash')}</button></div></article>`;
}

function cloudPage() {
  const activeProvider = getActiveCloudProvider();
  const isConfigured = activeProvider.configured;
  const testFeedback = state.connectionTestResult ? `
    <div class="test-feedback ${state.connectionTestResult.success ? 'success' : 'error'}" role="alert">
      <div class="feedback-title">${state.connectionTestResult.success ? '✓ BAĞLANTI BAŞARILI' : '⚠ BAĞLANTI BAŞARISIZ'}</div>
      <p>${escapeHtml(state.connectionTestResult.message)}</p>
      ${state.connectionTestResult.hint ? `<div class="feedback-hint">${escapeHtml(state.connectionTestResult.hint)}</div>` : ''}
    </div>
  ` : '';

  return `<section class="workspace cloud-workspace"><div class="page-heading"><div><h1>Bulut Aktarımı</h1><p>Klipleriniz önce bu cihazda saklanır. Seçtiğiniz bulut sağlayıcısına tek tıkla doğrudan aktarabilirsiniz.</p></div><div class="cloud-header-status"><span class="provider-pill-badge">${escapeHtml(activeProvider.name)}</span><span class="cloud-state ${isConfigured ? 'configured' : ''}"><i></i>${isConfigured ? 'BAĞLANTI HAZIR' : 'ANAHTAR BEKLENİYOR'}</span></div></div><div class="cloud-provider-bar"><div class="cloud-bar-left"><span class="control-label">AKTİF BULUT:</span><div class="cloud-pill-selector" role="radiogroup" aria-label="Aktif Bulut Sağlayıcısı">${Object.values(EMBEDDED_PROVIDERS).map((p) => `<button type="button" class="cloud-pill-btn ${p.id === activeProvider.id ? 'active' : ''} ${p.configured ? '' : 'pending'}" data-action="select-cloud-provider" data-provider-id="${p.id}"><span>${escapeHtml(p.name)}</span><small>${p.configured ? '✓ Hazır' : '⏳ Bekliyor'}</small></button>`).join('')}</div></div><div class="cloud-bar-actions"><button type="button" class="outline-button test-active-cloud-btn" data-action="test-active-cloud" ${state.testingConnection || !isConfigured ? 'disabled' : ''}>${state.testingConnection ? 'Test Ediliyor…' : '⚡ Bağlantıyı Test Et'}</button><button type="button" class="outline-button" data-page="settings">${icon('settings')} Ayarlar</button></div></div>${testFeedback}<section class="cloud-queue full-width-queue"><div class="queue-heading"><span class="control-label">AKTARILMAYA HAZIR KLİPLER</span><span>${state.clips.length} KLİP</span></div>${state.clips.length ? state.clips.map((clip) => `<div class="queue-row"><div class="queue-info"><strong>${escapeHtml(clip.name)}</strong><div class="queue-meta"><span>${Math.round(clip.blob.size / 1024 / 1024 * 10) / 10} MB · ${formatDate(clip.createdAt)}</span>${clip.uploadedAt ? `<span class="queue-status-badge uploaded"><i></i> Aktarıldı (${formatDate(clip.uploadedAt)})</span>` : '<span class="queue-status-badge"><i></i> Cihazda bekliyor</span>'}</div></div><button class="outline-button upload-action ${clip.uploadedAt ? 'uploaded' : ''}" data-action="upload" data-id="${clip.id}" ${isConfigured ? '' : 'disabled'}>${icon('upload')} ${clip.uploadedAt ? 'Tekrar Aktar' : 'Buluta Aktar'}</button></div>`).join('') : '<div class="queue-empty">Aktarım kuyruğu boş. Yakaladığınız yeni klipler burada listelenir.</div>'}</section></section>`;
}

function settingsPage() {
  const activeProvider = getActiveCloudProvider();
  const quality = getQualitySettings();
  const updateSettings = getUpdateSettings();
  const updateInfo = state.updateResult || updateSettings.lastResult;
  const testFeedback = state.connectionTestResult ? `
    <div class="test-feedback ${state.connectionTestResult.success ? 'success' : 'error'}" role="alert">
      <div class="feedback-title">${state.connectionTestResult.success ? '✓ BAĞLANTI BAŞARILI' : '⚠ BAĞLANTI BAŞARISIZ'}</div>
      <p>${escapeHtml(state.connectionTestResult.message)}</p>
      ${state.connectionTestResult.hint ? `<div class="feedback-hint">${escapeHtml(state.connectionTestResult.hint)}</div>` : ''}
    </div>` : '';

  const u = state.updater;
  const isUpdating = u.status === 'checking' || u.status === 'downloading';

  let statusBadgeHtml = '';
  if (u.status === 'available') {
    statusBadgeHtml = '<span class="update-badge-pill update">⚡ YENİ SÜRÜM BULUNDU</span>';
  } else if (u.status === 'downloading') {
    statusBadgeHtml = '<span class="update-badge-pill update">📥 İNDİRİLİYOR</span>';
  } else if (u.status === 'downloaded') {
    statusBadgeHtml = '<span class="update-badge-pill current">✓ KURULUMA HAZIR</span>';
  } else if (u.status === 'not-available') {
    statusBadgeHtml = '<span class="update-badge-pill current">✓ GÜNCEL</span>';
  } else if (updateInfo?.hasUpdate) {
    statusBadgeHtml = '<span class="update-badge-pill update">⚡ YENİ SÜRÜM VAR</span>';
  } else if (updateInfo?.success) {
    statusBadgeHtml = '<span class="update-badge-pill current">✓ GÜNCEL</span>';
  }

  let updateBannerHtml = '';
  if (u.status === 'checking') {
    updateBannerHtml = `<div class="update-banner" role="status"><div class="update-banner-head"><div class="banner-title"><span class="update-pulse-dot"></span><strong>Güncellemeler denetleniyor…</strong></div></div></div>`;
  } else if (u.status === 'available') {
    updateBannerHtml = `<div class="update-banner update-available" role="alert"><div class="update-banner-head"><div class="banner-title"><span class="update-pulse-dot"></span><strong>Yeni Sürüm Bulundu: v${escapeHtml(u.version)}</strong>${u.releaseDate ? `<span class="release-date">(${formatDate(u.releaseDate)})</span>` : ''}</div><button type="button" class="save-button download-update-btn" data-action="download-update">${icon('download')} Güncellemeyi İndir</button></div>${u.releaseNotes ? `<div class="update-notes-box"><span class="control-label">SÜRÜM NOTLARI</span><p>${escapeHtml(u.releaseNotes)}</p></div>` : ''}</div>`;
  } else if (u.status === 'downloading') {
    const p = u.progress || { percent: 0, bytesPerSecond: 0, transferred: 0, total: 0 };
    updateBannerHtml = `<div class="update-banner update-downloading" role="status"><div class="update-banner-head"><div class="banner-title"><span class="update-pulse-dot"></span><strong>Güncelleme İndiriliyor: %${p.percent}</strong></div><span class="updater-speed">${formatBytes(p.bytesPerSecond)}/sn</span></div><div class="updater-progress-track"><div class="updater-progress-bar" style="width: ${p.percent}%"></div></div><div class="updater-progress-meta"><span>${formatBytes(p.transferred)} / ${formatBytes(p.total)}</span><span>%${p.percent}</span></div></div>`;
  } else if (u.status === 'downloaded') {
    updateBannerHtml = `<div class="update-banner update-downloaded" role="status"><div class="update-banner-head"><div class="banner-title"><span class="status-check-icon">${icon('check')}</span><div><strong>Güncelleme İndirildi!</strong><p>Yeni sürüm (v${escapeHtml(u.version)}) kuruluma hazır.</p></div></div><button type="button" class="save-button quit-install-btn" data-action="quit-and-install">🚀 Yeniden Başlat ve Yükle</button></div></div>`;
  } else if (u.status === 'not-available') {
    updateBannerHtml = `<div class="update-banner up-to-date" role="status"><span class="status-check-icon">${icon('check')}</span><div><strong>Velex Clip güncel!</strong><p>En son kararlı sürümü (v${APP_VERSION}) kullanıyorsunuz.</p></div></div>`;
  } else if (u.status === 'dev') {
    updateBannerHtml = `<div class="update-banner update-error" role="status"><strong>Geliştirici Modu:</strong><p>${escapeHtml(u.error || 'Geliştirme modunda güncelleme denetimi çalışmaz; kurulu/paketlenmiş uygulama gerekir.')}</p></div>`;
  } else if (u.status === 'error' && u.error) {
    updateBannerHtml = `<div class="update-banner update-error" role="alert"><strong>Güncelleme denetlenemedi:</strong><p>${escapeHtml(u.error)}</p></div>`;
  } else if (updateInfo) {
    if (updateInfo.success && updateInfo.hasUpdate) {
      updateBannerHtml = `<div class="update-banner update-available" role="alert"><div class="update-banner-head"><div class="banner-title"><span class="update-pulse-dot"></span><strong>Yeni Sürüm Mevcut: v${escapeHtml(updateInfo.latestVersion)}</strong>${updateInfo.publishedAt ? `<span class="release-date">(${formatDate(updateInfo.publishedAt)})</span>` : ''}</div><button type="button" class="save-button download-update-btn" data-action="download-update">${icon('download')} Güncellemeyi İndir</button></div>${updateInfo.notes ? `<div class="update-notes-box"><span class="control-label">SÜRÜM NOTLARI</span><p>${escapeHtml(updateInfo.notes)}</p></div>` : ''}</div>`;
    } else if (updateInfo.success && !updateInfo.hasUpdate) {
      updateBannerHtml = `<div class="update-banner up-to-date" role="status"><span class="status-check-icon">${icon('check')}</span><div><strong>Velex Clip güncel!</strong><p>En son kararlı sürümü (v${APP_VERSION}) kullanıyorsunuz.</p></div></div>`;
    } else if (!updateInfo.success && updateInfo.error) {
      updateBannerHtml = `<div class="update-banner update-error" role="alert"><strong>Güncelleme denetlenemedi:</strong><p>${escapeHtml(updateInfo.error)}</p></div>`;
    }
  }

  const providers = Object.values(EMBEDDED_PROVIDERS);

  return `<section class="workspace settings-workspace"><div class="page-heading"><div><h1>Ayarlar</h1><p>Arayüz temasını belirle, kayıt kalitesi profilini ayarla, bulut sağlayıcısını seç ve güncellemeleri denetle.</p></div></div><div class="settings-layout"><div class="settings-form-column"><section class="quality-card theme-card" aria-label="Arayüz ve Tema Ayarları"><div class="quality-card-head"><div><span class="control-label">GÖRÜNÜM AYARLARI</span><h2>Arayüz Teması</h2></div><span class="theme-active-badge">${state.theme === 'dark' ? '🌙 KOYU GRAFİT (SİYAH)' : '☀️ AÇIK TEMA'}</span></div><p class="quality-card-desc">Uygulamanın renk temasını seçin. Siyah tema göz yorgunluğunu azaltır ve gece kullanımı için yüksek kontrastlı net yazılar sunar.</p><div class="theme-btn-grid" role="radiogroup" aria-label="Arayüz teması"><button type="button" class="theme-choice-btn ${state.theme === 'dark' ? 'active' : ''}" data-action="set-theme" data-theme-val="dark"><div class="theme-btn-title">${icon('moon')}<strong>Koyu Grafit (Siyah)</strong></div><small>Modern slate siyahı (#0d1117 / #161f2e), parlak ve net yazılar</small></button><button type="button" class="theme-choice-btn ${state.theme === 'light' ? 'active' : ''}" data-action="set-theme" data-theme-val="light"><div class="theme-btn-title">${icon('sun')}<strong>Açık Tema (Klasik)</strong></div><small>Standart açık kağıt tonları (#f3f3ef), gündüz çalışma ortamı</small></button></div></section><section class="quality-card" aria-label="Kayıt kalitesi ve kodlama ayarları"><div class="quality-card-head"><div><span class="control-label">YAKALAMA &amp; KODLAMA PROFİLİ</span><h2>Kayıt Kalitesi ve Dışa Aktarma</h2></div><span class="quality-active-badge">${quality.fps} FPS · ${(quality.bitrate / 1000000).toFixed(0)} MBPS · ${quality.resolution === 'source' ? 'KAYNAK' : quality.resolution.toUpperCase()}</span></div><p class="quality-card-desc">Geri sarma tamponu ve kütüphaneden indirilen/kırpılan klipler bu kare hızı ve veri akış hızıyla kodlanır.</p><div class="quality-grid"><div class="quality-group"><span class="quality-group-label">KARE HIZI (FPS)</span><div class="quality-btn-row" role="radiogroup" aria-label="Kare hızı">${QUALITY_PRESETS.fpsList.map((item) => `<button type="button" class="quality-btn ${quality.fps === item.value ? 'active' : ''}" data-quality-key="fps" data-quality-value="${item.value}"><strong>${item.label}</strong><small>${item.hint}</small></button>`).join('')}</div></div><div class="quality-group"><span class="quality-group-label">ÇÖZÜNÜRLÜK</span><div class="quality-btn-row" role="radiogroup" aria-label="Çözünürlük">${QUALITY_PRESETS.resolutions.map((item) => `<button type="button" class="quality-btn ${quality.resolution === item.id ? 'active' : ''}" data-quality-key="resolution" data-quality-value="${item.id}"><strong>${item.label}</strong><small>${item.hint}</small></button>`).join('')}</div></div><div class="quality-group"><span class="quality-group-label">VİDEO BİTRATE (VERİ HIZI)</span><div class="quality-btn-row" role="radiogroup" aria-label="Bitrate">${QUALITY_PRESETS.bitrates.map((item) => `<button type="button" class="quality-btn ${quality.bitrate === item.value ? 'active' : ''}" data-quality-key="bitrate" data-quality-value="${item.value}"><strong>${item.label}</strong><small>${item.hint}</small></button>`).join('')}</div></div></div></section><section class="quality-card cloud-storage-card" aria-label="Bulut Depolama Sağlayıcıları"><div class="quality-card-head"><div><span class="control-label">BULUT DEPOLAMA MERKEZİ</span><h2>Bulut Depolama Sağlayıcıları</h2></div><span class="cloud-status-badge ${activeProvider.configured ? 'ready' : 'pending'}">${escapeHtml(activeProvider.name)} Seçili</span></div><p class="quality-card-desc">Tüm sağlayıcılar uygulamaya doğrudan gömülüdür. Form doldurmanıza veya karmaşık ayarlar yapmanıza gerek yoktur. İstediğiniz sağlayıcıyı seçip tek tıkla kullanabilirsiniz.</p>${testFeedback}<div class="embedded-provider-list">${providers.map((p) => {
    const isSelected = p.id === activeProvider.id;
    return `<div class="embedded-provider-row ${isSelected ? 'active' : ''}"><div class="provider-info-wrap"><div class="provider-title-row"><strong>${escapeHtml(p.name)}</strong><span class="no-card-pill">${escapeHtml(p.badge)}</span>${isSelected ? '<span class="active-pill">✓ AKTİF</span>' : ''}</div><span class="provider-quota-sub">${escapeHtml(p.quota)} · ${p.configured ? 'Bağlantı Hazır' : 'Anahtar Bekleniyor'}</span></div><div class="provider-row-actions"><button type="button" class="outline-button select-cloud-btn ${isSelected ? 'is-active' : ''}" data-action="select-cloud-provider" data-provider-id="${p.id}">${isSelected ? '✓ Seçili' : 'Kullan'}</button></div></div>`;
  }).join('')}</div><div class="cloud-footer-actions"><button type="button" class="outline-button test-active-cloud-btn" data-action="test-active-cloud" ${state.testingConnection || !activeProvider.configured ? 'disabled' : ''}>${state.testingConnection ? 'Test Ediliyor…' : `⚡ ${escapeHtml(activeProvider.name)} Bağlantısını Test Et`}</button></div></section><section class="quality-card update-card" aria-label="Sürüm ve güncelleme denetleme"><div class="quality-card-head"><div><span class="control-label">YAZILIM GÜNCELLEMELERİ</span><h2>Sürüm ve Güncelleme Denetleyici</h2></div><div class="version-head-badge"><span class="version-badge">v${APP_VERSION}</span>${statusBadgeHtml}</div></div><p class="quality-card-desc">Velex Clip, resmi GitHub deponuzdaki (<strong>${escapeHtml(updateSettings.githubRepo || OFFICIAL_GITHUB_REPO)}</strong>) yeni yayınları ve kurulum dosyalarını otomatik denetler.</p>${updateBannerHtml}<div class="update-settings-form"><div class="embedded-repo-box"><div class="embedded-repo-info"><span class="control-label">GÖMÜLÜ RESMİ DAĞITIM KANALI</span><div class="repo-name-row"><span class="repo-icon">⚡</span><strong>github.com/${escapeHtml(updateSettings.githubRepo || OFFICIAL_GITHUB_REPO)}</strong><span class="embedded-pill">Otomatik Bağlı</span></div></div><button type="button" class="outline-button check-update-btn" data-action="check-updates" ${isUpdating || state.checkingUpdate ? 'disabled' : ''}>${isUpdating || state.checkingUpdate ? 'Denetleniyor…' : `${icon('arrow')} Şimdi Güncellemeleri Denetle`}</button></div><div class="update-actions-bar"><span class="last-checked-label">${updateSettings.lastCheckedAt ? `Son denetleme: ${formatDate(updateSettings.lastCheckedAt)}` : 'Açılışta otomatik denetlenir'}</span><button type="button" class="text-link-button" data-action="open-download" data-url="https://github.com/${escapeAttribute(updateSettings.githubRepo || OFFICIAL_GITHUB_REPO)}/releases">GitHub Releases Sayfasını Aç ↗</button></div></div></section></div></div></section>`;
}

function trimDialog() {
  const clip = state.trimClip;
  const url = URL.createObjectURL(clip.blob);
  state.trimUrl = url;
  const estMb = Math.round(clip.blob.size / 1024 / 1024 * 10) / 10;
  return `<div class="dialog-backdrop" data-action="close-trim"><section class="trim-dialog" role="dialog" aria-modal="true" aria-labelledby="trim-title"><div class="dialog-head"><div><span class="control-label">GELİŞMİŞ DÜZENLEME &amp; KIRPMA</span><h2 id="trim-title">Klibi Kırp</h2></div><button class="icon-button" data-action="close-trim" aria-label="Kapat">${icon('close')}</button></div><video class="trim-preview" src="${url}" controls playsinline></video><div class="trim-meta-bar"><span class="trim-filename"><strong>${escapeHtml(clip.name)}</strong> · ${formatTime(clip.duration)} (${clip.duration.toFixed(1)} sn)</span><span class="trim-filesize">${estMb} MB</span></div><div class="trim-timeline-box"><div class="trim-timeline-head"><span class="control-label">İNTERAKTİF ZAMAN ÇİZELGESİ</span><span class="trim-stats-readout">Kırpılacak: <strong id="trim-duration-badge">${clip.duration.toFixed(1)} sn (~${estMb} MB)</strong></span></div><div class="trim-timeline-track"><div class="trim-track-bg"></div><div class="trim-track-fill" id="trim-track-fill" style="left:0%;width:100%;"></div><div class="trim-playhead" id="trim-playhead" style="left:0%;"></div><input type="range" id="trim-slider-start" min="0" max="${clip.duration}" step="0.05" value="0" aria-label="Başlangıç noktası"><input type="range" id="trim-slider-end" min="0" max="${clip.duration}" step="0.05" value="${clip.duration}" aria-label="Bitiş noktası"></div><div class="trim-track-ticks"><span>00:00</span><span>${formatTime(clip.duration * 0.25)}</span><span>${formatTime(clip.duration * 0.5)}</span><span>${formatTime(clip.duration * 0.75)}</span><span>${formatTime(clip.duration)}</span></div></div><div class="trim-quick-actions"><button type="button" class="outline-button" data-action="trim-set-start" title="Videodaki geçerli kareyi başlangıç noktası yap">📍 Burayı Başlangıç Yap</button><button type="button" class="outline-button play-selection-btn" data-action="trim-preview-selection" title="Yalnızca seçilen aralığı oynat">▶ Seçimi Oynat</button><button type="button" class="outline-button" data-action="trim-set-end" title="Videodaki geçerli kareyi bitiş noktası yap">Burayı Bitiş Yap 📍</button></div><div class="trim-fields"><label><span>BAŞLANGIÇ (sn)</span><input id="trim-start" type="number" min="0" max="${clip.duration}" step="0.1" value="0"></label><label><span>BİTİŞ (sn)</span><input id="trim-end" type="number" min="0.1" max="${clip.duration}" step="0.1" value="${clip.duration.toFixed(1)}"></label></div><p class="trim-help">Kırpılan aralık yeni bir WebM klibi olarak kitaplığınıza eklenir; özgün klip değişmeden korunur.</p><div class="dialog-actions"><button class="text-button" data-action="close-trim">İptal</button><button class="save-button" data-action="apply-trim" data-id="${clip.id}">Yeni kırpılmış klip oluştur ${icon('arrow')}</button></div></section></div>`;
}

function bindTrimControls() {
  if (!state.trimClip) return;
  const clip = state.trimClip;
  const video = app.querySelector('.trim-preview');
  const sliderStart = app.querySelector('#trim-slider-start');
  const sliderEnd = app.querySelector('#trim-slider-end');
  const inputStart = app.querySelector('#trim-start');
  const inputEnd = app.querySelector('#trim-end');
  const trackFill = app.querySelector('#trim-track-fill');
  const playhead = app.querySelector('#trim-playhead');
  const durationBadge = app.querySelector('#trim-duration-badge');

  if (!sliderStart || !sliderEnd || !inputStart || !inputEnd || !video) return;

  const updateVisuals = () => {
    let s = Number(inputStart.value);
    let e = Number(inputEnd.value);
    if (!Number.isFinite(s) || s < 0) s = 0;
    if (!Number.isFinite(e) || e > clip.duration) e = clip.duration;
    if (s >= e) s = Math.max(0, e - 0.1);

    const left = (s / clip.duration) * 100;
    const width = ((e - s) / clip.duration) * 100;
    if (trackFill) {
      trackFill.style.left = `${left}%`;
      trackFill.style.width = `${width}%`;
    }
    if (durationBadge) {
      const dur = Math.max(0.1, e - s);
      const estMb = Math.round((dur / clip.duration) * (clip.blob.size / 1024 / 1024) * 10) / 10;
      durationBadge.textContent = `${dur.toFixed(1)} sn (~${estMb} MB)`;
    }
  };

  sliderStart.addEventListener('input', () => {
    let s = Number(sliderStart.value);
    let e = Number(sliderEnd.value);
    if (s >= e) {
      s = Math.max(0, e - 0.2);
      sliderStart.value = String(s);
    }
    inputStart.value = s.toFixed(1);
    video.currentTime = s;
    updateVisuals();
  });

  sliderEnd.addEventListener('input', () => {
    let s = Number(sliderStart.value);
    let e = Number(sliderEnd.value);
    if (e <= s) {
      e = Math.min(clip.duration, s + 0.2);
      sliderEnd.value = String(e);
    }
    inputEnd.value = e.toFixed(1);
    video.currentTime = e;
    updateVisuals();
  });

  inputStart.addEventListener('input', () => {
    let s = Number(inputStart.value);
    let e = Number(inputEnd.value);
    if (Number.isFinite(s) && s >= 0 && s < e) {
      sliderStart.value = String(s);
      video.currentTime = s;
      updateVisuals();
    }
  });

  inputEnd.addEventListener('input', () => {
    let s = Number(inputStart.value);
    let e = Number(inputEnd.value);
    if (Number.isFinite(e) && e <= clip.duration && e > s) {
      sliderEnd.value = String(e);
      video.currentTime = e;
      updateVisuals();
    }
  });

  video.addEventListener('timeupdate', () => {
    if (playhead) {
      const pct = (video.currentTime / clip.duration) * 100;
      playhead.style.left = `${pct}%`;
    }
  });

  updateVisuals();
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
}

function escapeAttribute(value) {
  return escapeHtml(value || '');
}

function render() {
  state.objectUrls.forEach(URL.revokeObjectURL);
  state.objectUrls = [];
  if (state.trimUrl) URL.revokeObjectURL(state.trimUrl);
  state.trimUrl = null;
  app.innerHTML = shell();
  bindEvents();
  if (state.stream) {
    const preview = app.querySelector('.source-feed');
    if (preview) {
      preview.srcObject = state.stream;
      preview.play().catch((error) => showToast(`Canlı önizleme başlatılamadı: ${error.message}`, 'error'));
    }
  }
}

function updateCaptureReadout() {
  const workspace = app.querySelector('.capture-workspace');
  if (!workspace) return;
  const elapsed = Math.max(0, (Date.now() - state.startedAt) / 1000);
  const buffered = Math.min(state.selectedSeconds, elapsed);
  const percent = Math.round((buffered / state.selectedSeconds) * 100);
  const filledTicks = Math.floor((percent / 100) * 48);
  workspace.querySelector('.recording-time').textContent = formatTime(elapsed);
  workspace.querySelector('.rewind-readout strong').textContent = formatTime(buffered);
  workspace.querySelector('.track-fill').style.transform = `scaleX(${percent / 100})`;
  workspace.querySelector('.playhead').style.left = `${percent}%`;
  workspace.querySelectorAll('.track-ticks i').forEach((tick, index) => tick.classList.toggle('filled', index < filledTicks));
  workspace.querySelector('.rewind-foot span:first-child').textContent = `${Math.max(0, state.selectedSeconds - buffered).toFixed(0)} sn daha dolduruluyor`;
  workspace.querySelector('.rewind-foot span:last-child').textContent = `${percent}%`;
  const saveButton = workspace.querySelector('[data-action="save"]');
  if (saveButton) saveButton.disabled = percent < 1 || state.saving;
}

function showToast(message, type = 'success') {
  const region = document.querySelector('.toast-region');
  if (!region) return;
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  region.append(toast);
  window.setTimeout(() => toast.remove(), 4200);
}

function bindEvents() {
  app.querySelectorAll('[data-page]').forEach((button) => button.addEventListener('click', (event) => {
    event.preventDefault();
    state.page = button.dataset.page;
    render();
  }));
  app.querySelectorAll('[data-duration]').forEach((button) => button.addEventListener('click', () => {
    state.selectedSeconds = Number(button.dataset.duration);
    localStorage.setItem('velex-clip-replay-seconds', String(state.selectedSeconds));
    render();
  }));
  app.querySelectorAll('[data-quality-key]').forEach((button) => button.addEventListener('click', () => {
    const key = button.dataset.qualityKey;
    let value = button.dataset.qualityValue;
    if (key === 'fps' || key === 'bitrate') value = Number(value);
    const current = getQualitySettings();
    current[key] = value;
    saveQualitySettings(current);
    const label = button.querySelector('strong')?.textContent || value;
    showToast(`Kalite ayarı güncellendi: ${label}`);
    render();
  }));
  app.querySelectorAll('[data-action]').forEach((button) => button.addEventListener('click', (event) => {
    if (button.classList.contains('dialog-backdrop') && event.target !== button) return;
    handleAction(button);
  }));
  app.querySelectorAll('[data-filter-status]').forEach((button) => button.addEventListener('click', () => {
    state.filterStatus = button.dataset.filterStatus;
    render();
  }));
  const searchInput = app.querySelector('#library-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      const cursor = e.target.selectionStart;
      render();
      const updated = app.querySelector('#library-search');
      if (updated) {
        updated.focus();
        updated.setSelectionRange(cursor, cursor);
      }
    });
  }
  const sortSelect = app.querySelector('#library-sort');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      state.sortBy = e.target.value;
      render();
    });
  }
  const renameForm = app.querySelector('#rename-form');
  if (renameForm) {
    renameForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const input = document.querySelector('#rename-input');
      const newName = input?.value.trim();
      if (!newName || !state.renamingClip) return;
      state.renamingClip.name = newName;
      await databaseRequest('readwrite', 'put', state.renamingClip);
      state.renamingClip = null;
      await loadClips();
      showToast('Klip adı güncellendi.');
    });
  }
  app.querySelectorAll('[data-update-source]').forEach((button) => button.addEventListener('click', () => {
    const current = getUpdateSettings();
    current.sourceType = button.dataset.updateSource;
    saveUpdateSettings(current);
    render();
  }));
  bindTrimControls();
}

async function handleAction(button) {
  const { action, id, sourceId } = button.dataset;
  try {
    if (action === 'start') await startCapture();
    if (action === 'select-source') await startCapture(sourceId);
    if (action === 'stop') stopCapture();
    if (action === 'save') await saveReplay();
    if (action === 'trim') openTrim(id);
    if (action === 'close-trim') closeTrim();
    if (action === 'trim-set-start') {
      const video = app.querySelector('.trim-preview');
      const inputStart = app.querySelector('#trim-start');
      const sliderStart = app.querySelector('#trim-slider-start');
      const inputEnd = app.querySelector('#trim-end');
      if (video && inputStart && inputEnd && state.trimClip) {
        const cur = video.currentTime;
        const e = Number(inputEnd.value);
        if (cur < e) {
          inputStart.value = cur.toFixed(1);
          if (sliderStart) sliderStart.value = String(cur);
          const durBadge = app.querySelector('#trim-duration-badge');
          const dur = Math.max(0.1, e - cur);
          const estMb = Math.round((dur / state.trimClip.duration) * (state.trimClip.blob.size / 1024 / 1024) * 10) / 10;
          if (durBadge) durBadge.textContent = `${dur.toFixed(1)} sn (~${estMb} MB)`;
          const trackFill = app.querySelector('#trim-track-fill');
          if (trackFill) {
            trackFill.style.left = `${(cur / state.trimClip.duration) * 100}%`;
            trackFill.style.width = `${((e - cur) / state.trimClip.duration) * 100}%`;
          }
          showToast('Başlangıç noktası ayarlandı.');
        } else {
          showToast('Başlangıç noktası bitişten önce olmalıdır.', 'error');
        }
      }
    }
    if (action === 'trim-set-end') {
      const video = app.querySelector('.trim-preview');
      const inputStart = app.querySelector('#trim-start');
      const inputEnd = app.querySelector('#trim-end');
      const sliderEnd = app.querySelector('#trim-slider-end');
      if (video && inputStart && inputEnd && state.trimClip) {
        const cur = video.currentTime;
        const s = Number(inputStart.value);
        if (cur > s) {
          inputEnd.value = cur.toFixed(1);
          if (sliderEnd) sliderEnd.value = String(cur);
          const durBadge = app.querySelector('#trim-duration-badge');
          const dur = Math.max(0.1, cur - s);
          const estMb = Math.round((dur / state.trimClip.duration) * (state.trimClip.blob.size / 1024 / 1024) * 10) / 10;
          if (durBadge) durBadge.textContent = `${dur.toFixed(1)} sn (~${estMb} MB)`;
          const trackFill = app.querySelector('#trim-track-fill');
          if (trackFill) {
            trackFill.style.left = `${(s / state.trimClip.duration) * 100}%`;
            trackFill.style.width = `${((cur - s) / state.trimClip.duration) * 100}%`;
          }
          showToast('Bitiş noktası ayarlandı.');
        } else {
          showToast('Bitiş noktası başlangıçtan sonra olmalıdır.', 'error');
        }
      }
    }
    if (action === 'trim-preview-selection') {
      const video = app.querySelector('.trim-preview');
      const inputStart = app.querySelector('#trim-start');
      const inputEnd = app.querySelector('#trim-end');
      if (video && inputStart && inputEnd) {
        const s = Number(inputStart.value) || 0;
        const e = Number(inputEnd.value) || video.duration;
        video.currentTime = s;
        video.play().catch(() => {});
        const checkEnd = () => {
          if (video.currentTime >= e) {
            video.pause();
            video.removeEventListener('timeupdate', checkEnd);
          }
        };
        video.addEventListener('timeupdate', checkEnd);
      }
    }
    if (action === 'apply-trim') await applyTrim(id);
    if (action === 'download') downloadClip(id);
    if (action === 'open-rename') {
      const clip = state.clips.find((item) => item.id === id);
      if (clip) {
        state.renamingClip = clip;
        render();
        const input = app.querySelector('#rename-input');
        if (input) {
          input.focus();
          input.select();
        }
      }
    }
    if (action === 'close-rename') {
      state.renamingClip = null;
      render();
    }
    if (action === 'clear-search') {
      state.searchQuery = '';
      render();
    }
    if (action === 'reset-filters') {
      state.searchQuery = '';
      state.filterStatus = 'all';
      state.sortBy = 'newest';
      render();
    }
    if (action === 'delete') await deleteClip(id);
    if (action === 'upload') await uploadClip(id, button);
    if (action === 'close-source-picker') closeSourcePicker();
    if (action === 'refresh-sources') await openSourcePicker();
    if (action === 'select-cloud-provider') {
      const providerId = button.dataset.providerId;
      if (providerId && EMBEDDED_PROVIDERS[providerId]) {
        state.activeCloudId = providerId;
        localStorage.setItem('velex-clip-active-cloud', providerId);
        state.connectionTestResult = null;
        showToast(`${EMBEDDED_PROVIDERS[providerId].name} aktif sağlayıcı olarak seçildi.`);
        render();
      }
    }
    if (action === 'test-active-cloud' || action === 'test-connection' || action === 'test-connection-from-cloud') {
      await runConnectionTest();
    }
    if (action === 'check-updates') {
      if (window.velexDesktop?.checkForUpdates) {
        state.updater = {
          status: 'checking',
          version: null,
          releaseDate: null,
          releaseNotes: null,
          progress: null,
          error: null,
        };
        render();
        try {
          const res = await window.velexDesktop.checkForUpdates();
          if (res?.isDev) {
            state.updater = {
              status: 'dev',
              version: null,
              releaseDate: null,
              releaseNotes: null,
              progress: null,
              error: res.message,
            };
            render();
            showToast(res.message, 'error');
          } else if (res && !res.success && res.error) {
            state.updater = {
              status: 'error',
              version: null,
              releaseDate: null,
              releaseNotes: null,
              progress: null,
              error: res.error,
            };
            render();
            showToast(res.error, 'error');
          }
        } catch (err) {
          state.updater = {
            status: 'error',
            version: null,
            releaseDate: null,
            releaseNotes: null,
            progress: null,
            error: err.message,
          };
          render();
          showToast(`Güncelleme hatası: ${err.message}`, 'error');
        }
      } else {
        await checkForUpdates(false);
      }
    }
    if (action === 'download-update') {
      if (window.velexDesktop?.downloadUpdate) {
        state.updater = {
          ...state.updater,
          status: 'downloading',
          progress: { percent: 0, bytesPerSecond: 0, transferred: 0, total: 0 },
        };
        render();
        showToast('Güncelleme indirmesi başlatılıyor...', 'success');
        try {
          await window.velexDesktop.downloadUpdate();
        } catch (err) {
          state.updater = {
            ...state.updater,
            status: 'error',
            error: err.message,
          };
          render();
          showToast(`İndirme başarısız: ${err.message}`, 'error');
        }
      } else {
        showToast('Güncelleme indirme sadece masaüstü uygulamasında çalışır.', 'error');
      }
    }
    if (action === 'quit-and-install') {
      if (window.velexDesktop?.quitAndInstall) {
        showToast('Uygulama kapatılıyor ve güncelleme yükleniyor...', 'success');
        window.velexDesktop.quitAndInstall();
      }
    }
    if (action === 'save-update-source') {
      const current = getUpdateSettings();
      if (current.sourceType === 'github') {
        const input = app.querySelector('#github-repo-input');
        if (input) current.githubRepo = input.value.trim();
      } else {
        const input = app.querySelector('#custom-url-input');
        if (input) current.customUrl = input.value.trim();
      }
      saveUpdateSettings(current);
      showToast('Güncelleme kaynağı kaydedildi.');
      render();
    }
    if (action === 'open-download') {
      const url = button.dataset.url;
      if (url) openUrl(url);
    }
    if (action === 'toggle-theme') {
      applyTheme(state.theme === 'dark' ? 'light' : 'dark');
      render();
      showToast(state.theme === 'dark' ? 'Koyu Grafit (Siyah) tema aktif edildi.' : 'Açık tema aktif edildi.');
    }
    if (action === 'set-theme') {
      const targetTheme = button.dataset.themeVal;
      if (targetTheme && targetTheme !== state.theme) {
        applyTheme(targetTheme);
        render();
        showToast(targetTheme === 'dark' ? 'Koyu Grafit (Siyah) tema aktif edildi.' : 'Açık tema aktif edildi.');
      }
    }
  } catch (error) {
    showToast(error instanceof Error ? error.message : 'İşlem tamamlanamadı.', 'error');
  }
}

async function openSourcePicker() {
  if (!window.velexDesktop) return;
  state.captureSources = await window.velexDesktop.listSources();
  state.sourcePickerOpen = true;
  render();
}

function closeSourcePicker() {
  state.sourcePickerOpen = false;
  render();
}

async function startCapture(sourceId) {
  if (!navigator.mediaDevices?.getDisplayMedia) throw new Error('Ekran yakalama bu tarayıcıda desteklenmiyor. Güncel Chrome veya Edge kullan.');
  const includeAudio = document.querySelector('#capture-audio')?.checked || false;
  if (window.velexDesktop) {
    if (!sourceId) {
      await openSourcePicker();
      return;
    }
    const selectedSource = state.captureSources.find((source) => source.id === sourceId);
    if (!selectedSource) throw new Error('Kayıt kaynağı artık listede yok. Kaynak listesini yenileyip tekrar dene.');
    await window.velexDesktop.selectSource(sourceId);
    await window.velexDesktop.setCaptureAudio(includeAudio);
    state.selectedSourceName = selectedSource.name;
    state.sourcePickerOpen = false;
  }
  const quality = getQualitySettings();
  const videoConstraints = {
    frameRate: { ideal: quality.fps, max: quality.fps },
  };
  if (quality.resolution === '1080p') {
    videoConstraints.width = { ideal: 1920, max: 1920 };
    videoConstraints.height = { ideal: 1080, max: 1080 };
  } else if (quality.resolution === '720p') {
    videoConstraints.width = { ideal: 1280, max: 1280 };
    videoConstraints.height = { ideal: 720, max: 720 };
  }

  let stream;
  try {
    stream = await navigator.mediaDevices.getDisplayMedia({ video: videoConstraints, audio: includeAudio });
  } catch (error) {
    state.selectedSourceName = '';
    state.hasAudio = false;
    if (window.velexDesktop) window.velexDesktop.setCaptureActive(false);
    throw new Error(`Ekran kaydı başlatılamadı: ${error instanceof Error ? error.message : 'seçim iptal edildi.'}`);
  }
  const audioTracks = stream.getAudioTracks();
  state.hasAudio = audioTracks.length > 0;
  if (includeAudio && !state.hasAudio) {
    showToast('Sistem sesi yakalanamadı. Yalnızca video kaydediliyor. (Pencere yakalamalarında Windows ses loopback desteklemeyebilir)', 'error');
  }
  if (!window.MediaRecorder) {
    stream.getTracks().forEach((track) => track.stop());
    state.hasAudio = false;
    if (window.velexDesktop) window.velexDesktop.setCaptureActive(false);
    throw new Error('Bu tarayıcıda MediaRecorder desteklenmiyor.');
  }
  try {
    const mimeType = ['video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm'].find((type) => MediaRecorder.isTypeSupported(type));
    state.stream = stream;
    state.chunks = [];
    state.startedAt = Date.now();
    const recorderOptions = {
      ...(mimeType ? { mimeType } : {}),
      videoBitsPerSecond: quality.bitrate,
      audioBitsPerSecond: 128000,
    };
    state.recorder = new MediaRecorder(stream, recorderOptions);
  } catch (error) {
    stream.getTracks().forEach((track) => track.stop());
    state.stream = null;
    state.recorder = null;
    state.hasAudio = false;
    if (window.velexDesktop) window.velexDesktop.setCaptureActive(false);
    throw new Error(`Kayıt başlatılamadı: ${error instanceof Error ? error.message : 'tarayıcı medya kaydı oluşturulamadı.'}`);
  }
  state.recorder.addEventListener('dataavailable', (event) => {
    if (event.data.size) {
      state.chunks.push({ blob: event.data, at: Date.now() });
      const cutoff = Date.now() - (state.selectedSeconds + 3) * 1000;
      while (state.chunks.length > 0 && state.chunks[0].at < cutoff) {
        state.chunks.shift();
      }
    }
    if (state.pendingChunk) {
      clearTimeout(state.pendingChunk.timer);
      state.pendingChunk.resolve();
      state.pendingChunk = null;
    }
  });
  state.recorder.addEventListener('error', (event) => showToast(event.error?.message || 'Ekran kaydı sırasında bir hata oluştu.', 'error'));
  state.recorder.addEventListener('stop', () => {
    clearInterval(state.interval);
    state.stream?.getTracks().forEach((track) => track.stop());
    state.stream = null;
    state.recorder = null;
    state.chunks = [];
    state.startedAt = 0;
    state.hasAudio = false;
    if (window.velexDesktop) window.velexDesktop.setCaptureActive(false);
    state.selectedSourceName = '';
    render();
  });
  stream.getVideoTracks()[0]?.addEventListener('ended', () => {
    if (state.recorder?.state === 'recording') {
      showToast('Kayıt kaynağı (ekran veya pencere) kapandığı için kayıt durduruldu.', 'error');
      state.recorder.stop();
    }
  }, { once: true });
  try {
    state.recorder.start(1000);
  } catch (error) {
    stream.getTracks().forEach((track) => track.stop());
    state.stream = null;
    state.recorder = null;
    state.selectedSourceName = '';
    state.hasAudio = false;
    if (window.velexDesktop) window.velexDesktop.setCaptureActive(false);
    throw new Error(`Kayıt başlatılamadı: ${error instanceof Error ? error.message : 'tarayıcı medya kaydı başlatılamadı.'}`);
  }
  state.interval = window.setInterval(() => {
    const cutoff = Date.now() - (state.selectedSeconds + 2) * 1000;
    state.chunks = state.chunks.filter((chunk) => chunk.at >= cutoff);
    updateCaptureReadout();
  }, 1000);
  if (window.velexDesktop) window.velexDesktop.setCaptureActive(true);
  render();
}

function stopCapture() {
  if (state.recorder?.state === 'recording') state.recorder.stop();
}

async function requestFinalChunk() {
  if (!state.recorder || state.recorder.state !== 'recording') throw new Error('Kayıt artık etkin değil.');
  await new Promise((resolve, reject) => {
    const timer = window.setTimeout(() => {
      state.pendingChunk = null;
      reject(new Error('Son kayıt parçası alınamadı. Kayıt durumunu kontrol edip tekrar dene.'));
    }, 1500);
    state.pendingChunk = { resolve, timer };
    try {
      state.recorder.requestData();
    } catch (error) {
      clearTimeout(timer);
      state.pendingChunk = null;
      reject(new Error(`Kayıt parçası alınamadı: ${error instanceof Error ? error.message : 'kayıt isteği başarısız.'}`));
    }
  });
}

async function assertStorageSpace(requiredBytes = 50 * 1024 * 1024) {
  if (navigator.storage?.estimate) {
    try {
      const estimate = await navigator.storage.estimate();
      if (estimate.quota !== undefined && estimate.usage !== undefined) {
        const remaining = estimate.quota - estimate.usage;
        if (remaining < requiredBytes) {
          const mb = Math.round(remaining / 1024 / 1024);
          throw new Error(`Yetersiz disk alanı: Cihazınızda klip kaydetmek için yeterli alan kalmadı (Kullanılabilir: ~${mb} MB).`);
        }
      }
    } catch (error) {
      if (error.message?.startsWith('Yetersiz disk alanı')) throw error;
    }
  }
}

function downloadClip(id) {
  const clip = state.clips.find((item) => item.id === id);
  if (!clip) throw new Error('İndirilecek klip bulunamadı.');
  const sanitized = clip.name.replace(/[^a-zA-Z0-9_\-\u00C0-\u017F ]/g, '_').trim().replace(/\s+/g, '_');
  const filename = `${sanitized || 'VelexClip'}.webm`;
  const url = URL.createObjectURL(clip.blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 2000);
  showToast(`"${filename}" başarıyla indirildi.`);
}

async function saveReplay() {
  if (state.saving) return;
  state.saving = true;
  const button = app.querySelector('[data-action="save"]');
  if (button) button.disabled = true;
  try {
    await requestFinalChunk();
    const cutoff = Date.now() - state.selectedSeconds * 1000;
    const recentChunks = state.chunks.filter((chunk) => chunk.at >= cutoff).map((chunk) => chunk.blob);
    if (!recentChunks.length) throw new Error('Tampon henüz dolmadı. Biraz bekleyip tekrar dene.');
    const blob = new Blob(recentChunks, { type: state.recorder?.mimeType || 'video/webm' });
    if (blob.size === 0) throw new Error('Klip boş geldi. Biraz kayıt alıp yeniden dene.');
    await assertStorageSpace(blob.size * 2);
    const clip = {
      id: crypto.randomUUID(),
      name: `Klip ${formatDate(Date.now())}`,
      createdAt: Date.now(),
      duration: Math.min(state.selectedSeconds, (Date.now() - state.startedAt) / 1000),
      blob,
    };
    await databaseRequest('readwrite', 'put', clip);
    await loadClips();
    showToast('Klip bu cihazdaki kitaplığa kaydedildi.');
  } finally {
    state.saving = false;
    if (button?.isConnected) updateCaptureReadout();
  }
}

function openTrim(id) {
  const clip = state.clips.find((item) => item.id === id);
  if (!clip) throw new Error('Düzenlenecek klip bulunamadı.');
  state.trimClip = clip;
  render();
}

function closeTrim() {
  state.trimClip = null;
  render();
}

async function applyTrim(id) {
  if (state.trimming) return;
  const clip = state.clips.find((item) => item.id === id);
  const start = Number(document.querySelector('#trim-start')?.value);
  const end = Number(document.querySelector('#trim-end')?.value);
  if (!clip || !Number.isFinite(start) || !Number.isFinite(end) || start < 0 || end <= start || end > clip.duration) {
    throw new Error('Başlangıç ve bitiş sürelerini kontrol et.');
  }
  state.trimming = true;
  const button = app.querySelector('[data-action="apply-trim"]');
  if (button) {
    button.disabled = true;
    button.textContent = 'Klip hazırlanıyor…';
  }
  const source = document.createElement('video');
  const sourceUrl = URL.createObjectURL(clip.blob);
  let outputStream;
  source.src = sourceUrl;
  source.preload = 'auto';
  source.playsInline = true;
  try {
    await new Promise((resolve, reject) => {
      source.onloadedmetadata = resolve;
      source.onerror = () => reject(new Error('Klip önizlemesi açılamadı.'));
    });
    if (typeof source.captureStream !== 'function') throw new Error('Bu tarayıcı kırpılmış klip dışa aktarmayı desteklemiyor.');
    const stream = source.captureStream();
    outputStream = stream;
    const quality = getQualitySettings();
    const mimeType = ['video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm'].find((type) => MediaRecorder.isTypeSupported(type));
    if (!window.MediaRecorder) throw new Error('Bu tarayıcıda MediaRecorder desteklenmiyor.');
    const recorder = new MediaRecorder(stream, {
      ...(mimeType ? { mimeType } : {}),
      videoBitsPerSecond: quality.bitrate,
      audioBitsPerSecond: 128000,
    });
    const parts = [];
    recorder.addEventListener('dataavailable', (event) => { if (event.data.size) parts.push(event.data); });
    const stopped = new Promise((resolve, reject) => {
      recorder.addEventListener('stop', resolve, { once: true });
      recorder.addEventListener('error', () => reject(new Error('Kırpılmış klip dışa aktarılamadı.')), { once: true });
    });
    if (start > 0) {
      await new Promise((resolve, reject) => {
        const timer = window.setTimeout(() => reject(new Error('Klip bu konuma alınamadı.')), 4000);
        source.addEventListener('seeked', () => {
          clearTimeout(timer);
          resolve();
        }, { once: true });
        source.currentTime = start;
      });
    }
    recorder.start(250);
    const playback = new Promise((resolve, reject) => {
      const timer = window.setTimeout(() => finish(new Error('Kırpma zaman aşımına uğradı.')), (end - start) * 1000 + 5000);
      const finish = (error) => {
        clearTimeout(timer);
        source.removeEventListener('timeupdate', onTime);
        if (recorder.state === 'recording') recorder.stop();
        if (error) reject(error);
        else resolve();
      };
      const onTime = () => { if (source.currentTime >= end) finish(); };
      source.addEventListener('timeupdate', onTime);
      source.onended = () => finish();
    });
    await source.play();
    await playback;
    await stopped;
    source.pause();
    stream.getTracks().forEach((track) => track.stop());
    const trimmed = new Blob(parts, { type: recorder.mimeType || 'video/webm' });
    if (!trimmed.size) throw new Error('Kırpılmış klip boş geldi. Tekrar dene.');
    await assertStorageSpace(trimmed.size * 2);
    await databaseRequest('readwrite', 'put', {
      id: crypto.randomUUID(),
      name: `${clip.name} (kırpıldı)`,
      createdAt: Date.now(),
      duration: end - start,
      blob: trimmed,
    });
    state.trimClip = null;
    await loadClips();
    showToast('Kırpılmış klip ayrı bir dosya olarak kaydedildi.');
  } finally {
    source.pause();
    outputStream?.getTracks().forEach((track) => track.stop());
    URL.revokeObjectURL(sourceUrl);
    state.trimming = false;
    if (button?.isConnected) {
      button.disabled = false;
      button.innerHTML = `Yeni kırpılmış klip oluştur ${icon('arrow')}`;
    }
  }
}

async function deleteClip(id) {
  const clip = state.clips.find((item) => item.id === id);
  if (!clip || !window.confirm(`"${clip.name}" bu cihazdan silinsin mi?`)) return;
  await databaseRequest('readwrite', 'delete', id);
  await loadClips();
  showToast('Klip bu cihazdan silindi.');
}



// S3 AWS Signature Version 4 (SigV4) Helpers using Web Crypto API
async function hmacSha256(keyData, stringData) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    typeof keyData === 'string' ? encoder.encode(keyData) : keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const data = typeof stringData === 'string' ? encoder.encode(stringData) : stringData;
  return await crypto.subtle.sign('HMAC', key, data);
}

async function getSignatureKey(secretKey, dateStamp, regionName, serviceName) {
  const kDate = await hmacSha256('AWS4' + secretKey, dateStamp);
  const kRegion = await hmacSha256(kDate, regionName);
  const kService = await hmacSha256(kRegion, serviceName);
  return await hmacSha256(kService, 'aws4_request');
}

async function signS3Request({ method, url, headers = {}, body = null, accessKeyId, secretAccessKey, region = 'auto' }) {
  const parsedUrl = new URL(url);
  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '');
  const dateStamp = amzDate.slice(0, 8);
  const encoder = new TextEncoder();
  const host = parsedUrl.host;

  let payloadHash = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
  if (body) {
    if (typeof body === 'string') {
      const digest = await crypto.subtle.digest('SHA-256', encoder.encode(body));
      payloadHash = Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, '0')).join('');
    } else if (body instanceof Blob) {
      const arrayBuffer = await body.arrayBuffer();
      const digest = await crypto.subtle.digest('SHA-256', arrayBuffer);
      payloadHash = Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, '0')).join('');
    }
  }

  const normalizedHeaders = {};
  for (const [key, value] of Object.entries(headers)) {
    if (value !== undefined && value !== null) {
      normalizedHeaders[key.toLowerCase()] = String(value).trim();
    }
  }
  normalizedHeaders['host'] = host;
  normalizedHeaders['x-amz-date'] = amzDate;
  normalizedHeaders['x-amz-content-sha256'] = payloadHash;

  const sortedHeaderKeys = Object.keys(normalizedHeaders).sort();
  const canonicalHeaders = sortedHeaderKeys.map((k) => `${k}:${normalizedHeaders[k]}\n`).join('');
  const signedHeaders = sortedHeaderKeys.join(';');

  const searchParams = new URLSearchParams(parsedUrl.search);
  const sortedParams = Array.from(searchParams.keys()).sort();
  const canonicalQuery = sortedParams.map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(searchParams.get(k) || '')}`).join('&');

  const canonicalUri = parsedUrl.pathname || '/';

  const canonicalRequest = [
    method.toUpperCase(),
    canonicalUri,
    canonicalQuery,
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join('\n');

  const canonicalRequestHashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(canonicalRequest));
  const canonicalRequestHash = Array.from(new Uint8Array(canonicalRequestHashBuffer)).map((b) => b.toString(16).padStart(2, '0')).join('');

  const effectiveRegion = region || 'auto';
  const credentialScope = `${dateStamp}/${effectiveRegion}/s3/aws4_request`;
  const stringToSign = [
    'AWS4-HMAC-SHA256',
    amzDate,
    credentialScope,
    canonicalRequestHash,
  ].join('\n');

  const signingKey = await getSignatureKey(secretAccessKey, dateStamp, effectiveRegion, 's3');
  const key = await crypto.subtle.importKey('raw', signingKey, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const signatureBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(stringToSign));
  const signature = Array.from(new Uint8Array(signatureBuffer)).map((b) => b.toString(16).padStart(2, '0')).join('');

  return {
    ...normalizedHeaders,
    Authorization: `AWS4-HMAC-SHA256 Credential=${accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`,
  };
}

async function testS3Connection(config) {
  if (!config.s3Endpoint || !config.s3Bucket || !config.s3AccessKeyId || !config.s3SecretAccessKey) {
    throw new Error('S3 Uç Noktası, Bucket adı, Access Key ID ve Secret Access Key alanlarını doldurun.');
  }
  const endpoint = config.s3Endpoint.trim().replace(/\/+$/, '');
  try {
    const parsed = new URL(endpoint);
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') throw new Error();
  } catch {
    throw new Error('Geçersiz Uç Nokta URL adresi.');
  }

  const bucket = config.s3Bucket.trim();
  const testUrl = `${endpoint}/${encodeURIComponent(bucket)}?max-keys=1`;

  try {
    const signedHeaders = await signS3Request({
      method: 'GET',
      url: testUrl,
      accessKeyId: config.s3AccessKeyId.trim(),
      secretAccessKey: config.s3SecretAccessKey.trim(),
      region: config.s3Region?.trim() || 'auto',
    });

    const response = await fetch(testUrl, {
      method: 'GET',
      headers: signedHeaders,
    });

    if (response.ok) {
      let providerName = 'S3 Uyumlu Depolama';
      if (endpoint.includes('filebase.')) providerName = 'Filebase (5 GB Free · Kartsız)';
      else if (endpoint.includes('r2.cloudflarestorage.com')) providerName = 'Cloudflare R2 (10 GB Free + 0$ Egress)';
      else if (endpoint.includes('backblazeb2.com')) providerName = 'Backblaze B2 (10 GB Free)';
      else if (endpoint.includes('localhost') || endpoint.includes('127.0.0.1')) providerName = 'Yerel MinIO';

      return {
        success: true,
        message: `${providerName} bağlantısı doğrulandı! "${bucket}" bucket'ına başarıyla erişildi.`,
        hint: 'Bucket okuma ve yazma işlemlerine hazır. Klipler doğrudan bu alana aktarılabilir.',
      };
    }

    const text = await response.text().catch(() => '');
    if (response.status === 403) {
      return {
        success: false,
        message: 'Yetki hatası (403): Erişim reddedildi. Access Key ID veya Secret Access Key geçersiz.',
        hint: 'Sağlayıcı panelinden oluşturduğunuz API anahtarının Object Read & Write yetkilerine sahip olduğunu doğrulayın.',
      };
    }
    if (response.status === 404) {
      return {
        success: false,
        message: `Bucket bulunamadı (404): "${bucket}" adında bir bucket mevcut değil.`,
        hint: 'Sağlayıcı panelinde bu isimde bir bucket oluşturup tekrar deneyin.',
      };
    }

    return {
      success: false,
      message: `S3 sunucu yanıtı (${response.status}): ${response.statusText}`,
      hint: text.slice(0, 150) || 'Uç nokta ve bucket ayarlarını kontrol edin.',
    };
  } catch (error) {
    if (error.name === 'TypeError' || error.message.includes('fetch')) {
      return {
        success: false,
        message: 'Sunucuya bağlanılamadı (Ağ veya CORS engeli).',
        hint: 'Tarayıcıdan doğrudan yükleme yapabilmek için Cloudflare R2 / Backblaze B2 panelinde bucket CORS kurallarına izin verildiğinden emin olun (Sağdaki kılavuza bakın).',
      };
    }
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Bağlantı testi sırasında beklenmeyen bir hata oluştu.',
    };
  }
}

async function testSupabaseConnection(config) {
  if (!config.url || !config.apiKey || !config.bucket) {
    throw new Error('Project URL, API Key ve Bucket adını eksiksiz girin.');
  }
  const url = config.url.trim().replace(/\/+$/, '');
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:' && parsed.hostname !== 'localhost') {
      throw new Error();
    }
  } catch {
    throw new Error('Geçersiz Proje URL adresi. "https://proje-id.supabase.co" biçiminde olmalıdır.');
  }

  const bucket = config.bucket.trim();
  const endpoint = `${url}/storage/v1/bucket/${encodeURIComponent(bucket)}`;

  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        apikey: config.apiKey.trim(),
        Authorization: `Bearer ${config.accessToken?.trim() || config.apiKey.trim()}`,
      },
    });

    if (response.ok) {
      const data = await response.json().catch(() => null);
      const isPublic = data?.public ? 'Açık (Public)' : 'Özel (Private)';
      const sizeLimit = data?.file_size_limit
        ? ` · Maks dosya sınırı: ${Math.round(data.file_size_limit / 1024 / 1024)} MB`
        : '';
      return {
        success: true,
        message: `Supabase Storage bağlantısı doğrulandı! "${bucket}" bucket'ına erişildi.`,
        hint: `Bucket türü: ${isPublic}${sizeLimit}. Doğrudan yükleme için hazır.`,
      };
    }

    let errorDetails = '';
    try {
      const json = await response.json();
      errorDetails = json.message || json.error || json.msg || '';
    } catch {
      errorDetails = (await response.text().catch(() => '')).slice(0, 200);
    }

    if (response.status === 404) {
      return {
        success: false,
        message: `Bucket bulunamadı (404): "${bucket}" adında bir Storage bucket mevcut değil.`,
        hint: `Supabase panelinizde Storage > New Bucket adımıyla "${bucket}" isimli bir bucket oluşturup tekrar deneyin.`,
      };
    }

    if (response.status === 401 || response.status === 403) {
      return {
        success: false,
        message: `Yetki hatası (${response.status}): Anon anahtarı veya bucket izinleri yetersiz.`,
        hint: 'API anahtarınızı kontrol edin. Özel bucket\'lar için Storage RLS kurallarını yapılandırmayı unutmayın.',
      };
    }

    return {
      success: false,
      message: `Supabase yanıtı (${response.status}): ${errorDetails || response.statusText}`,
      hint: 'Proje URL ve API anahtarınızı kontrol edin.',
    };
  } catch (error) {
    if (error.name === 'TypeError' || error.message.includes('fetch')) {
      return {
        success: false,
        message: 'Sunucuya bağlanılamadı (Ağ / CORS engeli).',
        hint: 'Proje URL adresini, internet bağlantınızı ve Supabase CORS yapılandırmasını kontrol edin.',
      };
    }
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Bağlantı testi sırasında beklenmeyen bir hata oluştu.',
    };
  }
}

async function runConnectionTest(customConfig = null) {
  if (state.testingConnection) return;
  state.testingConnection = true;
  state.connectionTestResult = null;
  render();

  try {
    const activeProvider = getActiveCloudProvider();
    const config = customConfig || activeProvider.config;
    if (!activeProvider.configured && !customConfig) {
      state.connectionTestResult = {
        success: false,
        message: `${activeProvider.name} için henüz API anahtarı eklenmedi.`,
        hint: 'Bu sağlayıcı için API anahtarını ilettiğinde hemen aktifleşecektir.',
      };
      showToast(state.connectionTestResult.message, 'error');
      return;
    }
    const isS3 = (config.provider === 's3' || activeProvider.type === 's3');
    const result = isS3
      ? await testS3Connection(config)
      : await testSupabaseConnection(config);
    state.connectionTestResult = result;
    if (result.success) {
      showToast(result.message, 'success');
    } else {
      showToast(result.message, 'error');
    }
  } catch (error) {
    state.connectionTestResult = {
      success: false,
      message: error instanceof Error ? error.message : 'Bağlantı testi başarısız.',
    };
    showToast(state.connectionTestResult.message, 'error');
  } finally {
    state.testingConnection = false;
    render();
  }
}

async function uploadClip(id, button) {
  const clip = state.clips.find((item) => item.id === id);
  const activeProvider = getActiveCloudProvider();
  const config = activeProvider.config;
  if (!clip) throw new Error('Aktarılacak klip bulunamadı.');

  if (!activeProvider.configured) {
    state.page = 'settings';
    render();
    showToast(`${activeProvider.name} için henüz anahtar tanımlanmadı. Lütfen Ayarlar'dan hazır bir bulut seçin.`, 'error');
    return;
  }

  const isS3 = activeProvider.type === 's3' || config.provider === 's3';

  if (!isS3) {
    const fileSizeMb = clip.blob.size / 1024 / 1024;
    if (fileSizeMb > 50) {
      const proceed = window.confirm(
        `Dikkat: Bu klibin boyutu ${fileSizeMb.toFixed(1)} MB.\nSupabase ücretsiz planında tekil dosya yükleme sınırı varsayılan olarak 50 MB'tır.\nYüklemeye devam etmek istiyor musunuz?`
      );
      if (!proceed) return;
    }
  }

  const uploadButton = button || app.querySelector(`[data-action="upload"][data-id="${id}"]`);
  const previousText = uploadButton?.textContent;
  if (uploadButton) {
    uploadButton.disabled = true;
    uploadButton.textContent = 'Aktarılıyor…';
  }

  try {
    const filename = `${new Date(clip.createdAt).toISOString().replace(/[:.]/g, '-')}-${clip.id}.webm`;

    if (isS3) {
      const endpoint = config.s3Endpoint.trim().replace(/\/+$/, '');
      const bucket = config.s3Bucket.trim();
      const objectKey = `clips/${filename}`;
      const uploadUrl = `${endpoint}/${encodeURIComponent(bucket)}/${objectKey}`;

      const signedHeaders = await signS3Request({
        method: 'PUT',
        url: uploadUrl,
        headers: {
          'Content-Type': clip.blob.type || 'video/webm',
        },
        body: clip.blob,
        accessKeyId: config.s3AccessKeyId.trim(),
        secretAccessKey: config.s3SecretAccessKey.trim(),
        region: config.s3Region?.trim() || 'auto',
      });

      const response = await fetch(uploadUrl, {
        method: 'PUT',
        headers: signedHeaders,
        body: clip.blob,
      });

      if (!response.ok) {
        if (response.status === 403) throw new Error('Erişim engellendi (403): S3 API anahtarınız bu bucket\'a yazma (PUT) yetkisine sahip değil.');
        if (response.status === 404) throw new Error(`Bucket bulunamadı (404): "${bucket}" adında bir S3 bucket mevcut değil.`);
        throw new Error(`S3 aktarım başarısız (${response.status}): ${response.statusText}`);
      }

      clip.uploadedAt = Date.now();
      clip.cloudProvider = 's3';
      await databaseRequest('readwrite', 'put', clip);
      await loadClips();
      let providerName = 'S3 bulut';
      if (endpoint.includes('filebase.')) providerName = 'Filebase';
      else if (endpoint.includes('r2.cloudflarestorage.com')) providerName = 'Cloudflare R2';
      else if (endpoint.includes('backblazeb2.com')) providerName = 'Backblaze B2';
      showToast(`Klip ${providerName} alanına başarıyla aktarıldı. Yerel kopya korunuyor.`, 'success');
    } else {
      const objectPath = `clips/${filename}`;
      const endpoint = `${config.url.replace(/\/+$/, '')}/storage/v1/object/${encodeURIComponent(config.bucket.trim())}/${objectPath.split('/').map(encodeURIComponent).join('/')}`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          apikey: config.apiKey.trim(),
          Authorization: `Bearer ${config.accessToken?.trim() || config.apiKey.trim()}`,
          'Content-Type': clip.blob.type || 'video/webm',
          'x-upsert': 'false',
        },
        body: clip.blob,
      });

      if (!response.ok) {
        let errorDetails = '';
        try {
          const json = await response.json();
          errorDetails = json.message || json.error || json.msg || '';
        } catch {
          errorDetails = (await response.text().catch(() => '')).slice(0, 200);
        }

        if (response.status === 404) {
          throw new Error(`Bucket bulunamadı (404): "${config.bucket}" isimli bir Storage bucket mevcut değil.`);
        } else if (response.status === 401 || response.status === 403) {
          throw new Error('Erişim engellendi (' + response.status + '): Supabase Storage RLS politikası dosya yüklemeye (INSERT) izin vermiyor.');
        } else if (response.status === 413) {
          throw new Error(`Dosya boyutu aşıldı (413): Klip boyutu (${(clip.blob.size / 1024 / 1024).toFixed(1)} MB), Supabase projenizin tek dosya sınırından büyük.`);
        } else {
          throw new Error(`Aktarım başarısız (${response.status}): ${errorDetails || response.statusText}`);
        }
      }

      clip.uploadedAt = Date.now();
      clip.cloudProvider = 'supabase';
      await databaseRequest('readwrite', 'put', clip);
      await loadClips();
      showToast('Klip Supabase Storage alanına aktarıldı. Yerel kopya duruyor.');
    }
  } catch (error) {
    if (error.name === 'TypeError' || error.message.includes('fetch')) {
      throw new Error('Ağ bağlantısı hatası: Sunucuya ulaşılamadı. İnternet bağlantınızı ve CORS yapılandırmasını kontrol edin.');
    }
    throw error;
  } finally {
    if (uploadButton?.isConnected) {
      uploadButton.disabled = false;
      uploadButton.textContent = previousText || 'Aktar';
    }
  }
}

document.addEventListener('keydown', (event) => {
  if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 's') {
    if (state.recorder?.state === 'recording') {
      event.preventDefault();
      saveReplay().catch((error) => showToast(error.message, 'error'));
    }
  }
  if (event.key === 'Escape' && state.trimClip) closeTrim();
  if (event.key === 'Escape' && state.sourcePickerOpen) closeSourcePicker();
  if (event.key === 'Escape' && state.renamingClip) {
    state.renamingClip = null;
    render();
  }
});

async function initialize() {
  try {
    state.db = await openDatabase();
  } catch (error) {
    console.error('Klip veritabanı açılamadı:', error);
  }

  try {
    if (state.db) {
      await loadClips();
    } else {
      state.clips = [];
    }
  } catch (error) {
    console.error('Klipler yüklenemedi:', error);
    state.clips = [];
  }

  state.interval = null;
  if (window.velexDesktop) {
    if (window.velexDesktop.getVersion) {
      try {
        const v = await window.velexDesktop.getVersion();
        if (v) APP_VERSION = v;
      } catch (err) {
        console.warn('Uygulama sürümü alınamadı:', err);
      }
    }
    window.velexDesktop.onSaveShortcut(() => {
      if (state.recorder?.state === 'recording') {
        saveReplay().catch((error) => showToast(error.message, 'error'));
      } else {
        state.page = 'capture';
        render();
      }
    });
    window.velexDesktop.onStopCapture(stopCapture);
    if (window.velexDesktop.onUpdaterStatus) {
      window.velexDesktop.onUpdaterStatus((data) => {
        if (!data) return;
        if (data.status === 'checking') {
          state.updater = {
            status: 'checking',
            version: null,
            releaseDate: null,
            releaseNotes: null,
            progress: null,
            error: null,
          };
        } else if (data.status === 'available') {
          state.updater = {
            status: 'available',
            version: data.version,
            releaseDate: data.releaseDate ? new Date(data.releaseDate).getTime() : null,
            releaseNotes: data.releaseNotes || null,
            progress: null,
            error: null,
          };
          showToast(`Yeni sürüm bulundu: v${data.version}!`, 'success');
        } else if (data.status === 'not-available') {
          state.updater = {
            status: 'not-available',
            version: data.version || APP_VERSION,
            releaseDate: null,
            releaseNotes: null,
            progress: null,
            error: null,
          };
          showToast(`Velex Clip güncel (v${APP_VERSION}). En son sürümdesiniz.`, 'success');
        } else if (data.status === 'downloading') {
          state.updater = {
            ...state.updater,
            status: 'downloading',
            progress: {
              percent: data.percent ?? 0,
              bytesPerSecond: data.bytesPerSecond ?? 0,
              transferred: data.transferred ?? 0,
              total: data.total ?? 0,
            },
          };
        } else if (data.status === 'downloaded') {
          state.updater = {
            status: 'downloaded',
            version: data.version,
            releaseDate: null,
            releaseNotes: null,
            progress: null,
            error: null,
          };
          showToast(`v${data.version} indirildi. Yeniden başlatmaya hazır!`, 'success');
        } else if (data.status === 'dev') {
          state.updater = {
            status: 'dev',
            version: null,
            releaseDate: null,
            releaseNotes: null,
            progress: null,
            error: data.message,
          };
        } else if (data.status === 'error') {
          state.updater = {
            status: 'error',
            version: null,
            releaseDate: null,
            releaseNotes: null,
            progress: null,
            error: data.message,
          };
          showToast(`Güncelleme hatası: ${data.message}`, 'error');
        }
        render();
      });
    }
  }

  render();

  const updateSettings = getUpdateSettings();
  if (updateSettings.autoCheck) {
    setTimeout(() => {
      if (window.velexDesktop?.checkForUpdates) {
        window.velexDesktop.checkForUpdates().catch(() => {});
      } else {
        checkForUpdates(true);
      }
    }, 2500);
  }
}

initialize();
