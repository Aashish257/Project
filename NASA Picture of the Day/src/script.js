/*
Purpose: Handle NASA API querying, form events, and history arrays.
Responsibility: Implements getCurrentImageOfTheDay, getImageOfTheDay, saveSearch, and addSearchToHistory.
Dependencies: index.html ID targets.
Concepts Used: Fetch, LocalStorage, Query parameters, Date formatting.
Learning Outcomes: Managing persistent history trackers.
*/

// STEP 1: Select elements using specific IDs (search-form, search-input, current-image-container, search-history)
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const currentImageContainer = document.getElementById('current-image-container');
const searchHistory = document.getElementById('search-history');
const apiKey = 'x6vGg6McmhAslP3BVhhwE3nhgxloeO0HL9WbxrCJ';


function renderMedia(data) {
    currentImageContainer.innerHTML = `
        <h2>${data.title}</h2>
        ${data.media_type === 'video' 
            ? `<iframe src="${data.url}" frameborder="0" allowfullscreen></iframe>`
            : `<img src="${data.url}" alt="${data.title}">`
        }
        <p>${data.explanation}</p>
    `;
}
// STEP 2: Implement getCurrentImageOfTheDay() (runs on load, fetches today's APOD)
// Run immediately on page load
getCurrentImageOfTheDay();

function getCurrentImageOfTheDay() {
    const currentDate = new Date().toISOString().split("T")[0];
    const url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${currentDate}`;
    
    fetch(url)
        .then(res => res.json())
        .then(data => {
            renderMedia(data);
            addSearchToHistory(); // Display existing searches on load
        })
        .catch(err => console.error("Error fetching today's image:", err));
}

// STEP 3: Implement getImageOfTheDay(date) (fetches target date APOD, updates UI)
function getImageOfTheDay(date) {
    const url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${date}`;
    
    fetch(url)
        .then(res => res.json())
        .then(data => {
            renderMedia(data);
            saveSearch(date);
            addSearchToHistory();
        })
        .catch(err => console.error("Error fetching historical image:", err));
}
// STEP 4: Implement saveSearch(date) (appends query to LocalStorage string list)
function saveSearch(date) {
    // 1. Get existing history array from LocalStorage
    let history = JSON.parse(localStorage.getItem('searchHistory')) || [];
    
    // 2. Add the date if it's not a duplicate
    if (!history.includes(date)) {
        history.push(date);
    }
    
    // 3. Save it back to LocalStorage
    localStorage.setItem('searchHistory', JSON.stringify(history));
}
// STEP 5: Implement addSearchToHistory() (displays list links from LocalStorage, registers click events)
function addSearchToHistory() {
    // 1. Clear the list to prevent duplicates
    searchHistory.innerHTML = '';
    
    // 2. Fetch the array from LocalStorage
    const history = JSON.parse(localStorage.getItem('searchHistory')) || [];
    
    // 3. Create clickable list elements for each date
    history.forEach(date => {
        const li = document.createElement('li');
        li.textContent = date;
        
        // Add click event to fetch that specific date again when clicked
        li.addEventListener('click', () => {
            getImageOfTheDay(date);
        });
        
        searchHistory.appendChild(li);
    });
}
// STEP 6: Add submit event listener to form to prevent default load and trigger lookup
searchForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Stop page reload
    const selectedDate = searchInput.value;
    if (selectedDate) {
        getImageOfTheDay(selectedDate);
    }
});