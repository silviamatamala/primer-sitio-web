// En la función revealLogos, línea ~65 del archivo JS original:
function revealLogos() {
    const logo = document.getElementById('logo1');
    if (!logo) return;
    // CORRECCIÓN: Añadir "docs/" a la ruta
    const src = logo.getAttribute('data-gif-src') || 'docs/elementos-web/logo-animado.gif';
    logo.setAttribute('data-gif-src', src);
    logo.src = '';
    setTimeout(() => {
        logo.src = src;
        logo.classList.add('show');
    }, 60);
}