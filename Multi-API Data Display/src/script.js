/*
Purpose: Asynchronous sequential API orchestration.
Responsibility: Houses API promise wrappers, chain controllers, and table card injectors.
Dependencies: index.html DOM targets.
Concepts Used: Promises, Fetch API, setTimeout, chaining, arrays rendering.
Learning Outcomes: Creating sequential loading UI pipelines.
*/

// Reference action trigger button and target content containers
const loadDataBtn = document.getElementById('load-data-btn');
const postsContainer = document.getElementById('posts-container');
const productsContainer = document.getElementById('products-container');
const todosContainer = document.getElementById('todos-container');

/**
 * PromiseAPI1: Fetches posts after a 1000ms delay.
 * Resolves true if successful.
 */
function PromiseAPI1() {
    return new Promise((resolve) => {
        setTimeout(() => {
            fetch('https://dummyjson.com/posts')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Posts fetch failed');
                    }
                    return response.json();
                })
                .then(data => {
                    // Extract posts array from API object
                    renderPosts(data.posts || []);
                    resolve(true);
                })
                .catch(error => {
                    console.error('Error fetching posts:', error);
                    resolve(false); // Resolve false so the chain knows it failed
                });
        }, 1000);
    });
}

/**
 * PromiseAPI2: Fetches products after a 2000ms delay.
 * Resolves true if successful.
 */
function PromiseAPI2() {
    return new Promise((resolve) => {
        setTimeout(() => {
            fetch('https://dummyjson.com/products')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Products fetch failed');
                    }
                    return response.json();
                })
                .then(data => {
                    // Extract products array from API object
                    renderProducts(data.products || []);
                    resolve(true);
                })
                .catch(error => {
                    console.error('Error fetching products:', error);
                    resolve(false);
                });
        }, 2000);
    });
}

/**
 * PromiseAPI3: Fetches todos after a 3000ms delay.
 * Resolves true if successful.
 */
function PromiseAPI3() {
    return new Promise((resolve) => {
        setTimeout(() => {
            fetch('https://dummyjson.com/todos')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Todos fetch failed');
                    }
                    return response.json();
                })
                .then(data => {
                    // Extract todos array from API object
                    renderTodos(data.todos || []);
                    resolve(true);
                })
                .catch(error => {
                    console.error('Error fetching todos:', error);
                    resolve(false);
                });
        }, 3000);
    });
}

// Implement sequential click trigger check using if conditions in promise chain
if (loadDataBtn) {
    loadDataBtn.addEventListener('click', () => {
        // Clear containers before starting
        postsContainer.innerHTML = '<p class="loading">Loading posts (1000ms delay)...</p>';
        productsContainer.innerHTML = '';
        todosContainer.innerHTML = '';

        PromiseAPI1()
            .then((res1) => {
                // Check if the previous promise resolved successfully
                if (res1) {
                    productsContainer.innerHTML = '<p class="loading">Loading products (2000ms delay)...</p>';
                    return PromiseAPI2();
                } else {
                    postsContainer.innerHTML = '<p class="error">Failed to load posts. Execution stopped.</p>';
                    throw new Error('PromiseAPI1 failed');
                }
            })
            .then((res2) => {
                // Check if the previous promise resolved successfully
                if (res2) {
                    todosContainer.innerHTML = '<p class="loading">Loading todos (3000ms delay)...</p>';
                    return PromiseAPI3();
                } else if (res2 === false) {
                    productsContainer.innerHTML = '<p class="error">Failed to load products. Execution stopped.</p>';
                    throw new Error('PromiseAPI2 failed');
                }
            })
            .then((res3) => {
                if (res3) {
                    console.log('All data loaded successfully sequentially.');
                } else if (res3 === false) {
                    todosContainer.innerHTML = '<p class="error">Failed to load todos.</p>';
                }
            })
            .catch(error => {
                console.warn('Promise sequence aborted:', error.message);
            });
    });
}

// Rendering functions
function renderPosts(posts) {
    postsContainer.innerHTML = posts.map(post => `
        <div class="post-card">
            <h3>${post.title}</h3>
            <p>${post.body}</p>
        </div>
    `).join('');
}

function renderProducts(products) {
    productsContainer.innerHTML = products.map(product => `
        <div class="product-card">
            <h3>${product.title}</h3>
            <p>${product.description}</p>
            <p>Price: $${product.price}</p>
            <button type="button">Add to Cart</button>
        </div>
    `).join('');
}

function renderTodos(todos) {
    todosContainer.innerHTML = todos.map(todo => `
        <div class="todo-card">
            <h3>Todo #${todo.id}</h3>
            <p>${todo.todo}</p>
            <p>Completed: <strong>${todo.completed ? 'Yes' : 'No'}</strong></p>
        </div>
    `).join('');
}
