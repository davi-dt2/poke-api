
const pokeCount = 151;
const colors = {fire: '#FDDFDF', grass: '#DEFDE0',electric: '#FCF7DE', water: '#DEF3FD', ground: '#f4e7da', rock: '#d5d5d4', fairy: '#fceaff', poison: '#98d7a5', bug: '#f8d5a3', dragon: '#97b3e6', psychic: '#eaeda1', flying: '#F5F5F5', fighting: '#E6E0D4', normal: '#F5F5F5', ice: '#d0f0fd', steel: '#d5d5e5', ghost: '#a393eb', dark: '#a9a9a9'};
const mainTypes = Object.keys(colors);


document.getElementById('sName').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        document.getElementById('btnProcurar').click();
    }
});

// Funções da Pokédex Básica e Filtro
async function fetchPoke(id) { /* código */ }
function setSelector() { /* código */ }
async function filter(selector, i) { /* código */ }
async function renderCards(selector) { /* código */ }
async function createCard(i) { /* código */ }

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
async function fetchAbilities() { /* código */ }

// Função Mapa de Localização
async function fetchLocation(pokemonId) { /* código */ }

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
async function fetchTypeInfo() { /* código */ }

// Função Árvore de Evolução
async function fetchEvolution() { /* código */ }

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
