const secretInput = document.getElementById('secret');
const serviceInput = document.getElementById('service');
const lengthInput = document.getElementById('length');
const versionSelect = document.getElementById('version');
const output = document.getElementById('password-output');
const background = document.getElementById('background');

// Convierte hex a color pastel
function hexToPastel(hex) {
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    const pastel = v => Math.floor((v + 255) / 2);
    return `rgb(${pastel(r)}, ${pastel(g)}, ${pastel(b)})`;
}

// Genera color determinista desde la contraseña
function getColorFromPassword(password) {
    const hash = [...password].reduce((acc, c) => acc + c.charCodeAt(0).toString(16), '');

    const hue = parseInt(hash.slice(0, 3), 16) % 360;       // 0–359
    const sat = 70 + parseInt(hash.slice(3, 4), 16) % 30;   // 70–99%
    const light = 50 + parseInt(hash.slice(4, 5), 16) % 20; // 50–69%

    return `hsl(${hue}, ${sat}%, ${light}%)`;
}

async function updatePassword() {
    const secret = secretInput.value.trim();
    const service = serviceInput.value.trim();
    const length = lengthInput.value;
    const version = versionSelect.value;

    // Si uno de los dos está vacío, mantener el placeholder
    if (!secret || !service) {
        output.textContent = 'Your password will appear here';
        return;
    }

    const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret, service, length, version })
    });

    const data = await res.json();
    if (res.ok) {
        output.textContent = data.password || 'Your password will appear here';
        const color = getColorFromPassword(data.password);
        background.style.backgroundColor = color;
    } else {
        output.textContent = 'Error: ' + data.error;
    }
}

secretInput.addEventListener('input', updatePassword);
serviceInput.addEventListener('input', updatePassword);
lengthInput.addEventListener('change', updatePassword);
versionSelect.addEventListener('change', updatePassword);

const passwordBox = document.getElementById('password-box');

passwordBox.addEventListener('click', () => {
    const text = output.textContent.trim();
    if (!text || text === 'Your password will appear here' || text.startsWith('Error')) return;

    navigator.clipboard.writeText(text).then(() => {
        const original = output.textContent;
        output.textContent = '¡Copied ✔!';
        setTimeout(() => {
            output.textContent = original;
        }, 1500);
    });
});