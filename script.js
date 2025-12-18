const output = document.getElementById('output');
const form = document.querySelector('form');
const submitBtn = document.querySelector('button[type="submit"]');
const errorParagraph = document.querySelector('.error');

const employees = [];

function handleAdd(e) {
    e.preventDefault();

    const name = (document.getElementById('name') || {}).value?.trim() || '';
    const profession = (document.getElementById('profession') || {}).value?.trim() || '';
    const age = (document.getElementById('age') || {}).value?.trim() || '';

    errorParagraph.textContent = '';

    if (!name || !profession || !age) {
        errorParagraph.textContent = 'All fields are required.';
        return;
    }

    const employee = { name, profession, age };
    employees.push(employee);
    updateOutput();

    // clear inputs
    const inputs = form.querySelectorAll('input');
    inputs.forEach(i => i.value = '');
}

if (submitBtn) {
    submitBtn.addEventListener('click', handleAdd);
} else if (form) {
    form.addEventListener('submit', handleAdd);
}

function updateOutput() {
    if (!output) return;

    if (employees.length === 0) {
        output.innerHTML = 'You have 0 Employees.';
        return;
    }

    let html = `<table class="employees-table"><caption>You have ${employees.length} Employee${employees.length > 1 ? 's' : ''}</caption><thead><tr><th>Name</th><th>Profession</th><th>Age</th></tr></thead><tbody>`;
    employees.forEach((emp, index) => {
        html += `<tr><td>${escapeHtml(emp.name)}</td><td>${escapeHtml(emp.profession)}</td><td>${escapeHtml(emp.age)}</td><td><button class="remove" data-index="${index}">Delete</button></td></tr>`;
    });
    html += '</tbody></table>';
    

    output.innerHTML = html;
}

function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
}


if (output) {
    output.addEventListener('click', function(e) {
        const btn = e.target.closest('.remove');
        if (!btn) return;
        const idx = Number(btn.dataset.index);
        if (!Number.isNaN(idx) && idx >= 0 && idx < employees.length) {
            employees.splice(idx, 1);
            updateOutput();
        }
    });
}