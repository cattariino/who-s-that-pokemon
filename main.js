const containerNamePokemon = document.querySelector(".text-container");
const signoInterrogacion = document.querySelector(".name-pokemon");
const containerDivImagePokemon = document.querySelector(".container");
const containerBotones = document.querySelector(".botones");
const scoreContainer = document.querySelector(".score");
const containerHears = document.querySelector(".container-hears");

window.addEventListener('beforeunload', function(event) {
    sessionStorage.removeItem('score');
});

function addHearts() {
    for (let i = 0; i < 3; i++) {
        const divHeart = document.createElement("div");
        divHeart.className = "heart";
        containerHears.appendChild(divHeart);
    }
}

addHearts();

let heartsLeft = 3;

function removeHeart() {
    const hearts = containerHears.querySelectorAll('.heart');
    if (hearts.length > 0) {
        const lastHeart = hearts[hearts.length - 1];
        lastHeart.remove();
        heartsLeft--;

        if (heartsLeft === 0) {
            setTimeout(() => {
                function showCustomAlert(score) {
                    const alertMessage = document.querySelector("#alert-message");
                    alertMessage.textContent = `Your score: ${score}`;
                
                    const customAlert = document.getElementById('custom-alert');
                    customAlert.style.display = 'block';
                
                    const btnClose = document.querySelector("#close");
                    btnClose.addEventListener("click", () => {
                        customAlert.style.display = 'none';
                        restartGame()
                    });
                }
                
                let score = getStoredScore();
                showCustomAlert(score);
            }, 500);
        }
    }
}

function restartGame() {
    // Restablecer el número de vidas y volver a agregar los corazones
    heartsLeft = 3;
    containerHears.innerHTML = '';
    addHearts();
    
    // Reiniciar el puntaje almacenado a cero
    saveScore(0);
    scoreContainer.textContent = 0;
    
    // Volver a cargar un nuevo Pokémon
    loadNewPokemon();
}

function getPokemonImage(pokemonAleatorio, done) {
    const url = `https://pokeapi.co/api/v2/pokemon/${pokemonAleatorio}`;
    fetch(url)
        .then(resolve => resolve.json())
        .then(data => {
            const imgUrl = data.sprites.other["official-artwork"].front_default;
            const name = data.name;
            done(imgUrl, name);
        })
        .catch(error => {
            console.error('Error fetching Pokémon data:', error);
            done(null);
        });
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function getRandomPokemonNames(correctName, callback) {
    const numberOfPokemons = 3; // Three Pokémon names
    const randomPokemonIDs = [];

    while (randomPokemonIDs.length < numberOfPokemons - 1) {
        const randomIdPokemon = Math.floor(Math.random() * 150) + 1;
        if (!randomPokemonIDs.includes(randomIdPokemon)) {
            randomPokemonIDs.push(randomIdPokemon);
        }
    }

    Promise.all(randomPokemonIDs.map(id =>
        fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
        .then(response => response.json())
        .then(data => data.name)
    ))
    .then(names => {
        names.push(correctName);
        names = shuffleArray(names);
        callback(names);
    })
    .catch(error => {
        console.error('Error fetching Pokémon names:', error);
        callback([]);
    });
}

function getStoredScore() {
    const storedScore = sessionStorage.getItem('score');
    return storedScore ? parseInt(storedScore) : 0;
}

function saveScore(score) {
    sessionStorage.setItem('score', score);
}

scoreContainer.textContent = getStoredScore();


function loadNewPokemon() {
    containerDivImagePokemon.innerHTML = '';
    containerBotones.innerHTML = '';
    signoInterrogacion.textContent = "?"
    scoreContainer.textContent = getStoredScore(); // Usar el puntaje almacenado

    const pokemonAleatorio = Math.floor(Math.random() * 150) + 1;

    getPokemonImage(pokemonAleatorio, (imgUrl, correctName) => {
        const imgPokemon = document.createElement("img");
        imgPokemon.src = imgUrl;
        imgPokemon.className = "imgPokemon";
        containerDivImagePokemon.appendChild(imgPokemon);

        getRandomPokemonNames(correctName, names => {
            names.forEach((name, index) => {
                const button = document.createElement("button");
                button.className = "btn1";
                button.textContent = name;
                containerBotones.appendChild(button);

                button.addEventListener("click", () => {
                    if (name === correctName) {
                        function randomInRange(min, max) {
                            return Math.random() * (max - min) + min;
                          }
                          
                          confetti({
                            angle: randomInRange(55, 125),
                            spread: randomInRange(50, 70),
                            particleCount: randomInRange(50, 100),
                            origin: { y: 0.6 }
                          });
                        imgPokemon.style.filter = "none";
                        signoInterrogacion.textContent = correctName;
                        const allButtons = containerBotones.querySelectorAll("button");
                        allButtons.forEach(btn => {
                            btn.style.display = "none";
                        });
                        let score = getStoredScore();
                        score += 10;
                        scoreContainer.textContent = score;
                        saveScore(score);
                        setTimeout(() => {
                            loadNewPokemon();
                        }, 2000);
                    } else {
                        button.classList.add("animate__animated", "animate__wobble");
                        button.addEventListener('animationend', () => {
                            button.style.display = "none";
                        });
                        removeHeart(); 
                        let score = getStoredScore();
                        scoreContainer.textContent = score;
                        saveScore(score);

                        
                        const selectedButtons = containerBotones.querySelectorAll('.btn1:not(.animate__animated)');
                        if (selectedButtons.length === 1) {
                            setTimeout(() => {
                                imgPokemon.style.filter = "none";
                                signoInterrogacion.textContent = correctName;
                                const allButtons = containerBotones.querySelectorAll("button");
                                allButtons.forEach(btn => {
                                    btn.style.display = "none";
                                });
                                setTimeout(() => {
                                    loadNewPokemon(); 
                                }, 1000);
                            }, 500);
                        }
                    }
                });
            });
        });
    });
}
let score = getStoredScore();

loadNewPokemon();
