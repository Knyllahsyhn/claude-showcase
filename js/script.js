(() => {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ==========================================================
     0. Titlebar reacts to scroll position
     ========================================================== */
  (() => {
    const titlebarText = document.getElementById('titlebar-text');
    const sections = Array.from(document.querySelectorAll('[data-title]'));
    if (!titlebarText || !sections.length) return;

    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          titlebarText.textContent = 'tobi@localhost: ' + entry.target.dataset.title;
        }
      });
    }, { rootMargin: '-45% 0px -45% 0px' });

    sections.forEach((s) => obs.observe(s));
  })();

  /* ==========================================================
     1. Hero typewriter
     ========================================================== */
  (() => {
    const el = document.getElementById('hero-typewriter');
    if (!el) return;

    const lines = [
      { cls: 'line-prompt', text: '$ whoami' },
      { cls: 'line-out', text: '> ein Nachmittag mit Claude Code' },
      { cls: 'line-prompt', text: '$ cat mission.txt' },
      { cls: 'line-mission', text: 'Zeig Tobi in ein paar Minuten, was hier wirklich geht.' },
    ];

    if (prefersReducedMotion) {
      el.innerHTML = lines.map(l => `<div class="${l.cls}">${l.text}</div>`).join('');
      return;
    }

    let li = 0, ci = 0;
    const cursor = document.createElement('span');
    cursor.className = 'cursor-blink';
    cursor.textContent = '_';

    function typeStep() {
      if (li >= lines.length) {
        el.appendChild(cursor);
        return;
      }
      let lineDiv = el.querySelector(`[data-line="${li}"]`);
      if (!lineDiv) {
        lineDiv = document.createElement('div');
        lineDiv.className = lines[li].cls;
        lineDiv.dataset.line = String(li);
        el.appendChild(lineDiv);
      }
      const full = lines[li].text;
      ci++;
      lineDiv.textContent = full.slice(0, ci);
      if (ci >= full.length) {
        li++;
        ci = 0;
        setTimeout(typeStep, 220);
      } else {
        setTimeout(typeStep, 14 + Math.random() * 20);
      }
    }
    typeStep();
  })();

  /* ==========================================================
     2. Roast generator
     ========================================================== */
  (() => {
    const btn = document.getElementById('roast-btn');
    const out = document.getElementById('roast-output');
    if (!btn || !out) return;

    const roasts = [
      'Tobi, dein Code kompiliert nur, weil die Physik heute frei hat.',
      'Tobi, dein letzter Commit heißt "fix" — der neunte in Folge.',
      'Tobi, dein Code läuft in Prod, aber niemand weiß warum. Am wenigsten du.',
      'Tobi, du hast einen Bug gefixt und drei neue als Dankeschön bekommen.',
      'Tobi, dein Git-Log liest sich wie ein Krimi ohne Auflösung.',
      'Tobi, "TODO: später aufräumen" steht seit 2021 in Zeile 4.',
      'Tobi, dein Stack Overflow Tab ist älter als manche Junior-Devs.',
      'Tobi, du hast console.log("hier") drin gelassen. Wir sehen es alle.',
      'Tobi, dein Code funktioniert — aber nur wenn du daneben stehst und guckst.',
      'Tobi, du nennst es "Legacy Code". Wir nennen es "Montag".',
    ];
    let last = -1;
    btn.addEventListener('click', () => {
      let i;
      do { i = Math.floor(Math.random() * roasts.length); } while (i === last && roasts.length > 1);
      last = i;
      out.innerHTML = '$ ./roast.sh --target=tobi<br><span class="highlight">&gt; ' + roasts[i] + '</span>';
    });
  })();

  /* ==========================================================
     3. Excuse generator
     ========================================================== */
  (() => {
    const btn = document.getElementById('excuse-btn');
    const out = document.getElementById('excuse-output');
    if (!btn || !out) return;

    const excuses = [
      'Das war beim letzten Refactor noch grün. Ich schwöre.',
      'Funktioniert lokal. "Lokal" ist jetzt ein Rechtsbegriff.',
      'Der Cache war schuld. Der Cache ist immer schuld.',
      'Ein Byte hat sich entschieden, heute anders zu sein.',
      'Das war ein Feature. Das Ticket kommt gleich.',
      'Mercury war rückläufig, das steht nirgendwo im Code, aber ich weiß es.',
      'Es lag am Zeitzonen-Offset. Es liegt immer am Zeitzonen-Offset.',
      'Die Staging-Umgebung hat sich das nur eingebildet.',
      'Da war ein Leerzeichen zu viel. Genau eins. Irgendwo.',
      'CI ist grün, Prod ist rot — Statistik sagt: im Schnitt läuft es.',
    ];
    let last = -1;
    btn.addEventListener('click', () => {
      let i;
      do { i = Math.floor(Math.random() * excuses.length); } while (i === last && excuses.length > 1);
      last = i;
      out.innerHTML = '$ cargo run --release<br><span class="highlight">&gt; ' + excuses[i] + '</span>';
    });
  })();

  /* ==========================================================
     4. Compiler-Horoskop
     ========================================================== */
  (() => {
    const btn = document.getElementById('fortune-btn');
    const out = document.getElementById('fortune-output');
    if (!btn || !out) return;

    const fortunes = [
      'Heute wird dein erster Versuch nicht funktionieren. Dein dritter auch nicht. Der vierte schon.',
      'Ein Merge-Konflikt sucht dich. Er findet dich um 16:47 Uhr.',
      'Deine Variable "temp" wird die nächsten zwei Jahre überleben.',
      'Heute schreibst du einen Kommentar, den du in sechs Monaten nicht verstehst.',
      'Ein Semikolon fehlt. Du findest es erst nach dem dritten console.log.',
      'Dein Code wird heute funktionieren. Frag nicht warum. Frag nie warum.',
      'Die Doku lügt nicht — sie ist nur seit drei Versionen nicht aktualisiert.',
      'Du wirst heute "es funktioniert bei mir" sagen. Es wird nicht reichen.',
      'Ein Test wird heute rot. Er hat schon lange rot sein wollen.',
      'Deine nächste Idee um 23 Uhr ist besser als alles, was du tagsüber hattest.',
    ];
    let last = -1;
    btn.addEventListener('click', () => {
      let i;
      do { i = Math.floor(Math.random() * fortunes.length); } while (i === last && fortunes.length > 1);
      last = i;
      out.innerHTML = '$ fortune --coding<br><span class="highlight">&gt; ' + fortunes[i] + '</span>';
    });
  })();

  /* ==========================================================
     5. ASCII banner — real pixel sampling from a canvas
     ========================================================== */
  (() => {
    const input = document.getElementById('ascii-input');
    const btn = document.getElementById('ascii-btn');
    const out = document.getElementById('ascii-output');
    const canvas = document.getElementById('ascii-canvas');
    if (!input || !btn || !out || !canvas) return;

    const ctx = canvas.getContext('2d');
    const ramp = ' .:-=+*#%@';

    function render() {
      const text = (input.value || 'TOBI').toUpperCase().slice(0, 12);
      const w = canvas.width, h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#fff';
      ctx.font = '800 90px "JetBrains Mono", monospace';
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';
      ctx.fillText(text, w / 2, h / 2 + 6);

      const data = ctx.getImageData(0, 0, w, h).data;
      const cellW = 6, cellH = 12;
      let lines = [];
      for (let y = 0; y < h; y += cellH) {
        let line = '';
        for (let x = 0; x < w; x += cellW) {
          let sum = 0, count = 0;
          for (let sy = 0; sy < cellH && y + sy < h; sy += 2) {
            for (let sx = 0; sx < cellW && x + sx < w; sx += 2) {
              const idx = ((y + sy) * w + (x + sx)) * 4;
              sum += data[idx];
              count++;
            }
          }
          const avg = count ? sum / count : 0;
          const charIdx = Math.floor((avg / 255) * (ramp.length - 1));
          line += ramp[charIdx];
        }
        lines.push(line.replace(/\s+$/, ''));
      }
      lines = lines.filter((l, i) => l.trim().length > 0 || (i > 0 && lines[i - 1].trim().length > 0));
      out.textContent = lines.join('\n') || '> leer? gib was ein.';
    }

    btn.addEventListener('click', render);
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') render(); });
    render();
  })();

  /* ==========================================================
     6. Snake
     ========================================================== */
  (() => {
    const canvas = document.getElementById('snake-canvas');
    const btn = document.getElementById('snake-btn');
    const scoreEl = document.getElementById('snake-score');
    if (!canvas || !btn || !scoreEl) return;

    const ctx = canvas.getContext('2d');
    const cell = 15;
    const cols = canvas.width / cell;
    const rows = canvas.height / cell;

    let snake, dir, nextDir, food, score, alive, loopId;

    function reset() {
      snake = [{ x: 8, y: 8 }, { x: 7, y: 8 }, { x: 6, y: 8 }];
      dir = { x: 1, y: 0 };
      nextDir = { x: 1, y: 0 };
      score = 0;
      alive = true;
      placeFood();
      scoreEl.textContent = '0';
    }

    function placeFood() {
      let ok = false;
      while (!ok) {
        food = { x: Math.floor(Math.random() * cols), y: Math.floor(Math.random() * rows) };
        ok = !snake.some(s => s.x === food.x && s.y === food.y);
      }
    }

    function draw() {
      ctx.fillStyle = '#17191a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#fe8019';
      ctx.fillRect(food.x * cell, food.y * cell, cell - 1, cell - 1);

      snake.forEach((s, i) => {
        ctx.fillStyle = i === 0 ? '#b8bb26' : '#98971a';
        ctx.fillRect(s.x * cell, s.y * cell, cell - 1, cell - 1);
      });

      if (!alive) {
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#fabd2f';
        ctx.font = '600 16px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('game over', canvas.width / 2, canvas.height / 2 - 6);
        ctx.font = '400 11px "JetBrains Mono", monospace';
        ctx.fillStyle = '#a89984';
        ctx.fillText('$ ./snake --start zum neu starten', canvas.width / 2, canvas.height / 2 + 14);
      }
    }

    function step() {
      if (!alive) return;
      dir = nextDir;
      const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

      if (head.x < 0 || head.y < 0 || head.x >= cols || head.y >= rows ||
          snake.some(s => s.x === head.x && s.y === head.y)) {
        alive = false;
        draw();
        clearInterval(loopId);
        return;
      }

      snake.unshift(head);
      if (head.x === food.x && head.y === food.y) {
        score++;
        scoreEl.textContent = String(score);
        placeFood();
      } else {
        snake.pop();
      }
      draw();
    }

    function start() {
      clearInterval(loopId);
      reset();
      draw();
      loopId = setInterval(step, 110);
    }

    btn.addEventListener('click', start);

    const keyMap = {
      ArrowUp: { x: 0, y: -1 }, w: { x: 0, y: -1 }, W: { x: 0, y: -1 },
      ArrowDown: { x: 0, y: 1 }, s: { x: 0, y: 1 }, S: { x: 0, y: 1 },
      ArrowLeft: { x: -1, y: 0 }, a: { x: -1, y: 0 }, A: { x: -1, y: 0 },
      ArrowRight: { x: 1, y: 0 }, d: { x: 1, y: 0 }, D: { x: 1, y: 0 },
    };
    window.addEventListener('keydown', (e) => {
      const d = keyMap[e.key];
      if (!d) return;
      if (!document.body.contains(canvas)) return;
      const rect = canvas.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      e.preventDefault();
      if (d.x === -dir.x && d.y === -dir.y) return;
      nextDir = d;
    }, { passive: false });

    reset();
    draw();
  })();

  /* ==========================================================
     7. Stats counters
     ========================================================== */
  (() => {
    const nums = document.querySelectorAll('.stat-num');
    if (!nums.length) return;

    function animateNum(el) {
      const target = parseInt(el.dataset.target, 10) || 0;
      if (prefersReducedMotion) { el.textContent = String(target); return; }
      const duration = 700;
      const start = performance.now();
      function tick(now) {
        const p = Math.min(1, (now - start) / duration);
        el.textContent = String(Math.round(target * p));
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }

    const obs = new IntersectionObserver((entries, o) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateNum(entry.target);
          o.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    nums.forEach((n) => obs.observe(n));
  })();

  /* ==========================================================
     8. Build log — condensed, real narrative of this session
     ========================================================== */
  (() => {
    const win = document.getElementById('log-window');
    if (!win) return;

    const entries = [
      ['09:12:01', 'user', 'user', '"lass uns eine WebApp für Tobi hochziehen, die zeigt was hier so geht"'],
      ['09:12:03', 'skill', 'skill', 'brainstorming geladen — Requirements klären statt einfach lostippen'],
      ['09:12:41', 'sys', 'sys', '4 Rückfragen gestellt: Inhalt, Log-Art, Repo-Setup, Insider-Content'],
      ['09:13:15', 'user', 'user', 'Antworten: Mini-Demos · echtes Session-Log · neues public Repo · generisch crazy'],
      ['09:13:20', 'skill', 'skill', 'frontend-design geladen — Design-Token-System statt Default-Template'],
      ['09:13:52', 'sys', 'sys', 'Konzept: Terminal-Fenster-Ästhetik, Gruvbox-Palette, JetBrains Mono'],
      ['09:14:10', 'ok', 'write', 'index.html geschrieben — Hero, 6 Demo-Panes, Log, Credits'],
      ['09:15:44', 'ok', 'write', 'css/style.css geschrieben — Titlebar, Panes, responsive Grid'],
      ['09:17:02', 'ok', 'write', 'js/script.js geschrieben — Roast, Excuse, Fortune, ASCII, Snake, Stats'],
      ['09:17:30', 'git', 'git', 'git init && git add . && git commit -m "initial commit"'],
      ['09:17:45', 'git', 'gh', 'gh repo create --public claude-showcase'],
      ['09:18:02', 'git', 'git', 'git push -u origin main'],
      ['09:18:20', 'git', 'gh', 'GitHub Pages aktiviert, Branch main, Root'],
      ['09:18:40', 'ok', 'done', 'live. dieser Log hier ist der Beweis, dass es echt so lief.'],
    ];

    const tagClass = { user: 'tag-user', skill: 'tag-skill', sys: 'tag-sys', git: 'tag-git', ok: 'tag-ok' };

    function renderAll(instant) {
      win.innerHTML = '';
      entries.forEach(([time, kind, tag, text], i) => {
        const row = document.createElement('div');
        row.className = 'log-line';
        row.style.animationDelay = instant ? '0s' : (i * 0.18) + 's';
        row.innerHTML =
          '<span class="log-time">' + time + '</span>' +
          '<span class="log-tag ' + (tagClass[kind] || 'tag-sys') + '">' + tag + '</span>' +
          '<span class="log-text">' + text + '</span>';
        win.appendChild(row);
      });
    }

    let played = false;
    const obs = new IntersectionObserver((es, o) => {
      es.forEach((e) => {
        if (e.isIntersecting && !played) {
          played = true;
          renderAll(prefersReducedMotion);
          o.disconnect();
        }
      });
    }, { threshold: 0.2 });
    obs.observe(win);
  })();

})();
