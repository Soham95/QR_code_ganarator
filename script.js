let currentOutput;

function detectType(input) {
  if (/^mailto:/i.test(input) || /^[^\s]+@[^\s]+\.[^\s]+$/.test(input)) return "email";
  if (/^tel:/i.test(input) || /^\+?[0-9\s-]{7,}$/.test(input)) return "tel";
  if (/^https?:\/\//i.test(input) || /^www\./i.test(input)) return "url";
  if (/^WIFI:T:/.test(input)) return "wifi";
  if (/^BEGIN:VCARD/.test(input)) return "vcard";
  if (/^[0-9A-Za-z\-\s]+$/.test(input) && input.length <= 20) return "barcode";
  return "text";
}

function generateCode() {
  const input = document.getElementById("userInput").value.trim();
  const output = document.getElementById("output");

  if (!input) {
    alert("Please enter valid input");
    return;
  }

  output.innerHTML = "";
  const type = detectType(input);

  if (type === "barcode") {
    const svg = document.createElement("svg");
    JsBarcode(svg, input, {
      format: "CODE128",
      lineColor: getComputedStyle(document.body).getPropertyValue('--qr-fg').trim(),
      background: getComputedStyle(document.body).getPropertyValue('--qr-bg').trim(),
      width: 2,
      height: 100,
      displayValue: true
    });
    output.appendChild(svg);
    currentOutput = svg;
  } else {
    let formattedInput = input;
    if (type === "email" && !input.startsWith("mailto:")) formattedInput = `mailto:${input}`;
    if (type === "tel" && !input.startsWith("tel:")) formattedInput = `tel:${input}`;
    if (type === "url" && !input.startsWith("http")) formattedInput = `https://${input}`;

    const div = document.createElement("div");
    new QRCode(div, {
      text: formattedInput,
      width: 200,
      height: 200,
      colorDark: getComputedStyle(document.body).getPropertyValue('--qr-fg').trim(),
      colorLight: getComputedStyle(document.body).getPropertyValue('--qr-bg').trim(),
    });
    output.appendChild(div);
    currentOutput = div.querySelector("canvas") || div.querySelector("img");
  }
}

function downloadImage() {
  if (!currentOutput) return alert("Generate a code first.");
  if (currentOutput.tagName === 'IMG') {
    const a = document.createElement("a");
    a.href = currentOutput.src;
    a.download = "qr_code.png";
    a.click();
  } else if (currentOutput.tagName === 'CANVAS') {
    const a = document.createElement("a");
    a.href = currentOutput.toDataURL();
    a.download = "qr_code.png";
    a.click();
  } else if (currentOutput.tagName === 'svg') {
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(currentOutput);
    const blob = new Blob([source], {type: "image/svg+xml;charset=utf-8"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "barcode.svg";
    a.click();
    URL.revokeObjectURL(url);
  }
}

function copyInput() {
  const input = document.getElementById("userInput");
  navigator.clipboard.writeText(input.value).then(() => alert("Copied!"));
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  document.documentElement.setAttribute("data-theme", currentTheme === "dark" ? "light" : "dark");
}

function switchLang(lang) {
  document.getElementById("title").innerText = lang === 'es' ? "Generador de QR y Códigos de Barras" : "QR & Barcode Generator";
  document.getElementById("userInput").placeholder = lang === 'es' ? "Ingrese sus datos aquí" : "Enter your data here";
}

document.documentElement.setAttribute("data-theme", "light");
