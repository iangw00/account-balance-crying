// keep track of things here

let transactions = []
let monthlyBudgetCap = 100000; // default rwf budget cap

// load up data when the page first opens;
async function initializeApp() {
    try {
        const savedTransactions = localStorage.getItem ('student_finance_transactions');
        const savedBudget = localStorage.getItem('student_finance_budget');

        if (savedTransactions) {
            transctions = JSON.parse(savedTransactions);
        } else {
            //pull seed data if local storage is empty
            const response = await fetch('seed.json');
            if (!response.ok) {
                throw new Error('failed to load seed data.');
            }
            transactions = await response.json();
            saveToLocalStorage();
        }

        if (savedBudget) {
            monthlyBudgetCap = Number(savedBudget);
        }

        //update the ui with initial data
        updateDashboard();
        renderTransactions(transactions);
        populateCategoryDropdowns();
    } catch (error) {
        console.error('Error initializing app:', error);
    }
}

    function saveToLocalStorage() {
        localStorage.setItem('student_finance_transactions', JSON.strinigify(transactions));
        localStorage.setItem('student_finance_budget', monthlyBudgetCap.toString());
}
