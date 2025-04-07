const numberContainer = document.querySelector('.counting-container');
const dropTargetContainer = document.querySelector('.drop-target-container');
const countDisplay = document.querySelector('.count-display');
let expectedNumber = 1; // Track the next expected number

// Load click sound effect
const clickSound = new Audio('click.mp3');

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
    numberButton.addEventListener('click', () => handleNumberClick(numberButton, number));
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
        dropTargetContainer.appendChild(button);
        button.removeEventListener('click', handleNumberClick);
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
                // Create dinosaur element for celebration
                const dino = document.createElement('img');
                dino.src = 'https://freepngimg.com/thumb/dinosaur/33376-9-dinosaur-transparent-image.png';
                dino.alt = 'Celebrating Dinosaur';
                dino.className = 'dino-image';
                
                // Add dinosaur to the page
                document.body.appendChild(dino);
                
                // Position the dinosaur in the center
                setTimeout(() => {
                    dino.style.opacity = '1';
                    dino.style.transform = 'translate(-50%, -50%) scale(1) scaleX(-1)';
                    
                    // Create a mouth position relative to the dinosaur image
                    setTimeout(() => {
                        const dinoRect = dino.getBoundingClientRect();
                        const mouthX = (dinoRect.left + dinoRect.width * 0.25) / window.innerWidth;
                        const mouthY = (dinoRect.top + dinoRect.height * 0.4) / window.innerHeight;
                        
                        // Shoot confetti from dinosaur's mouth
                        confetti({
                            particleCount: 300,
                            spread: 50,
                            origin: { 
                                x: mouthX,
                                y: mouthY 
                            },
                            angle: 300, // Adjust angle based on flipped dino
                            startVelocity: 60,
                            colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff']
                        });
                    }, 100);
                    
                    // Remove dinosaur after celebration
                    setTimeout(() => {
                        dino.style.opacity = '0';
                        dino.style.transform = 'translate(-50%, -50%) scale(0) scaleX(-1)';
                        setTimeout(() => {
                            document.body.removeChild(dino);
                        }, 1000);
                    }, 4000);
                }, 100);
                
                // Play celebration sound
                const sound = new Audio('https://actions.google.com/sounds/v1/cartoon/cartoon_boing.ogg');
                sound.volume = 0.5;
                sound.play();
            }, 300);
        }
    } else {
        // Incorrect number clicked
        console.log(`Incorrect. Expected: ${expectedNumber}, Clicked: ${clickedNumber}`);
        const originalColor = button.style.backgroundColor;
        button.style.backgroundColor = '#ffcccb'; // Light red
        
        // Create and show the error message
        const messageEl = document.createElement('div');
        messageEl.className = 'error-message';
        messageEl.textContent = `Oops! You need to find number ${expectedNumber} first!`;
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
}
