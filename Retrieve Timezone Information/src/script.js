/*
Purpose: Geolocation querying and timezone fetching.
Responsibility: Handles coordinates lookup, geocoding requests, API responses.
Dependencies: index.html elements.
Concepts Used: Geolocation API, Fetch, Promise structures.
Learning Outcomes: Fetching data from multi-step geocoding APIs.
*/

// STEP 1: Configure API Key credentials and base endpoint parameters
const apiKey = "3fd5d5629b43444fb8404567ef42117d"; // Replace with your actual Geoapify key
const timezoneForm = document.getElementById("timezone-form");
const addressInput = document.getElementById("address-input");
const localResult = document.getElementById("local-timezone-result");
const targetResult = document.getElementById("target-timezone-result");
const errorMessage = document.getElementById("error-message");

// STEP 2: Get user coordinates using Geolocation API on load
// Initialize on page load
getUserCoordinates();

function getUserCoordinates() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                fetchLocalTimezone(latitude, longitude);
            },
            (error) => {
                localResult.innerHTML = `<p class="status error">Geolocation denied or unavailable.</p>`;
            }
        );
    } else {
        localResult.innerHTML = `<p class="status error">Geolocation is not supported by this browser.</p>`;
    }
}

// STEP 3: Fetch timezone details from API using coordinates
function fetchTimezone(lat, lng) {
    const url = `${timezoneBaseUrl}?key=${apiKey}&format=json&by=position&lat=${lat}&lng=${lng}`;   
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.status === "OK") {
                updateUIWithTimezone(data);
            } else {
                console.error("Error fetching timezone:", data.message);
            }
        })
        .catch(error => console.error("Fetch error:", error));
    }


// STEP 4: Bind click event to address lookup action
timezoneForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const address = addressInput.value.trim();
    if (!address) return;

    errorMessage.textContent = "";
    targetResult.innerHTML = "<p>Fetching address details...</p>";

    const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(address)}&format=json&apiKey=${apiKey}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.results && data.results.length > 0) {
                renderTimezone(targetResult, data.results[0]);
            } else {
                errorMessage.textContent = "No results found for the provided address.";
                targetResult.innerHTML = "<p>Location not found.</p>";
            }
                })
        .catch(err => {
            console.error("Search fetch error:", err);
            errorMessage.textContent = "An error occurred while geocoding the address. Please check your API Key or connection.";
            targetResult.innerHTML = "<p>Retrieval failed.</p>";
        });
});

// STEP 5: Request coordinates from Geocoding API using input text
function fetchCoordinatesFromAddress(address) {
    const url = `${geocodingBaseUrl}?q=${encodeURIComponent(address)}&key=${apiKey}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.results && data.results.length > 0) {
                const { lat, lng } = data.results[0].geometry;
                fetchTimezone(lat, lng);
            } else {
                console.error("No results found for the provided address.");
            }
        })
        .catch(error => console.error("Fetch error:", error));
}

// STEP 6: Fetch target timezone using geocoded coordinates and update UI
function fetchLocalTimezone(lat, lon) {
    const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&format=json&apiKey=${apiKey}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.results && data.results.length > 0) {
                renderTimezone(localResult, data.results[0]);
            }
                })
        .catch(err => {
            console.error("Local fetch error:", err);
            localResult.innerHTML = `<p class="status error">Failed to retrieve timezone. Please verify your API Key or connection.</p>`;
        });
}

function renderTimezone(container, info) {
    const timezone = info.timezone;
    container.innerHTML = `
        <div class="timezone-details">
            <div class="timezone-field"><span>Name Of Time Zone:</span><strong>${timezone.name}</strong></div>
            <div class="timezone-field"><span>Latitude:</span><strong>${info.lat}</strong></div>
            <div class="timezone-field"><span>Longitude:</span><strong>${info.lon}</strong></div>
            <div class="timezone-field"><span>Offset STD:</span><strong>${timezone.offset_STD}</strong></div>
            <div class="timezone-field"><span>Offset STD Seconds:</span><strong>${timezone.offset_STD_seconds}</strong></div>
            <div class="timezone-field"><span>Offset DST:</span><strong>${timezone.offset_DST}</strong></div>
            <div class="timezone-field"><span>Offset DST Seconds:</span><strong>${timezone.offset_DST_seconds}</strong></div>
            <div class="timezone-field"><span>Country:</span><strong>${info.country}</strong></div>
            <div class="timezone-field"><span>Postcode:</span><strong>${info.postcode || 'N/A'}</strong></div>
            <div class="timezone-field"><span>City:</span><strong>${info.city || 'N/A'}</strong></div>
        </div>
    `;
}
