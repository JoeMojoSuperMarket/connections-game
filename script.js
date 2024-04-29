const groups = {
    'Where All My Ideas Go': ['Graveyard', 'Bench', 'Appendix', 'Skip'],
    'Things Creative Directors Hate': ['Reading', 'Sobriety', 'You', 'Listening'],
    'Words in Every Brief': ['Gen Z', '$0', 'Culture', 'Buzz-worthy'],
    'Stuff Your Account Person Says': ['Caveat', 'No', 'Testing', 'Next Steps']
};

let tries = 5;
let selected = [];
let correctGroups = 0;
let isAnimating = false;

function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

function animateAndRemoveWords(groupName) {
    isAnimating = true;
    let groupWords = selected.join(', ');
    let displayText = `${groupName}: ${groupWords}`;
    let rect = document.getElementById(selected[0]).getBoundingClientRect();
    const groupBox = document.createElement('div');
    groupBox.textContent = displayText;
    groupBox.className = 'group-box';
    groupBox.style.top = rect.top + 'px';
    document.body.prepend(groupBox);
    selected.forEach(word => {
        const element = document.getElementById(word);
        element.classList.add('floating');
    });
    setTimeout(() => {
        selected.forEach(word => {
            const element = document.getElementById(word);
            element.style.display = 'none';
        });
        groupBox.style.top = '10px';
        selected = [];
        isAnimating = false;
    }, 1000);
}

function checkSelection() {
    if (selected.length === 4) {
        for (const groupName in groups) {
            if (groups[groupName].every(element => selected.includes(element))) {
                correctGroups++;
                animateAndRemoveWords(groupName);
                if (correctGroups === Object.keys(groups).length) {
                    setTimeout(() => alert('Congratulations! You found all groups!'), 1100);
                }
                return true;
            }
        }
    }
    return false;
}

function handleClick(word) {
    if (isAnimating) return;
    const index = selected.indexOf(word);
    const element = document.getElementById(word);
    if (index > -1) {
        selected.splice(index, 1);
        element.classList.remove('highlighted');
    } else {
        if (selected.length < 4) {
            selected.push(word);
            element.classList.add('highlighted');
        }
    }
    if (selected.length === 4) {
        const correct = checkSelection();
        if (!correct) {
            tries--;
            document.getElementById('tries').textContent = tries;
            selected.forEach(selectedWord => {
                const selectedElement = document.getElementById(selectedWord);
                selectedElement.classList.remove('highlighted');
                selectedElement.classList.add('incorrect');
                setTimeout(() => selectedElement.classList.remove('incorrect'), 500);
            });
            selected = [];
            if (tries === 0) {
                offerOptions();
            }
        }
    }
}

function offerOptions() {
    const userChoice = confirm("Would you like to try again? Click 'Cancel' to see the answers.");
    if (userChoice) {
        resetGame();
    } else {
        revealAnswers();
    }
}

function resetGame() {
    tries = 5;
    selected = [];
    correctGroups = 0;
    document.getElementById('tries').textContent = '5';
    createBoard(); // Redraws the board for another attempt
}

function revealAnswers() {
    const board = document.getElementById('game-board');
    board.innerHTML = ''; // Clear the board for answers
    Object.keys(groups).forEach(groupName => {
        const group = document.createElement('div');
        group.className = 'answer-group';
        const title = document.createElement('div');
        title.className = 'group-name';
        title.textContent = groupName;
        group.appendChild(title);
        const items = document.createElement('div');
        items.className = 'group-items';
        items.textContent = groups[groupName].join(', ');
        group.appendChild(items);
        board.appendChild(group);
    });
}

function createBoard() {
    const board = document.getElementById('game-board');
    const allWords = shuffle(Object.values(groups).flat());
    board.innerHTML = '';
    allWords.forEach(word => {
        const item = document.createElement('div');
        item.textContent = word;
        item.id = word;
        item.className = 'grid-item';
        item.onclick = function() { handleClick(word); };
        board.appendChild(item);
    });
}

createBoard();

function offerOptions() {
    const modal = document.getElementById('confirmModal');
    const yesBtn = document.getElementById('yesBtn');
    const noBtn = document.getElementById('noBtn');

    modal.style.display = "block";

    yesBtn.onclick = function() {
        modal.style.display = "none";
        resetGame();
    }

    noBtn.onclick = function() {
        modal.style.display = "none";
        revealAnswers();
    }
}

// Add this to handle clicking outside of the modal to close it
window.onclick = function(event) {
    const modal = document.getElementById('confirmModal');
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
