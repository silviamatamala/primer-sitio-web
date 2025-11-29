document.addEventListener('DOMContentLoaded', function () {
  // en vez de $(document).ready(...)
  const screen = document.querySelector('.cinema-count-screen');
  const videos = $('video'); 
    
  const options = {
      root: null, 
      rootMargin: '0px',
      threshold: 0.5 
  };

  const callback = (entries, observer) => {
      entries.forEach(entry => {
          const video = entry.target; 
          if (entry.isIntersecting) {
              video.play().catch(error => {
                  console.error('Autoplay failed:', error);
              });
          } else {
              video.pause(); 
              video.currentTime = 0; 
          }
      });
  };

  const observer = new IntersectionObserver(callback, options);

  videos.each(function() {
      observer.observe(this);
  });

  // Animar logos
  function revealLogos() {
      // asegúrate que el elemento existe
      const logo = document.getElementById('logo1');
      if (!logo) return;

      // si necesitas forzar el GIF (a veces el navegador muestra primer frame),
      // reasigna el src para reiniciar la animación
      const src = logo.getAttribute('data-gif-src') || logo.src;
      logo.setAttribute('data-gif-src', src); // guarda si no existe
      logo.src = '';           // forzar recarga
      setTimeout(() => { logo.src = src; }, 50);

      // mostrar con clase
      logo.classList.add('show');
  }

  // Hover handlers
  $("#links_rrss a, #smooth a").hover(
      function() { $(this).animate({ color: "#f0781d" }, 300); }, 
      function() { $(this).animate({ color: "#fff" }, 300); }
  );

  // Scroll reveal
  $(window).scroll(function() {
      $(".imagen, .flourish-embed").each(function() {
          if ($(this).offset().top < $(window).scrollTop() + $(window).height()) {
              $(this).animate({ opacity: 1, top: "0" }, 1000);
          }
      });
  });

  // --- replace countdown block with this plain JS fallback ---
  // COUNTDOWN robusto en JS puro
  (function() {
      if (window._cinemaCountdownRunning) return;
      window._cinemaCountdownRunning = true;

      function initCountdown() {
          const el = document.getElementById('numbercnt');
          let sec = el ? parseInt(el.textContent.trim(), 10) : NaN;
          if (!Number.isInteger(sec) || isNaN(sec)) sec = 10;
          if (el) el.textContent = sec; // mostrar valor inicial

          const id = setInterval(() => {
              sec -= 1;
              if (el) el.textContent = sec;
              if (sec <= 0) {
                  clearInterval(id);
                  hideCinemaScreen();
              }
          }, 1000);

          if (screen) {
              screen.addEventListener('click', () => {
                  clearInterval(id);
                  hideCinemaScreen();
              }, { once: true });
          }

          function hideCinemaScreen() {
              const s = document.querySelector('.cinema-count-screen');
              if (!s) return;
              s.style.transition = 'opacity 0.5s ease';
              s.style.opacity = '0';
              setTimeout(() => {
                  s.remove();
                  if (typeof revealLogos === 'function') revealLogos();
              }, 600);
          }
      }

      if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', initCountdown);
      } else {
          initCountdown();
      }
  })();
});
