const monthYearElement = document.getElementById("monthYear");
const datesElement = document.getElementById("dates");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

let currentDate = new Date();

function updateCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    let startDay = firstDayOfMonth.getDay();
    startDay = startDay === 0 ? 6 : startDay - 1;

    monthYearElement.textContent = currentDate.toLocaleString("default", {
        month: "long",
        year: "numeric",
    });

    let datesHTML = "";

    const prevMonthLastDate = new Date(year, month, 0).getDate();
    for (let i = startDay; i > 0; i--) {
        datesHTML += `<div class="date inactive">${prevMonthLastDate - i + 1}</div>`;
    }

    for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
        const isToday =
            day === new Date().getDate() &&
            month === new Date().getMonth() &&
            year === new Date().getFullYear();

        const fullDate = `${year}-${String(month + 1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;

        datesHTML += `
            <div class="date ${isToday ? "active" : ""}" data-date="${fullDate}">
                ${day}
            </div>`;

    }

    const totalCells = startDay + lastDayOfMonth.getDate();
    const remaining = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);

    for (let i = 1; i <= remaining; i++) {
        datesHTML += `<div class="date inactive">${i}</div>`;
    }

    datesElement.innerHTML = datesHTML;
}

prevBtn.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    updateCalendar();
});

nextBtn.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    updateCalendar();
});

updateCalendar();

datesElement.addEventListener("click", (e) => {
    if (!e.target.classList.contains("date") ||
        e.target.classList.contains("inactive")) return;

    document.querySelectorAll(".date").forEach(d =>
        d.classList.remove("active")
    );
    e.target.classList.add("active");

    const selectedDate = new Date(e.target.dataset.date);
    calculateWeeklySummary(selectedDate);
});

function calculateWeeklySummary(selectedDate) {
    const transactions =
        JSON.parse(localStorage.getItem("transactions")) || [];

    const start = new Date(selectedDate);
    const day = start.getDay() || 7;
    start.setDate(start.getDate() - (day - 1));

    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    let totalExpenses = 0;
    let totalSavings = 0;

    transactions.forEach(t => {
        const tDate = new Date(t.date);
        if (tDate >= start && tDate <= end) {
            if (t.type === "savings") {
                totalSavings += t.amount;
            } else if (t.amount < 0) {
                totalExpenses += Math.abs(t.amount);
            }
        }
    });

    document.getElementById("weeklyExpenses").textContent =
        totalExpenses.toFixed(2);

    document.getElementById("weeklySavings").textContent =
        totalSavings.toFixed(2);

    document.getElementById("weekRange").textContent =
        `${start.toLocaleDateString()} – ${end.toLocaleDateString()}`;
}