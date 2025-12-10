document.addEventListener('DOMContentLoaded', () => {
    console.log('Script cargado - iniciando cuenta regresiva');
    
    // 1. Contador de Pantalla de Carga (Cinema Count)
    const splashScreen = document.querySelector('.cinema-count-screen');
    const numberElement = document.getElementById('numbercnt');
    const logo = document.getElementById('logo1');
    const body = document.body;
    let count = 10;

    console.log('Elementos encontrados:', { splashScreen, numberElement, logo });

    const interval = setInterval(() => {
        if (count > 0) {
            numberElement.textContent = count;
            console.log('Contando:', count);
            count--;
        } else {
            clearInterval(interval);
            console.log('Cuenta terminada, ocultando pantalla');
            // Ocultar la pantalla de inicio y mostrar el contenido
            numberElement.textContent = '0';
            setTimeout(() => {
                splashScreen.style.opacity = '0';
                setTimeout(() => {
                    splashScreen.style.display = 'none';
                    body.classList.remove('loading'); // Mostrar el contenido
                    console.log('Contenido mostrado');
                    if (logo) {
                        logo.classList.add('show');
                    }
                    // Iniciar la animación de butacas después de la carga
                    setTimeout(animateSeats, 500);
                }, 500);
            }, 500);
        }
    }, 1000); // Cambiar cada 1 segundo para cuenta regresiva visible


    // 2. Animación y Asignación de Color de Butacas
    const TOTAL_SEATS = 98; 
    // 52.9% Documentales (Blancas)
    const DOCUMENTARY_PERCENT = 0.529;
    const NUM_DOCUMENTARIES = Math.round(TOTAL_SEATS * DOCUMENTARY_PERCENT); // = 52

    function animateSeats() {
        const seats = Array.from(document.querySelectorAll('.seat'));

        // Mezclar los asientos aleatoriamente
        const shuffledSeats = seats.sort(() => Math.random() - 0.5);

        // Identificar los 52 asientos que serán de color blanco (Documentales)
        const seatsToColor = shuffledSeats.slice(0, NUM_DOCUMENTARIES);

        shuffledSeats.forEach((seat, index) => {
            setTimeout(() => {
                // ASIGNACIÓN DE COLOR PERMANENTE
                // Si el asiento está en la lista de los 52 seleccionados aleatoriamente, se vuelve blanco.
                if (seatsToColor.includes(seat)) {
                    seat.classList.add('blanca');
                }

                // ANIMACIÓN DE BRILLO
                seat.classList.add('active');
                setTimeout(() => {
                    seat.classList.remove('active');
                }, 500);

            }, index * 20);
        });
    }
});