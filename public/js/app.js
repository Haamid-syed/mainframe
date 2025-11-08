// Navigation
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const pageId = btn.dataset.page + '-page';
        document.querySelectorAll('.page').forEach(page => {
            page.classList.add('hidden');
        });
        document.getElementById(pageId).classList.remove('hidden');
    });
});

const API_URL = 'http://localhost:3000/api';

// Create Account
async function createAccount() {
    const name = document.getElementById('new-name').value;
    const accountNo = document.getElementById('new-account-no').value;
    const initialDeposit = parseFloat(document.getElementById('initial-deposit').value);

    try {
        const response = await fetch(`${API_URL}/createAccount`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, accountNo, initialDeposit })
        });

        const data = await response.json();
        if (response.ok) {
            alert('Account created successfully!');
            // Clear form
            document.getElementById('new-name').value = '';
            document.getElementById('new-account-no').value = '';
            document.getElementById('initial-deposit').value = '';
        } else {
            alert(data.error || 'Error creating account');
        }
    } catch (err) {
        alert('Error creating account: ' + err.message);
    }
}

// Check Balance
async function checkBalance() {
    const accountNo = document.getElementById('dashboard-account-no').value;

    try {
        const response = await fetch(`${API_URL}/balance/${accountNo}`);
        const data = await response.json();
        
        if (response.ok) {
            document.getElementById('balance-display').innerHTML = `
                <div class="mt-4 p-4 bg-green-100 rounded">
                    <p class="text-xl">Current Balance: $${data.balance}</p>
                </div>
            `;
        } else {
            alert(data.error || 'Error checking balance');
        }
    } catch (err) {
        alert('Error checking balance: ' + err.message);
    }
}

// Deposit
async function deposit() {
    const accountNo = document.getElementById('trans-account-no').value;
    const amount = parseFloat(document.getElementById('trans-amount').value);

    try {
        const response = await fetch(`${API_URL}/deposit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ accountNo, amount })
        });

        const data = await response.json();
        if (response.ok) {
            alert(`Deposit successful! New balance: $${data.newBalance}`);
            document.getElementById('trans-amount').value = '';
            loadTransactions(); // Refresh transaction history
        } else {
            alert(data.error || 'Error making deposit');
        }
    } catch (err) {
        alert('Error making deposit: ' + err.message);
    }
}

// Withdraw
async function withdraw() {
    const accountNo = document.getElementById('trans-account-no').value;
    const amount = parseFloat(document.getElementById('trans-amount').value);

    try {
        const response = await fetch(`${API_URL}/withdraw`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ accountNo, amount })
        });

        const data = await response.json();
        if (response.ok) {
            alert(`Withdrawal successful! New balance: $${data.newBalance}`);
            document.getElementById('trans-amount').value = '';
            loadTransactions(); // Refresh transaction history
        } else {
            alert(data.error || 'Error making withdrawal');
        }
    } catch (err) {
        alert('Error making withdrawal: ' + err.message);
    }
}

// Load Transactions
async function loadTransactions() {
    const accountNo = document.getElementById('trans-account-no').value;

    try {
        const response = await fetch(`${API_URL}/transactions/${accountNo}`);
        const transactions = await response.json();

        if (response.ok) {
            const tableBody = document.getElementById('transaction-table');
            tableBody.innerHTML = '';

            transactions.forEach(trans => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td class="border px-4 py-2">${new Date(trans.DATE).toLocaleString()}</td>
                    <td class="border px-4 py-2">${trans.TYPE}</td>
                    <td class="border px-4 py-2">$${trans.AMOUNT}</td>
                    <td class="border px-4 py-2">$${trans.BALANCE_AFTER}</td>
                `;
                tableBody.appendChild(row);
            });
        } else {
            alert('Error loading transactions');
        }
    } catch (err) {
        alert('Error loading transactions: ' + err.message);
    }
}
