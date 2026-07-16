/* ==========================================================================
   SiteMarket — оптимизированные падающие частицы (фон)
   ========================================================================== */

(function() {
  // Проверка производительности — если FPS падает ниже 30, уменьшаем количество частиц
  var fps = 60;
  var frameCount = 0;
  var lastFpsCheck = Date.now();

  var canvas = document.createElement('canvas');
  canvas.id = 'particles-canvas';
  canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;';
  document.body.prepend(canvas);

  var ctx = canvas.getContext('2d');
  var particles = [];
  var numParticles = 80; // уменьшено с 150 до 80
  var maxParticles = 120; // лимит для слабых устройств

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  function createParticle() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      size: Math.random() * 2 + 1, // меньше размер
      speedY: Math.random() * 0.8 + 0.3, // медленнее
      opacity: Math.random() * 0.4 + 0.3
    };
  }

  function initParticles(count) {
    particles = [];
    for (var i = 0; i < count; i++) {
      particles.push(createParticle());
    }
  }
  initParticles(numParticles);

  function animate(timestamp) {
    // Проверка FPS каждую секунду
    frameCount++;
    if (timestamp - lastFpsCheck > 1000) {
      fps = frameCount;
      frameCount = 0;
      lastFpsCheck = timestamp;
      // Если FPS ниже 30, уменьшаем частицы
      if (fps < 30 && numParticles > 30) {
        numParticles = Math.max(30, numParticles - 5);
        initParticles(numParticles);
      } else if (fps > 45 && numParticles < maxParticles) {
        numParticles = Math.min(maxParticles, numParticles + 2);
        initParticles(numParticles);
      }
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Рисуем частицы без лишних теней для скорости
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      p.y += p.speedY;
      if (p.y > canvas.height + 20) {
        p.y = -20;
        p.x = Math.random() * canvas.width;
        p.size = Math.random() * 2 + 1;
        p.speedY = Math.random() * 0.8 + 0.3;
        p.opacity = Math.random() * 0.4 + 0.3;
      }
      // Простая отрисовка без свечения для производительности
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 106, 26, ' + p.opacity + ')';
      ctx.fill();
      // Яркое ядро (меньше и без тени)
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 0.4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.fill();
    }

    requestAnimationFrame(animate);
  }

  // Запускаем анимацию
  requestAnimationFrame(animate);
})();