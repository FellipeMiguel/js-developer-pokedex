const pokemonList = document.getElementById("pokemonList");
const loadMoreButton = document.getElementById("loadMoreButton");
const closeModalButton = document.getElementById("closeModal"); // New line

const maxRecords = 151;
const limit = 10;
let offset = 0;

function convertPokemonToLi(pokemon) {
  return `
    <li class="pokemon ${pokemon.type}">
      <span class="number">#${pokemon.number}</span>
      <span class="name" onclick="showPokemonModal('${pokemon.name}', '${pokemon.description}', '${pokemon.photo}')">${pokemon.name}</span>
      <div class="detail">
        <ol class="types">
          ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join("")}
        </ol>
        <img src="${pokemon.photo}" alt="${pokemon.name}">
      </div>
    </li>
  `;
}

function loadPokemonItens(offset, limit) {
  pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
    const newHtml = pokemons.map(convertPokemonToLi).join("");
    pokemonList.innerHTML += newHtml;
  });
}

loadPokemonItens(offset, limit);

loadMoreButton.addEventListener("click", () => {
  offset += limit;
  const qtdRecordsWithNexPage = offset + limit;

  if (qtdRecordsWithNexPage >= maxRecords) {
    const newLimit = maxRecords - offset;
    loadPokemonItens(offset, newLimit);

    loadMoreButton.parentElement.removeChild(loadMoreButton);
  } else {
    loadPokemonItens(offset, limit);
  }
});

async function fetchFlavorText(pokemonName) {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonName.toLowerCase()}/`);

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status}`);
    }

    const data = await response.json();
    const flavorTextEntries = data.flavor_text_entries.filter(entry => entry.language.name === 'en');

    const flavorText = flavorTextEntries.map(entry => entry.flavor_text).join(' ');

    return flavorText;
  } catch (error) {
    console.error("Error fetching flavor text:", error);
  }
}


async function showPokemonModal(name, photo) {
  const modal = document.getElementById("pokemonModal");
  const modalPokemonName = document.getElementById("modalPokemonName");
  const modalPokemonDescription = document.getElementById("modalPokemonDescription");
  const modalPokemonImage = document.getElementById("modalPokemonImage");

  const flavorText = await fetchFlavorText(name);

  modalPokemonName.textContent = name;
  modalPokemonDescription.textContent = flavorText;
  modalPokemonImage.src = photo;
  modal.style.display = "flex";
}

function closePokemonModal() {
  const modal = document.getElementById("pokemonModal");
  modal.style.display = "none";
}

closeModalButton.addEventListener("click", closePokemonModal);