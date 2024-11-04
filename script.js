const pokeCount = 151;
const colors = {
    fire: '#FDDFDF', grass: '#DEFDE0', electric: '#FCF7DE', water: '#DEF3FD', ground: '#f4e7da',
    rock: '#d5d5d4', fairy: '#fceaff', poison: '#98d7a5', bug: '#f8d5a3', dragon: '#97b3e6',
    psychic: '#eaeda1', flying: '#F5F5F5', fighting: '#E6E0D4', normal: '#F5F5F5', ice: '#d0f0fd',
    steel: '#d5d5e5', ghost: '#a393eb', dark: '#a9a9a9'
};
const mainTypes = Object.keys(colors);

document.getElementById('sName').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        document.getElementById('btnProcurar').click();
    }
});

// Funções da Pokédex Básica e Filtro
async function fetchPoke(id) {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Erro ao buscar Pokémon ID ${id}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
}

function setSelector() {
    const selector = document.getElementById("sName").value.trim();
    renderCards(selector.toUpperCase());
}

async function filter(selector, i) {
    const data = await fetchPoke(i);
    return data.name.toUpperCase().includes(selector);
}

async function renderCards(selector) {
    const div = document.querySelector("#pokeContainer");
    while (div.firstChild) {
        div.removeChild(div.firstChild);
    }

    for (let i = 1; i <= pokeCount; i++) {
        const match = await filter(selector, i);
        if (!selector || match) {
            await createCard(i);
        }
    }
}

async function createCard(i) {
    const data = await fetchPoke(i);

    const card = document.createElement('div');
    card.classList.add("card");

    const name = data.name[0].toUpperCase() + data.name.slice(1);
    const id = data.id.toString().padStart(3, "0");
    const types = data.types.map(type => type.type.name);
    const mainType = types[0];
    const color = colors[mainType] || '#F5F5F5';

    card.style.backgroundColor = color;

    const pokeInnerHTML = `
        <div class="imgContainer">
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${i}.png" alt="${name}">
        </div>
        <div class="info">
            <p class="number">#${id}</p>
            <p class="name">${name}</p>
            <p class="type">Type: ${types.join(', ')}</p>
        </div>
    `;

    card.innerHTML = pokeInnerHTML;
    document.querySelector("#pokeContainer").appendChild(card);
}

// Função Jogo de Perguntas sobre Pokémon
async function startQuiz() {
    const randomId = Math.floor(Math.random() * pokeCount) + 1;
    const data = await fetchPoke(randomId);
    document.getElementById("quizImage").src = data.sprites.front_default;
    document.getElementById("quizAnswer").value = "";
    document.getElementById("quizFeedback").textContent = "";
    document.getElementById("quizAnswer").dataset.correctAnswer = data.name;
}

function checkAnswer() {
    const userAnswer = document.getElementById("quizAnswer").value.toLowerCase();
    const correctAnswer = document.getElementById("quizAnswer").dataset.correctAnswer;
    const feedback = userAnswer === correctAnswer ? "Correto!" : `Errado! Era ${correctAnswer}.`;
    document.getElementById("quizFeedback").textContent = feedback;
}

// Função Explorador de Habilidades
async function fetchAbilities() {
    const pokemonId = document.getElementById("abilityPokeId").value;
    const data = await fetchPoke(pokemonId);
    if (data) {
        const abilities = data.abilities.map(ability => ability.ability.name).join(", ");
        document.getElementById("abilityList").textContent = `Habilidades: ${abilities}`;
    } else {
        document.getElementById("abilityList").textContent = "Erro ao buscar habilidades.";
    }
}

// Função Mapa de Localização
async function fetchLocation(pokemonId) {
    const url = `https://pokeapi.co/api/v2/pokemon/${pokemonId}/encounters`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        const locations = data.map(loc => loc.location_area.name).join(", ");
        document.getElementById("locationList").textContent = `Localizações: ${locations}`;
    } catch (error) {
        console.error(error);
        document.getElementById("locationList").textContent = "Erro ao buscar localizações.";
    }
}

// Função Simulador de Batalhas
async function simulateBattle() {
    const poke1Id = document.getElementById("battlePoke1").value;
    const poke2Id = document.getElementById("battlePoke2").value;
    if (!poke1Id || !poke2Id) return alert("Escolha dois Pokémon.");

    const poke1 = await fetchPoke(poke1Id);
    const poke2 = await fetchPoke(poke2Id);
    const winner = Math.random() > 0.5 ? poke1 : poke2;
    document.getElementById("battleResult").textContent = `Vencedor: ${winner.name}`;
}

// Função Enciclopédia de Tipos
async function fetchTypeInfo() {
    const typeId = document.getElementById("typeId").value;
    const url = `https://pokeapi.co/api/v2/type/${typeId}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        const pokemonList = data.pokemon.map(p => p.pokemon.name).join(", ");
        document.getElementById("typeInfo").textContent = `Pokémon do Tipo: ${pokemonList}`;
    } catch (error) {
        console.error(error);
        document.getElementById("typeInfo").textContent = "Erro ao buscar informações do tipo.";
    }
}

// Função Árvore de Evolução
async function fetchEvolution() {
    const speciesId = document.getElementById("evolutionPokeId").value;
    const speciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${speciesId}`;
    try {
        const response = await fetch(speciesUrl);
        const speciesData = await response.json();
        const evolutionChainUrl = speciesData.evolution_chain.url;

        const evolutionResponse = await fetch(evolutionChainUrl);
        const evolutionData = await evolutionResponse.json();

        function parseEvolution(evolvesTo) {
            const names = [evolvesTo.species.name];
            evolvesTo.evolves_to.forEach(evolution => names.push(...parseEvolution(evolution)));
            return names;
        }

        const evolutionNames = parseEvolution(evolutionData.chain);
        document.getElementById("evolutionList").textContent = `Evoluções: ${evolutionNames.join(" → ")}`;
    } catch (error) {
        console.error(error);
        document.getElementById("evolutionList").textContent = "Erro ao buscar evoluções.";
    }
}

// Função Construtor de Equipes
const team = [];

async function addToTeam() {
    const pokeId = document.getElementById("teamPokeId").value;
    if (!pokeId) return alert("Insira um ID de Pokémon.");

    const pokemon = await fetchPoke(pokeId);
    if (team.length >= 6) {
        alert("A equipe já possui 6 Pokémon.");
        return;
    }
    
    team.push(pokemon);
    document.getElementById("teamList").innerHTML = team
        .map(poke => `<p>${poke.name}</p>`)
        .join("");
}
