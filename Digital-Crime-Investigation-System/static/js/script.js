// Login Handling
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const user = document.getElementById('username').value;
        const pass = document.getElementById('password').value;
        const errorMsg = document.getElementById('loginError');

        if (user === 'admin' && pass === 'admin123') {
            localStorage.setItem('isLoggedIn', 'true');
            window.location.href = '/dashboard';
        } else {
            errorMsg.textContent = 'Invalid username or password';
        }
    });
}

// Navigation Handling
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.main-content section').forEach(sec => {
        sec.className = 'section-hidden';
    });
    
    // Show target section
    document.getElementById(sectionId).className = 'section-active';
    
    // Update active nav link
    document.querySelectorAll('.sidebar-nav a').forEach(link => {
        link.classList.remove('active');
    });
    event.target.classList.add('active');

    // Refresh data if going to all records or overview
    if(sectionId === 'all-records' || sectionId === 'overview') {
        loadAllRecords();
    }
}

function logout() {
    localStorage.removeItem('isLoggedIn');
    window.location.href = '/';
}

// Add Criminal
const addForm = document.getElementById('addForm');
if (addForm) {
    addForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const data = {
            id: document.getElementById('addId').value,
            name: document.getElementById('addName').value,
            age: document.getElementById('addAge').value,
            crimeType: document.getElementById('addCrime').value,
            status: document.getElementById('addStatus').value
        };

        try {
            const res = await fetch('/api/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await res.json();
            alert(result.message);
            addForm.reset();
            loadAllRecords(); // Refresh data
        } catch (err) {
            alert('Error adding record');
        }
    });
}

// Helper to render table row
function createTableRow(record) {
    const statusClass = record.status.startsWith('Under') ? 'status-Under' : `status-${record.status}`;
    return `
        <tr>
            <td>${record.id}</td>
            <td>${record.name}</td>
            <td>${record.age}</td>
            <td>${record.crimeType}</td>
            <td><span class="status-badge ${statusClass}">${record.status}</span></td>
            <td>
                <button onclick="deleteRecord('${record.id}')" class="btn-danger">Delete</button>
            </td>
        </tr>
    `;
}

// Load All Records
async function loadAllRecords() {
    try {
        const res = await fetch('/api/display');
        const records = await res.json();
        
        // Update table
        const tbody = document.getElementById('recordsTableBody');
        if (tbody) {
            tbody.innerHTML = records.map(createTableRow).join('');
        }
        
        // Update dashboard counters
        const totalElem = document.getElementById('totalRecordsCount');
        const openElem = document.getElementById('openCasesCount');
        
        if (totalElem && openElem) {
            totalElem.textContent = records.length;
            const openCases = records.filter(r => r.status === 'Open' || r.status === 'Under Investigation').length;
            openElem.textContent = openCases;
        }
    } catch (err) {
        console.error('Failed to load records', err);
    }
}

// Search Record
async function searchRecord() {
    const searchTerm = document.getElementById('searchInput').value;
    if (!searchTerm) return;

    try {
        const res = await fetch('/api/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ searchTerm })
        });
        const records = await res.json();
        
        const table = document.getElementById('searchTable');
        const tbody = document.getElementById('searchResultBody');
        const msg = document.getElementById('searchMessage');

        if (records.error) {
            table.style.display = 'none';
            msg.textContent = records.error;
            msg.style.color = 'var(--danger)';
        } else {
            table.style.display = 'table';
            tbody.innerHTML = records.map(createTableRow).join('');
            msg.textContent = '';
        }
    } catch (err) {
        alert('Error searching record');
    }
}

// Delete Record
async function deleteRecord(id) {
    if (!confirm(`Are you sure you want to delete criminal ID: ${id}?`)) return;

    try {
        const res = await fetch('/api/delete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        });
        const result = await res.json();
        alert(result.message);
        
        // Refresh tables
        loadAllRecords();
        // Clear search if it was from search
        const searchTable = document.getElementById('searchTable');
        if (searchTable && searchTable.style.display !== 'none') {
            searchRecord();
        }
    } catch (err) {
        alert('Error deleting record');
    }
}
