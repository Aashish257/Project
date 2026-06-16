/*
Purpose: Handle API fetching, promise chaining, state mutation.
Responsibility: Implements getMenu, TakeOrder, orderPrep, payOrder, thankyouFnc, and binds event listeners.
Dependencies: index.html DOM targets
Concepts Used: Promises, Fetch API, setTimeout, DOM rendering.
Learning Outcomes: Structuring synchronous pipeline simulation.
*/

// API endpoint to fetch food items
const FetchData = 'https://raw.githubusercontent.com/saksham-accio/f2_contest_3/main/food.json';

// Global menu items array to store fetched items
let menuItems = [];

// Selected items for the current order
let currentOrderItems = [];

// Debounce flag to prevent duplicate concurrent orders
let isOrdering = false;

/**
 * Utility: Converts Unsplash page link to direct image asset download url
 */
function getDirectImageUrl(url) {
    if (!url) return '';
    // If it's a standard Unsplash photo page link, convert it to direct download redirect link
    if (url.includes('unsplash.com') && !url.includes('images.unsplash.com') && !url.includes('/download')) {
        const parts = url.trim().split('/');
        const lastPart = parts[parts.length - 1];
        const segments = lastPart.split('-');
        const id = segments[segments.length - 1];
        if (id) {
            return `https://unsplash.com/photos/${id}/download`;
        }
    }
    return url;
}

/**
 * Fetches food items from the static API and renders card components in the menu grid.
 */
function getMenu() {
    const menuGrid = document.querySelector('.menu-grid');
    if (!menuGrid) return;

    // Display loading message
    menuGrid.innerHTML = `<p class="loading-msg" style="color: var(--text-gray); font-weight: 500;">Loading food menu...</p>`;

    fetch(FetchData)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch food items from server.');
            }
            return response.json();
        })
        .then(data => {
            menuItems = data;
            menuGrid.innerHTML = ''; // Clear loading message

            // Render each food item in the grid catalog
            data.forEach(item => {
                const directImg = getDirectImageUrl(item.imgSrc);
                menuGrid.innerHTML += `
                    <div class="card" onclick="placeOrderSimulation()">
                        <img src="${directImg}" alt="${item.name}" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60';">
                        <div class="card-row">
                            <div class="card-info">
                                <span class="card-title">${item.name}</span>
                                <span class="card-price">$${item.price.toFixed(2)}/-</span>
                            </div>
                            <button type="button" class="card-btn">+</button>
                        </div>
                    </div>
                `;
            });
        })
        .catch(error => {
            console.error('Error fetching menu:', error);
            menuGrid.innerHTML = `<p class="error-msg" style="color: var(--accent-red); font-weight: 600;">Failed to load food menu. Please try again later.</p>`;
        });
}

/**
 * Simulates placing an order. Returns a promise that resolves in 2.5s with three randomly chosen items.
 */
function TakeOrder() {
    return new Promise((resolve, reject) => {
        // Update visual tracker UI
        updateOrderTracker(1, 'Taking your order: Selecting 3 delicious burgers...');

        setTimeout(() => {
            if (!menuItems || menuItems.length === 0) {
                reject(new Error('Menu items are not loaded. Cannot place order.'));
                return;
            }

            // Filter for items containing "burger" or "cheeseburger"
            let burgers = menuItems.filter(item => item.name.toLowerCase().includes('burger'));
            // Fallback to all menu items if no specific burgers are found in the list
            if (burgers.length === 0) {
                burgers = menuItems;
            }

            // Randomly select 3 items (allowing repeats if list is small, or unique if possible)
            const selectedBurgers = [];
            const tempBurgers = [...burgers];
            for (let i = 0; i < 3; i++) {
                if (tempBurgers.length === 0) break;
                const randomIndex = Math.floor(Math.random() * tempBurgers.length);
                // Splice to ensure unique items in a single order
                selectedBurgers.push(tempBurgers.splice(randomIndex, 1)[0]);
            }

            currentOrderItems = selectedBurgers;

            // Resolve with order object
            resolve({
                items: selectedBurgers,
                order_status: true,
                paid: false
            });
        }, 2500);
    });
}

/**
 * Simulates order preparation in the kitchen. Returns a promise that resolves in 1.5s.
 */
function orderPrep() {
    return new Promise(resolve => {
        // Display selected items in tracker and transition to Step 2
        const itemsName = currentOrderItems.map(item => item.name).join(', ');
        updateOrderTracker(2, `Chef preparing your order: [${itemsName}]...`);

        setTimeout(() => {
            resolve({
                order_status: true,
                paid: false
            });
        }, 1500);
    });
}

/**
 * Simulates the payment process. Returns a promise that resolves in 1.0s.
 */
function payOrder() {
    return new Promise(resolve => {
        updateOrderTracker(3, 'Processing payment: Finalizing transaction securely...');

        setTimeout(() => {
            resolve({
                order_status: true,
                paid: true
            });
        }, 1000);
    });
}

/**
 * Updates the tracker UI and displays a browser alert to thank the customer.
 */
function thankyouFnc() {
    updateOrderTracker(4, 'Success! Payment completed. Thank you for dining with us!');

    // Brief timeout to let UI update before alert blocks execution
    setTimeout(() => {
        alert('thankyou for eating with us today!');
    }, 100);
}

/**
 * UTILITY: Update visual order tracker UI
 */
function updateOrderTracker(stepNumber, statusMessage) {
    const orderTracker = document.getElementById('order-tracker');
    const progressLine = document.getElementById('progress-line');
    const orderSummary = document.getElementById('order-summary');

    if (!orderTracker || !progressLine || !orderSummary) return;

    // Show order tracker
    orderTracker.classList.remove('hidden');
    orderSummary.textContent = statusMessage;

    // Calculate progress line width: step 1 (0%), step 2 (33%), step 3 (66%), step 4 (100%)
    const percentage = ((stepNumber - 1) / 3) * 100;
    progressLine.style.width = `${percentage}%`;

    // Highlight visual nodes & labels
    for (let i = 1; i <= 4; i++) {
        const node = document.getElementById(`step-${i}`);
        const label = document.getElementById(`label-${i}`);

        if (node && label) {
            node.classList.remove('active', 'completed');
            label.classList.remove('active');

            if (i < stepNumber) {
                node.classList.add('completed');
            } else if (i === stepNumber) {
                node.classList.add('active');
                label.classList.add('active');
            }
        }
    }
}

/**
 * Controls the overall sequential execution of the ordering pipeline (TakeOrder -> orderPrep -> payOrder -> thankyouFnc).
 */
function placeOrderSimulation() {
    if (isOrdering) return;
    isOrdering = true;

    const placeOrderBtn = document.getElementById('place-order-btn');
    if (placeOrderBtn) {
        placeOrderBtn.disabled = true;
        placeOrderBtn.textContent = 'Ordering...';
    }

    // Hide hero section to transition to Menu/Dashboard screen layout (Screen 2)
    const heroSection = document.getElementById('hero-section');
    if (heroSection) {
        heroSection.classList.add('hidden');
    }

    // Execute sequential promise chain
    TakeOrder()
        .then(order => {
            console.log('TakeOrder resolved:', order);
            return orderPrep();
        })
        .then(prepStatus => {
            console.log('orderPrep resolved:', prepStatus);
            return payOrder();
        })
        .then(payStatus => {
            console.log('payOrder resolved:', payStatus);
            if (payStatus && payStatus.paid) {
                thankyouFnc();
            }
        })
        .catch(error => {
            console.error('An error occurred during order process:', error);
            const orderSummary = document.getElementById('order-summary');
            if (orderSummary) {
                orderSummary.innerHTML = `<span style="color: var(--accent-red); font-weight: bold;">Order Failed: ${error.message}</span>`;
            }
        })
        .finally(() => {
            isOrdering = false;
            if (placeOrderBtn) {
                placeOrderBtn.disabled = false;
                placeOrderBtn.textContent = 'Place Order';
            }
        });
}

// Bind load hooks and interaction handlers
document.addEventListener('DOMContentLoaded', () => {
    // Render the menu from API
    getMenu();

    // Bind Place Order button click
    const placeOrderBtn = document.getElementById('place-order-btn');
    if (placeOrderBtn) {
        placeOrderBtn.addEventListener('click', placeOrderSimulation);
    }

    // Bind Sidebar quick links to screen transitions
    const sidebarLinks = document.querySelectorAll('#sidebar ol li');
    const heroSection = document.getElementById('hero-section');

    sidebarLinks.forEach(link => {
        link.addEventListener('click', () => {
            const text = link.textContent.trim().toLowerCase();
            if (text.includes('home')) {
                // Show Screen 1: Hero visible
                if (heroSection) heroSection.classList.remove('hidden');
                // Hide tracker if visible
                const orderTracker = document.getElementById('order-tracker');
                if (orderTracker) orderTracker.classList.add('hidden');
            } else if (text.includes('order') || text.includes('menu')) {
                // Show Screen 2: Hero hidden
                if (heroSection) heroSection.classList.add('hidden');
            }
        });
    });
});
