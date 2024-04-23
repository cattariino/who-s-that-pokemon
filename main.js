const containerNamePokemon = document.querySelector(".text-container");
const signoInterrogacion = document.querySelector(".name-pokemon");
const containerDivImagePokemon = document.querySelector(".container");
const containerBotones = document.querySelector(".botones");

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
            // containerNamePokemon.appendChild(button);
            button.addEventListener("click", () => {
                if (name === correctName) {
                    imgPokemon.style.filter = "none";
                    signoInterrogacion.textContent = correctName;
                    const allButtons = containerBotones.querySelectorAll("button");
                    allButtons.forEach(btn => {
                        
                        function randomInRange(min, max) {
                            return Math.random() * (max - min) + min;
                          }
                          
                          confetti({
                            angle: randomInRange(55, 125),
                            spread: randomInRange(50, 70),
                            particleCount: randomInRange(50, 100),
                            origin: { y: 0.6 }
                          });
                        btn.style.display = "none";
                        

                    });

                } else {
                    button.classList.add("animate__animated", "animate__wobble");
                    button.addEventListener('animationend', () => {
                        // Cuando la primera animación haya terminado, aplica la segunda animación
                        button.style.display = "none";
                    });
                    // alert("Pokemon Incorrecto. ¡Inténtalo de nuevo!");
                }
            });
        });
    });
});


