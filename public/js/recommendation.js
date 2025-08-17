let suggestionGenerated = false;

async function generateGeminiSuggestion() {
  if (suggestionGenerated) {
    alert("You've already received your custom suggestion.");
    return;
  }

  const geminiCard = document.getElementById("gemini-card");

  // Show loading animation
  const loadingCard = document.createElement("div");
  loadingCard.className = "card";
  loadingCard.id = "loading-card";
  loadingCard.innerHTML = `
    <div class="card-content" style="display: flex; align-items: center; justify-content: center; height: 100%;">
      <p style="font-size: 1.2em;">⏳ Fetching your personalized suggestion...</p>
    </div>
  `;
  geminiCard.replaceWith(loadingCard);

  try {
    const res = await fetch("/api/custom-suggestion");
    const data = await res.json();

    if (!data.videoId) throw new Error("No video ID returned");

    const newCard = document.createElement("div");
    newCard.className = "card";
    newCard.innerHTML = `
      <a href="https://www.youtube.com/watch?v=${data.videoId}" target="_blank" style="text-decoration: none">
        <img src="${data.thumbnail}" class="card-img" />
        <div class="card-content">
          <h3>${data.title}</h3>
          <p>${data.description}</p>
        </div>
      </a>
    `;

    loadingCard.replaceWith(newCard);
    suggestionGenerated = true;
  } catch (err) {
    console.error("Error fetching recommendation:", err);
    loadingCard.innerHTML = `
      <div class="card-content" style="text-align: center;">
        <p style="color: red;">❌ ${err.message}<br/>Please try again later.</p>
      </div>
    `;
  }
}
