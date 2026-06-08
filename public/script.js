const API_KEY = "935cf79e8857e12b8cb8858194e821f1";


const movieList = document.getElementById("movie-list");
const message = document.getElementById("message");
const searchInput = document.getElementById("search");
const btnSearch = document.getElementById("btnSearch");

async function fetchMovies(query = "") {
  let url;

  if (query) {
    url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=pt-BR&query=${query}`;
  } else {
    // Filmes de Terror (gênero 27)
    url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=pt-BR&with_genres=27`;
  }

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Erro ao buscar filmes");
  }

  const data = await response.json();

  return data.results;
}

function createMovieCard(movie) {
  const card = document.createElement("div");
  card.classList.add("movie-card");

  const poster = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://via.placeholder.com/500x750?text=Sem+Imagem";

  const year = movie.release_date
    ? movie.release_date.substring(0, 4)
    : "N/A";

  const overview = movie.overview
    ? movie.overview.substring(0, 100) + "..."
    : "Sinopse não disponível.";

  card.innerHTML = `
    <img src="${poster}" alt="${movie.title}">
    <div class="movie-info">
      <h3>${movie.title}</h3>
      <p><strong>Ano:</strong> ${year}</p>
      <p><strong>Nota:</strong> ${movie.vote_average}</p>
      <p>${overview}</p>
    </div>
  `;

  return card;
}

function renderMovies(movies) {
  movieList.innerHTML = "";

  if (movies.length === 0) {
    showMessage("Nenhum filme encontrado.");
    return;
  }

  showMessage("");

  movies.forEach(movie => {
    movieList.appendChild(createMovieCard(movie));
  });
}

function showMessage(text) {
  message.textContent = text;
}

async function init() {
  try {
    showMessage("Carregando filmes de terror...");

    const movies = await fetchMovies();

    renderMovies(movies);
  } catch (error) {
    showMessage("Erro ao carregar filmes.");
    console.error(error);
  }
}

btnSearch.addEventListener("click", async () => {
  try {
    showMessage("Buscando...");

    const movies = await fetchMovies(searchInput.value.trim());

    renderMovies(movies);
  } catch (error) {
    showMessage("Erro na busca.");
    console.error(error);
  }
});

searchInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    btnSearch.click();
  }
});

init();

  