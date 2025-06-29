document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById('apodDate');
  const button = document.getElementById('apodBtn');
  const content = document.getElementById('apodContent');

  input.max = new Date().toISOString().split('T')[0];

  async function fetchAPOD() {
    const date = input.value || input.max;
    try {
      const res = await fetch(`/apod?date=${date}`);
      if (!res.ok) throw new Error("API error");

      const data = await res.json();

      content.innerHTML = `
        <h2>${data.title}</h2>
        ${data.media_type === 'image'
          ? `<img src="${data.url}" alt="${data.title}" />`
          : `<iframe src="${data.url}" frameborder="0" allowfullscreen></iframe>`}
        <p>${data.explanation}</p>
      `;
    } catch (err) {
      console.error(err);
      content.innerHTML =` <p style="color:red;">Failed to load data.</p>`;
    }
  }

  fetchAPOD(); // load on page open
  button.addEventListener("click", fetchAPOD); // on click
});