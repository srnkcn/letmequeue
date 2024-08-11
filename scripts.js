let screenWindow;
let timerInterval;
let timer;
let seconds = 0;
let isRunning = false;

const timerDisplay = document.getElementById('timerDisplay');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const resetBtn = document.getElementById('resetBtn');
const breakSwitch = document.getElementById('breakSwitch');

function formatTime(sec) {
    const hrs = Math.floor(sec / 3600);
    const mins = Math.floor((sec % 3600) / 60);
    const secs = sec % 60;

    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function updateTimerDisplay() {
    const formattedTime = formatTime(seconds);
    timerDisplay.textContent = formattedTime;

    // Store the timer value in localStorage
    localStorage.setItem('timer', formattedTime);
}

function startTimer() {
    if (!isRunning) {
        isRunning = true;
        timerInterval = setInterval(() => {
            seconds++;
            updateTimerDisplay();
        }, 1000);
    }
}

function stopTimer() {
    clearInterval(timerInterval);
    isRunning = false;
}

function resetTimer() {
    clearInterval(timerInterval);
    seconds = 0;
    isRunning = false;
    updateTimerDisplay();
}

// Update localStorage when break switch is toggled
breakSwitch.addEventListener('change', function() {
    const isBreak = this.checked;
    localStorage.setItem('break', isBreak);
    
    // Update the screen immediately
    if (isBreak) {
        timerDisplay.textContent = 'Break';
    } else {
        updateTimerDisplay();
    }
});

startBtn.addEventListener('click', startTimer);
stopBtn.addEventListener('click', stopTimer);
resetBtn.addEventListener('click', resetTimer);

// Initialize timer display
updateTimerDisplay();

// Add event listener for the "Add" button click
document.getElementById('addQueueBtn').addEventListener('click', function() {
    processQueueInput();
});

// Add event listener for "Enter" key press in the input field
document.getElementById('queueInput').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        processQueueInput();
    }
});

// Add event listener for the "Add" button click
document.getElementById('addQueueBtn').addEventListener('click', function() {
    processQueueInput();
});

// Add event listener for "Enter" key press in the input field
document.getElementById('queueInput').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        processQueueInput();
    }
});

// Function to process the input and add a queue item
function processQueueInput() {
    const queueInput = document.getElementById('queueInput');
    const queueValue = queueInput.value.trim();

    if (queueValue !== '') {
        addQueueItem(queueValue);
        queueInput.value = ''; // Clear the input field
    }
}

// Function to add a queue item to the list
function addQueueItem(queueValue) {
    const queueList = document.getElementById('queueList');
    const listItem = document.createElement('li');
    
    listItem.innerHTML = `
        <span>${queueValue}</span>
        <div class="queue-actions">
            <button class="edit-btn">
                <i class="material-icons">edit</i>
            </button>
            <button class="delete-btn">
                <i class="material-icons">delete</i>
            </button>
        </div>
    `;
    
    queueList.appendChild(listItem);

    // Update screen window queue
    updateScreenQueue();

    // Add event listeners for edit and delete buttons
    const editBtn = listItem.querySelector('.edit-btn');
    const deleteBtn = listItem.querySelector('.delete-btn');

    editBtn.addEventListener('click', function() {
        editQueueItem(listItem);
    });

    deleteBtn.addEventListener('click', function() {
        deleteQueueItem(listItem);
    });
}

// Function to edit a queue item
function editQueueItem(listItem) {
    const queueValue = prompt('Edit Queue Number:', listItem.querySelector('span').textContent);
    if (queueValue !== null && queueValue.trim() !== '') {
        listItem.querySelector('span').textContent = queueValue.trim();
        updateScreenQueue(); // Update screen after editing
    }
}

// Function to delete a queue item
function deleteQueueItem(listItem) {
    listItem.remove();
    updateScreenQueue(); // Update screen after deleting
}

// Function to update the screen queue list
function updateScreenQueue() {
    if (screenWindow && !screenWindow.closed) {
        const screenQueueList = screenWindow.document.getElementById('queueList');
        screenQueueList.innerHTML = ''; // Clear the current queue on the screen

        const queueItems = document.querySelectorAll('#queueList li');
        queueItems.forEach(item => {
            const clonedItem = item.cloneNode(true);
            screenQueueList.appendChild(clonedItem);
        });
    }
}


function playSound() {
    const audio = new Audio('ding-36029.mp3');
    console.log('Sound should play now');// Update the path to your sound file
    audio.play();
}

function notifyScreen() {
    window.postMessage('playSound', '*');
}

// Synchronize queue numbers on screen page
document.addEventListener('DOMContentLoaded', function() {
    const nextInLine = document.querySelector('.next-in-line-queue-num p');
    const interviewing = document.querySelector('.interviewing-num p');
    const editNextInLineButton = document.querySelector('.next-in-line-queue-box .icon-button');
    const editInterviewingButton = document.querySelector('.interviewing-queue-box .icon-button');
// Initialize the queue list and event listeners
    const queueList = document.getElementById('queueList');
    
    // Add event listeners for existing and future queue items
    queueList.addEventListener('click', function(event) {
        const clickedItem = event.target.closest('li');
        if (clickedItem) {
            const queueNumber = clickedItem.querySelector('span').textContent;
            updateQueueNumbers(clickedItem, queueNumber);
        }
    });
    function makeEditable(element, key) {
        // Create input element
        const input = document.createElement('input');
        input.type = 'text';
        input.value = element.textContent.trim();
        input.style.width = '100px'; // Adjust width as needed
        input.className = 'edit-input';

        // Replace element content with input
        element.innerHTML = '';
        element.appendChild(input);
        input.focus();
        input.select();

        // Handle blur event
        input.addEventListener('blur', function() {
            const value = input.value.trim() || '00';
            element.textContent = value;

            // Save to localStorage
            localStorage.setItem(key, value);

            // Log to console
            console.log(`Updated ${key} to ${value}`);
        });

        // Handle Enter key press
        input.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                input.blur(); // Trigger blur event to save
            }
        });
    }

     // Function to handle updating queue numbers and removing the clicked item
     function updateQueueNumbers(clickedItem, queueNumber) {
        const nextInLine = document.querySelector('.next-in-line-queue-num p');
        const interviewing = document.querySelector('.interviewing-num p');
        
        // Get the current value of next in line
        const currentNextInLine = nextInLine.textContent;

        // Update next in line with the clicked queue number
        nextInLine.textContent = queueNumber;

        // Move the previous next in line value to interviewing
        interviewing.textContent = currentNextInLine;

        // Save the updated values to localStorage
        localStorage.setItem('nextInLine', nextInLine.textContent);
        playSound();
        localStorage.setItem('interviewing', interviewing.textContent);

        // Log to console

        // Remove the clicked item from the queue list
        clickedItem.remove();
    }

    // Add event listeners for edit buttons
    if (editNextInLineButton) {
        editNextInLineButton.addEventListener('click', function() {
            makeEditable(nextInLine, 'nextInLine');
        });
    } else {
        console.error('Edit button for Next in Line not found.');
    }

    if (editInterviewingButton) {
        editInterviewingButton.addEventListener('click', function() {
            makeEditable(interviewing, 'interviewing');
        });
    } else {
        console.error('Edit button for Interviewing not found.');
    }

    // Initialize values from localStorage
    nextInLine.textContent = localStorage.getItem('nextInLine') || '00';
    interviewing.textContent = localStorage.getItem('interviewing') || '00';

    // Setup event listener for each queue item
    queueItems.forEach(item => {
        item.addEventListener('click', function() {
            const queueNumber = this.getAttribute('data-queue-number');
            updateQueueNumbers(queueNumber);
        });
    });
    // Notify other windows
    notifyScreen();
});



// admins.js

document.getElementById('launchBtn').addEventListener('click', function() {
    // Get input values
    const titleInput = document.getElementById('titleInput').value;
    const subtitleInput = document.getElementById('subtitleInput').value;
    const descriptionInput = document.getElementById('descriptionInput').value;

    // Store values in localStorage
    localStorage.setItem('title', titleInput);
    localStorage.setItem('subtitle', subtitleInput);
    localStorage.setItem('description', descriptionInput);

    // Open new window with the screen page
    window.open('screen.html', '_blank');
});

// Get references to the elements
const titleInput = document.getElementById('titleInput');
const subtitleInput = document.getElementById('subtitleInput');
const descriptionInput = document.getElementById('descriptionInput');
const editButton = document.querySelector('.input-edit-button');

// Add event listener to the Edit button
editButton.addEventListener('click', function() {
    // Store the data in localStorage
    localStorage.setItem('title', titleInput.value);
    localStorage.setItem('subtitle', subtitleInput.value);
    localStorage.setItem('description', descriptionInput.value);

    // Optionally, log to confirm
    /*console.log('Data saved to storage:', {
        title: titleInput.value,
        subtitle: subtitleInput.value,
        description: descriptionInput.value
    }) */ ;
});


function updateQueueNumbers(queueNumber) {
    const nextInLineElement = document.getElementById('nextInLine');
    const interviewingElement = document.getElementById('interviewing');

    // Save current 'next in line' to 'interviewing'
    const currentNextInLine = nextInLineElement.textContent;
    interviewingElement.textContent = currentNextInLine;

    // Set new 'next in line'
    nextInLineElement.textContent = queueNumber;
}

