function clean()
{
  console.log("clear");
   document.getElementById("disasterResult").innerHTML="";
  document.getElementById("disasterType").value="";
  document.getElementById("timePeriod").value="";
}


document.getElementById("getDisasters").addEventListener("click", () => {
  const type = document.getElementById("disasterType").value;
  const days = parseInt(document.getElementById("timePeriod").value);
  const res = document.getElementById("disasterResult");

  const now = new Date();
  const start = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  const startDate = start.toISOString().split("T")[0]; // format: YYYY-MM-DD


  fetch(`/disasters?type=${type}&days=${days}`)
    .then(r => r.ok ? r.json() : Promise.reject("Failed to load disasters"))
    .then(data => {
      if (!data || !data.events.length) {
        res.textContent = "No active events for this type and time period.";
        return;
      }

      res.innerHTML = "<h1>Disaster Events</h1>" + data.events.map(e => {
        const geo = e.geometry.at(-1);
        const coords = geo.coordinates;
        const area = geo.description || e.title || "Location not specified"; // some have description

        return `
          <h3>${e.title}</h3>
          <p>Category: ${e.categories.map(c => c.title).join(", ")}</p>
          <p>Date: ${geo.date}</p>
          <p>Area: ${area}</p>
          <p>Coordinates: Lat ${coords[1]}, Lon ${coords[0]}</p>
          ${e.sources.length ? `<p>Sources: ${e.sources.map(s => `<a href="${s.url}" target="_blank">${s.id}</a>`).join(", ")}</p>` : ""}
          <hr>
        `;
      }).join("");
    })
    .catch(err => {
      res.textContent = err;
    });
});