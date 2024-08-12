document.addEventListener('DOMContentLoaded', function() {
    // Retrieve stored content from localStorage
    const storetitle = localStorage.getItem('title');
    const storesubtitle = localStorage.getItem('subtitle');
    const storedes = localStorage.getItem('description');

    // Get the HTML elements
    const titleElement = document.querySelector('.screen-title');
    const subtitleElement = document.querySelector('.screen-subtitle');
    const descriptionElement = document.querySelector('.description-text');

    titleElement.textContent = storetitle || 'Default Title';
    subtitleElement.textContent = storesubtitle || 'Default Subtitle';
    descriptionElement.textContent = storedes || 'Default Description';

    // Ensure these IDs match your HTML
    const nextInLine = document.getElementById('scr-nil');
    const interviewing = document.getElementById('scr-int');

    // Log to verify that elements are found
    if (!nextInLine) {
        console.error('Element with ID scr-nil not found');
    }
    if (!interviewing) {
        console.error('Element with ID scr-int not found');
    }

    // Initialize sound notification
    function playSound() {
        const audio = new Audio('ding-36029.mp3'); // Update the path to your sound file
        audio.play().catch(error => console.error('Audio play failed:', error));
    }

    // Update the screen from localStorage and play sound if the next in line changes
    function updateScreenFromStorage() {
        // Retrieve the current displayed values
        const currentNextInLine = nextInLine.textContent;

        // Retrieve stored values from localStorage
        const storedNextInLine = localStorage.getItem('nextInLine') || '00';
        const storedInterviewing = localStorage.getItem('interviewing') || '00';

        // Update the screen elements
        const storetitle = localStorage.getItem('title');
        const storesubtitle = localStorage.getItem('subtitle');
        const storedes = localStorage.getItem('description');

        titleElement.textContent = storetitle || 'Default Title';
        subtitleElement.textContent = storesubtitle || 'Default Subtitle';
        descriptionElement.textContent = storedes || 'Default Description';

        // Update timer display
        const timer = localStorage.getItem('timer') || '00:00:00';
        const isBreak = localStorage.getItem('break') === 'true';

        const timerDisplay = document.getElementById('timerDisplay');
        if (timerDisplay) {
            timerDisplay.textContent = isBreak ? 'Break' : timer;
        }

        const timeBreakContainer = document.querySelector('.time-break');
        if (timeBreakContainer) {
            if (isBreak) {
                timeBreakContainer.classList.add('break-background');
            } else {
                timeBreakContainer.classList.remove('break-background');
            }
        }

        // Update queue numbers
        if (nextInLine) {
            // Check if the "Next in Line" number has changed
            if (currentNextInLine !== storedNextInLine) {
                nextInLine.textContent = storedNextInLine;
                playSound(); // Play sound only if the "Next in Line" number has changed
            }
        } else {
            console.warn('Next In Line element not found');
        }

        if (interviewing) {
            interviewing.textContent = storedInterviewing;
        } else {
            console.warn('Interviewing element not found');
        }
    }

    // Initial call to update the screen when the page loads
    updateScreenFromStorage();

    // Listen for changes in localStorage to update the numbers dynamically
    window.addEventListener('storage', function(event) {
        if (event.storageArea === localStorage) {
            updateScreenFromStorage();
        }
    });
});


const socket = io();

// Update timer display
socket.on('timerUpdated', (data) => {
    timerDisplay.textContent = formatTime(data.timerValue);
});

socket.on('breakStatusUpdated', (data) => {
    if (data.breakStatus) {
        timerDisplay.textContent = 'Break';
    } else {
        updateTimerDisplay();
    }
});

// Update queue display
socket.on('queueUpdated', (data) => {
    updateQueueList(data.queue);
});

// Update title, subtitle, and description
socket.on('textUpdated', (data) => {
    document.getElementById('titleDisplay').textContent = data.title;
    document.getElementById('subtitleDisplay').textContent = data.subtitle;
    document.getElementById('descriptionDisplay').textContent = data.description;
});

function updateQueueList(queue) {
    const queueList = document.getElementById('queueList');
    queueList.innerHTML = '';
    queue.forEach(item => {
        const listItem = document.createElement('li');
        listItem.textContent = item;
        queueList.appendChild(listItem);
    });
}

function formatTime(sec) {
    const hrs = Math.floor(sec / 3600);
    const mins = Math.floor((sec % 3600) / 60);
    const secs = sec % 60;

    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}
