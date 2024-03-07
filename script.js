const newWordBtn = document.querySelector('#new-word-btn')
const langSelect = document.querySelector('#lang-select')
const wordHtmlElement = document.querySelector('#word')
const userLettersContainer = document.querySelector('#letters')
const userLetters = document.querySelectorAll('#letters li')
const errorContainer = document.querySelector('#error-container')
const errorImg = document.querySelector('#error-container img')
const errorCount = document.querySelector('#error-count')
const gameHistoryBtn = document.querySelector('#game-history-btn')

var lang = 'en'
var currentWord = null
var currentWordLetters = null
var gameRunning = false
var gameWon = false
var lettersGuessedNb = 0
var lettersGuessed = []
var errors = 0

// api call to generate new word depending on the language selected
async function generateRandomWord() {
    try {
        let response = await fetch(`https://random-word-api.herokuapp.com/word?lang=${lang}`)
        const data = await response.json()

        if(response.ok) {
            return data[0]
        } else {
            throw new Error(`Erreur de chargement : ${response.status}`)
        }

    } catch(error) {
        console.error('Erreur :', error.message)
    }
}

// --------------------------------------------------------------------------------------------------------------------
// ------- opening et closing of match history (jQuery for animations) ------------------------------------------------
$('#game-history-btn').click(function() {
    if ($('#modal-overlay').css('display') === 'none') {
        $('#modal-body').empty()
        displayGamesHistory()
        $('#modal-overlay').fadeIn('fast')
    } else {
        $('#modal-overlay').fadeOut('fast')
    }
})

$('#modal-close').click(function() {
    $('#modal-overlay').fadeOut();
})

$(document).click(function(event) {
    if (!$(event.target).closest('#modal-content, #game-history-btn').length) {
        $('#modal-overlay').fadeOut()
    }
})
// --------------------------------------------------------------------------------------------------------------------

// language selection on select list
langSelect.addEventListener('change', () => {
    lang = langSelect.value
})

// word generation on btn click
newWordBtn.addEventListener('click', startGame)

// handle letter guess
userLetters.forEach((userLetter) => {
    userLetter.addEventListener('click', () => {
        handleLetterPress(userLetter.innerHTML)
    })
})

// handle key presses for letter guessing and start gaming with 'Enter'
document.addEventListener('keydown', (e) => {
    // check if key pressed is in the alphabet
    if(e.key.match(/^[a-zA-Z]$/) && gameRunning) {
        handleLetterPress(e.key)
    } else if(e.key === 'Enter') {
        if(!gameRunning) {
            startGame()
        }
    }
})

// handle letter press (from keyboard OR mouse)
function handleLetterPress(letter) {
    // if game is running and the word clicked is in the word
    if(gameRunning) {

        // if user already pressed this letter, ignore
        if(lettersGuessed.includes(letter)) {
            // potential error msg here
            return
        }

        if(isInWord(letter)) {
            handleLetterGuessed(letter)
        } else {
            errors += 1
        }
        lettersGuessed.push(letter)
        disableGuessedLetter(letter)

    } else {
        console.log('Generate a word first.')
    }
    handleErrors()
}

// check if a letter is in the current word to guess
function isInWord(letter) {
    var success = null

    currentWordLetters.forEach((currentWordLetter) => {
        if(convertAccentsAndSpecialChars(currentWordLetter) === letter.toLowerCase()) {
            success = true
        }
    })

    return success
}

function disableGuessedLetter(letter) {
    userLetters.forEach((userLetter) => {
        console.log(letter)
        if(convertAccentsAndSpecialChars(userLetter.innerHTML) === letter.toLowerCase()) {
            userLetter.classList.add('disabled')
        }
    })
}

function enableAllLetters() {
    userLetters.forEach((userLetter) => {
        userLetter.classList.remove('disabled')
    })
}

// show letter if user guessed right
function handleLetterGuessed(letter) {
    var guessedLetterPosition = null

    // for each letters in current word to guess
    currentWordLetters.forEach((currentWordLetter, index) => {
        // if it's not the first letter (bc it's displayed by default at the start of the game)
        // and if the user guess is the same as it
        if(index !== 0 && convertAccentsAndSpecialChars(currentWordLetter) === letter.toLowerCase()) {
            // get the empty <li> in ul#word in the right position 
            guessedLetterPosition = document.querySelector(`#word li:nth-of-type(${index + 1})`)
            // add letter in this li
            guessedLetterPosition.innerHTML = currentWordLetters[index]
            // increment lettersGuessedNb
            lettersGuessedNb++
        }
    })

    // if user guessed all the letters, show victoryScreen
    if((lettersGuessedNb + 1) === currentWordLetters.length) {
        endGame(true)
    }
}

// function to convert special chars and accents to lowercase normal letter (Ê => e)
function convertAccentsAndSpecialChars(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
}

// start game formalities
async function startGame() {
    try {
        // set current word and currentWordLetters
        currentWord = await generateRandomWord()
        currentWordLetters = currentWord.split('')
    
        console.log(currentWord)
    
        wordHtmlElement.innerHTML = "" // empty current word displayed
        // add empty space for each letters in the generated word
        for(i = 0; i < currentWordLetters.length; i++) {
            const emptyLetterSpace = document.createElement('li')
            wordHtmlElement.appendChild(emptyLetterSpace)
        }    
    
        // display first letter of the word to guess
        document.querySelector('#word li:first-of-type').innerHTML = currentWordLetters[0].toUpperCase()
    
        userLettersContainer.style.display = "flex"
        wordHtmlElement.style.display = "flex"
    
        gameRunning = true
        gameWon = false
        lettersGuessed = []
        lettersGuessedNb = 0
        errors = 0
    
        enableAllLetters()
        handleErrors()
    
        errorContainer.style.display = 'flex'
        errorImg.src = '/img/hang-0.png'
    } catch (error) {
        console.error(error)
    }
}

// endgame and show message
function endGame(victory) {
    gameRunning = false
    
    userLettersContainer.style.display = "none"

    // Récupération de l'historique des parties depuis localStorage
    const gamesHistory = JSON.parse(localStorage.getItem('gamesHistory')) || [];
    
    // Ajout de l'état de la partie actuelle à l'historique
    const gameState = {
        gameWon: victory,
        wordGuessed: currentWord,
        errorsMade: errors,
        date: new Date().toISOString() // Ajoute la date et l'heure de la partie
    };
    
    // Mise à jour de l'historique des parties
    gamesHistory.push(gameState);
    localStorage.setItem('gamesHistory', JSON.stringify(gamesHistory));

    if(victory) {
        gameWon = true
        errorImg.src = '/img/thumbs_up.webp'

        switch(lang) {
            case 'en':
                wordHtmlElement.innerHTML = "Congratulations !"
                break;
            case 'fr':
                wordHtmlElement.innerHTML = "Félicitations !"
                break;
            case 'en':
                wordHtmlElement.innerHTML = "Felicidades !"
                break;
            default:
                wordHtmlElement.innerHTML = "Congratulations"
                break;
        }
        
    } else {
        errorImg.src = '/img/snif_snif.jpg'

        switch(lang) {
            case 'en':
                wordHtmlElement.innerHTML = "You lost.."
                break;
            case 'fr':
                wordHtmlElement.innerHTML = "Perdu.."
                break;
            case 'en':
                wordHtmlElement.innerHTML = "Perdido.."
                break;
            default:
                wordHtmlElement.innerHTML = "You lost.."
                break;
        }
    }
}

// handle errors and change image depending on the amount of errors
function handleErrors() {
    if (errors >= 7) {
        endGame(false)
        errorCount.innerHTML = errors
        return
    }

    if(!gameWon) {
        errorImg.src = `/img/hang-${errors}.png`
        errorCount.innerHTML = errors
    }
}

function displayGamesHistory() {
    const gamesHistory = JSON.parse(localStorage.getItem('gamesHistory')) || [];
    const modalBody = $('#modal-body');

    gamesHistory.forEach((game, index) => {
        const entryClass = game.gameWon ? 'win' : 'lose';
        const entryContent = `<div class="modal-history-entry ${entryClass}">
            <strong>Game ${index + 1}:</strong> ${game.gameWon ? "Won" : "Lost"}<br>
            Word: ${game.wordGuessed}<br>
            Errors: ${game.errorsMade}<br>
            Date: ${new Date(game.date).toLocaleString()}
        </div>`;
        modalBody.append(entryContent);
    });
}