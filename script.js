// Wait for DOM to fully load before running script
document.addEventListener('DOMContentLoaded', initializeGames);

function initializeGames() {
    // Load click sound effect
    const clickSound = new Audio('click.mp3');

    // Game selector setup
    const alphabetSelector = document.getElementById('alphabet-selector');
    const numberSelector = document.getElementById('number-selector');
    const alphabetSection = document.getElementById('alphabet-section');
    const numberSection = document.getElementById('number-section');

    // Set up game switching
    alphabetSelector.addEventListener('click', () => {
        alphabetSection.classList.add('active');
        numberSection.classList.remove('active');
        alphabetSelector.classList.add('active');
        numberSelector.classList.remove('active');
    });

    numberSelector.addEventListener('click', () => {
        numberSection.classList.add('active');
        alphabetSection.classList.remove('active');
        numberSelector.classList.add('active');
        alphabetSelector.classList.remove('active');
    });

    // ------------------- ALPHABET GAME -------------------
    const alphabetContainer = document.querySelector('.alphabet-container');
    const alphabetTarget = document.getElementById('alphabet-target');
    const correctOrder = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let expectedLetterIndex = 0;

    // Create a shuffled version of the letters for display
    let displayLetters = correctOrder.split('');
    for (let i = displayLetters.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [displayLetters[i], displayLetters[j]] = [displayLetters[j], displayLetters[i]];
    }

    // Create letter buttons
    displayLetters.forEach(letter => {
        const button = document.createElement('div');
        button.className = 'letter';
        button.textContent = letter;
        // Store the handler function on the button so it can be removed later
        button.clickHandler = handleLetterClick;
        button.addEventListener('click', button.clickHandler);
        alphabetContainer.appendChild(button);
    });

    // Letter click handler
    function handleLetterClick(e) {
        const clickedButton = e.target;
        const currentLetter = clickedButton.textContent;
        const expectedLetter = correctOrder[expectedLetterIndex];

        if (currentLetter === expectedLetter) {
            // Correct letter clicked
            clickSound.currentTime = 0;
            clickSound.play();

            // Use lowercase for speech to avoid "capital" being said
            const audio = new SpeechSynthesisUtterance(currentLetter.toLowerCase());
            speechSynthesis.speak(audio);

            // Move the button to the target container
            alphabetTarget.appendChild(clickedButton);
            // Remove the click listener from the moved button using stored handler
            clickedButton.removeEventListener('click', clickedButton.clickHandler);
            clickedButton.style.cursor = 'default';
            clickedButton.classList.add('placed');

            expectedLetterIndex++; // Move to the next expected letter

            // Check for win condition
            if (expectedLetterIndex === correctOrder.length) {
                // All letters placed correctly!
                setTimeout(() => {
                    showCelebration();
                }, 300);
            }
        } else {
            // Incorrect letter clicked - Visual feedback and message
            console.log(`Incorrect. Expected: ${expectedLetter}, Clicked: ${currentLetter}`);
            showError(clickedButton, `Oops! Find letter ${expectedLetter} first!`);
        }
    }

    // ------------------- NUMBER ORDERING GAME -------------------
    const numberContainer = document.querySelector('.counting-container');
    const numberTarget = document.getElementById('number-target');
    const countDisplay = document.querySelector('.count-display');
    let expectedNumber = 1; // Track the next expected number

    // Create an array of numbers 1-20 and shuffle them
    let numbers = Array.from({length: 20}, (_, i) => i + 1);
    for (let i = numbers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }

    // Create number buttons
    numbers.forEach(number => {
        const numberButton = document.createElement('div');
        numberButton.className = 'number';
        numberButton.textContent = number;
        // Store the handler function on the button so it can be removed later
        numberButton.clickHandler = () => handleNumberClick(numberButton, number);
        numberButton.addEventListener('click', numberButton.clickHandler);
        numberContainer.appendChild(numberButton);
    });

    function handleNumberClick(button, clickedNumber) {
        if (clickedNumber === expectedNumber) {
            // Correct number clicked
            clickSound.currentTime = 0;
            clickSound.play();

            // Speak the number
            const speakNumber = new SpeechSynthesisUtterance(clickedNumber.toString());
            speechSynthesis.speak(speakNumber);

            // Move the button to the target container
            numberTarget.appendChild(button);
            // Fix: Use a function reference that can be properly removed
            button.removeEventListener('click', button.clickHandler);
            button.style.cursor = 'default';
            button.classList.add('placed');

            // Display stars for the current number
            countDisplay.innerHTML = '';
            for (let i = 0; i < clickedNumber; i++) {
                const star = document.createElement('span');
                star.textContent = '★';
                star.style.margin = '5px';
                countDisplay.appendChild(star);
            }

            expectedNumber++;

            // Check for win condition
            if (expectedNumber > 20) {
                setTimeout(() => {
                    showCelebration();
                }, 300);
            }
        } else {
            // Incorrect number clicked
            console.log(`Incorrect. Expected: ${expectedNumber}, Clicked: ${clickedNumber}`);
            showError(button, `Oops! You need to find number ${expectedNumber} first!`);
        }
    }

    // ------------------- SHARED UTILITY FUNCTIONS -------------------

    // Show error message and highlight
    function showError(button, message) {
        const originalColor = button.style.backgroundColor;
        button.style.backgroundColor = '#ffcccb'; // Light red
        
        // Create and show the error message
        const messageEl = document.createElement('div');
        messageEl.className = 'error-message';
        messageEl.textContent = message;
        document.body.appendChild(messageEl);
        
        // Create and play error sound
        const errorSound = new Audio('https://actions.google.com/sounds/v1/cartoon/cartoon_boing.ogg');
        errorSound.volume = 0.3;
        errorSound.play();
        
        // Remove message after 2 seconds
        setTimeout(() => {
            document.body.removeChild(messageEl);
            button.style.backgroundColor = originalColor; // Revert color
        }, 2000);
    }

    // Show celebration with dinosaur and confetti
    function showCelebration() {
        // Create dinosaur element for celebration
        const dino = document.createElement('img');
        dino.src = 'dinosaur.svg'; // Use local dinosaur image
        dino.alt = 'Celebrating Dinosaur';
        dino.className = 'dino-image';
        
        // Add dinosaur to the page
        document.body.appendChild(dino);
        
        // Position the dinosaur in the center
        setTimeout(() => {
            dino.style.opacity = '1';
            dino.style.transform = 'translate(-50%, -50%) scale(1)';
            
            // Create a mouth position relative to the dinosaur image
            setTimeout(() => {
                // The SVG has the mouth defined at coordinates around (360, 40)
                // So we need to position the confetti origin at that point relative to the image
                const dinoRect = dino.getBoundingClientRect();
                const mouthX = (dinoRect.left + (370 * dinoRect.width / 400)) / window.innerWidth;
                const mouthY = (dinoRect.top + (40 * dinoRect.height / 300)) / window.innerHeight;
                
                // Shoot confetti from dinosaur's mouth
                confetti({
                    particleCount: 300,
                    spread: 50,
                    origin: { 
                        x: mouthX,
                        y: mouthY 
                    },
                    angle: 120, // Adjust angle for the SVG dinosaur
                    startVelocity: 60,
                    colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff']
                });
            }, 100);
            
            // Remove dinosaur after celebration
            setTimeout(() => {
                dino.style.opacity = '0';
                dino.style.transform = 'translate(-50%, -50%) scale(0)';
                setTimeout(() => {
                    document.body.removeChild(dino);
                }, 1000);
            }, 4000);
        }, 100);
        
        // Play celebration sound
        const sound = new Audio('https://actions.google.com/sounds/v1/cartoon/cartoon_boing.ogg');
        sound.volume = 0.5;
        sound.play();
    }
}
