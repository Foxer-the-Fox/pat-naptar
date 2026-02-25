const loginScreen = document.getElementById('login-screen');
const calendarScreen = document.getElementById('calendar-screen');
const usernameInput = document.getElementById('username');
const usercolorInput = document.getElementById('usercolor');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const welcomeMessage = document.getElementById('welcome-message');
const calendarDiv = document.getElementById('calendar');

let user = null;
const API_BASE = "https://YOUR_NETLIFY_FUNCTION_URL"; // cseréld le a saját URL-re

function generateCalendar() {
    calendarDiv.innerHTML = "";
    const daysInMonth = 30;
    for (let i = 1; i <= daysInMonth; i++) {
        const day = document.createElement('div');
        day.classList.add('day');
        day.dataset.date = `2026-02-${String(i).padStart(2,'0')}`;
        day.innerHTML = `<strong>${i}</strong><p class="entry-text"></p>`;
        day.addEventListener('click', () => addEntry(day));
        calendarDiv.appendChild(day);
    }
    loadEntries();
}

async function addEntry(dayDiv) {
    const date = dayDiv.dataset.date;
    const content = prompt("Mit csinálsz ezen a napon?");
    if (!content) return;

    const userEntries = await fetch(`${API_BASE}/getUserEntries?device_id=${user.device_id}`)
        .then(r=>r.json());
    if (userEntries.length >= 5) {
        alert("Maximum 5 napra írhatsz egyszerre!");
        return;
    }

    await fetch(`${API_BASE}/addEntry`, {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({device_id: user.device_id, date, content})
    });

    loadEntries();
}

async function loadEntries() {
    const allEntries = await fetch(`${API_BASE}/getAllEntries`).then(r=>r.json());
    document.querySelectorAll('.day').forEach(dayDiv => {
        const date = dayDiv.dataset.date;
        const entryDiv = dayDiv.querySelector('.entry-text');
        const entry = allEntries.find(e=>e.date===date);
        if (entry) {
            entryDiv.textContent = entry.content;
            entryDiv.style.backgroundColor = entry.color;
        } else {
            entryDiv.textContent = '';
            entryDiv.style.backgroundColor = '';
        }
    });
}

loginBtn.addEventListener('click', async () => {
    const name = usernameInput.value.trim();
    const color = usercolorInput.value;
    if (!name) { alert("Adj meg egy nevet!"); return; }

    let device_id = localStorage.getItem('device_id');
    if (!device_id) {
        device_id = crypto.randomUUID();
        localStorage.setItem('device_id', device_id);
    }

    user = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({device_id, name, color})
    }).then(r=>r.json());

    usernameInput.value = user.name;
    usercolorInput.value = user.color;

    loginScreen.style.display = 'none';
    calendarScreen.style.display = 'block';
    welcomeMessage.textContent = `Üdv, ${user.name}!`;
    generateCalendar();
});

logoutBtn.addEventListener('click', () => {
    loginScreen.style.display = 'block';
    calendarScreen.style.display = 'none';
});
