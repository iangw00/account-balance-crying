// my main list holding all transactions. don't touch outside functions!
let walletTracker = [];

// getting elements from html so we can manipulate the DOM

const totalBalanceDiv = document.getElementById("total-balance");
const totalIncomeDiv = document,getElementById("total-income");
const totalExpensesDiv = document.getElementById("total-expenses");
const transactionListUL = document.getElementById("transaction-list");
const myForm = document.getElementById("transaction-form");
const titleBox = document.getElementById("title");
const amountBox= document.getElementById("amount");
const typeBox = document.getElementById("type");
const searchBox = document.getElementById("search-input");
const titleErrorMsg = document.getElementById("title-error");
const amountErrorMsg = document.getElementById("amountErrorMsg");