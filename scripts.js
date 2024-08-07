// scripts.js
document.addEventListener('DOMContentLoaded', function () {
    // Sahifa yuklanganda, guruhlar va o'quvchilarni localStorage'dan yuklaymiz
    let groups = JSON.parse(localStorage.getItem('groups')) || [];

    document.getElementById('viewGroups').addEventListener('click', viewGroups);
    document.getElementById('addGroup').addEventListener('click', addGroup);

    function saveData() {
        localStorage.setItem('groups', JSON.stringify(groups));
    }

    function viewGroups() {
        let mainContent = document.getElementById('mainContent');
        mainContent.innerHTML = '';

        if (groups.length === 0) {
            mainContent.innerHTML = '<p>Hozircha hech qanday guruh mavjud emas.</p>';
        } else {
            groups.forEach(function (group) {
                let groupDiv = document.createElement('div');
                groupDiv.classList.add('group');
                groupDiv.innerHTML = `<h3 data-group="${group.name}">${group.name}</h3>`;
                mainContent.appendChild(groupDiv);

                groupDiv.querySelector('h3').addEventListener('click', function () {
                    viewGroupDetails(group.name);
                });
            });
        }
    }

    function addGroup() {
        let mainContent = document.getElementById('mainContent');
        mainContent.innerHTML = `
            <h2>Yangi Guruh Qo'shish</h2>
            <form id="addGroupForm">
                <label for="groupName">Guruh Nomi:</label>
                <input type="text" id="groupName" name="groupName" required>
                <button type="submit">Qo'shish</button>
            </form>
        `;

        document.getElementById('addGroupForm').addEventListener('submit', function (event) {
            event.preventDefault();
            let groupName = document.getElementById('groupName').value;
            if (groups.some(g => g.name === groupName)) {
                alert('Bu guruh allaqachon mavjud!');
                return;
            }
            groups.push({ name: groupName, students: [] });
            saveData();
            viewGroups();
        });
    }

    function viewGroupDetails(groupName) {
        let mainContent = document.getElementById('mainContent');
        let group = groups.find(g => g.name === groupName);

        mainContent.innerHTML = `
            <h2>${group.name} Guruh Tafsilotlari</h2>
            <button id="addStudentBtn">O'quvchi Qo'shish</button>
            <table>
                <thead>
                    <tr class='tr'>
                        <th>Ismi</th>
                        <th>Davomati</th>
                        <th>To'lov</th>
                        <th>Ball</th>
                        <th>Harakatlar</th>
                    </tr>
                </thead>
                <tbody>
                    ${group.students.map(student => `
                        <tr>
                            <td>${student.name}</td>
                            <td>${student.attendance}</td>
                            <td>${student.payment} so'm</td>
                            <td>${student.score} ball</td>
                            <td class='center'><button class='btn' onclick="editStudent('${student.name}', '${group.name}')">Tahrirlash</button></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;

        document.getElementById('addStudentBtn').addEventListener('click', function () {
            addStudent(groupName);
        });
    }

    function addStudent(groupName) {
        let mainContent = document.getElementById('mainContent');
        mainContent.innerHTML = `
            <h2>Yangi O'quvchi Qo'shish</h2>
            <form id="addStudentForm">
                <label for="studentName">O'quvchi Nomi:</label>
                <input type="text" id="studentName" name="studentName" required>
                <label for="attendance">Davomati:</label>
                <input type="text" id="attendance" name="attendance" required>
                <label for="payment">To'lov:</label>
                <input type="number" id="payment" name="payment" required>
                <label for="score">Ball:</label>
                <input type="number" id="score" name="score" required>
                <button type="submit">Qo'shish</button>
            </form>
        `;

        document.getElementById('addStudentForm').addEventListener('submit', function (event) {
            event.preventDefault();
            let studentName = document.getElementById('studentName').value;
            let attendance = document.getElementById('attendance').value;
            let payment = document.getElementById('payment').value;
            let score = document.getElementById('score').value;

            let student = {
                name: studentName,
                attendance: attendance,
                payment: payment,
                score: score
            };

            let group = groups.find(g => g.name === groupName);
            if (group.students.some(s => s.name === studentName)) {
                alert('Bu o\'quvchi allaqachon mavjud!');
                return;
            }
            group.students.push(student);
            saveData();
            viewGroupDetails(groupName);
        });
    }

    window.editStudent = function (studentName, groupName) {
        let mainContent = document.getElementById('mainContent');
        let group = groups.find(g => g.name === groupName);
        let student = group.students.find(s => s.name === studentName);

        mainContent.innerHTML = `
            <h2>O'quvchi Tahrirlash</h2>
            <form id="editStudentForm">
                <label for="studentName">O'quvchi Nomi:</label>
                <input class='inp_name' type="text" id="studentName" name="studentName" value="${student.name}" disabled>
                <label for="attendance">Davomati:</label>
                <input class='inp_name' type="text" id="attendance" name="attendance" value="${student.attendance}" required>
                <label for="payment">To'lov:</label>
                <input class='inp_name' type="number" id="payment" name="payment" value="${student.payment}" required>
                <label for="score">Ball:</label>
                <input class='inp_name' type="number" id="score" name="score" value="${student.score}" required>
                <div class='btn-bar'>
                <button type="submit">Yangilash</button>
                <button type="button" id="removeStudentBtn">O'chirish</button>
                </div>
            </form>
        `;

        document.getElementById('editStudentForm').addEventListener('submit', function (event) {
            event.preventDefault();
            student.attendance = document.getElementById('attendance').value;
            student.payment = document.getElementById('payment').value;
            student.score = document.getElementById('score').value;

            saveData();
            viewGroupDetails(groupName);
        });

        document.getElementById('removeStudentBtn').addEventListener('click', function () {
            group.students = group.students.filter(s => s.name !== studentName);
            saveData();
            viewGroupDetails(groupName);
        });
    }

    document.getElementById('searchStudent').addEventListener('click', searchStudent);

    function searchStudent() {
        let mainContent = document.getElementById('mainContent');
        mainContent.innerHTML = `
            <h2>O'quvchi Qidirish</h2>
            <form id="searchStudentForm">
                <label for="searchName">O'quvchi Nomi:</label>
                <input type="text" id="searchName" name="searchName" required>
                <button type="submit">Qidirish</button>
            </form>
            <div id="searchResults"></div>
        `;

        document.getElementById('searchStudentForm').addEventListener('submit', function (event) {
            event.preventDefault();
            let searchName = document.getElementById('searchName').value.toLowerCase();
            let results = [];

            groups.forEach(group => {
                group.students.forEach(student => {
                    if (student.name.toLowerCase().includes(searchName)) {
                        results.push(student);
                    }
                });
            });

            let searchResults = document.getElementById('searchResults');
            searchResults.innerHTML = '';

            if (results.length === 0) {
                searchResults.innerHTML = '<p>Hech qanday o\'quvchi topilmadi.</p>';
            } else {
                results.forEach(function (student) {
                    let studentDiv = document.createElement('div');
                    studentDiv.classList.add('student');
                    studentDiv.innerHTML = `
                        <p>Nomi: ${student.name}</p>
                        <p>Davomati: ${student.attendance}</p>
                        <p>To'lov: ${student.payment}</p>
                        <p>Ball: ${student.score}</p>
                    `;
                    searchResults.appendChild(studentDiv);
                });
            }
        });
    }

    // Avvalgi funksiyalarni chaqirish
    viewGroups();
});
