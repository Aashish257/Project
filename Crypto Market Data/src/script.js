/*
Purpose: API requests processing and array filtering/sorting.
Responsibility: Implements fetch, search key events, sort execution, and row mapping.
Dependencies: index.html structures.
Concepts Used: async/await, Array.filter(), Array.sort(), innerHTML string mapping.
Learning Outcomes: Processing list representations in DOM interfaces.
*/

// CoinGecko API URL to retrieve market metadata
const API_URL = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false';

// State Cache
let coinsList = [];

// DOM Selectors
const searchInput = document.querySelector('.search-input');
const sortMktBtn = document.querySelector('.sort-mkt-btn');
const sortPercentBtn = document.querySelector('.sort-percent-btn');
const tableBody = document.querySelector('.crypto-table tbody');

/**
 * Fetches cryptocurrency data using .then() chains 
 */
function fetchCryptoDataWithThen() {
    fetch(API_URL)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            coinsList = data;
            renderCryptoData(coinsList);
        })
        .catch(error => {
            console.error('Error in fetchCryptoDataWithThen:', error);
            renderStatusMessage('Failed to load cryptocurrency data.');
        });
}

/**
 * Fetches cryptocurrency data using async/await
 */
async function fetchCryptoDataWithAsync() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        coinsList = data;
        renderCryptoData(coinsList);
    } catch (error) {
        console.error('Error in fetchCryptoDataWithAsync:', error);
        renderStatusMessage('Failed to load cryptocurrency data.');
    }
}

/**
 * Helper to display loading or status message inside the table rows
 */
function renderStatusMessage(message) {
    if (tableBody) {
        tableBody.innerHTML = `
            <tr class="status-row">
                <td colspan="6">${message}</td>
            </tr>
        `;
    }
}

/**
 * Renders cryptocurrency array to the table rows
 */
function renderCryptoData(data) {
    if (!tableBody) return;
    tableBody.innerHTML = '';

    if (data.length === 0) {
        renderStatusMessage('No matching cryptocurrencies found.');
        return;
    }

    data.forEach(crypto => {
        const name = crypto.name || 'N/A';
        const image = crypto.image || '';
        const symbol = (crypto.symbol || '').toUpperCase();
        const price = crypto.current_price !== undefined ? `$${crypto.current_price.toLocaleString()}` : 'N/A';
        const volume = crypto.total_volume !== undefined ? `$${crypto.total_volume.toLocaleString()}` : 'N/A';

        // Price change percentage coloring (green if positive, red if negative)
        const changeVal = crypto.price_change_percentage_24h;
        let changeClass = '';
        let changeText = 'N/A';
        if (changeVal !== undefined && changeVal !== null) {
            changeClass = changeVal >= 0 ? 'green-text' : 'red-text';
            changeText = `${changeVal.toFixed(2)}%`;
        }

        // Market cap formatted in "Mkt Cap : $..." format
        const marketCap = crypto.market_cap !== undefined ? `Mkt Cap : $${crypto.market_cap.toLocaleString()}` : 'N/A';

        tableBody.innerHTML += `
            <tr>
                <td class="col-name">
                    <div class="coin-cell">
                        <img src="${image}" alt="${name}" class="coin-image" onerror="this.onerror=null; this.src='https://via.placeholder.com/26';">
                        <span class="coin-name">${name}</span>
                    </div>
                </td>
                <td class="col-symbol">${symbol}</td>
                <td class="col-price">${price}</td>
                <td class="col-volume">${volume}</td>
                <td class="col-change ${changeClass}">${changeText}</td>
                <td class="col-mktcap">${marketCap}</td>
            </tr>
        `;
    });
}

/**
 * Filters cryptocurrency data by name or symbol
 */
function filterCryptoData(data, searchTerm) {
    if (!searchTerm) return data;
    const term = searchTerm.toLowerCase().trim();
    return data.filter(crypto =>
        (crypto.name || '').toLowerCase().includes(term) ||
        (crypto.symbol || '').toLowerCase().includes(term)
    );
}

// Bind search input to 'input' event for dynamic, instant real-time filtering
if (searchInput) {
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value;
        const filteredData = filterCryptoData(coinsList, searchTerm);
        renderCryptoData(filteredData);
    });
}

// Bind Sort by Market Cap Button Click
if (sortMktBtn) {
    sortMktBtn.addEventListener('click', () => {
        const sortedData = [...coinsList].sort((a, b) => {
            const valA = a.market_cap !== undefined ? a.market_cap : 0;
            const valB = b.market_cap !== undefined ? b.market_cap : 0;
            return valB - valA;
        });
        renderCryptoData(sortedData);
    });
}

// Bind Sort by Percentage Change Button Click
if (sortPercentBtn) {
    sortPercentBtn.addEventListener('click', () => {
        const sortedData = [...coinsList].sort((a, b) => {
            const valA = a.price_change_percentage_24h !== undefined ? a.price_change_percentage_24h : -Infinity;
            const valB = b.price_change_percentage_24h !== undefined ? b.price_change_percentage_24h : -Infinity;
            return valB - valA;
        });
        renderCryptoData(sortedData);
    });
}

// Initialize on page load using the async/await fetching logic
document.addEventListener('DOMContentLoaded', () => {
    renderStatusMessage('Loading market data...');
    fetchCryptoDataWithAsync();
});
