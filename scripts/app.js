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

// --- display transactions in the table ---

function renderTransactions(dataToRender) {
    const tableBody = document.getElementById('transaction-rows');
    if (!tableBody) return;

    //clear out old rows first
    tableBody.innerHTML = '';

    // show a message if there's nothing to display 
    if (dataToRender.length === 0) {
        tableBody.innerHTML = `
        <tr>
            <td colspan="5" style="text-align: center; padding-top: 20px; padding-bottom: 20px;">
            No transactions found.
            </td>
        </tr>
    `;
    return;
    }

    // loop through and build each row
    dataToRender.forEach(item => {
        const row = document.createElement('tr');

        row.innerHTML = `
        <td>${item.description}</td>
        <td>${Number(item.amount).toLocaleString()} Rwf</td>
        <td>${item.category}</td>
        <td>${item.date}</td>
        <td>
            <button type="button" class="delete-button
    </td>
`;

tableBody.appendChild(row);
    });
}

// sort transactions by date, amount, or description
function sortTransactions(criteria) {
    const sortedList = [...transactions];

    if(criteria === 'date-descending') {
        sortedList.sort((a,b) => new Date(b.date) - new Date(a.date));
    } else if (criteria === 'date-ascending') {
        sortedList.sort((a,b) => new Date(a.date) - new Date(b.date));
    } else if (criteria ==='amount-descending') {
        sortedList.sort((a,b) => Number(b.amount) - Number(a.amount));
    } else if (criteria === 'amount-ascending') {
        sortedList.sort((a,b) => Number(a.amount) - Number(b.amount));
    } else if (criteria === 'description-ascending') {
        sortedList.sort((a,b) => a.description.localeCompare(b.description));
    }

    renderTransactions(sortedList);
}


// --- adding & deleting transactions ---

// grab form submit event and add a new transaction
function handleFormSubmit(event) {
    event.preventDefault();

    const descriptionInput = document.getElementById('description-input');
    const amountInput = document.getElementById('amount-input');
    const categoryInput = document.getElementById('category-input');
    const dateInput = document.getElementById('date-input');

    if(!descriptionInput || !amountInput || !categoryInput || !dateInput) return;

    const newTransaction = {
        id: Date.now().toString(), // unique id using current timestamp
        description: descriptionInput.ariaValueMax.trim(),
        amount: Number(amountInput.value),
        category: categoryInput.value,
        date: dateInput.value
    };

    // add to the beginning of the array so newest shows up first
    transactions.unshift(newTransaction);
    saveToLocalStorage();

    // refresh everything on screen
    updateDashboard();
    renderTransactions(transactions);

    // clear out form inputs
    descriptionInput.value= '';
    amountInput.value = '';
}

// remove a transaction by its id
function deleteTransaction(id) {
    transactions = transactions.filter(item => item.id !== id);
    saveToLocalStorage();

    // refresh everything on screen
    updateDashboard();
    renderTransactions(transactions);
}


// --- Category dropdowns & event listeners ---

// populate dropdowns with standard categories
function populateCategoryDropdowns() {
    const categoryInput = document.getElementById('category-input');
    if (!categoryInput) return;

    const categories = ['Food & Groceries', 'Transport (Tap&Go)', 'Utilities & Airtime', 'Academic & Books', 'Leisure & Personal', 'Other'];

    categoryInput.innerHTML= '';
    categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        categoryInput.appendChild(option);
    });
}

// run initialization when the page finishes loading
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();

    // hook up the form submit listener
    const transactionForm = document.getElementById('transaction-form');
    if (transactionForm) {
        transactionForm.addEventListener('submit', handleFormSubmit);
    }

    // setup the sort dropdown listener
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            sortTransactions(e.target.value);
        });
    }
});