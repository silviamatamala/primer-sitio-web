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
      const logo = document.getElementById('logo1');
      if (!logo) return;
      // asegurar ruta relativa guardada
      const src = logo.getAttribute('data-gif-src') || 'elementos-web/logo-animado.gif';
      logo.setAttribute('data-gif-src', src);
      // reiniciar GIF (forzar recarga)
      logo.src = '';
      setTimeout(() => {
        logo.src = src;
        // añadir clase que muestra y anima el logo
        logo.classList.add('show');
      }, 60);
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

document.addEventListener('DOMContentLoaded', function () {
  const screen = document.querySelector('.cinema-count-screen');
  if (screen) {
    Object.assign(screen.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      right: '0',
      bottom: '0',
      width: '100vw',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: '999999'
    });
    // mover el nodo al body para asegurarlo
    if (screen.parentNode !== document.body) document.body.insertBefore(screen, document.body.firstChild);
  }
});
