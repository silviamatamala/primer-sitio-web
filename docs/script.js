/* ========================================================================= */
/* LÓGICA 1: CUENTA REGRESIVA Y ACTIVACIÓN DE CONTENIDO */
/* ========================================================================= */
 
const countdownScreen = document.getElementById('countdown-screen');
const mainContent = document.getElementById('main-content');
const countdownTimer = document.getElementById('countdown-timer');
 
let count = 5;
 
// Función para iniciar el temporizador
function startCountdown() {
    countdownTimer.textContent = count;
    const timerInterval = setInterval(() => {
        count--;
        countdownTimer.textContent = count;
 
        if (count <= 0) {
            clearInterval(timerInterval);
            // Ocultar la pantalla de cuenta regresiva
            countdownScreen.classList.add('hidden');
            // Mostrar el contenido principal
            mainContent.classList.remove('hidden');
            // Llamar a la función para inicializar las visualizaciones
            initializeVisualizations();
        }
    }, 1000);
}
 
// Iniciar la cuenta regresiva al cargar la página
window.onload = startCountdown;
 
 
/* ========================================================================= */
/* LÓGICA 2: INICIALIZACIÓN DE VISUALIZACIONES */
/* ========================================================================= */
 
function initializeVisualizations() {
    // 1. Lógica para los Asientos de Cine
    const seats = Array.from(document.querySelectorAll(".seat"));
    const totalToMark = 52;
 
    // Mezclamos el array (aleatorio)
    const shuffled = seats.sort(() => Math.random() - 0.5);
 
    // Marcamos los primeros 52 de la lista ya mezclada
    shuffled.slice(0, totalToMark).forEach(seat => {
        seat.classList.add("active");
    });
   
    // 2. Lógica para el Carrusel de Documentales
    // (Incluida a continuación)
    initializeCarousel();
}
 
 
/* ========================================================================= */
/* LÓGICA 3: CARRUSEL DE DOCUMENTALES */
/* ========================================================================= */
 
const teamMembers = [
                { name: "Lemebel", role: "Joanna Reposi Garibaldi" },
                { name: "Surire", role: "Perut y Osnovikoff" },
                { name: "Allende mi abuelo Allende", role: "Marcia Tambutti Allende" },
                { name: "El salvavidas", role: "Maite Alberdi" },
                { name: "Sergio Larraín: El instante eterno", role: "Sebastián Moreno" },
                { name: "Malqueridas", role: "Tana Gilbert" }
];
 
function initializeCarousel() {
    const cards = document.querySelectorAll(".card");
    const dots = document.querySelectorAll(".dot");
    const memberName = document.querySelector(".member-name");
    const memberRole = document.querySelector(".member-role");
    const upArrows = document.querySelectorAll(".nav-arrow.up");
    const downArrows = document.querySelectorAll(".nav-arrow.down");
    let currentIndex = 0;
    let isAnimating = false;
 
    function updateCarousel(newIndex) {
        if (isAnimating) return;
        isAnimating = true;
 
        currentIndex = (newIndex + cards.length) % cards.length;
 
        cards.forEach((card, i) => {
            const offset = (i - currentIndex + cards.length) % cards.length;
 
            card.classList.remove(
                "center",
                "up-1",
                "up-2",
                "down-1",
                "down-2",
                "hidden"
            );
 
            if (offset === 0) {
                card.classList.add("center");
            } else if (offset === 1) {
                card.classList.add("down-1");
            } else if (offset === 2) {
                card.classList.add("down-2");
            } else if (offset === cards.length - 1) {
                card.classList.add("up-1");
            } else if (offset === cards.length - 2) {
                card.classList.add("up-2");
            } else {
                card.classList.add("hidden");
            }
        });
 
        dots.forEach((dot, i) => {
            dot.classList.toggle("active", i === currentIndex);
        });
 
        // Efecto de fade para el texto
        memberName.style.opacity = "0";
        memberRole.style.opacity = "0";
 
        setTimeout(() => {
            memberName.textContent = teamMembers[currentIndex].name;
            memberRole.textContent = teamMembers[currentIndex].role;
            memberName.style.opacity = "1";
            memberRole.style.opacity = "1";
        }, 300);
 
        setTimeout(() => {
            isAnimating = false;
        }, 800);
    }
 
    // --- Event Listeners para el Carrusel ---
   
    // Flechas de escritorio y móviles
    upArrows.forEach(arrow => {
        arrow.addEventListener("click", () => {
            updateCarousel(currentIndex - 1);
        });
    });
 
    downArrows.forEach(arrow => {
        arrow.addEventListener("click", () => {
            updateCarousel(currentIndex + 1);
        });
    });
 
    // Puntos de navegación
    dots.forEach((dot, i) => {
        dot.addEventListener("click", () => {
            updateCarousel(i);
        });
    });
 
    // Clicks en las tarjetas
    cards.forEach((card, i) => {
        card.addEventListener("click", () => {
            updateCarousel(i);
        });
    });
 
    // Navegación con teclado (Flechas Arriba/Abajo)
    document.addEventListener("keydown", (e) => {
        if (e.key === "ArrowUp") {
            updateCarousel(currentIndex - 1);
        } else if (e.key === "ArrowDown") {
            updateCarousel(currentIndex + 1);
        }
    });
 
    // Navegación táctil (Swipe)
    let touchStartX = 0;
    let touchEndX = 0;
 
    document.addEventListener("touchstart", (e) => {
        // Solo si el carrusel es visible
        if (!mainContent.classList.contains('hidden')) {
            touchStartX = e.changedTouches[0].screenY;
        }
    });
 
    document.addEventListener("touchend", (e) => {
        if (!mainContent.classList.contains('hidden')) {
            touchEndX = e.changedTouches[0].screenY;
            handleSwipe();
        }
    });
 
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
 
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) { // Deslizar hacia arriba (siguiente tarjeta)
                updateCarousel(currentIndex + 1);
            } else { // Deslizar hacia abajo (tarjeta anterior)
                updateCarousel(currentIndex - 1);
            }
        }
    }
 
    // Inicializar el carrusel en la primera tarjeta
    updateCarousel(0);
 
    // Lógica para el indicador de desplazamiento (Scroll Indicator)
    function createScrollIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'scroll-indicator';
        indicator.innerHTML = 'scroll';
        document.body.appendChild(indicator);
    }
    createScrollIndicator();
}