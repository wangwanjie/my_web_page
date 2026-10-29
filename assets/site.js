// 家庭服务器管理中心主页脚本：三语切换、三态主题、远程开机示意动画、截图切换、滚动渐入
(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  var darkQuery = matchMedia('(prefers-color-scheme: dark)');

  // ---------- 文案 ----------
  // 简体中文直接取自 HTML 初始内容，这里只维护英文与繁体
  var META = {
    'zh-CN': {
      title: '家庭服务器管理中心 — 自托管的远程开关机与定时任务控制台',
      desc: '家庭服务器管理中心是一个自托管的 Web 控制台：网络唤醒远程开机，SSH 关机与重启，把定时关机写进服务器的 crontab，并集中管理家里常用服务的入口。Docker 一键部署。'
    },
    en: {
      title: 'Home Server Manager — self-hosted power control and schedules for your homelab',
      desc: 'Home Server Manager is a self-hosted web console: wake servers with Wake-on-LAN, shut down or reboot them over SSH, write scheduled shutdowns into each server\'s crontab, and keep your home service shortcuts on one page. Deploys with Docker Compose.'
    },
    'zh-TW': {
      title: '家庭伺服器管理中心 — 自架的遠端開關機與排程控制台',
      desc: '家庭伺服器管理中心是一個自架的 Web 控制台：網路喚醒遠端開機，透過 SSH 關機與重新啟動，把定時關機寫進伺服器的 crontab，並集中管理家中常用服務的入口。以 Docker 一鍵部署。'
    }
  };

  var DICT = {
    en: {
      skip: 'Skip to content',
      brand: 'Home Server Manager',
      iconAlt: 'Home Server Manager icon',
      navAria: 'Page sections',
      navFeatures: 'Features',
      navShots: 'Screens',
      navDeploy: 'Deploy',
      navPrivacy: 'Data & security',
      langAria: 'Language',
      themeAria: 'Theme',
      themeLight: 'Light',
      themeDark: 'Dark',
      themeSystem: 'Match system',
      ghAria: 'GitHub repository',
      kicker: 'Self-hosted · Docker · amd64 / arm64',
      heroTitle: 'Wake <em>every server</em><br>at home with one click',
      heroLead: 'Home Server Manager is a self-hosted web console. It wakes machines with Wake-on-LAN, shuts them down or reboots them over SSH, writes scheduled shutdowns into each server\'s own crontab, and keeps the shortcuts to your home services on one page.',
      ctaDeploy: 'Deploy with Docker',
      ctaRelease: 'View release',
      factHub: 'Images on Docker Hub',
      factPort: 'Default port 3800',
      demoTag: 'Illustration',
      powerAria: 'Wake the next server',
      ctrlTitle: 'Press power to wake the next node',
      featTitle: 'Power, schedules and shortcuts on one panel',
      featLead: 'Signed in as admin, you get the server list, manual controls and scheduled tasks on a single page. Visitors who are not signed in only see the shortcuts you choose to make public.',
      f1t: 'Wake-on-LAN power on',
      f1d: 'Save a server\'s MAC address, press Wake, and a Wake-on-LAN magic packet goes out to <code>255.255.255.255:9</code>.',
      f2t: 'Shutdown and reboot over SSH',
      f2d: 'Runs <code>/sbin/shutdown -h now</code> or <code>/sbin/reboot</code> over SSH. Private key and password auth are supported, and you can test the connection and see its latency before saving.',
      f3t: 'Scheduled shutdown and reboot',
      f3d: 'Pick a time and every day or specific weekdays. The job is written into the target server\'s own crontab, so it still runs while the manager is offline. Existing jobs can be viewed, edited, disabled and removed.',
      f4t: 'Service shortcuts',
      f4d: 'Group your NAS, router, media and other services. Each shortcut can hold LAN, FRP, IPv6 and Cloudflare addresses; LAN addresses are shown to the admin only, and groups can be made visible without signing in.',
      f5t: 'Sign-in protection',
      f5d: 'The admin account supports TOTP two-factor authentication and optional Google, GitHub and QQ sign-in. Expired sessions prompt you to sign in again.',
      f6t: 'Two images, ready to run',
      f6d: 'One frontend image and one backend image, both built for linux/amd64 and linux/arm64. All data lives in a single SQLite volume, so a backup is a copy of that volume.',
      shotTitle: 'The real interface',
      shotLead: 'Light and dark themes are built in, and the panel works on a phone too.',
      t0: 'Manual control',
      t1: 'Servers & schedules',
      t2: 'New scheduled task',
      t3: 'Add server',
      t4: 'Shortcuts',
      a0: 'Manual control: test, wake, reboot and shutdown buttons for each server',
      a1: 'Server cards with their scheduled task lists',
      a2: 'New scheduled task dialog: action, time, repeat mode and cron preview',
      a3: 'Add server dialog in the light theme: host, SSH port, MAC address and auth method',
      a4: 'Grouped service shortcuts in the light theme',
      aMobile: 'Devices and scheduled tasks on a phone',
      shotCap: 'Screenshots come from a demo instance running locally; all servers and shortcuts are sample data. The interface itself is in Simplified Chinese.',
      depTitle: 'Deploy with Docker Compose',
      depLead: 'You need a Linux host (amd64 or arm64) with Docker and Docker Compose, on the same LAN as the servers you want to manage. The images are public on Docker Hub and pull directly.',
      s1t: 'Download the compose file',
      s1d: 'Create a directory and download docker-compose.yml and the environment template.',
      s2t: 'Generate secrets',
      s2d: 'Fill the three signing secrets with random values, then set <code>APP_BASE_URL</code> to the address you use to open the panel.',
      s3t: 'Start',
      s3d: 'Then open <code>http://HOST-IP:3800</code> in a browser.',
      s4t: 'Sign in and change the default password',
      s4d: 'On first start the admin account is <code>admin</code> with password <code>ChangeMe123!</code>.',
      s4w: '<strong>Change it right away:</strong> after signing in, open 设置 (Settings) → 管理员设置 (Admin settings) to set a new username and password, then turn on TOTP under 双因素认证 (Two-factor authentication). The default password is the same on every install.',
      s5t: 'Upgrade',
      s5d: 'Pull the new images and recreate the containers. The data volume is kept.',
      cTitle: 'Full docker-compose.yml',
      cLead: 'Same as the file in the release, without comments.',
      wolTitle: 'For Wake-on-LAN',
      wolD: 'The magic packet is broadcast from the backend container, and Docker\'s default bridge network usually does not forward it to your LAN. To power machines on, uncomment <code>network_mode: host</code> and the two <code>extra_hosts</code> lines, then run <code>docker compose up -d</code> again; the backend then uses the host network and takes port 3001. The target machine also needs Wake-on-LAN enabled in its BIOS and network card.',
      reqTitle: 'Requirements',
      req1: 'A Linux host on linux/amd64 or linux/arm64 with Docker and the Docker Compose plugin',
      req2: 'SSH enabled on managed servers; shutdown and reboot need a login user allowed to run shutdown / reboot',
      req3: 'Scheduled tasks are managed with crontab, so the target server needs a working crontab command',
      pTitle: 'Your data stays on your host',
      p1t: 'Local SQLite',
      p1d: 'The server list, SSH credentials, shortcuts and settings are stored in a SQLite file inside the <code>backend_data</code> volume. There is no analytics or telemetry.',
      p2t: 'Guard your credentials',
      p2d: 'SSH passwords and private keys are stored in the database as plain text. Restrict access to the host and the volume, and prefer private keys with limited privileges.',
      p3t: 'Be careful with public exposure',
      p3d: 'This panel can power off your servers. Keep it on your LAN or VPN; if it must be reachable from the internet, put it behind an HTTPS reverse proxy and enable two-factor authentication.',
      more: 'More from VanJay',
      feedback: 'Feedback'
    },
    'zh-TW': {
      skip: '跳到正文',
      brand: '家庭伺服器管理中心',
      iconAlt: '家庭伺服器管理中心圖示',
      navAria: '頁面導覽',
      navFeatures: '功能',
      navShots: '介面',
      navDeploy: '部署',
      navPrivacy: '資料與安全',
      langAria: '語言',
      themeAria: '主題',
      themeLight: '淺色',
      themeDark: '深色',
      themeSystem: '跟隨系統',
      ghAria: 'GitHub 儲存庫',
      kicker: '自架 · Docker · amd64 / arm64',
      heroTitle: '一鍵喚醒<br>家裡的<em>每一台伺服器</em>',
      heroLead: '家庭伺服器管理中心是一個自架的 Web 控制台：用網路喚醒遠端開機，透過 SSH 關機和重新啟動，把定時關機寫進伺服器自己的 crontab，再把家中常用服務的入口集中到一頁。',
      ctaDeploy: '用 Docker 部署',
      ctaRelease: '查看 Release',
      factHub: '映像檔發布在 Docker Hub',
      factPort: '預設連接埠 3800',
      demoTag: '示意動畫',
      powerAria: '喚醒下一台伺服器',
      ctrlTitle: '按下電源鍵，喚醒下一台',
      featTitle: '開機、關機、排程和入口，放在一個面板裡',
      featLead: '登入管理員帳號後，伺服器清單、手動控制和排程任務都在同一頁；未登入的訪客只會看到你允許公開的服務入口。',
      f1t: '網路喚醒遠端開機',
      f1d: '為伺服器填好 MAC 位址，按「喚醒」就會向 <code>255.255.255.255:9</code> 傳送網路喚醒魔術封包。',
      f2t: 'SSH 關機與重新啟動',
      f2d: '透過 SSH 執行 <code>/sbin/shutdown -h now</code> 或 <code>/sbin/reboot</code>。支援私鑰與密碼驗證，儲存前可以先測試連線並查看耗時。',
      f3t: '定時關機與重新啟動',
      f3d: '選好時間和每天或指定星期，任務會寫進目標伺服器自己的 crontab，管理中心離線時照常執行；既有任務可檢視、編輯、停用和刪除。',
      f4t: '服務入口導覽',
      f4d: '依群組整理 NAS、路由器、影音等常用服務。每個入口可填內網、FRP、IPv6、Cloudflare 四種位址，內網位址只對管理員顯示，群組可設為未登入可見。',
      f5t: '登入保護',
      f5d: '管理員帳號支援 TOTP 雙因素驗證，可選擇接入 Google、GitHub、QQ 第三方登入，存取權杖過期後會提示重新登入。',
      f6t: '兩個映像檔，開箱即用',
      f6d: '前端與後端各一個映像檔，同時提供 linux/amd64 與 linux/arm64。所有資料都存在一個 SQLite 資料卷裡，備份只需複製這個資料卷。',
      shotTitle: '真實介面',
      shotLead: '介面內建淺色與深色兩套主題，手機上同樣可以操作。',
      t0: '手動控制',
      t1: '伺服器與排程任務',
      t2: '新增排程任務',
      t3: '新增伺服器',
      t4: '服務入口',
      a0: '手動控制：每台伺服器的測試、喚醒、重新啟動、關機按鈕',
      a1: '伺服器卡片與各自的排程任務清單',
      a2: '新增排程任務對話框：操作、執行時間、重複模式與 Cron 運算式預覽',
      a3: '淺色主題下的新增伺服器對話框：主機位址、SSH 連接埠、MAC 位址與驗證方式',
      a4: '淺色主題下依群組顯示的服務入口',
      aMobile: '手機上的裝置與排程任務頁面',
      shotCap: '截圖來自本機啟動的示範實例，伺服器與入口均為範例資料；介面本身為簡體中文。',
      depTitle: '用 Docker Compose 部署',
      depLead: '準備一台裝有 Docker 與 Docker Compose 的 Linux 主機（amd64 或 arm64），並和要管理的伺服器在同一個區域網路。映像檔公開發布在 Docker Hub，直接拉取即可。',
      s1t: '下載編排檔案',
      s1d: '建立一個目錄，下載 docker-compose.yml 和環境變數範本。',
      s2t: '產生金鑰',
      s2d: '為三個簽章金鑰寫入隨機值，再把 <code>APP_BASE_URL</code> 改成你開啟面板的位址。',
      s3t: '啟動',
      s3d: '啟動後在瀏覽器開啟 <code>http://主機IP:3800</code>。',
      s4t: '登入並修改預設密碼',
      s4d: '首次啟動的管理員帳號是 <code>admin</code>，密碼 <code>ChangeMe123!</code>。',
      s4w: '<strong>務必立即修改：</strong>登入後開啟「设置 → 管理员设置」更換使用者名稱和密碼，再到「双因素认证」開啟 TOTP。預設密碼在每一份安裝中都相同。',
      s5t: '升級',
      s5d: '拉取新映像檔後重建容器，資料卷會保留。',
      cTitle: '完整的 docker-compose.yml',
      cLead: '與 Release 中的檔案一致（省略了註解）。',
      wolTitle: '需要遠端開機時',
      wolD: '網路喚醒魔術封包從後端容器送往廣播位址，Docker 預設的橋接網路通常不會把它轉送到區域網路。需要遠端開機時，取消 <code>network_mode: host</code> 和 <code>extra_hosts</code> 兩處註解後重新執行 <code>docker compose up -d</code>，後端會直接使用主機網路並佔用 3001 連接埠。目標機器還需要在 BIOS 與網路卡中開啟 Wake-on-LAN。',
      reqTitle: '執行需求',
      req1: 'Linux 主機，linux/amd64 或 linux/arm64，已安裝 Docker 與 Docker Compose 外掛',
      req2: '受管理的伺服器開啟 SSH，關機與重新啟動需要登入使用者有執行 shutdown / reboot 的權限',
      req3: '排程任務透過 crontab 管理，目標伺服器需要可用的 crontab 指令',
      pTitle: '資料留在你自己的主機上',
      p1t: '本機 SQLite',
      p1d: '伺服器清單、SSH 憑證、服務入口和設定都存在 <code>backend_data</code> 資料卷的 SQLite 檔案裡。沒有統計和遙測。',
      p2t: '保護好憑證',
      p2d: 'SSH 密碼與私鑰以原文存在資料庫中。請限制主機與資料卷的存取權限，並優先使用權限受限的私鑰。',
      p3t: '謹慎暴露到公網',
      p3d: '面板能直接關閉你的伺服器。建議只在區域網路或 VPN 內存取；確需公網存取時放在 HTTPS 反向代理之後，並開啟雙因素驗證。',
      more: 'VanJay 的更多作品',
      feedback: '回報問題'
    }
  };

  // 收集 HTML 中的简体原文作为 zh-CN 字典
  var base = {};
  document.querySelectorAll('[data-i18n]').forEach(function (el) {
    base[el.getAttribute('data-i18n')] = el.textContent;
  });
  document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
    base[el.getAttribute('data-i18n-html')] = el.innerHTML;
  });
  document.querySelectorAll('[data-i18n-alt]').forEach(function (el) {
    base[el.getAttribute('data-i18n-alt')] = el.getAttribute('alt');
  });
  document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
    base[el.getAttribute('data-i18n-aria')] = el.getAttribute('aria-label');
  });
  DICT['zh-CN'] = base;

  function setMeta(selector, value) {
    var m = document.querySelector(selector);
    if (m) {
      m.setAttribute('content', value);
    }
  }

  function applyLang(lang) {
    var d = DICT[lang] || DICT.en;
    var pick = function (key) {
      return d[key] !== undefined ? d[key] : base[key];
    };
    root.setAttribute('lang', lang);
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      el.textContent = pick(el.getAttribute('data-i18n'));
    });
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      el.innerHTML = pick(el.getAttribute('data-i18n-html'));
    });
    document.querySelectorAll('[data-i18n-alt]').forEach(function (el) {
      el.setAttribute('alt', pick(el.getAttribute('data-i18n-alt')));
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
      el.setAttribute('aria-label', pick(el.getAttribute('data-i18n-aria')));
    });
    document.title = META[lang].title;
    setMeta('meta[name="description"]', META[lang].desc);
    setMeta('meta[property="og:description"]', META[lang].desc);
    document.querySelectorAll('#langSeg button').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-lang') === lang));
    });
  }

  document.querySelectorAll('#langSeg button').forEach(function (b) {
    b.addEventListener('click', function () {
      var lang = b.getAttribute('data-lang');
      localStorage.setItem('hsm-lang', lang);
      applyLang(lang);
    });
  });
  applyLang(root.getAttribute('lang'));

  // ---------- 主题 ----------
  function applyTheme(pref) {
    var dark = pref === 'dark' || (pref === 'system' && darkQuery.matches);
    root.setAttribute('data-theme', dark ? 'dark' : 'light');
    root.setAttribute('data-theme-pref', pref);
    setMeta('meta[name="theme-color"]', dark ? '#060a12' : '#f3f4f1');
    document.querySelectorAll('#themeSeg button').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-theme-btn') === pref));
    });
    redrawAll();
  }

  document.querySelectorAll('#themeSeg button').forEach(function (b) {
    b.addEventListener('click', function () {
      var pref = b.getAttribute('data-theme-btn');
      localStorage.setItem('hsm-theme', pref);
      applyTheme(pref);
    });
  });
  darkQuery.addEventListener('change', function () {
    if (root.getAttribute('data-theme-pref') === 'system') {
      applyTheme('system');
    }
  });

  // ---------- 远程开机示意动画 ----------
  var body = document.getElementById('consoleBody');
  var consoleEl = document.getElementById('console');
  var powerKey = document.getElementById('powerKey');
  var logEl = document.getElementById('log');
  var nodes = Array.prototype.map.call(document.querySelectorAll('.node'), function (el, i) {
    var canvas = el.querySelector('canvas');
    var data = [];
    for (var k = 0; k < 40; k++) {
      data.push(0);
    }
    return {
      el: el,
      canvas: canvas,
      ctx: canvas.getContext('2d'),
      data: data,
      phase: i * 1.7,
      base: [0.38, 0.55, 0.3][i] || 0.4,
      stats: el.querySelectorAll('.node-stats b'),
      state: 'off'
    };
  });

  var heroVisible = true;
  var pageVisible = !document.hidden;
  var autoTimer = null;
  var rafId = 0;
  var lastTick = 0;
  var manualUntil = 0;

  function css(name) {
    return getComputedStyle(root).getPropertyValue(name).trim();
  }

  function onlineCount() {
    return nodes.filter(function (n) {
      return n.state === 'on';
    }).length;
  }

  function log(html) {
    logEl.innerHTML = html;
  }

  function setState(n, state) {
    n.state = state;
    n.el.setAttribute('data-state', state);
    n.el.querySelector('.node-state').textContent = state === 'on' ? 'ONLINE' : state === 'wake' ? 'WAKING' : 'OFFLINE';
    if (state !== 'on') {
      n.stats[0].textContent = '--';
      n.stats[1].textContent = '--';
    }
    if (state === 'off') {
      for (var k = 0; k < n.data.length; k++) {
        n.data[k] = 0;
      }
    }
    draw(n);
  }

  // 让 canvas 匹配显示尺寸与像素密度
  function fit(n) {
    var r = n.canvas.getBoundingClientRect();
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = Math.max(1, Math.round(r.width * dpr));
    var h = Math.max(1, Math.round(r.height * dpr));
    if (n.canvas.width !== w || n.canvas.height !== h) {
      n.canvas.width = w;
      n.canvas.height = h;
    }
  }

  function draw(n) {
    fit(n);
    var c = n.ctx;
    var w = n.canvas.width;
    var h = n.canvas.height;
    c.clearRect(0, 0, w, h);
    var color = n.state === 'on' ? css('--green') : css('--off');
    var step = w / (n.data.length - 1);
    var pad = h * 0.12;
    c.beginPath();
    for (var i = 0; i < n.data.length; i++) {
      var y = h - pad - n.data[i] * (h - pad * 2);
      if (i === 0) {
        c.moveTo(0, y);
      } else {
        c.lineTo(i * step, y);
      }
    }
    c.lineWidth = Math.max(1.5, h / 30);
    c.strokeStyle = color;
    c.lineJoin = 'round';
    c.stroke();
    if (n.state === 'on') {
      c.lineTo(w, h);
      c.lineTo(0, h);
      c.closePath();
      var g = c.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, color + '55');
      g.addColorStop(1, color + '00');
      // 颜色是十六进制时才能拼接透明度，否则只描线
      if (/^#[0-9a-f]{6}$/i.test(color)) {
        c.fillStyle = g;
        c.fill();
      }
    }
  }

  function redrawAll() {
    nodes.forEach(draw);
  }

  // 在线节点推入新的指标值
  function tickData(t) {
    nodes.forEach(function (n) {
      if (n.state !== 'on') {
        return;
      }
      n.phase += 0.35;
      var v = n.base + Math.sin(n.phase) * 0.12 + Math.sin(n.phase * 2.3) * 0.06 + (Math.random() - 0.5) * 0.22;
      v = Math.max(0.05, Math.min(0.95, v));
      n.data.shift();
      n.data.push(v);
      n.stats[0].textContent = Math.round(v * 100) + '%';
      n.stats[1].textContent = Math.round((n.base + 0.2) * 100 + Math.sin(n.phase / 4) * 3) + '%';
      draw(n);
    });
  }

  function loop(t) {
    rafId = 0;
    if (!running()) {
      return;
    }
    if (t - lastTick > 140) {
      lastTick = t;
      tickData(t);
    }
    rafId = requestAnimationFrame(loop);
  }

  function running() {
    return heroVisible && pageVisible && !reduceMotion.matches;
  }

  function kick() {
    if (running() && !rafId) {
      rafId = requestAnimationFrame(loop);
    }
  }

  // 魔术包从电源键飞向节点的状态灯
  function flyPackets(n, done) {
    var b = body.getBoundingClientRect();
    var p = powerKey.getBoundingClientRect();
    var l = n.el.querySelector('.lamp').getBoundingClientRect();
    var x0 = p.left + p.width / 2 - b.left;
    var y0 = p.top + p.height / 2 - b.top;
    var x1 = l.left + l.width / 2 - b.left;
    var y1 = l.top + l.height / 2 - b.top;
    var mx = (x0 + x1) / 2;
    var my = Math.min(y0, y1) - 26;
    var count = 3;
    var finished = 0;
    for (var i = 0; i < count; i++) {
      var dot = document.createElement('span');
      dot.className = 'pkt';
      body.appendChild(dot);
      var anim = dot.animate([
        { transform: 'translate(' + x0 + 'px,' + y0 + 'px) scale(.6)', opacity: 0 },
        { transform: 'translate(' + x0 + 'px,' + y0 + 'px) scale(1)', opacity: 1, offset: 0.08 },
        { transform: 'translate(' + mx + 'px,' + my + 'px) scale(1.1)', opacity: 1, offset: 0.5 },
        { transform: 'translate(' + x1 + 'px,' + y1 + 'px) scale(.5)', opacity: 0.2 }
      ], { duration: 780, delay: i * 120, easing: 'cubic-bezier(.45,.05,.4,1)', fill: 'forwards' });
      anim.onfinish = (function (d) {
        return function () {
          d.remove();
          finished++;
          if (finished === count) {
            done();
          }
        };
      })(dot);
    }
  }

  function press() {
    powerKey.classList.remove('press');
    void powerKey.offsetWidth;
    powerKey.classList.add('press');
    setTimeout(function () {
      powerKey.classList.remove('press');
    }, 180);
  }

  function wake(n) {
    if (n.state !== 'off') {
      return;
    }
    press();
    setState(n, 'wake');
    log('<b>wol</b> ' + n.el.getAttribute('data-mac') + ' → 255.255.255.255:9');
    var finish = function () {
      setTimeout(function () {
        setState(n, 'on');
        log('<b>ssh</b> ' + n.el.querySelector('.node-name').textContent + ' · up · ' + onlineCount() + '/3 online');
        kick();
      }, reduceMotion.matches ? 0 : 650);
    };
    if (reduceMotion.matches) {
      finish();
    } else {
      flyPackets(n, finish);
    }
  }

  function shutdown(n) {
    if (n.state !== 'on') {
      return;
    }
    setState(n, 'off');
    log('<b>ssh</b> ' + n.el.querySelector('.node-name').textContent + ' · /sbin/shutdown -h now');
  }

  function wakeNext() {
    var next = nodes.filter(function (n) {
      return n.state === 'off';
    })[0];
    if (next) {
      wake(next);
    }
    return next;
  }

  // 自动演示：逐台唤醒，全部在线后依次关机，循环
  function autoStep() {
    autoTimer = null;
    if (!running()) {
      return;
    }
    var delay = 2200;
    if (Date.now() < manualUntil) {
      delay = manualUntil - Date.now();
    } else if (!wakeNext()) {
      var on = nodes.filter(function (n) {
        return n.state === 'on';
      });
      if (on.length && nodes.every(function (n) {
        return n.state === 'on';
      }) && !autoStep.holding) {
        autoStep.holding = true;
        delay = 4200;
      } else if (on.length) {
        autoStep.holding = false;
        shutdown(on[on.length - 1]);
        delay = on.length === 1 ? 1600 : 700;
      }
    }
    autoTimer = setTimeout(autoStep, delay);
  }

  function startAuto() {
    if (!autoTimer && running()) {
      autoTimer = setTimeout(autoStep, 900);
    }
  }

  function stopAuto() {
    if (autoTimer) {
      clearTimeout(autoTimer);
      autoTimer = null;
    }
  }

  powerKey.addEventListener('click', function () {
    manualUntil = Date.now() + 6000;
    if (!wakeNext()) {
      nodes.forEach(shutdown);
    }
  });
  nodes.forEach(function (n) {
    n.el.addEventListener('click', function () {
      manualUntil = Date.now() + 6000;
      if (n.state === 'off') {
        wake(n);
      } else if (n.state === 'on') {
        shutdown(n);
      }
    });
  });

  // 动画只在首屏可见、页面可见且未要求减少动态效果时运行
  function sync() {
    if (running()) {
      kick();
      startAuto();
    } else {
      stopAuto();
    }
  }

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      heroVisible = entries[0].isIntersecting;
      sync();
    }).observe(consoleEl);
  }
  document.addEventListener('visibilitychange', function () {
    pageVisible = !document.hidden;
    sync();
  });
  reduceMotion.addEventListener('change', function () {
    applyReduced();
    sync();
  });

  // 减少动态效果时直接展示全部在线的静态画面
  function applyReduced() {
    if (!reduceMotion.matches) {
      return;
    }
    nodes.forEach(function (n) {
      n.state = 'on';
      for (var k = 0; k < n.data.length; k++) {
        n.data[k] = Math.max(0.05, Math.min(0.95, n.base + Math.sin(k * 0.6 + n.phase) * 0.15));
      }
      n.el.setAttribute('data-state', 'on');
      n.el.querySelector('.node-state').textContent = 'ONLINE';
      n.stats[0].textContent = Math.round(n.base * 100) + '%';
      n.stats[1].textContent = Math.round((n.base + 0.2) * 100) + '%';
    });
    log('<b>ssh</b> 3/3 online');
    redrawAll();
  }

  // 指针倾斜：只改 transform
  if (matchMedia('(hover: hover)').matches) {
    consoleEl.addEventListener('pointermove', function (e) {
      if (reduceMotion.matches) {
        return;
      }
      var r = consoleEl.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5;
      var y = (e.clientY - r.top) / r.height - 0.5;
      consoleEl.style.setProperty('--ry', (x * 5).toFixed(2) + 'deg');
      consoleEl.style.setProperty('--rx', (-y * 4).toFixed(2) + 'deg');
    });
    consoleEl.addEventListener('pointerleave', function () {
      consoleEl.style.setProperty('--ry', '0deg');
      consoleEl.style.setProperty('--rx', '0deg');
    });
    document.querySelectorAll('.feat').forEach(function (f) {
      f.addEventListener('pointermove', function (e) {
        var r = f.getBoundingClientRect();
        f.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        f.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });
  }

  window.addEventListener('resize', redrawAll);

  // ---------- 截图切换 ----------
  var tabs = document.querySelectorAll('#tabs button');
  var frames = document.querySelectorAll('#frame img');
  tabs.forEach(function (t) {
    t.addEventListener('click', function () {
      var idx = +t.getAttribute('data-shot');
      tabs.forEach(function (o) {
        o.setAttribute('aria-selected', String(o === t));
      });
      frames.forEach(function (img, i) {
        if (i === idx) {
          img.loading = 'eager';
        }
        img.classList.toggle('on', i === idx);
      });
    });
  });

  // ---------- 复制按钮 ----------
  document.querySelectorAll('.code').forEach(function (box) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'copy';
    btn.textContent = 'copy';
    btn.addEventListener('click', function () {
      var text = box.querySelector('code').textContent;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(function () {
          btn.textContent = 'copied';
          setTimeout(function () {
            btn.textContent = 'copy';
          }, 1400);
        });
      }
    });
    box.appendChild(btn);
  });

  // ---------- 滚动渐入 ----------
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion.matches) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) {
      io.observe(el);
    });
  } else {
    reveals.forEach(function (el) {
      el.classList.add('in');
    });
  }

  document.getElementById('year').textContent = new Date().getFullYear();
  applyTheme(root.getAttribute('data-theme-pref') || 'system');
  applyReduced();
  sync();
})();
