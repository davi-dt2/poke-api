const pokeCount = 151;
const colors = {
  fire: "#FDDFDF",
  grass: "#DEFDE0",
  electric: "#FCF7DE",
  water: "#DEF3FD",
  ground: "#f4e7da",
  rock: "#d5d5d4",
  fairy: "#fceaff",
  poison: "#98d7a5",
  bug: "#f8d5a3",
  dragon: "#97b3e6",
  psychic: "#eaeda1",
  flying: "#F5F5F5",
  fighting: "#E6E0D4",
  normal: "#F5F5F5",
  ice: "#d0f0fd",
  steel: "#d5d5e5",
  ghost: "#a393eb",
  dark: "#a9a9a9"
};
const mainTypes = Object.keys(colors);

document.getElementById("sName").addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    document.getElementById("btnProcurar").click();
  }
});
function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
    document.querySelector("header").classList.toggle("dark-mode");
    document.querySelector("h1").classList.toggle("dark-mode");
    
    document.querySelectorAll("input[type='text'], input[type='number']").forEach(input => {
        input.classList.toggle("dark-mode");
    });

    document.querySelectorAll("button").forEach(button => {
        button.classList.toggle("dark-mode");
    });

    document.querySelectorAll(".card").forEach(card => {
        card.classList.toggle("dark-mode");
    });

    document.querySelectorAll(".pokemonBox").forEach(box => {
        box.classList.toggle("dark-mode");
    });

    document.querySelectorAll("h2").forEach(h2 => {
        h2.classList.toggle("dark-mode");
    });

    document.querySelector("footer").classList.toggle("dark-mode");
}
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

  const card = document.createElement("div");
  card.classList.add("card");

  const name = data.name[0].toUpperCase() + data.name.slice(1);
  const id = data.id.toString().padStart(3, "0");
  const types = data.types.map((type) => type.type.name);
  const mainType = types[0];
  const color = colors[mainType] || "#F5F5F5";

  card.style.backgroundColor = color;

  const pokeInnerHTML = `
        <div class="imgContainer">
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${i}.png" alt="${name}">
        </div>
        <div class="info">
            <p class="number">#${id}</p>
            <p class="name">${name}</p>
            <p class="type">Type: ${types.join(" and ")}</p>
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
  const correctAnswer = document.getElementById("quizAnswer").dataset
    .correctAnswer;
  const feedback =
    userAnswer === correctAnswer ? "Correto!" : `Errado! Era ${correctAnswer}.`;
  document.getElementById("quizFeedback").textContent = feedback;
}

// Função Explorador de Habilidades
async function fetchAbilities() {
  const pokemonId = document.getElementById("abilityPokeId").value;
  const abilityImage = document.getElementById("abilityImage");

  if (!pokemonId) {
    document.getElementById("abilityList").textContent =
      "Por favor, insira um ID de Pokémon.";
    abilityImage.style.display = "none"; // Esconde a imagem se não houver ID
    return;
  }

  const data = await fetchPoke(pokemonId);
  if (data) {
    const abilities = data.abilities
      .map((ability) => ability.ability.name)
      .join(", ");
    document.getElementById(
      "abilityList"
    ).textContent = `Habilidades: ${abilities}`;

    // Atualiza a imagem do Pokémon
    abilityImage.src = data.sprites.front_default; 
    abilityImage.style.display = "block"; 
  }
}

// Função Simulador de Batalhas
async function simulateBattle() {
  const poke1Id = document.getElementById("battlePoke1").value;
  const poke2Id = document.getElementById("battlePoke2").value;
  const level1 = parseInt(document.getElementById("battleLevel1").value) || 50;
  const level2 = parseInt(document.getElementById("battleLevel2").value) || 50;

  if (!poke1Id || !poke2Id) {
    document.getElementById("battleResult").textContent = "Por favor, insira os IDs de dois Pokémon.";
    return;
  }

  const poke1 = await fetchPoke(poke1Id);
  const poke2 = await fetchPoke(poke2Id);

  if (!poke1 || !poke2) {
    document.getElementById("battleResult").textContent = "Não foi possível carregar os dados dos Pokémon.";
    return;
  }

  // Exibe as imagens dos Pokémon para a batalha em caixinhas
  document.getElementById("battleImages").innerHTML = `
    <div class="battle-pokemon">
      <img src="${poke1.sprites.front_default}" alt="${poke1.name}" class="battle-image">
      <p>${poke1.name.charAt(0).toUpperCase() + poke1.name.slice(1)} (Nível ${level1})</p>
    </div>
    <div class="battle-pokemon">
      <img src="${poke2.sprites.front_default}" alt="${poke2.name}" class="battle-image">
      <p>${poke2.name.charAt(0).toUpperCase() + poke2.name.slice(1)} (Nível ${level2})</p>
    </div>`;

  const winner = calculateBattleOutcome(poke1, poke2, level1, level2);
  document.getElementById("battleResult").textContent = `${
    winner.name.charAt(0).toUpperCase() + winner.name.slice(1)
  } venceu!`;
}

// Função para calcular o resultado da batalha
function calculateBattleOutcome(poke1, poke2, level1, level2) {
  const typeEffectiveness = {
    normal: { rock: 0.5, ghost: 0, steel: 0.5 },
    fire: { grass: 2, ice: 2, bug: 2, steel: 2, water: 0.5, fire: 0.5, rock: 0.5, dragon: 0.5},
    water: { fire: 2, ground: 2, rock: 2, water: 0.5, grass: 0.5, dragon: 0.5 },
    electric: { water: 2, flying: 2, ground: 0, electric: 0.5, grass: 0.5, dragon: 0.5},
    grass: { water: 2, ground: 2, rock: 2, fire: 0.5,  grass: 0.5, poison: 0.5, flying: 0.5, bug: 0.5, dragon: 0.5, steel: 0.5},
    ice: { grass: 2, ground: 2, flying: 2, dragon: 2, fire: 0.5, water: 0.5, ice: 0.5,steel: 0.5},
    fighting: { normal: 2, ice: 2, rock: 2, dark: 2, steel: 2, poison: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, ghost: 0, fairy: 0.5},
    poison: { grass: 2, fairy: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0},
    ground: { fire: 2, electric: 2, poison: 2, rock: 2, steel: 2, grass: 0.5, bug: 0.5, flying: 0},
    flying: { grass: 2, fighting: 2, bug: 2, electric: 0.5, rock: 0.5, steel: 0.5},
    psychic: { fighting: 2, poison: 2, psychic: 0.5, dark: 0, steel: 0.5 },
    bug: {grass: 2, psychic: 2, dark: 2, fire: 0.5, fighting: 0.5, poison: 0.5, flying: 0.5, ghost: 0.5,steel: 0.5, fairy: 0.5},
    rock: { fire: 2, ice: 2, flying: 2, bug: 2, fighting: 0.5, ground: 0.5, steel: 0.5},
    ghost: { psychic: 2, ghost: 2, dark: 0.5, normal: 0 },dragon: { dragon: 2, steel: 0.5, fairy: 0 }, 
    dark: { psychic: 2, ghost: 2, fighting: 0.5, dark: 0.5, fairy: 0.5 }, 
    steel: {ice: 2, rock: 2, fairy: 2, fire: 0.5, water: 0.5, electric: 0.5, steel: 0.5},
    fairy: { fighting: 2, dragon: 2, dark: 2, fire: 0.5, poison: 0.5, steel: 0.5}
  };

  const poke1Type = poke1.types[0].type.name;
  const poke2Type = poke2.types[0].type.name;

  const poke1Atk = poke1.stats[1].base_stat; 
  const poke1Def = poke1.stats[2].base_stat; 
  const poke2Atk = poke2.stats[1].base_stat; 
  const poke2Def = poke2.stats[2].base_stat; 

  const poke1TypeMultiplier = typeEffectiveness[poke1Type]?.[poke2Type] || 1;
  const poke2TypeMultiplier = typeEffectiveness[poke2Type]?.[poke1Type] || 1;

  const poke1Damage = calculateDamage(
    level1,
    poke1Atk,
    poke2Def,
    poke1TypeMultiplier
  );
  const poke2Damage = calculateDamage(
    level2,
    poke2Atk,
    poke1Def,
    poke2TypeMultiplier
  );

  return poke1Damage > poke2Damage ? poke1 : poke2;
}

// Função para calcular o dano
function calculateDamage(level, attack, defense, typeMultiplier) {
  const baseDamage = (((2 * level) / 5 + 2) * attack) / defense / 50 + 2;
  return baseDamage * typeMultiplier;
}

// Função Enciclopédia de Tipos
async function fetchTypeInfo() {
  const typeName = document.getElementById("typeName").value.toLowerCase();
  const typeImage = document.getElementById("typeImage");
  const typeInfoDiv = document.getElementById("typeInfo");

  // Resetando a imagem e as informações
  typeImage.style.display = "none";
  typeInfoDiv.innerHTML = "";

  if (mainTypes.includes(typeName)) {
    typeImage.src = `path/to/type/images/${typeName}.png`; // Substitua pelo caminho correto das imagens
    typeImage.style.display = "block";

    const response = await fetch(`https://pokeapi.co/api/v2/type/${typeName}`);
    const typeData = await response.json();

    // Exibindo informações do tipo
    const pokemonList = typeData.pokemon
      .map((poke) => poke.pokemon.name)
      .join(", ");
    typeInfoDiv.innerHTML = `<p>Pokémon do Tipo ${
      typeName.charAt(0).toUpperCase() + typeName.slice(1)
    }: ${pokemonList}</p>`;
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
      currentEvolution.evolves_to.forEach((evolution) => {
        evolvesTo.push(evolution.species.name);
        if (evolution.evolves_to.length > 0) {
          evolution.evolves_to.forEach((subEvolution) => {
            evolvesTo.push(subEvolution.species.name);
          });
        }
      });
    }

    let evolutionText = `${
      data.name.charAt(0).toUpperCase() + data.name.slice(1)
    }`;

    if (evolvesFrom) {
      evolutionText += ` evolui de ${
        evolvesFrom.charAt(0).toUpperCase() + evolvesFrom.slice(1)
      }`;
    }

    if (evolvesTo.length > 0) {
      evolutionText += ` evolui para ${evolvesTo
        .map((name) => name.charAt(0).toUpperCase() + name.slice(1))
        .join(" e ")}.`;
    } else {
      evolutionText += ` e não evolui para mais ninguém.`;
    }

    if (!evolvesFrom && evolvesTo.length === 0) {
      evolutionText = `${
        data.name.charAt(0).toUpperCase() + data.name.slice(1)
      } é de estágio único.`;
    }

    evolutionList.innerHTML = `<p>${evolutionText}</p>`;
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
async function showBattleImage(pokeId, pokeNumber) {
  if (!pokeId) return;

  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokeId}`);
    const pokemon = await response.json();
    const imgUrl = pokemon.sprites.front_default;
    const imgElement =
      pokeNumber === 1
        ? document.getElementById("battleImage1")
        : document.getElementById("battleImage2");
    imgElement.src = imgUrl;
    imgElement.style.display = "block"; 
  } catch (error) {
    console.error("Erro ao carregar a imagem do Pokémon:", error);
  }
}

// Função Construtor de Equipes
const team = [];

function addToTeam() {
  const pokeId = document.getElementById("teamPokeId").value;

  if (team.length >= 6) {
    alert("O time já está completo! Máximo de 6 Pokémon.");
    return;
  }
  
  if (!pokeId || team.includes(pokeId)) {
    alert("Por favor, insira um ID válido e que ainda não esteja na equipe.");
    return;
  }

  team.push(pokeId);
  showTeamPokemon(pokeId);
}

async function showTeamPokemon(id) {
  const data = await fetchPoke(id);
  const imgContainer = document.getElementById("teamPokemonImage");

  // Define a cor de fundo com base no tipo principal do Pokémon
  const primaryType = data.types[0].type.name;
  const bgColor = colors[primaryType] || "#F0F0F0"; // Cor padrão se o tipo não estiver no objeto `colors`

  // Adiciona o Pokémon com estilo baseado no tipo
  imgContainer.innerHTML += `
    <div class="team-member" style="background-color: ${bgColor};">
      <img src="${data.sprites.front_default}" alt="${data.name}" class="team-image">
      <p class="team-name">${data.name}</p>
    </div>`;
}

// Função para buscar dados do Pokémon com base no ID
async function fetchPoke(id) {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  return response.json();
}

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
  document.querySelector("header").classList.toggle("dark-mode");
  document.querySelector("footer").classList.toggle("dark-mode");
  document.querySelectorAll("input").forEach((el) => el.classList.toggle("dark-mode"));
  document.querySelectorAll("button").forEach((el) => el.classList.toggle("dark-mode"));
  document.querySelectorAll(".card").forEach((el) => el.classList.toggle("dark-mode"));
  document.querySelectorAll(".pokemonBox").forEach((el) => el.classList.toggle("dark-mode"));
  document.querySelectorAll("h1, h2").forEach((el) => el.classList.toggle("dark-mode"));
}
