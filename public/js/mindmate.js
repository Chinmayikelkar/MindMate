// Gemini Chat Submission
document
  .getElementById("feelingsForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();
    const feelings = document.getElementById("feelings").value;

    try {
      const response = await fetch("/api/feelings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feelings }),
      });

      if (!response.ok) throw new Error("Failed to send feelings");

      const data = await response.json();
      document.getElementById("responseText").textContent =
        data.reply || "Thank you for sharing.";
    } catch (error) {
      document.getElementById("responseText").textContent =
        "Sorry, something went wrong.";
    }
  });

// Mood Tracker Buttons
document.querySelectorAll(".emoji-btn").forEach((btn) => {
  btn.addEventListener("click", function () {
    const mood = this.getAttribute("data-mood");
    const note = document.getElementById("moodNote").value;

    fetch("/log-mood", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mood, note }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to save mood");
        return res.json();
      })
      .then((data) => {
        document.getElementById("status").textContent = "Mood saved!";
        updateChart(data.moods);

        if (data.summary) {
          alert(data.summary); // Could replace with a styled div for better UX
        }

        document.getElementById("moodNote").value = ""; // Clear note
      })
      .catch(() => {
        document.getElementById("status").textContent = "Error saving mood.";
      });
  });
});

// Mood Chart Setup
let chart;
function updateChart(moods) {
  const dates = moods.map((m) => m.date);
  const moodValues = moods.map((m) => {
    if (m.mood === "happy") return 2;
    if (m.mood === "neutral") return 1;
    return 0;
  });

  if (!chart) {
    const ctx = document.getElementById("chart").getContext("2d");
    chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: dates,
        datasets: [
          {
            label: "Mood Trend",
            data: moodValues,
            fill: true,
            borderColor: "blue",
            tension: 0.1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            min: 0,
            max: 2,
            ticks: {
              callback: function (value) {
                if (value === 2) return "😊";
                if (value === 1) return "😐";
                if (value === 0) return "😔";
                return value;
              },
            },
          },
        },
      },
    });
  } else {
    chart.data.labels = dates;
    chart.data.datasets[0].data = moodValues;
    chart.update();
  }
}

// Load moods on page load
fetch("/get-moods")
  .then((res) => res.json())
  .then((data) => updateChart(data.moods))
  .catch(() => console.error("Failed to load moods"));
