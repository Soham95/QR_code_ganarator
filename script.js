function generateCode() {
    const input = document.getElementById("userInput").value.trim();
    const output = document.getElementById("output");
    output.innerHTML = ""; // Clear previous output

    if (!input) {
        alert("Please enter something to generate a code.");
        return;
    }

    try {
        // Attempt to generate QR code
        const qrDiv = document.createElement("div");
        new QRCode(qrDiv, {
            text: input,
            width: 200,
            height: 200,
            colorDark: getComputedStyle(document.body).getPropertyValue('--qr-fg').trim() || "#000",
            colorLight: getComputedStyle(document.body).getPropertyValue('--qr-bg').trim() || "#fff",
            correctLevel: QRCode.CorrectLevel.H
        });
        output.appendChild(qrDiv);

        // Basic barcode detection (numeric input of a certain length)
        const isNumeric = /^[0-9]+$/.test(input);
        if (isNumeric && input.length >= 7 && input.length <= 13) {
            const svg = document.createElement("svg");
            JsBarcode(svg, input, { format: "CODE128", displayValue: true });
            output.appendChild(svg);
        }
    } catch (error) {
        console.error("QR code generation error:", error);
        alert("Error generating QR code. Please try a different input.");
    }
}

function downloadImage() {
    const qrCanvas = document.querySelector("#output canvas");
    const barcodeSvg = document.querySelector("#output svg");

    if (qrCanvas) {
        const link = document.createElement("a");
        link.download = "qr-code.png";
        link.href = qrCanvas.toDataURL();
        link.click();
    } else if (barcodeSvg) {
        const svgData = new XMLSerializer().serializeToString(barcodeSvg);
        const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(svgBlob);
        const link = document.createElement("a");
        link.download = "barcode.svg";
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
    } else {
        alert("No code to download.");
    }
}

function copyInput() {
    const input = document.getElementById("userInput").value;
    if (!input) return alert("No input to copy.");
    navigator.clipboard.writeText(input);
    alert("Copied input to clipboard!");
}

function toggleTheme() {
    const html = document.documentElement;
    const current = html.getAttribute("data-theme") || "light";
    html.setAttribute("data-theme", current === "dark" ? "light" : "dark");
}

function switchLang(lang) {
    const messages = {
        en: {
            title: "Smart QR & Barcode Generator",
            placeholder: "Enter text, URL, email, phone, etc.",
            generate: "Generate",
            download: "Download",
            copy: "Copy Input",
            theme: "Theme",
            light: "Light",
            dark: "Dark",
            english: "English",
            spanish: "Spanish",
            privacy: "Privacy Policy",
            terms: "Terms of Use"
        },
        es: {
            title: "Generador Inteligente de Códigos QR y de Barras",
            placeholder: "Ingrese texto, URL, correo electrónico, teléfono, etc.",
            generate: "Generar",
            download: "Descargar",
            copy: "Copiar Entrada",
            theme: "Tema",
            light: "Claro",
            dark: "Oscuro",
            english: "Inglés",
            spanish: "Español",
            privacy: "Política de Privacidad",
            terms: "Términos de Uso"
        }
    };
    document.getElementById("title").innerText = messages[lang].title;
    document.getElementById("userInput").placeholder = messages[lang].placeholder;
    document.getElementById("generateBtn").innerText = messages[lang].generate;
    document.getElementById("downloadBtn").innerText = messages[lang].download;
    document.getElementById("copyBtn").innerText = messages[lang].copy;
    document.getElementById("themeLabel").innerText = messages[lang].theme;
    document.getElementById("lightLabel").innerText = messages[lang].light;
    document.getElementById("darkLabel").innerText = messages[lang].dark;
    document.getElementById("enLink").innerText = messages[lang].english;
    document.getElementById("esLink").innerText = messages[lang].spanish;
    document.getElementById("privacyLink").innerText = messages[lang].privacy;
    document.getElementById("termsLink").innerText = messages[lang].terms;
}

document.addEventListener('DOMContentLoaded', () => {
    switchLang(navigator.language.startsWith('es') ? 'es' : 'en');
    document.documentElement.setAttribute("data-theme", "light");
    document.getElementById("generateBtn").addEventListener("click", generateCode);
    document.getElementById("downloadBtn").addEventListener("click", downloadImage);
    document.getElementById("copyBtn").addEventListener("click", copyInput);
    document.getElementById("themeToggle").addEventListener("click", toggleTheme);
    document.getElementById("enLink").addEventListener("click", () => switchLang('en'));
    document.getElementById("esLink").addEventListener("click", () => switchLang('es'));
});
