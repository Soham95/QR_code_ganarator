function generateCode() {
  const input = document.getElementById("userInput").value.trim();
  const output = document.getElementById("output");
  output.innerHTML = ""; // Clear previous

  if (!input) {
    alert("Please enter something to generate a code.");
    return;
  }

  // If numeric and > 7 digits, assume barcode
  const isNumeric = /^[0-9]+$/.test(input);
  if (isNumeric && input.length >= 7 && input.length <= 13) {
    const svg = document.createElement("svg");
    JsBarcode(svg, input, { format: "CODE128", displayValue: true });
    output.appendChild(svg);
    return;
  }

  // Otherwise, treat it as a QR code input
  const qrDiv = document.createElement("div");
  new QRCode(qrDiv, {
    text: input,
    width: 200,
    height: 200,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H
  });
  output.appendChild(qrDiv);
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
