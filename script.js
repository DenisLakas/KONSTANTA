const SUPABASE_URL = "https://dwebqtanslecexhqezbx.supabase.co";

const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3ZWJxdGFuc2xlY2V4aHFlemJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA4MjA1ODgsImV4cCI6MjA5NjM5NjU4OH0.oiH-NPM_qgCmh6vu02dXGWvEi1SUkc6aSrQ5ohwBxl0";

// ELEMENTS
const applyBtn = document.getElementById("applyBtn");
const adminBtn = document.getElementById("adminBtn");

const applyModal = document.getElementById("applyModal");
const adminModal = document.getElementById("adminModal");

const closeApply = document.getElementById("closeApply");
const closeAdmin = document.getElementById("closeAdmin");

const sendBtn = document.getElementById("sendBtn");

const loginBtn = document.getElementById("loginBtn");
const adminPassword = document.getElementById("adminPassword");
const refreshAdmin = document.getElementById("refreshAdmin");

const adminPanel = document.getElementById("adminPanel");
const loginBox = document.getElementById("loginBox");

const list = document.getElementById("list");
const count = document.getElementById("count");

// OPEN / CLOSE MODALS
applyBtn.onclick = () => applyModal.style.display = "flex";
adminBtn.onclick = () => adminModal.style.display = "flex";

closeApply.onclick = () => applyModal.style.display = "none";
closeAdmin.onclick = () => adminModal.style.display = "none";

// SEND APPLICATION
sendBtn.onclick = async () => {
    const name = document.getElementById("name").value.trim();
    const age = document.getElementById("age").value.trim();
    const job = document.getElementById("job").value.trim();

    if (!name || !age || !job) {
        alert("Заповни всі поля!");
        return;
    }

    try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/applications`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "apikey": SUPABASE_KEY,
                "Authorization": `Bearer ${SUPABASE_KEY}`,
                "Prefer": "return=representation"
            },
            body: JSON.stringify({
                name,
                age,
                job,
                time: new Date().toLocaleString()
            })
        });

        if (!res.ok) {
            const err = await res.text();
            console.log(err);
            alert("Помилка: " + err);
            return;
        }

        alert("Заявку відправлено!");
        applyModal.style.display = "none";

    } catch (e) {
        console.log(e);
        alert("Помилка з'єднання з сервером");
    }
};

// ADMIN LOGIN
loginBtn.onclick = () => {
    if (adminPassword.value === "12345678") {
        loginBox.style.display = "none";
        adminPanel.style.display = "block";
        loadApplications();
    } else {
        alert("Невірний пароль!");
    }
};

// LOAD APPLICATIONS
async function loadApplications() {
    try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/applications?select=*`, {
            headers: {
                "apikey": SUPABASE_KEY,
                "Authorization": `Bearer ${SUPABASE_KEY}`
            }
        });

        if (!res.ok) {
            const err = await res.text();
            console.log(err);
            alert("Помилка завантаження");
            return;
        }

        const data = await res.json();

        count.innerText = "Заявок: " + data.length;
        list.innerHTML = "";

        data.reverse().forEach(app => {
            const div = document.createElement("div");
            div.className = "application-card";

            div.innerHTML = `
                <p><b>Ім'я:</b> ${app.name}</p>
                <p><b>Вік:</b> ${app.age}</p>
                <p><b>Робота:</b> ${app.job}</p>
                <p><b>Час:</b> ${app.time}</p>
            `;

            list.appendChild(div);
        });

    } catch (e) {
        console.log(e);
        alert("Помилка з'єднання");
    }
}
refreshAdmin.onclick = () => {
    loadApplications();
};