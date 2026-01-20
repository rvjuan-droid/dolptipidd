document.addEventListener('DOMContentLoaded', () => {
    const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    
    const categoryLists = {
        food: document.querySelector('#food ul'),
        transportation: document.querySelector('#transpo ul'),
        expenses: document.querySelector('#expenses ul') 
    };
    const totalSavings = transactions
    .filter(t => t.type === 'savings')
    .reduce((sum, t) => sum + t.amount, 0);

    document.getElementById("totalSavings").textContent = totalSavings.toFixed(2);


    Object.values(categoryLists).forEach(ul => {
        if (ul) ul.innerHTML = '';
    });

    transactions.forEach(t => {
        if (categoryLists[t.type]) {
            const li = document.createElement('li');
            // Use Math.abs because expenses are stored as negative numbers in your tracker
            const amount = Math.abs(t.amount).toFixed(2);
            li.innerHTML = `<strong>₱${amount}</strong> - ${t.description} <br><small>${t.date}</small>`;
            categoryLists[t.type].appendChild(li);
        }
    });

    const totalAllowance = transactions
        .filter(t => t.type === 'allowance')
        .reduce((sum, t) => sum + t.amount, 0);
    
        document.getElementById("allowanceAmount").textContent =
    totalAllowance.toFixed(2);
    
    const allowanceDisplay = document.querySelector('h1 u');
    if (allowanceDisplay) {
        allowanceDisplay.textContent = `₱ ${totalAllowance.toFixed(2)}`;
    }
});