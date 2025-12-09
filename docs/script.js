document.addEventListener('DOMContentLoaded', function () {
    // 1. Inicialización de Variables y Elementos Clave
    const countdownScreen = document.querySelector('.cinema-count-screen');
    const countdownNumberElement = document.querySelector('.cinema-count-screen .number'); // Busca el elemento con clase .number
    
    // Si la pantalla de cuenta regresiva no existe, salimos
    if (!countdownScreen) {
        console.log('Pantalla de cuenta regresiva no encontrada. Inicialización omitida.');
        // Igualmente intentamos revelar el logo si no hay cuenta regresiva
        if (typeof revealLogos === 'function') revealLogos();
        return; 
    }

    // 2. Control de Reproducción de Videos (Intersection Observer)
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

    // 3. Animación de Logos
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
    window.revealLogos = revealLogos; // Hacerla global para el contador

    // 4. Hover handlers
    $("#links_rrss a, #smooth a").hover(
        function() { $(this).animate({ color: "#f0781d" }, 300); }, 
        function() { $(this).animate({ color: "#fff" }, 300); }
    );

    // 5. Scroll reveal
    $(window).scroll(function() {
        $(".imagen, .flourish-embed").each(function() {
            // Se usa el offset de jQuery aquí, pero es más eficiente si todo se maneja con IntersectionObserver
            if ($(this).offset().top < $(window).scrollTop() + $(window).height()) {
                $(this).animate({ opacity: 1, top: "0" }, 1000);
            }
        });
    });

    // 6. Lógica de la Cuenta Regresiva (CORREGIDA)
    
    // Función para ocultar la pantalla y mostrar el logo
    function hideCinemaScreen(intervalId) {
        if (intervalId) clearInterval(intervalId); // Asegura que el contador se detiene
        
        countdownScreen.style.transition = 'opacity 0.5s ease';
        countdownScreen.style.opacity = '0';
        
        setTimeout(() => {
            countdownScreen.remove(); // Quita el elemento del DOM
            revealLogos(); // Muestra el logo animado
        }, 600);
    }

    function initCountdown() {
        if (!countdownNumberElement) {
             hideCinemaScreen(); // Si no se encuentra el elemento de número, ocultar la pantalla inmediatamente.
             return;
        }

        // Obtener valor inicial (si no es un número, usa 10 por defecto)
        let seconds = parseInt(countdownNumberElement.textContent.trim(), 10);
        if (isNaN(seconds) || seconds <= 0) seconds = 5; 
        
        countdownNumberElement.textContent = seconds; // Muestra el valor inicial

        // El corazón del contador
        const timerId = setInterval(() => {
            seconds -= 1;
            countdownNumberElement.textContent = seconds;

            if (seconds <= 0) {
                hideCinemaScreen(timerId);
            }
        }, 1000);

        // Permitir que el usuario haga clic para saltar la cuenta regresiva
        countdownScreen.addEventListener('click', () => {
            hideCinemaScreen(timerId);
        }, { once: true });
    }

    // Asegurar que el código del contador solo se ejecute una vez
    if (!window._cinemaCountdownRunning) {
        window._cinemaCountdownRunning = true;
        initCountdown();
    }
    
    // Opcional: Estilos para asegurar la posición de la pantalla (Si el CSS no lo hace)
    Object.assign(countdownScreen.style, {
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
    // Opcional: mover el nodo al body para asegurarlo (Si ya está en el HTML no es necesario)
    if (countdownScreen.parentNode !== document.body) document.body.insertBefore(countdownScreen, document.body.firstChild);
    
});