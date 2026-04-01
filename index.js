let allAnime = [];
const container = document.getElementById("animeContainer");
const loader = document.getElementById("loader");
const searchInput = document.getElementById("search");
const genreFilter = document.getElementById("genreFilter");
const sortSelect = document.getElementById("sort");
const toggleBtn = document.getElementById("themeToggle");
async function fetchGenres() {
  const res = await fetch("https://api.jikan.moe/v4/genres/anime");
  const data = await res.json();
  data.data.forEach(genre => {
    const option = document.createElement("option");
    option.value = genre.mal_id;
    option.textContent = genre.name;
    genreFilter.appendChild(option);
  });
}
async function fetchAnime() {
  loader.style.display = "block";
  const res = await fetch("https://api.jikan.moe/v4/top/anime");
  const data = await res.json();
  allAnime = data.data;
  displayAnime(allAnime);
  loader.style.display = "none";
}
function displayAnime(list) {
  container.innerHTML = "";
  list.map(anime => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <img src="${anime.images.jpg.image_url}" />
      <div class="card-content">
        <h3>${anime.title}</h3>
        <p>Rating: ${anime.score || "N/A"}</p>
        <div class="synopsis">${anime.synopsis || "No description"}</div>
        <button class="toggle">View More</button>
      </div>
    `;
    card.querySelector(".toggle").onclick = () => {
      const syn = card.querySelector(".synopsis");
      syn.style.display =
        syn.style.display === "block" ? "none" : "block";
    };
    container.appendChild(card);
  });
}
searchInput.addEventListener("input", () => {
  const keyword = searchInput.value.toLowerCase();
  const filtered = allAnime.filter(anime =>
    anime.title.toLowerCase().includes(keyword)
  );
  displayAnime(filtered);
});
genreFilter.addEventListener("change", () => {
  const genreId = genreFilter.value;
  if (!genreId) {
    displayAnime(allAnime);
    return;
  }
  const filtered = allAnime.filter(anime =>
    anime.genres.some(g => g.mal_id == genreId)
  );
  displayAnime(filtered);
});
sortSelect.addEventListener("change", () => {
  let sorted = [...allAnime];
  if (sortSelect.value === "rating") {
    sorted.sort((a, b) => b.score - a.score);
  }
  if (sortSelect.value === "az") {
    sorted.sort((a, b) => a.title.localeCompare(b.title));
  }
  displayAnime(sorted);
});
toggleBtn.onclick = () => {
  document.body.classList.toggle("light");
};
fetchGenres();
fetchAnime();