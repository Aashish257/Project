
const students = [];

async function loadStudentData() {
  try {
    const response = await fetch('https://gist.githubusercontent.com/harsh3195/b441881e0020817b84e34d27ba448418/raw/c4fde6f42310987a54ae1bc3d9b8bfbafac15617/demo-json-data.json');
    const data = await response.json();
    students.push(...data); 
    currentData = [...students];
    renderTable(students);
  } catch (error) {
    console.error('Error loading student data:', error);
  } 
}

loadStudentData();

let currentData = [];
let searchTerm = '';
let sortType = '';

//  Render table with student data
function renderTable(dataToRender) {
  let tableBody = document.getElementById('tableBody');
  tableBody.innerHTML = '';
  
  if (dataToRender.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 20px;">No students found</td></tr>';
    return;
  }
  
  dataToRender.forEach(student => {
    let row = document.createElement('tr');
    
    let idCell = document.createElement('td');
    idCell.textContent = student.id;
    row.appendChild(idCell);
    
    let nameCell = document.createElement('td');
    nameCell.innerHTML = `<img src="${student.img_src}" alt="${student.first_name} ${student.last_name}" style="width: 30px; height: 30px; border-radius: 50%; margin-right: 10px;"> ${student.first_name} ${student.last_name}`;
    row.appendChild(nameCell);
    
    let genderCell = document.createElement('td');
    genderCell.textContent = student.gender;
    row.appendChild(genderCell);
    
    let classCell = document.createElement('td');
    classCell.textContent = student.class;
    row.appendChild(classCell);
    
    let marksCell = document.createElement('td');
    marksCell.textContent = student.marks;
    row.appendChild(marksCell);
    
    let passingCell = document.createElement('td');
    passingCell.textContent = student.passing ? "Passing" : "Failed";
    row.appendChild(passingCell);
    
    let emailCell = document.createElement('td');
    emailCell.textContent = student.email;
    row.appendChild(emailCell);
    
    tableBody.appendChild(row);
  });
}

// Search functionality
function handleSearch() {
  let searchInput = document.getElementById('search').value.trim().toLowerCase();
  
  if (searchInput === '') {
    currentData = [...students];
  } else {
    currentData = students.filter(student => 
      student.first_name.toLowerCase().includes(searchInput) ||
      student.last_name.toLowerCase().includes(searchInput) ||
      student.email.toLowerCase().includes(searchInput)
    );
  }
  
  renderTable(currentData);
}

// Add event listeners for search
document.getElementById('search').addEventListener('input', handleSearch);

// Search button click
const searchBtn = document.querySelector('.search button');
searchBtn.addEventListener('click', handleSearch);

// Sort A->Z
function sortAZ() {
  currentData.sort((a, b) => {
    let nameA = a.first_name + ' ' + a.last_name;
    let nameB = b.first_name + ' ' + b.last_name;
    return nameA.localeCompare(nameB);
  });
  sortType = 'A-Z';
  renderTable(currentData);
  updateButtonState(0);
}

// Sort Z->A
function sortZA() {
  currentData.sort((a, b) => {
    let nameA = a.first_name + ' ' + a.last_name;
    let nameB = b.first_name + ' ' + b.last_name;
    return nameB.localeCompare(nameA);
  });
  sortType = 'Z-A';
  renderTable(currentData);
  updateButtonState(1);
}

// Sort by Marks
function sortByMarks() {
  currentData.sort((a, b) => a.marks - b.marks);
  sortType = 'marks';
  renderTable(currentData);
  updateButtonState(2);
}

// Sort by Passing
function sortByPassing() {
  currentData = students.filter(student => student.passing === true);
  currentData.sort((a, b) => {
    let nameA = a.first_name + ' ' + a.last_name;
    let nameB = b.first_name + ' ' + b.last_name;
    return nameA.localeCompare(nameB);
  });
  sortType = 'passing';
  renderTable(currentData);
  updateButtonState(3);
}

// Sort by Class
function sortByClass() {
  currentData.sort((a, b) => a.class - b.class);
  sortType = 'class';
  renderTable(currentData);
  updateButtonState(4);
}

// Sort by Gender - show males and females separately
function sortByGender() {
  const tableSection = document.querySelector('section');
  const existingTables = document.querySelectorAll('.gender-table-container');
  existingTables.forEach(el => el.remove());
  
  const maleStudents = students.filter(s => s.gender === 'Male');
  const femaleStudents = students.filter(s => s.gender === 'Female');
  
  // Creates male table
  const maleContainer = document.createElement('div');
  maleContainer.className = 'gender-table-container';
  maleContainer.innerHTML = '<h3 style="margin-top: 30px;">Male Students</h3>';
  
  const maleTable = document.createElement('table');
  maleTable.innerHTML = `
    <thead>
      <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Gender</th>
        <th>Class</th>
        <th>Marks</th>
        <th>Passing</th>
        <th>Email</th>
      </tr>
    </thead>
    <tbody id="maleTableBody"></tbody>
  `;
  maleContainer.appendChild(maleTable);
  tableSection.appendChild(maleContainer);
  
  // Populate male table
  const maleTableBody = document.getElementById('maleTableBody');
  maleStudents.forEach(student => {
    let row = createTableRow(student);
    maleTableBody.appendChild(row);
  });
  
  // Creates female table
  const femaleContainer = document.createElement('div');
  femaleContainer.className = 'gender-table-container';
  femaleContainer.innerHTML = '<h3 style="margin-top: 30px;">Female Students</h3>';
  
  const femaleTable = document.createElement('table');
  femaleTable.innerHTML = `
    <thead>
      <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Gender</th>
        <th>Class</th>
        <th>Marks</th>
        <th>Passing</th>
        <th>Email</th>
      </tr>
    </thead>
    <tbody id="femaleTableBody"></tbody>
  `;
  femaleContainer.appendChild(femaleTable);
  tableSection.appendChild(femaleContainer);
  
  // Populate female table
  const femaleTableBody = document.getElementById('femaleTableBody');
  femaleStudents.forEach(student => {
    let row = createTableRow(student);
    femaleTableBody.appendChild(row);
  });
  
  // Hide original table
  document.getElementById('studentTable').style.display = 'none';
  
  sortType = 'gender';
  updateButtonState(5);
}

// Helper function to create table row
function createTableRow(student) {
  let row = document.createElement('tr');
  
  let idCell = document.createElement('td');
  idCell.textContent = student.id;
  row.appendChild(idCell);
  
  let nameCell = document.createElement('td');
  nameCell.innerHTML = `<img src="${student.img_src}" alt="${student.first_name} ${student.last_name}" style="width: 30px; height: 30px; border-radius: 50%; margin-right: 10px;"> ${student.first_name} ${student.last_name}`;
  row.appendChild(nameCell);
  
  let genderCell = document.createElement('td');
  genderCell.textContent = student.gender;
  row.appendChild(genderCell);
  
  let classCell = document.createElement('td');
  classCell.textContent = student.class;
  row.appendChild(classCell);
  
  let marksCell = document.createElement('td');
  marksCell.textContent = student.marks;
  row.appendChild(marksCell);
  
  let passingCell = document.createElement('td');
  passingCell.textContent = student.passing ? "Passing" : "Failed";
  row.appendChild(passingCell);
  
  let emailCell = document.createElement('td');
  emailCell.textContent = student.email;
  row.appendChild(emailCell);
  
  return row;
}

// Update button active state
function updateButtonState(buttonIndex) {
  const buttons = document.querySelectorAll('.filter button');
  buttons.forEach(btn => btn.classList.remove('active'));
  buttons[buttonIndex].classList.add('active');
}

// Add event listeners to sort buttons
const filterButtons = document.querySelectorAll('.filter button');
filterButtons[0].addEventListener('click', sortAZ);
filterButtons[1].addEventListener('click', sortZA);
filterButtons[2].addEventListener('click', sortByMarks);
filterButtons[3].addEventListener('click', sortByPassing);
filterButtons[4].addEventListener('click', sortByClass);
filterButtons[5].addEventListener('click', sortByGender);

// Reset to show all students
function resetTable() {
  currentData = [...students];
  sortType = '';
  document.getElementById('studentTable').style.display = 'table';
  const genderContainers = document.querySelectorAll('.gender-table-container');
  genderContainers.forEach(el => el.remove());
  const buttons = document.querySelectorAll('.filter button');
  buttons.forEach(btn => btn.classList.remove('active'));
  renderTable(currentData);
  document.getElementById('search').value = '';
}
