function fetchSpaceData() {

  const eventType = document.getElementById("eventType").value;
  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;

  const outputDiv = document.getElementById("output");
  const rawJsonDiv = document.getElementById("rawJson");

  outputDiv.innerHTML = "Loading...";

 fetch("/fetch_data", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    eventType,
    startDate,
    endDate
  })
})
    .then(res => res.json())
    .then(data => {
      if (!Array.isArray(data.raw_json) || data.raw_json.length === 0) {
        outputDiv.innerHTML = "<span style='color:red;'>❌ No events found for the selected dates.</span>";
        rawJsonDiv.textContent = "";
        return;
      }

      const results = data.raw_json.map((item, i) => formatEvent(eventType, item, i)).join("<hr>");
      outputDiv.innerHTML = results;
      rawJsonDiv.textContent = ""; // Optional raw JSON
    })
    .catch(err => {
      console.error(err);
      outputDiv.innerHTML = "<span style='color:red;'>⚠️ Error fetching data. Try again.</span>";
      rawJsonDiv.textContent = "";
    });
}

function formatEvent(eventType, item, index) {
  const date = formatDate(item.startTime || item.beginTime || item.eventTime || item.messageIssueTime);
  const instruments = item.instruments?.map(i => i.displayName).join(", ") || "Not listed";
  const link = item.link ? `<a href="${item.link}" target="_blank">🔗 View More</a>` : "";
  let summary = "";
  let image = "";

  switch (eventType) {
    case "CME":
      const cme = item.cmeAnalyses?.[0] || {};
      const speed = cme.speed || "Unknown";
      const angle = cme.halfAngle || "Unknown";
      const cmeType = cme.type || "N/A";
      const locationCME = item.sourceLocation || "Unknown";
      image = `<img src="https://soho.nascom.nasa.gov/data/realtime/c3/512/latest.jpg" alt="SOHO CME" />`;

      summary = `
        ☀️ <b>Coronal Mass Ejection (CME)</b><br>
        📅 <b>Date:</b> ${date}<br>
        📍 <b>Location:</b> ${locationCME}<br>
        🚀 <b>Speed:</b> ${speed} km/s<br>
        🎯 <b>Half Angle:</b> ${angle}°<br>
        🌀 <b>Type:</b> ${cmeType}<br>
        🔭 <b>Instruments:</b> ${instruments}<br>
        ${link}
      `;
      break;

   
    case "GST":
      const kpIndex = item.allKpIndex?.[0]?.kpIndex || "Unknown";
      const observedTime = item.allKpIndex?.[0]?.observedTime || "N/A";
      const formattedObs = observedTime !== "N/A" ? formatDate(observedTime) : "N/A";
      image = `<img src="C:/Users/DELL/Documents/priya1/agnirva/static/images/download (3).jpg" alt="Geomagnetic Storm" />`;

      summary = `
        🌍 <b>Geomagnetic Storm (GST)</b><br>
        📅 <b>Event Date:</b> ${date}<br>
        ⏱️ <b>Observed:</b> ${formattedObs}<br>
        📍 <b>Region:</b> Global<br>
        ⚠️ <b>Kp Index:</b> ${kpIndex}<br>
        🔭 <b>Instruments:</b> ${instruments}<br>
        ${link}
      `;
      break;

     case "FLR":
       const flareClass = item.classType || "Unknown";
      const peakTime = item.peakTime ? formatDate(item.peakTime) : "N/A";
      const flareLocation = item.sourceLocation || "Unknown";
      const flareInstruments = item.instruments?.map(i => i.displayName).join(", ") || "Not listed";
     const flareLink = item.link ? `<a href="${item.link}" target="_blank">🔗 View More</a>` : "";
     const flareImage =` <img src="C:/Users/DELL/Documents/priya1/agnirva/static/images/images.jpg" alt="Solar Flare" />`;

     summary = `
       🔆 <b>Solar Flare (FLR)</b><br>
       📅 <b>Start:</b> ${date}<br>
      ⏱️ <b>Peak Time:</b> ${peakTime}<br>
      📍 <b>Location:</b> ${flareLocation}<br>
     ⚡ <b>Class:</b> ${flareClass}<br>
      🔭 <b>Instruments:</b> ${flareInstruments}<br>
      ${flareLink}<br><br>${flareImage}
     `;
     break;


    case "SEP":
      const peakFlux = item.protonFlux?.[0]?.flux || "N/A";
      const energy = item.protonFlux?.[0]?.energy || "N/A";
      image =` <img src=" C:/Users/DELL/Documents/priya1/agnirva/static/images/images (1).jpg" alt="Solar Energetic Particles" />`;

      summary = `
        🧬 <b>Solar Energetic Particles (SEP)</b><br>
        📅 <b>Date:</b> ${date}<br>
        ☢️ <b>Peak Proton Flux:</b> ${peakFlux}<br>
        ⚡ <b>Energy:</b> ${energy} MeV<br>
        🔭 <b>Instruments:</b> ${instruments}<br>
        ${link}
      `;
      break;

    case "notifications":
      const msgType = item.messageType || "N/A";
      const msgBody = item.messageBody?.slice(0, 300) || "No message.";
      image =` <img src="https://www.nasa.gov/sites/default/files/thumbnails/image/heliophysics_illustration.jpg " alt="Notification" />`;

      summary = `
        📢 <b>Space Weather Notification</b><br>
        📅 <b>Issued:</b> ${date}<br>
        📄 <b>Type:</b> ${msgType}<br>
        📝 <b>Message:</b> ${msgBody}...<br>
        🔭 <b>Instruments:</b> ${instruments}<br>
        ${link}
      `;
      break;

    default:
      summary =` <b>Unknown Event</b> on ${date}`;
  }

  return `
    <div class="event-summary">
      ${image}
      <div>${summary}</div>
    </div>
  `;
}

function formatDate(iso) {
  if (!iso) return "unknown";
  const d = new Date(iso);
  return d.toDateString() + " " + d.toLocaleTimeString();
}
