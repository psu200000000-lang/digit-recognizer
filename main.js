const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const https = require('https');
const fs = require('fs');

let mainWindow;
const historyFile = path.join(app.getPath('userData'), 'history.json');

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1080,
    height: 720,
    minWidth: 860,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    },
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
    backgroundColor: '#0d0d0d',
    show: false,
    title: '손글씨 숫자 인식기'
  });

  mainWindow.loadFile('index.html');
  mainWindow.once('ready-to-show', () => mainWindow.show());
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// ── API 인식 ──────────────────────────────────────────────────────
ipcMain.handle('recognize', async (event, { base64, apiKey }) => {
  return new Promise((resolve, reject) => {
    const prompt = [
      'This image shows a handwritten digit drawn with white strokes on a black background.',
      'Identify which digit (0-9) is written.',
      'Reply ONLY with a raw JSON object — no markdown, no explanation:',
      '{"digit":5,"confidence":0.95,"scores":{"0":0.01,"1":0.01,"2":0.01,"3":0.01,"4":0.01,"5":0.95,"6":0,"7":0,"8":0,"9":0}}',
      'digit = integer (0-9), confidence = float 0-1, scores must sum to ~1.0.',
      'If no digit is visible: {"digit":-1,"confidence":0,"scores":{"0":0.1,"1":0.1,"2":0.1,"3":0.1,"4":0.1,"5":0.1,"6":0.1,"7":0.1,"8":0.1,"9":0.1}}'
    ].join('\n');

    const body = JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 500,
      messages: [{
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type: 'image/png', data: base64 } },
          { type: 'text', text: prompt }
        ]
      }]
    });

    const req = https.request({
      hostname: 'api.anthropic.com',
      path: '/v1/messages',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
        'x-api-key': apiKey,
        'Content-Length': Buffer.byteLength(body)
      }
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.error) { reject(new Error(parsed.error.message)); return; }
          const text = (parsed.content || [])
            .map(i => i.text || '').join('')
            .replace(/```[\w]*\n?|```/g, '').trim();
          resolve(JSON.parse(text));
        } catch (e) {
          reject(new Error('응답 파싱 실패: ' + e.message));
        }
      });
    });

    req.on('error', err => reject(new Error('네트워크 오류: ' + err.message)));
    req.write(body);
    req.end();
  });
});

// ── 기록 저장/불러오기 ─────────────────────────────────────────────
ipcMain.handle('get-history', () => {
  try {
    if (fs.existsSync(historyFile)) {
      return JSON.parse(fs.readFileSync(historyFile, 'utf8'));
    }
  } catch (e) {}
  return [];
});

ipcMain.handle('save-history', (event, history) => {
  try {
    fs.writeFileSync(historyFile, JSON.stringify(history, null, 2), 'utf8');
    return true;
  } catch (e) { return false; }
});

ipcMain.handle('clear-history', () => {
  try {
    fs.writeFileSync(historyFile, '[]', 'utf8');
    return true;
  } catch (e) { return false; }
});

// ── API 키 저장 ────────────────────────────────────────────────────
const keyFile = path.join(app.getPath('userData'), 'config.json');

ipcMain.handle('get-api-key', () => {
  try {
    if (fs.existsSync(keyFile)) {
      return JSON.parse(fs.readFileSync(keyFile, 'utf8')).apiKey || '';
    }
  } catch (e) {}
  return '';
});

ipcMain.handle('save-api-key', (event, apiKey) => {
  try {
    fs.writeFileSync(keyFile, JSON.stringify({ apiKey }), 'utf8');
    return true;
  } catch (e) { return false; }
});
