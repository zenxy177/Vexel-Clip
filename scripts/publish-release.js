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
const NAME = `Velex Clip v${pkg.version}`;

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
        body: `Velex Clip ${TAG} sürümü yayınlandı.`,
        draft: false,
        prerelease: false,
      }),
    });
    if (!createRes.ok) throw new Error(`Release creation failed: ${await createRes.text()}`);
    release = await createRes.json();
  }

  const exeName = `Velex Clip Setup ${pkg.version}.exe`;
  const exePath = path.join(rootDir, 'release', exeName);
  if (!fs.existsSync(exePath)) {
    throw new Error(`Build file not found at ${exePath}. Run npm run desktop:dist first.`);
  }

  const stat = fs.statSync(exePath);
  console.log(`Uploading ${exeName} (${(stat.size / 1024 / 1024).toFixed(1)} MB)...`);

  const existingAsset = release.assets?.find((a) => a.name === exeName);
  if (existingAsset) {
    console.log(`Replacing existing asset ${existingAsset.id}...`);
    await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/releases/assets/${existingAsset.id}`, {
      method: 'DELETE',
      headers,
    });
  }

  const uploadUrl = `https://uploads.github.com/repos/${OWNER}/${REPO}/releases/${release.id}/assets?name=${encodeURIComponent(exeName)}`;
  const buffer = fs.readFileSync(exePath);

  const uploadRes = await fetch(uploadUrl, {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/octet-stream',
      'Content-Length': String(buffer.length),
    },
    body: buffer,
  });

  if (!uploadRes.ok) throw new Error(`Asset upload failed: ${await uploadRes.text()}`);
  const asset = await uploadRes.json();
  console.log(`Successfully published ${TAG}! Asset URL: ${asset.browser_download_url}`);
}

publish().catch((err) => {
  console.error(err);
  process.exit(1);
});
