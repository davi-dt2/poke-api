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
// Função para buscar os dados do Pokémon
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
  return data.name.toUpperCase().includes(selector);  // Verifica se o nome do Pokémon contém o valor do filtro
}

async function renderCards(selector) {
  const div = document.querySelector("#pokeContainer");

  // Limpar todos os Pokémon na tela antes de exibir os novos
  while (div.firstChild) {
    div.removeChild(div.firstChild);
  }

  // Renderizar os Pokémon filtrados
  for (let i = 1; i <= pokeCount; i++) {
    const match = await filter(selector, i);
    if (!selector || match) {
      await createCard(i);  // Chama a função para criar o card
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
  const color = colors[mainType] || "#F5F5F5";  // Cor baseada no tipo do Pokémon

  card.style.backgroundColor = color;  // Aplica a cor de fundo com base no tipo principal

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

// Adiciona evento de clique na carta para abrir o pop-up
card.addEventListener("click", () => {
  openPopup(data);  // Chama a função para abrir o pop-up com as informações do Pokémon
});

document.querySelector("#pokeContainer").appendChild(card);
}

// Função para abrir o pop-up com as informações do Pokémon
async function openPopup(data) {
  console.log("Abrindo pop-up para o Pokémon:", data);  // Verifique os dados do Pokémon no console

  // Obtém o tipo principal do Pokémon para definir a cor do fundo
  const types = data.types.map(type => type.type.name);
  const mainType = types[0];  // O primeiro tipo é o tipo principal
  const color = colors[mainType] || "#F5F5F5";  // Usamos a mesma cor que nas cartas, ou um padrão

  // Converte peso e altura para unidades mais compreensíveis
  const heightInMeters = (data.height / 10).toFixed(2);  // altura em metros (decímetros para metros)
  const weightInKg = (data.weight / 10).toFixed(2);  // peso em quilos (hectogramas para quilos)

  // Busca a cadeia de evolução do Pokémon
  const evolutionChain = await fetchEvolutionChain(data.id);

  // Cria o pop-up
  const popup = document.createElement("div");
  popup.classList.add("popup");

  // Chama a função para buscar os movimentos do Pokémon
  const moves = await fetchPokemonMoves(data.id);
  console.log("Movimentos do Pokémon:", moves);  // Verifique os movimentos no console

  // Cria o conteúdo do pop-up
  const popupContent = `
    <div class="popup-content" style="background-color: ${color};">  <!-- Aplique a cor do tipo ao fundo -->
      <span class="close-btn">X</span>
      <div class="popup-columns">
        <!-- Coluna 1: Informações básicas -->
        <div class="popup-column">
          <h2>${data.name.charAt(0).toUpperCase() + data.name.slice(1)}</h2>
          <img src="${data.sprites.front_default}" alt="${data.name}">
          <p><strong>ID:</strong> #${data.id}</p>
          <p><strong>Tipo(s):</strong> ${types.join(", ")}</p>
          <p><strong>Altura:</strong> ${heightInMeters} m</p>
          <p><strong>Peso:</strong> ${weightInKg} kg</p>
        </div>
        
        <!-- Coluna 2: Movimentos -->
        <div class="popup-column">
          <h3>Movimentos:</h3>
          <ul>
            ${moves.map(move => `<li>${move}</li>`).join("")}
          </ul>
        </div>

        <!-- Coluna 3: Evolução -->
        <div class="popup-column">
          <h3>Linha Evolutiva:</h3>
          <div class="evolution-chain">
            ${evolutionChain.map(evolution => `
              <div class="evolution">
                <img src="${evolution.image}" alt="${evolution.name}" style="width: 80px; height: 80px; margin-bottom: 5px;">
                <p>${evolution.name}</p>
                ${evolution.level ? `<p>Nível: ${evolution.level}</p>` : ""}
                ${evolution.condition ? `<p>Condição: ${evolution.condition}</p>` : ""}
              </div>
            `).join("")}
          </div>
        </div>
      </div>
    </div>
  `;

// Função para fechar o pop-up
function closePopup() {
  const popup = document.querySelector(".popup");
  if (popup) {
    document.body.removeChild(popup);  // Remove o pop-up
    document.body.style.overflow = "auto";  // Habilita novamente o scroll da página
  }
}
  
  popup.innerHTML = popupContent;
  document.body.appendChild(popup);  // Adiciona o pop-up no corpo da página

  // Adiciona o estilo para o pop-up
  document.body.style.overflow = "hidden";  // Desabilita o scroll da página quando o pop-up estiver aberto

  // Funcionalidade do botão de fechar
  const closeButton = popup.querySelector('.close-btn');
  if (closeButton) {
    closeButton.addEventListener('click', closePopup);
  } else {
    console.error("Botão de fechar não encontrado");
  }

  // Fecha o pop-up se o clique for fora da área de conteúdo do pop-up
  popup.addEventListener('click', function (event) {
    if (event.target === popup) {
      closePopup();
    }
  });

  // Previne a propagação do clique quando o usuário clicar dentro do conteúdo do pop-up
  const popupContentElement = popup.querySelector('.popup-content');
  if (popupContentElement) {
    popupContentElement.addEventListener('click', function (event) {
      event.stopPropagation();  // Impede que o evento se propague para o pop-up
    });
  }
}


// Função para buscar a cadeia evolutiva do Pokémon
async function fetchEvolutionChain(pokemonId) {
  const url = `https://pokeapi.co/api/v2/pokemon-species/${pokemonId}/`;
  const response = await fetch(url);
  const data = await response.json();

  // Obter a cadeia de evolução a partir da espécie do Pokémon
  const evolutionUrl = data.evolution_chain.url;
  const evolutionResponse = await fetch(evolutionUrl);
  const evolutionData = await evolutionResponse.json();

  // Montar a linha evolutiva
  const evolutionChain = [];
  let currentEvolution = evolutionData.chain;

  // Função auxiliar para processar todas as evoluções
  function processEvolution(currentEvolution) {
    const evolutions = [];

    // Inclui o Pokémon básico (inicial) na linha evolutiva
    const basicEvolution = {
      name: currentEvolution.species.name.charAt(0).toUpperCase() + currentEvolution.species.name.slice(1),
      level: currentEvolution.evolution_details[0]?.min_level || "",  // Se não for por nível, deixa em branco
      condition: currentEvolution.evolution_details[0]?.condition ? currentEvolution.evolution_details[0].condition.name : null,
      image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${currentEvolution.species.url.split("/")[6]}.png`
    };

    evolutions.push(basicEvolution);

    if (currentEvolution.evolves_to.length > 0) {
      currentEvolution.evolves_to.forEach(evolution => {
        evolutions.push(...processEvolution(evolution)); // Recursão para pegar as evoluções subsequentes
      });
    }

    return evolutions;
  }

  const evolutions = processEvolution(currentEvolution);

  const uniqueEvolutions = [];
  const seen = new Set();
  for (const evolution of evolutions) {
    if (!seen.has(evolution.name)) {
      seen.add(evolution.name);
      uniqueEvolutions.push(evolution);
    }
  }

  return uniqueEvolutions;
}

// Função para buscar os movimentos do Pokémon
async function fetchPokemonMoves(id) {
  const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Erro ao buscar movimentos do Pokémon ID ${id}`);
    const data = await response.json();
    const moves = data.moves.map(move => move.move.name);
    return moves.slice(0, 5); // Retorna os 5 primeiros movimentos
  } catch (error) {
    console.error(error);
    return [];
  }
}


// Função para buscar os dados do Pokémon pela API
async function fetchPoke(id) {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  const data = await response.json();
  return data;
}

// Função Jogo de Perguntas sobre Pokémon
async function startQuiz() {
  const randomId = Math.floor(Math.random() * pokeCount) + 1;
  const data = await fetchPoke(randomId);

  // Verifica se a imagem do Pokémon foi carregada corretamente
  if (data.sprites && data.sprites.front_default) {
    const imgElement = document.getElementById("quizImage");
    imgElement.src = data.sprites.front_default;
    imgElement.style.filter = "brightness(0)"; // Exibe a imagem em preto
  } else {
    console.error("Imagem do Pokémon não encontrada.");
  }

  // Limpa a resposta e o feedback
  document.getElementById("quizAnswer").value = "";
  document.getElementById("quizFeedback").textContent = "";

  // Armazena a resposta correta
  document.getElementById("quizAnswer").dataset.correctAnswer = data.name.toLowerCase();
}

// Função para verificar a resposta do usuário
function checkAnswer() {
  const userAnswer = document.getElementById("quizAnswer").value.toLowerCase();
  const correctAnswer = document.getElementById("quizAnswer").dataset.correctAnswer;

  const feedback =
    userAnswer === correctAnswer
      ? "Correto!"
      : `Errado! Era ${correctAnswer.charAt(0).toUpperCase() + correctAnswer.slice(1)}.`;

  document.getElementById("quizFeedback").textContent = feedback;

  // Revela a imagem em cores normais
  document.getElementById("quizImage").style.filter = "none";
}

// Função para ir para a próxima pergunta
function nextQuestion() {
  startQuiz();
}

// Inicia o quiz automaticamente quando o site carrega
window.onload = function () {
  startQuiz();
};

// Busca todos os ataques da API
async function fetchAllMoves() {
  try {
    const response = await fetch("https://pokeapi.co/api/v2/move?limit=1000");
    if (!response.ok) throw new Error("Erro ao buscar ataques.");
    const data = await response.json();
    return data.results.map((move) => move.name);
  } catch (error) {
    console.error(error);
    return [];
  }
}

// Inicializa as opções de ataques
async function initializeMoveOptions() {
  const moveSelect = document.getElementById("moveSelect");
  const moves = await fetchAllMoves();
  moves.forEach((move) => {
    const option = document.createElement("option");
    option.value = move;
    option.textContent = move;
    moveSelect.appendChild(option);
  });
}

// Filtra ataques enquanto digita
function filterMoves() {
  const searchInput = document.getElementById("moveSearch").value.toLowerCase();
  const options = document.querySelectorAll("#moveSelect option");
  options.forEach((option) => {
    option.style.display = option.value.includes(searchInput) ? "block" : "none";
  });
}

// Busca e exibe detalhes do ataque
async function fetchMoveDetails() {
  const selectedMove = document.getElementById("moveSelect").value;
  const moveDetails = document.getElementById("moveDetails");

  if (!selectedMove) {
    moveDetails.textContent = "Selecione um ataque.";
    return;
  }

  moveDetails.textContent = "Carregando detalhes...";

  try {
    const response = await fetch(`https://pokeapi.co/api/v2/move/${selectedMove}`);
    if (!response.ok) throw new Error("Ataque não encontrado.");
    const moveData = await response.json();

    // Dados do ataque
    const element = moveData.type.name;
    const power = moveData.power || "N/A";
    const accuracy = moveData.accuracy || "N/A";
    const pp = moveData.pp || "N/A";
    const damageClass = moveData.damage_class.name;
    const descriptionEntry = moveData.effect_entries.find((entry) => entry.language.name === "en");
    const description = descriptionEntry ? descriptionEntry.short_effect : "Descrição não encontrada.";

    // Chama a função para abrir o pop-up com as informações traduzidas
    openAbilityPopup(selectedMove, {
      element,
      power,
      accuracy,
      pp,
      damageClass,
      description,
    });
  } catch (error) {
    moveDetails.textContent = "Erro ao buscar detalhes. Tente novamente.";
    console.error(error);
  }
}

// Abre o pop-up com informações traduzidas
function openAbilityPopup(name, details) {
  const { element, power, accuracy, pp, damageClass, description } = details;
  const color = colors[element] || "#F5F5F5";  // Cor padrão

  const translation = {
    power: "Poder",
    accuracy: "Precisão",
    pp: "Limite de usos (PP)",
    damageClass: "Classe de Dano",
    description: "Descrição"
  };

  const popup = document.createElement("div");
  popup.id = "ability-popup";  // ID exclusivo para o pop-up de habilidade
  popup.classList.add("popup");

  popup.innerHTML = `
    <div class="popup-content" style="background-color: ${color};">
      <span class="close-btn" onclick="closePopup('ability-popup')">X</span>
      <div class="popup-header">${name.charAt(0).toUpperCase() + name.slice(1)}</div>
      <div class="popup-column">
        <p><strong>${translation.elemento || "Elemento"}:</strong> ${element}</p>
        <p><strong>${translation.pp}:</strong> ${pp}</p>
        <p><strong>${translation.poder}:</strong> ${power}</p>
        <p><strong>${translation.precisao}:</strong> ${accuracy}%</p>
        <p><strong>${translation.classeDeDano}:</strong> ${damageClass}</p>
        <p><strong>${translation.descricao}:</strong> ${description}</p>
      </div>
    </div>
  `;
  document.body.appendChild(popup);
  document.body.style.overflow = "hidden";  // Desabilita o scroll da página

  popup.addEventListener('click', function (event) {
    if (event.target === popup) {
      closePopup('ability-popup');
    }
  });

  const popupContentElement = popup.querySelector('.popup-content');
  popupContentElement.addEventListener('click', function (event) {
    event.stopPropagation();
  });
}

// Fecha o pop-up com base no id
function closePopup(popupId) {
  const popup = document.getElementById(popupId);
  if (popup) {
    document.body.removeChild(popup);
    document.body.style.overflow = "auto";  // Habilita novamente o scroll da página
  }
}

// Inicializa as opções ao carregar a página
document.addEventListener("DOMContentLoaded", initializeMoveOptions);

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
      <p>${poke1.name.charAt(0).toUpperCase() + poke1.name.slice(1)} (LV ${level1})</p>
    </div>
    <div class="battle-pokemon">
      <img src="${poke2.sprites.front_default}" alt="${poke2.name}" class="battle-image">
      <p>${poke2.name.charAt(0).toUpperCase() + poke2.name.slice(1)} (LV${level2})</p>
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
// Função para inicializar o Google Translate
function googleTranslateElementInit() {
  new google.translate.TranslateElement({
    pageLanguage: 'pt', // Idioma original da página
    includedLanguages: 'pt,en,es,fr,de,it,ja', // Idiomas para os quais pode ser traduzido
    layout: google.translate.TranslateElement.InlineLayout.SIMPLE
  }, 'google_translate_element');
}

// Carregar o script do Google Translate
(function() {
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
  document.body.appendChild(script);
})();
