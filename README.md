
# Hangman Game Project

![JavaScript](https://img.shields.io/badge/-JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black) ![HTML5](https://img.shields.io/badge/-HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/-CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white) ![jQuery](https://img.shields.io/badge/-jQuery-0769AD?style=for-the-badge&logo=jquery&logoColor=white)

Welcome to the Hangman Game Project! This game is a modern take on the classic word guessing game. Designed to be both fun and educational, it challenges players to guess words correctly before the hangman is drawn.

Test (on desktop for now) the project here : https://hangman-game-js-three.vercel.app/
<br>
(it's extremely difficult for now, the word generation API will be changed in the future)

## Features

- **Dynamic Word Generation**: Utilizes an API to fetch random words, allowing for a diverse and challenging experience with each game.
- **Keyboard Accessibility**: Ensured the game is fully playable with the keyboard, promoting accessibility for all users.
- **Interactive UI**: A clean and intuitive user interface that provides immediate feedback on guesses and game progress.
- **Game History**: Keeps track of your game history, including wins and losses, the words guessed, and the number of errors.

## Technologies Used

- **HTML5**: Structured the game's layout.
- **CSS3**: Styled the game's interface for a visually appealing experience.
- **JavaScript (ES6+)**: Implemented game logic and API calls.
- **jQuery**: Used for DOM manipulation, handling events, and performing animations.
- **APIs**: Integrated with the `random-word-api` for fetching random words based on the selected language. (some word don't exist in the language's dictionary, i'll change the API someday)

## Accessibility

Accessibility is a core component of this game. The following features have been implemented to ensure that the game is accessible to a wider range of players, including those relying on keyboard navigation:

- **Keyboard Navigation**: Players can use the keyboard to select letters and control game functions, making the game fully accessible without the need for a mouse.
- **Visual Feedback**: Provides visual cues for correct and incorrect guesses, as well as the progress on the hangman drawing.
- **Error Handling**: Displays informative error messages and feedback for an improved user experience.

## Contribution

Contributions are welcome! Whether it's adding new features, improving the game's accessibility, or fixing bugs, feel free to fork this repository and submit a pull request.
