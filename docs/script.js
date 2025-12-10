document.addEventListener('DOMContentLoaded', function () {
    const screen = document.querySelector('.cinema-count-screen');
    
    // --- 1. FUNCIÓN PARA REVELAR Y ANIMAR LOGO ---
    function revealLogos() {
        const logo = document.getElementById('logo1');
        if (!logo) return;
        
        const src = logo.getAttribute('data-gif-src') || 'elementos-web/logo-animado.gif';
        logo.setAttribute('data-gif-src', src);
        
        // Forzar reinicio del GIF
        logo.src = '';
        setTimeout(() => {
            logo.src = src;
            logo.classList.add('show');
        }, 60);
    }

    // --- 2. LÓGICA DEL CONTADOR (COUNTDOWN) ---
    (function() {
        // Evita que el contador se inicialice si ya está corriendo (por si se carga el script dos veces)
        if (window._cinemaCountdownRunning) return;
        window._cinemaCountdownRunning = true;

        function hideCinemaScreen() {
            const s = document.querySelector('.cinema-count-screen');
            if (!s) return;
            s.style.opacity = '0';
            setTimeout(() => {
                s.remove();
                if (typeof revealLogos === 'function') revealLogos();
                // Llamar a la inicialización del gráfico aquí para asegurar que las librerías están listas
                if (typeof initVegaChart === 'function') initVegaChart();
            }, 600);
        }

        function initCountdown() {
            const el = document.getElementById('numbercnt');
            // Establece el contador en 10 o usa el valor existente
            let sec = el ? parseInt(el.textContent.trim(), 10) : 10;
            if (el) el.textContent = sec;

            const id = setInterval(() => {
                sec -= 1;
                if (el) el.textContent = sec;
                if (sec <= 0) {
                    clearInterval(id);
                    hideCinemaScreen();
                }
            }, 1000);

            // Permite saltar el contador haciendo clic en la pantalla
            if (screen) {
                screen.addEventListener('click', () => {
                    clearInterval(id);
                    hideCinemaScreen();
                }, { once: true });
            }
        }
        initCountdown();
    })();
    
    // --- 3. LÓGICA DE BUTACAS (Asientos Aleatorios) ---
    (function() {
        const seats = Array.from(document.querySelectorAll(".seat"));
        const totalToMark = 52; // 52 butacas marcadas como activas

        if (seats.length === 0) return;

        // Mezcla aleatoriamente el array de asientos
        const shuffled = seats.sort(() => Math.random() - 0.5);

        // Marca el número deseado como 'active'
        shuffled.slice(0, totalToMark).forEach(seat => {
            seat.classList.add("active");
        });
    })();
    
    // --- 4. CÓDIGO DEPENDIENTE DE JQUERY (Scroll Reveal, Hover y Videos) ---
    if (typeof jQuery !== 'undefined') {
        
        // HANDLERS DE HOVER para enlaces
        $("#links_rrss a, #smooth a").hover(
            function() { $(this).animate({ color: "#f0781d" }, 300); },
            // El color de salida es NEGRO (#333)
            function() { $(this).animate({ color: "#333" }, 300); } 
        );

        // SCROLL REVEAL (Animación de entrada para imágenes y embeds al hacer scroll)
        $(window).scroll(function() {
            $(".imagen, .flourish-embed, .vega-embed").each(function() {
                // Aparece cuando el elemento está 150px antes del borde inferior de la ventana
                if ($(this).offset().top < $(window).scrollTop() + $(window).height() - 150) {
                    $(this).animate({ opacity: 1, top: "0" }, 1000);
                }
            });
        });

        // Asegurar que los elementos visibles al cargar se muestren inmediatamente
        $(window).scroll(); 
        
        // LÓGICA DE INTERSECTION OBSERVER PARA VIDEOS (Reproducir solo cuando están a la vista)
        const videos = $('video'); 
        const options = { root: null, rootMargin: '0px', threshold: 0.5 };

        const callback = (entries, observer) => {
            entries.forEach(entry => {
                const video = entry.target;
                if (entry.isIntersecting) {
                    // Si es visible, intentar reproducir (puede fallar por políticas de autoplay)
                    video.play().catch(error => { console.error('Autoplay failed:', error); });
                } else {
                    // Si no es visible, pausar y rebobinar
                    video.pause();
                    video.currentTime = 0;
                }
            });
        };
        const observer = new IntersectionObserver(callback, options);
        videos.each(function() { observer.observe(this); });
    }

    // --- 5. LÓGICA DE INTEGRACIÓN DE GRÁFICO (VEGA-LITE) ---
    window.initVegaChart = function() {
        // Datos de ejemplo basados en el gráfico "Producción de Obras de Ficción y Documentales por Década"
        const data = [
            { "Decada": "1960", "Tipo": "Ficción", "Produccion": 30 },
            { "Decada": "1970", "Tipo": "Ficción", "Produccion": 50 },
            { "Decada": "1980", "Tipo": "Ficción", "Produccion": 70 },
            { "Decada": "1990", "Tipo": "Ficción", "Produccion": 120 },
            { "Decada": "2000", "Tipo": "Ficción", "Produccion": 250 },
            { "Decada": "2010", "Tipo": "Ficción", "Produccion": 350 },
            { "Decada": "2020", "Tipo": "Ficción", "Produccion": 450 },
            
            { "Decada": "1960", "Tipo": "Documental", "Produccion": 10 },
            { "Decada": "1970", "Tipo": "Documental", "Produccion": 25 },
            { "Decada": "1980", "Tipo": "Documental", "Produccion": 40 },
            { "Decada": "1990", "Tipo": "Documental", "Produccion": 60 },
            { "Decada": "2000", "Tipo": "Documental", "Produccion": 100 },
            { "Decada": "2010", "Tipo": "Documental", "Produccion": 150 },
            { "Decada": "2020", "Tipo": "Documental", "Produccion": 200 }
        ];

        const vegaSpec = {
            "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
            "description": "Producción de Obras de Ficción y Documentales por Década.",
            "data": {"values": data},
            "mark": "bar",
            "encoding": {
                "x": {"field": "Decada", "type": "ordinal", "axis": {"title": "Década"}},
                "y": {"field": "Produccion", "type": "quantitative", "axis": {"title": "Cantidad de Producciones"}},
                "color": {
                    "field": "Tipo", 
                    "scale": {"range": ["#f0781d", "#333333"]}, // Naranja y Gris/Negro
                    "legend": {"title": "Tipo de Obra"}
                },
                "tooltip": [
                    {"field": "Decada", "title": "Década"},
                    {"field": "Tipo", "title": "Tipo de Obra"},
                    {"field": "Produccion", "title": "Producción", "format": ","}
                ]
            },
            "config": {
                "view": {"stroke": "transparent"},
                "axis": {"grid": true, "labelLimit": 300},
                "font": "Arial"
            }
        };

        vegaEmbed('#vis', vegaSpec, {actions: false}).then(result => {
            // Callback opcional si se necesita interactuar con el gráfico después de renderizar
            console.log("Gráfico de Vega-Lite renderizado.");
        }).catch(console.error);
    };
    
})();

// --- Código de posicionamiento de la pantalla de conteo (Fuera del DOMContentLoaded) ---
(function() {
    const screen = document.querySelector('.cinema-count-screen');
    if (screen) {
        // Asegura que la pantalla de conteo cubra toda la ventana y esté al frente
        Object.assign(screen.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            width: '100vw',
            height: '100vh',
            zIndex: '999999'
        });
    }
})();