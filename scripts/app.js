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


// --- dashboard stats & category calculations ---

function updateDashboard() {
    const totalRecordsElement = document.getElementById('total-records');
    const totalSpentElement = document.getElementById('total-spent');
    const topCategoryElement = document.getElementById('top-category');


    // count how many transactions we have
    const totalRecords = transactions.length;

    // add up all the transaciton amounts
    const totalSpent = transactions.reduce((sum,item) => sum + Number(item.amount), 0);

    // figure out which category is the highest total spending
    const categoryTotals= {};
    transactions.forEach(item => {
        const categoryName = item.category || 'other';
        categoryTotals[categoryName] = (categoryTotals[categoryName] || 0) + Number(item.amount);
    });

    let topCategory ='None' ;
    let maxAmount = 0;

    for( const [categoryName, amount] of Object.entries(categoryTotals)) {
        if (amount > maxAmount) {
            maxAmount = amount;
            topCategory = categoryName;
        }
    }

    // push the calculated numbers right into the html elements

    if (totalRecordsElement) {
        totalRecordsElement.textContent = totalRecords;
    }
    if (totalSpentElement) {
        totalSpentElement.textContent = `${totalSpent.toLocaleString()} Rwf'`;
    }
    if (topCategoryElement) {
        topCategoryElement.textContent = topCategory;
    }
}