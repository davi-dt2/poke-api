
const pokeCount = 151;
const colors = { fire: '#FDDFDF', grass: '#DEFDE0', electric: '#FCF7DE', water: '#DEF3FD',};
const mainTypes = Object.keys(colors);

async function fetchPoke(id) {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
}
async function renderCards(selector) {
    const div = document.querySelector("#pokeContainer");
    div.innerHTML = "";
    for (let i = 1; i <= pokeCount; i++) {
        const match = await filter(selector, i);
        if (selector == 0 || match) {
            createCard(i);
        }
    }
}

async function createCard(i) {
    const data = await fetchPoke(i);
    const card = document.createElement('div');
    card.classList.add("card");
    const name = data.name[0].toUpperCase() + data.name.slice(1);
    const type = mainTypes.find(type => data.types.map(t => t.type.name).includes(type)) || 'normal';
    const color = colors[type];
    card.style.backgroundColor = color;
    card.innerHTML = `
        <div class="imgContainer"><img src="${data.sprites.front_default}" alt="${name}"></div>
        <div class="info"><p>#${data.id}</p><p>${name}</p><p>Tipo: ${type}</p></div>
    `;
    document.querySelector("#pokeContainer").appendChild(card);
}

async function comparePokemon() {
    const poke1 = document.getElementById("poke1").value;
    const poke2 = document.getElementById("poke2").value;
    if (!poke1 || !poke2) return alert("Por favor, insira IDs válidos.");

    const data1 = await fetchPoke(poke1);
    const data2 = await fetchPoke(poke2);

    const result = `
        <div class="compare-card"><h3>${data1.name}</h3><p>Altura: ${data1.height}</p><p>Peso: ${data1.weight}</p></div>
        <div class="compare-card"><h3>${data2.name}</h3><p>Altura: ${data2.height}</p><p>Peso: ${data2.weight}</p></div>
    `;
    document.getElementById("compareResult").innerHTML = result;
}

async function exploreAbilities(pokemonId) {
    const data = await fetchPoke(pokemonId);
    const abilities = data.abilities.map(ability => `<p>${ability.ability.name}</p>`).join("");
    document.getElementById("abilities").innerHTML = `<h3>Habilidades de ${data.name}</h3>${abilities}`;
}

document.querySelector("#pokeContainer").addEventListener('click', (event) => {
    const card = event.target.closest(".card");
    if (card) {
        const id = parseInt(card.querySelector('.info p').textContent.slice(1));
        exploreAbilities(id);
    }
});
