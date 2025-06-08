const form = document.getElementById('studentForm');
const studentList = document.getElementById('studentList');

let students = JSON.parse(localStorage.getItem('students')) || [];
let editIndex = -1;

function saveToStorage() {
  localStorage.setItem('students', JSON.stringify(students));
}

function renderList() {
  studentList.innerHTML = '';

  if (students.length === 0) {
    studentList.innerHTML = `<p class="text-center text-gray-500">No student registered.</p>`;
    return;
  }

  students.forEach((student, index) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'bg-white p-3 rounded shadow space-y-2';

    const summary = document.createElement('div');
    summary.className = 'flex justify-between items-center';

    summary.innerHTML = `
      <div>
        <p><strong>Name:</strong> ${student.name}</p>
        <p><strong>Email:</strong> ${student.email}</p>
      </div>
      <div class="flex space-x-3 items-center shadow bg-blue-50">
        <button onclick="toggleDetails(${index})" id="toggle-${index}" title="View More">
          <svg xmlns="http://www.w3.org/2000/svg" class="icon text-blue-600 hover:scale-110 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
        <button onclick="editStudent(${index})" title="Edit">
          <svg xmlns="http://www.w3.org/2000/svg" class="icon text-yellow-600 hover:scale-110 transition" fill="none" viewBox="0 0 24 24" stroke="">
           <path d="M16.293 2.293a1 1 0 0 1 1.414 0l4 4a1 1 0 0 1 0 1.414l-13 13A1 1 0 0 1 8 21H4a1 1 0 0 1-1-1v-4a1 1 0 0 1 .293-.707l10-10 3-3zM14 7.414l-9 9V19h2.586l9-9L14 7.414zm4 1.172L19.586 7 17 4.414 15.414 6 18 8.586z" fill="black"/>
          </svg>
        </button>
        <button onclick="deleteStudent(${index})" title="Delete">
          <svg xmlns="http://www.w3.org/2000/svg" class="icon text-red-600 hover:scale-110 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    `;

    const details = document.createElement('div');
    details.className = 'text-sm text-gray-600 hidden';
    details.id = `details-${index}`;
    details.innerHTML = `
      <p><strong>Student ID:</strong> ${student.studentId}</p>
      <p><strong>Contact No:</strong> ${student.contact}</p>
    `;

    wrapper.appendChild(summary);
    wrapper.appendChild(details);
    studentList.appendChild(wrapper);
  });
}

function toggleDetails(index) {
  const detail = document.getElementById(`details-${index}`);
  const toggleBtn = document.getElementById(`toggle-${index}`);
  if (detail.classList.contains('hidden')) {
    detail.classList.remove('hidden');
  } else {
    detail.classList.add('hidden');
  }
}

function editStudent(index) {
  const student = students[index];
  document.getElementById('name').value = student.name;
  document.getElementById('studentId').value = student.studentId;
  document.getElementById('email').value = student.email;
  document.getElementById('contact').value = student.contact;
  editIndex = index;
}

function deleteStudent(index) {
  if (confirm("Are you sure you want to delete this record?")) {
    students.splice(index, 1);
    saveToStorage();
    renderList();
  }
}

function validateInputs(name, studentId, email, contact) {
  const nameRegex = /^[A-Za-z\s]+$/;
  const idRegex = /^\d+$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const contactRegex = /^\d{10}$/;

  if (!name || !studentId || !email || !contact) {
    alert("All fields are required.");
    return false;
  }
  if (!nameRegex.test(name)) {
    alert("Name should contain only letters.");
    return false;
  }
  if (!idRegex.test(studentId)) {
    alert("Student ID must be numeric.");
    return false;
  }
  if (!emailRegex.test(email)) {
    alert("Invalid email format.");
    return false;
  }
  if (!contactRegex.test(contact)) {
    alert("Contact number must be 10 digits.");
    return false;
  }
  return true;
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const studentId = document.getElementById('studentId').value.trim();
  const email = document.getElementById('email').value.trim();
  const contact = document.getElementById('contact').value.trim();

  if (!validateInputs(name, studentId, email, contact)) return;

  const newStudent = { name, studentId, email, contact };

  if (editIndex >= 0) {
    students[editIndex] = newStudent;
    editIndex = -1;
  } else {
    students.push(newStudent);
  }

  form.reset();
  saveToStorage();
  renderList();
});

window.addEventListener('DOMContentLoaded', renderList);
