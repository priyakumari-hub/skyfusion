const weatherButton = document.getElementById("getWeather");
const resultdiv = document.getElementById("result");

weatherButton.addEventListener("click", () => {
  const city = document.getElementById("city").value.trim();
  if (!city) {
    resultdiv.textContent = "Please enter a city name.";
    return;
  }

  fetch(`/weather?city=${encodeURIComponent(city)}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("City not found");
      }
      return response.json();
    })
    .then((data) => {
      // Use the actual keys returned by backend: temperature and condition
      resultdiv.innerHTML = `
        <h2><span class="material-symbols-outlined">location_on</span> Weather in ${data.city}</h2>
        <p><span class="material-symbols-outlined">device_thermostat</span> Temperature: ${data.temperature} °C</p>
        <p><span class="material-symbols-outlined">weather_snowy</span> Condition: ${data.condition}</p>
      `;
    })
    .catch((error) => {
      resultdiv.textContent = error.message;
    });
});
