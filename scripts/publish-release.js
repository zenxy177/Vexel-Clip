import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const pkg = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8'));

let TOKEN = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;
const tokenFilePath = path.join(rootDir, '.release-token');
if (!TOKEN && fs.existsSync(tokenFilePath)) {
  TOKEN = fs.readFileSync(tokenFilePath, 'utf8').trim();
}

if (!TOKEN) {
  console.error('ERROR: GITHUB_TOKEN or .release-token is missing.');
  process.exit(1);
}

const OWNER = 'zenxy177';
const REPO = 'Vexel-Clip';
const TAG = `v${pkg.version}`;
const NAME = `Velex Clip v${pkg.version} - Filebase Entegrasyonu (Kartsız Bulut) & Temiz Arayüz`;
const BODY = `### Velex Clip v${pkg.version} Sürüm Notları
- ☁️ **Gömülü Filebase Bulut Depolama**: Kredi kartı gerektirmeyen Filebase S3 entegrasyonu (velex-stroge) doğrudan sisteme gömüldü.
- 🧹 **Sade ve Temiz Arayüz**: Tüm karmaşık formlar, CORS/SQL kod kutuları ve kılavuz panelleri kaldırılarak doğrudan tek tıkla çalışan sağlayıcı seçicisi eklendi.
- 🔄 **Tek Tıkla Bulut Değiştirme**: Bulut sekmesinden ve Ayarlar'dan sunucular arasında anında geçiş yapabilme ve canlı bağlantı testi.
- 🖤 **Koyu Grafit Siyah Tema**: Yüksek kontrastlı, net okunabilir siyah arayüz korundu.
- 🚀 **Otomatik Güncelleme**: Uygulama içi güncelleme desteği.`;

async function publish() {
  const headers = {
    Authorization: `Bearer ${TOKEN}`,
    Accept: 'application/vnd.github+json',
    'User-Agent': 'VelexClip-Release-Bot',
    'X-GitHub-Api-Version': '2022-11-28',
  };

  console.log(`Checking existing release for ${TAG}...`);
  let release = null;
  const listRes = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/releases`, { headers });
  if (listRes.ok) {
    const releases = await listRes.json();
    release = releases.find((r) => r.tag_name === TAG);
  }

  if (!release) {
    console.log(`Creating release ${TAG}...`);
    const createRes = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/releases`, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tag_name: TAG,
        name: NAME,
        body: BODY,
        draft: false,
        prerelease: false,
      }),
    });
    if (!createRes.ok) throw new Error(`Release creation failed: ${await createRes.text()}`);
    release = await createRes.json();
    console.log(`✓ Release created! ID: ${release.id}`);
  } else {
    console.log(`Release ${TAG} found! ID: ${release.id}`);
  }

  // Refetch release to get fresh asset list
  const freshReleaseRes = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/releases/${release.id}`, { headers });
  if (freshReleaseRes.ok) release = await freshReleaseRes.json();

  async function uploadAsset(localPath, targetName, contentType = 'application/octet-stream') {
    if (!fs.existsSync(localPath)) {
      console.warn(`File not found, skipping: ${localPath}`);
      return;
    }
    const stat = fs.statSync(localPath);
    console.log(`Uploading ${targetName} (${(stat.size / 1024 / 1024).toFixed(2)} MB)...`);

    const existingAsset = release.assets?.find((a) => a.name === targetName);
    if (existingAsset) {
      console.log(`Replacing existing asset ${targetName} (${existingAsset.id})...`);
      await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/releases/assets/${existingAsset.id}`, {
        method: 'DELETE',
        headers,
      });
    }

    const uploadUrl = `https://uploads.github.com/repos/${OWNER}/${REPO}/releases/${release.id}/assets?name=${encodeURIComponent(targetName)}`;
    const buffer = fs.readFileSync(localPath);
    const uploadRes = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        ...headers,
        'Content-Type': contentType,
        'Content-Length': String(buffer.length),
      },
      body: buffer,
    });

    if (!uploadRes.ok) {
      throw new Error(`Failed to upload ${targetName} (${uploadRes.status}): ${await uploadRes.text()}`);
    }
    const asset = await uploadRes.json();
    console.log(`✓ ${targetName} uploaded successfully: ${asset.browser_download_url}`);
  }

  const releaseDir = path.join(rootDir, 'release');
  const latestYmlPath = path.join(releaseDir, 'latest.yml');
  const kebabExe = path.join(releaseDir, `Velex-Clip-Setup-${pkg.version}.exe`);
  const spaceExe = path.join(releaseDir, `Velex Clip Setup ${pkg.version}.exe`);
  const exePath = fs.existsSync(kebabExe) ? kebabExe : spaceExe;

  const kebabBlockmap = path.join(releaseDir, `Velex-Clip-Setup-${pkg.version}.exe.blockmap`);
  const spaceBlockmap = path.join(releaseDir, `Velex Clip Setup ${pkg.version}.exe.blockmap`);
  const blockmapPath = fs.existsSync(kebabBlockmap) ? kebabBlockmap : spaceBlockmap;

  // Target names matching electron-builder / electron-updater manifest expectations
  const manifestExeName = `Velex-Clip-Setup-${pkg.version}.exe`;
  const manifestBlockmapName = `Velex-Clip-Setup-${pkg.version}.exe.blockmap`;

  // 1. Upload latest.yml
  await uploadAsset(latestYmlPath, 'latest.yml', 'text/yaml');

  // 2. Upload manifest-named setup exe (Velex-Clip-Setup-X.X.X.exe)
  await uploadAsset(exePath, manifestExeName, 'application/vnd.microsoft.portable-executable');

  // 3. Upload blockmap
  await uploadAsset(blockmapPath, manifestBlockmapName, 'application/octet-stream');

  console.log(`\n🎉 Release ${TAG} is fully published and ready for electron-updater!`);
}

publish().catch((err) => {
  console.error(err);
  process.exit(1);
});
