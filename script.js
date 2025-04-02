// Alphabet Game
const alphabetContainer = document.querySelector('.alphabet-container');
const dropTargetContainer = document.querySelector('.drop-target-container'); // Get target area
const correctOrder = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
let expectedLetterIndex = 0; // Reinstate tracking variable

// Create a shuffled version of the letters for display
let displayLetters = correctOrder.split('');
for (let i = displayLetters.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [displayLetters[i], displayLetters[j]] = [displayLetters[j], displayLetters[i]]; // Swap
}

// Load click sound effect (ensure click.mp3 is in your project folder)
const clickSound = new Audio('click.mp3');

displayLetters.forEach(letter => {
  const button = document.createElement('div');
  button.className = 'letter';
  button.textContent = letter;
  // button.draggable = true; // REMOVED draggable
  // button.id = `letter-${letter}`; // REMOVED id (not strictly needed now)

  // ADD NEW Click Listener Logic
  button.addEventListener('click', handleLetterClick);

  // Remove Drag and Drop listeners
  /*
  button.addEventListener('dragstart', handleDragStart);
  button.addEventListener('dragover', handleDragOver);
  button.addEventListener('drop', handleDrop);
  button.addEventListener('dragend', handleDragEnd);
  */

  alphabetContainer.appendChild(button);
});

// REMOVE container drag/drop listeners
// alphabetContainer.addEventListener('dragover', handleDragOverContainer);
// alphabetContainer.addEventListener('drop', (e) => { ... });

// REMOVE Drag and Drop Handlers
/*
let draggedItem = null;
function handleDragStart(e) { ... }
function handleDragOver(e) { ... }
function handleDrop(e) { ... }
function handleDragEnd(e) { ... }
function handleDragOverContainer(e) { ... }
*/

// --- New Letter Click Handler ---
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
        dropTargetContainer.appendChild(clickedButton);
        // Remove the click listener from the moved button
        clickedButton.removeEventListener('click', handleLetterClick);
        clickedButton.style.cursor = 'default'; // Optional: change cursor

        expectedLetterIndex++; // Move to the next expected letter

        // Check for win condition
        if (expectedLetterIndex === correctOrder.length) {
            // All letters placed correctly!
            setTimeout(() => { // Short delay before celebration
                // Create dinosaur element
                const dino = document.createElement('div');
                dino.className = 'celebration-dino';
                dino.innerHTML = `
                    <img src="https://i.imgur.com/SQVdIBq.png" alt="Celebrating dinosaur">
                    <div class="dino-mouth"></div>
                `;
                
                // Add dinosaur to the page
                document.body.appendChild(dino);
                
                // Position the dinosaur in the center
                setTimeout(() => {
                    dino.style.opacity = '1';
                    dino.style.transform = 'scale(1)';
                    
                    // Shoot confetti from dinosaur's mouth
                    const mouth = dino.querySelector('.dino-mouth');
                    const mouthRect = mouth.getBoundingClientRect();
                    
                    confetti({
                        particleCount: 300,
                        spread: 70,
                        origin: { 
                            x: mouthRect.left / window.innerWidth,
                            y: mouthRect.top / window.innerHeight 
                        },
                        colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff']
                    });
                    
                    // Remove dinosaur after celebration
                    setTimeout(() => {
                        dino.style.opacity = '0';
                        setTimeout(() => {
                            document.body.removeChild(dino);
                        }, 1000);
                    }, 4000);
                }, 100);
                
                // Play celebration sound
                const celebrationSound = new Audio('https://freesound.org/data/previews/411/411089_5121236-lq.mp3');
                celebrationSound.volume = 0.5;
                celebrationSound.play();
            }, 300);
        }
    } else {
        // Incorrect letter clicked - Visual feedback and message
        console.log(`Incorrect. Expected: ${expectedLetter}, Clicked: ${currentLetter}`);
        const originalColor = clickedButton.style.backgroundColor;
        clickedButton.style.backgroundColor = '#ffcccb'; // Light red
        
        // Create and show the message
        const messageEl = document.createElement('div');
        messageEl.className = 'error-message';
        messageEl.textContent = `Sorry, that's not correct. Try again!`;
        document.body.appendChild(messageEl);
        
        // Remove message after 2 seconds
        setTimeout(() => {
            document.body.removeChild(messageEl);
            clickedButton.style.backgroundColor = originalColor; // Revert color
        }, 2000);
    }
}

// Counting Game
const countingContainer = document.querySelector('.counting-container');
const countDisplay = document.querySelector('.count-display');

for (let i = 1; i <= 20; i++) {
  const numberButton = document.createElement('div');
  numberButton.className = 'number';
  numberButton.textContent = i;

  numberButton.addEventListener('click', () => {
    clickSound.currentTime = 0;
    clickSound.play();

    const speakNumber = new SpeechSynthesisUtterance(i.toString());
    speechSynthesis.speak(speakNumber);

    // Display stars for a fun counting visual
    countDisplay.innerHTML = '';
    for (let j = 0; j < i; j++) {
      const star = document.createElement('span');
      star.textContent = '★';
      star.style.margin = '5px';
      countDisplay.appendChild(star);
    }
    
    // Trigger a full-screen confetti burst when number 20 is clicked
    if (i === 20) {
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.5 }
      });
      // Add a short delay, then clear the stars
      setTimeout(() => {
        countDisplay.innerHTML = '';
      }, 1000); // Delay of 1 second (1000 milliseconds)
    }
  });

  countingContainer.appendChild(numberButton);
}

// --- REMOVE Alphabet Order Check Logic ---
/*
const checkOrderBtn = document.getElementById('check-order-btn');
if (checkOrderBtn) { ... }
*/

// Helper function to get example words for each letter
// Removing this function as it's no longer needed
/*
function getExampleWord(letter) {
    const examples = {
        'A': 'apple', 'B': 'ball', 'C': 'cat', 'D': 'dog', 'E': 'elephant',
        'F': 'fish', 'G': 'goat', 'H': 'hat', 'I': 'igloo', 'J': 'jump',
        'K': 'kite', 'L': 'lion', 'M': 'monkey', 'N': 'nest', 'O': 'orange',
        'P': 'pig', 'Q': 'queen', 'R': 'rabbit', 'S': 'snake', 'T': 'tiger',
        'U': 'umbrella', 'V': 'violin', 'W': 'whale', 'X': 'xylophone', 'Y': 'yo-yo',
        'Z': 'zebra'
    };
    return examples[letter] || '';
}
*/