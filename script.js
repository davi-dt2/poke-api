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
    const abilityImage = document.getElementById("abilityImage");
    
    if (!pokemonId) {
        document.getElementById("abilityList").textContent = "Por favor, insira um ID de Pokémon.";
        abilityImage.style.display = "none"; // Esconde a imagem se não houver ID
        return;
    }

    const data = await fetchPoke(pokemonId);
    if (data) {
        const abilities = data.abilities.map(ability => ability.ability.name).join(", ");
        document.getElementById("abilityList").textContent = `Habilidades: ${abilities}`;
        
        // Atualiza a imagem do Pokémon
        abilityImage.src = data.sprites.front_default; // URL da imagem
        abilityImage.style.display = "block"; // Exibe a imagem
    }
}

// Função Simulador de Batalhas
async function showBattleImage(id, player) {
    const img = document.getElementById(`battleImage${player}`);
    const data = await fetchPoke(id);
    img.src = data.sprites.front_default;
    img.style.display = "block"; // Exibe a imagem
}

async function simulateBattle() {
    const poke1Id = document.getElementById("battlePoke1").value;
    const poke2Id = document.getElementById("battlePoke2").value;

    if (!poke1Id || !poke2Id) {
        document.getElementById("battleResult").textContent = "Por favor, insira os IDs de dois Pokémon.";
        return;
    }

    const poke1 = await fetchPoke(poke1Id);
    const poke2 = await fetchPoke(poke2Id);

    const winner = Math.random() < 0.5 ? poke1 : poke2;
    document.getElementById("battleResult").textContent = `${winner.name.charAt(0).toUpperCase() + winner.name.slice(1)} venceu!`;
}

// Função Enciclopédia de Tipos
async function fetchTypeInfo() {
    const typeName = document.getElementById('typeName').value.toLowerCase();
    const typeImage = document.getElementById('typeImage');
    const typeInfoDiv = document.getElementById('typeInfo');
    
    // Resetando a imagem e as informações
    typeImage.style.display = "none"; 
    typeInfoDiv.innerHTML = "";

    if (mainTypes.includes(typeName)) {
        typeImage.src = `path/to/type/images/${typeName}.png`; // Substitua pelo caminho correto das imagens
        typeImage.style.display = "block"; 

        const response = await fetch(`https://pokeapi.co/api/v2/type/${typeName}`);
        const typeData = await response.json();

        // Exibindo informações do tipo
        const pokemonList = typeData.pokemon.map(poke => poke.pokemon.name).join(", ");
        typeInfoDiv.innerHTML = `<p>Pokémon do Tipo ${typeName.charAt(0).toUpperCase() + typeName.slice(1)}: ${pokemonList}</p>`;
    } else {
        typeInfoDiv.innerHTML = "<p>Tipo inválido. Tente novamente.</p>";
    }
}

// Função Árvore de Evolução
async function fetchEvolution() {
    const pokemonId = document.getElementById("evolutionPokeId").value;
    const evolutionList = document.getElementById("evolutionList");
    const evolutionImages = document.getElementById("evolutionImages");

    evolutionList.innerHTML = "";
    evolutionImages.innerHTML = "";

    const data = await fetchPoke(pokemonId);
    if (data) {
        const speciesUrl = data.species.url;
        const speciesResponse = await fetch(speciesUrl);
        const speciesData = await speciesResponse.json();

        let evolvesFrom = null;
        let evolvesTo = [];

        if (speciesData.evolves_from_species) {
            const evolvesFromUrl = speciesData.evolves_from_species.url;
            const evolvesFromResponse = await fetch(evolvesFromUrl);
            evolvesFrom = (await evolvesFromResponse.json()).name;
        }

        const evolutionChainUrl = speciesData.evolution_chain.url;
        const evolutionChainResponse = await fetch(evolutionChainUrl);
        const evolutionChainData = await evolutionChainResponse.json();

        const findEvolution = (chain) => {
            if (chain.species.name === data.name) {
                return chain;
            }
            if (chain.evolves_to.length > 0) {
                for (const evolution of chain.evolves_to) {
                    const result = findEvolution(evolution);
                    if (result) return result;
                }
            }
            return null;
        };

        const currentEvolution = findEvolution(evolutionChainData.chain);
        if (currentEvolution) {
            currentEvolution.evolves_to.forEach(evolution => {
                evolvesTo.push(evolution.species.name);
                if (evolution.evolves_to.length > 0) {
                    evolution.evolves_to.forEach(subEvolution => {
                        evolvesTo.push(subEvolution.species.name);
                    });
                }
            });
        }

        let evolutionText = `${data.name.charAt(0).toUpperCase() + data.name.slice(1)}`;

        if (evolvesFrom) {
            evolutionText += ` evolui de ${evolvesFrom.charAt(0).toUpperCase() + evolvesFrom.slice(1)}`;
        }

        if (evolvesTo.length > 0) {
            evolutionText += ` e evolui para ${evolvesTo.map(name => name.charAt(0).toUpperCase() + name.slice(1)).join(', ')}.`;
        } else {
            evolutionText += ` não evolui para mais ninguém.`;
        }

        if (!evolvesFrom && evolvesTo.length === 0) {
            evolutionText = `${data.name.charAt(0).toUpperCase() + data.name.slice(1)} é de estágio único.`;
        }

        evolutionList.innerHTML = `<p>${evolutionText}</p>`;

        // Exibindo imagens do Pokémon atual, antecessor e sucessores
        if (evolvesFrom) {
            const fromData = await fetchPoke(evolvesFrom);
            evolutionImages.innerHTML += `<img src="${fromData.sprites.front_default}" alt="${fromData.name}">`;
        }
        evolutionImages.innerHTML += `<img src="${data.sprites.front_default}" alt="${data.name}">`;
        for (const name of evolvesTo) {
            const toData = await fetchPoke(name);
            evolutionImages.innerHTML += `<img src="${toData.sprites.front_default}" alt="${toData.name}">`;
        }
    }
}

// Função Construtor de Equipes
const team = [];

function addToTeam() {
    const pokeId = document.getElementById("teamPokeId").value;
    if (!pokeId || team.includes(pokeId)) {
        alert("Por favor, insira um ID válido e que ainda não esteja na equipe.");
        return;
    }
    
    team.push(pokeId);
    document.getElementById("teamList").innerHTML += `<p>Pokémon ID: ${pokeId}</p>`;
    showTeamPokemonImage(pokeId);
}

async function showTeamPokemonImage(id) {
    const data = await fetchPoke(id);
    const imgContainer = document.getElementById("teamPokemonImage");
    imgContainer.innerHTML += `<img src="${data.sprites.front_default}" alt="${data.name}" style="width: 50px; height: 50px;">`;
}
