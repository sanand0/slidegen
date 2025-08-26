import html from "../slideforge.js";

const sampleSelect = document.getElementById("sample-select");
const jsonInput = document.getElementById("json-input");
const renderContainer = document.getElementById("render-container");
const renderOutput = document.getElementById("render-output");
const htmlSource = document.getElementById("html-source");

function renderSlides() {
  try {
    const jsonText = jsonInput.value.trim();
    if (!jsonText) {
      renderOutput.innerHTML = '<p class="text-muted">Enter JSON to see rendered slides here</p>';
      htmlSource.value = "";
      return;
    }
    const deck = JSON.parse(jsonText);
    const htmlResult = html(deck);
    // Create a scaled wrapper for the deck
    const deckWrapper = document.createElement("div");
    deckWrapper.innerHTML = htmlResult;
    const deckElement = deckWrapper.querySelector(".slideforge-deck");
    if (deckElement) {
      // Get slide dimensions from deck
      const slideSize = deck.slide_size || { w: 1280, h: 720 };
      const containerWidth = renderContainer.clientWidth - 24; // Account for padding
      const scale = containerWidth / slideSize.w;
      // Apply scaling
      const scaledWrapper = document.createElement("div");
      scaledWrapper.style.transform = `scale(${scale})`;
      scaledWrapper.style.transformOrigin = "top";
      scaledWrapper.style.width = `${slideSize.w}px`;
      scaledWrapper.appendChild(deckElement);
      renderOutput.innerHTML = "";
      renderOutput.appendChild(scaledWrapper);
    } else {
      renderOutput.innerHTML = htmlResult;
    }
    htmlSource.value = htmlResult;
  } catch (error) {
    renderOutput.innerHTML = `<div class="alert alert-danger"><strong>Error:</strong> ${error.message}</div>`;
    htmlSource.value = "";
  }
}
async function loadSample(filename) {
  if (!filename) return;
  try {
    const json = await fetch(filename).then((r) => r.text());
    jsonInput.value = json;
    renderSlides();
  } catch (error) {
    renderOutput.innerHTML = `<div class="alert alert-danger"><strong>Error loading sample:</strong> ${error.message}</div>`;
  }
}
sampleSelect.addEventListener("change", (e) => {
  loadSample(e.target.value);
});
jsonInput.addEventListener("input", renderSlides);
// Re-render on window resize to recalculate scale
window.addEventListener("resize", renderSlides);
// Load basic deck by default
loadSample("basic-deck.json");
