// State Management
let loans = [];
let incomes = [];
let expenses = [];
let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();
let cashflowChart = null;
// To track paid status, we can store it in local storage as a map: "loanId_YYYY-MM-DD" -> true
let paidStatuses = JSON.parse(localStorage.getItem('loanManager_paidStatuses')) || {};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    loadTheme();
    setupEventListeners();
    renderApp();
});

function loadData() {
    const savedLoans = localStorage.getItem('loanManager_loans');
    if (savedLoans) {
        loans = JSON.parse(savedLoans);
        
        // Ensure older data has a type and category
        loans.forEach(l => { 
            if (!l.type) l.type = 'interest_only';
            if (!l.category) l.category = 'A';
        });

        // 自动注入“信用社”数据（如果还没加的话）
        if (!loans.find(l => l.name === '信用社')) {
            loans.push({
                id: generateId(), type: 'interest_only', name: '信用社', principal: 420000, rate: 4.65, interest: 1667, day: 21, maturity: '2027-07-24', bank: '未填写'
            });
        }
        
        // 自动注入建行(华天)
        if (!loans.find(l => l.name === '建设银行（华天）')) {
            loans.push({
                id: generateId(), type: 'amortized', name: '建设银行（华天）', principal: 117000, rate: '', interest: 2090, day: 1, maturity: '2031-07-01', bank: '未填写'
            });
        }
        
        // 自动注入农行
        if (!loans.find(l => l.name === '农行信用贷')) {
            loans.push({
                id: generateId(), type: 'interest_only', name: '农行信用贷', principal: 200000, rate: '', interest: 560, day: 21, maturity: '2026-10-22', bank: '未填写'
            });
        }
        
        // 自动注入北部湾
        if (!loans.find(l => l.name === '北部湾(房抵)')) {
            loans.push({
                id: generateId(), type: 'interest_only', name: '北部湾(房抵)', principal: 800000, rate: 4.5, interest: 3100, day: 10, maturity: '2027-08-30', bank: '未填写'
            });
        }
        
        // 自动注入北部湾(20万)
        if (!loans.find(l => l.name === '北部湾(20万)')) {
            loans.push({
                id: generateId(), type: 'interest_only', name: '北部湾(20万)', principal: 200000, rate: '', interest: 1000, day: 10, maturity: '2026-11-28', bank: '未填写'
            });
        }
        
        // 自动注入桂林银行房贷
        if (!loans.find(l => l.name === '桂林银行(房贷)')) {
            loans.push({
                id: generateId(), type: 'amortized', name: '桂林银行(房贷)', principal: 945606, rate: 3.2, interest: 8058.44, day: 20, maturity: '2038-03-07', bank: '尾号8869'
            });
        }
        
        // 自动注入桂林银行信用贷
        if (!loans.find(l => l.name === '桂林银行(信用贷)')) {
            loans.push({
                id: generateId(), type: 'interest_only', name: '桂林银行(信用贷)', principal: 200000, rate: '', interest: 1000, day: 20, maturity: '2028-11-11', bank: '未填写'
            });
        }
        
        // 自动注入李洛辰帮贷
        if (!loans.find(l => l.name === '李洛辰帮贷')) {
            loans.push({
                id: generateId(), type: 'interest_only', name: '李洛辰帮贷', principal: 230000, rate: '', interest: 0, day: null, maturity: '', bank: '未填写', category: 'D'
            });
        }

        // 自动注入漓江100万 (B)
        if (!loans.find(l => l.name === '漓江银行(100万)')) {
            loans.push({ id: generateId(), category: 'B', type: 'interest_only', name: '漓江银行(100万)', principal: 1000000, rate: '', interest: 3800, day: 15, maturity: '', bank: '未填写' });
        }
        
        // 自动注入信用社115万 (B)
        if (!loans.find(l => l.name === '信用社(115万)')) {
            loans.push({ id: generateId(), category: 'B', type: 'interest_only', name: '信用社(115万)', principal: 1150000, rate: '', interest: 3100, day: 15, maturity: '', bank: '未填写' });
        }
        
        // 自动注入招商银行 (B)
        if (!loans.find(l => l.name === '招商银行')) {
            loans.push({ id: generateId(), category: 'B', type: 'interest_only', name: '招商银行', principal: 128000, rate: '', interest: 300, day: 15, maturity: '', bank: '未填写' });
        }
        
        // 自动注入欠亲戚 (E)
        if (!loans.find(l => l.name === '欠亲戚')) {
            loans.push({ id: generateId(), category: 'E', type: 'interest_only', name: '欠亲戚', principal: 150000, rate: '', interest: 0, day: null, maturity: '', bank: '未填写' });
        }
        
        // 自动注入华夏银行房贷 (C)
        if (!loans.find(l => l.name === '华夏银行(房贷)')) {
            loans.push({ id: generateId(), category: 'C', type: 'amortized', name: '华夏银行(房贷)', principal: 990393.75, rate: 3.2, interest: 4831.75, day: 20, maturity: '2051-04-02', bank: '尾号0665' });
        }
        
        // 自动注入华夏银行易达金 (C)
        if (!loans.find(l => l.name === '华夏银行(易达金)')) {
            loans.push({ id: generateId(), category: 'C', type: 'amortized', name: '华夏银行(易达金)', principal: 13700.01, rate: '', interest: 2283.33, day: 16, maturity: '2026-12-26', bank: '未填写' });
        }
        
        // 自动注入光大银行光速贷 (C)
        if (!loans.find(l => l.name === '光大银行(光速贷)')) {
            loans.push({ id: generateId(), category: 'C', type: 'interest_only', name: '光大银行(光速贷)', principal: 46000, rate: 4.1, interest: 241.50, day: 8, maturity: '2027-11-09', bank: '未填写' });
        }
        
        // 自动注入光大银行光速贷2.3万 (C)
        if (!loans.find(l => l.name === '光大银行(光速贷2.3万)')) {
            loans.push({ id: generateId(), category: 'C', type: 'amortized', name: '光大银行(光速贷2.3万)', principal: 9716.57, rate: 4.77, interest: 1966.55, day: 11, maturity: '2026-11-11', bank: '未填写' });
        }
        
        // 强制更新已有数据中的 B 类贷款日期和华夏易达金
        loans.forEach(l => {
            if (['漓江银行(100万)', '信用社(115万)', '招商银行'].includes(l.name) && l.day === null) {
                l.day = 15;
            }
            if (l.name === '华夏银行(易达金)' && l.day === null) {
                l.day = 16;
            }
        });
        
        // 先把收入和支出数据加载好，防止后面 saveData() 把它们清空
        const savedIncomesPre = localStorage.getItem('loanManager_incomes');
        let parsedIncomesPre = savedIncomesPre ? JSON.parse(savedIncomesPre) : [];
        if (parsedIncomesPre.length > 0) {
            incomes = parsedIncomesPre;
        }

        const savedExpensesPre = localStorage.getItem('loanManager_expenses');
        let parsedExpensesPre = savedExpensesPre ? JSON.parse(savedExpensesPre) : [];
        if (parsedExpensesPre.length > 0) {
            expenses = parsedExpensesPre;
        }

        saveData();
    } else {
        // Initial data as requested
        loans = [
            { id: generateId(), category: 'A', type: 'interest_only', name: '漓江银行', principal: 300000, rate: 5.6, interest: 1400, day: 21, maturity: '2026-08-18', bank: '未填写' },
            { id: generateId(), category: 'A', type: 'interest_only', name: '信用社', principal: 420000, rate: 4.65, interest: 1667, day: 21, maturity: '2027-07-24', bank: '未填写' },
            { id: generateId(), category: 'A', type: 'amortized', name: '建设银行（华天）', principal: 117000, rate: '', interest: 2090, day: 1, maturity: '2031-07-01', bank: '未填写' },
            { id: generateId(), category: 'A', type: 'interest_only', name: '农行信用贷', principal: 200000, rate: '', interest: 560, day: 21, maturity: '2026-10-22', bank: '未填写' },
            { id: generateId(), category: 'A', type: 'interest_only', name: '北部湾(房抵)', principal: 800000, rate: 4.5, interest: 3100, day: 10, maturity: '2027-08-30', bank: '未填写' },
            { id: generateId(), category: 'A', type: 'interest_only', name: '北部湾(20万)', principal: 200000, rate: '', interest: 1000, day: 10, maturity: '2026-11-28', bank: '未填写' },
            { id: generateId(), category: 'A', type: 'amortized', name: '桂林银行(房贷)', principal: 945606, rate: 3.2, interest: 8058.44, day: 20, maturity: '2038-03-07', bank: '尾号8869' },
            { id: generateId(), category: 'A', type: 'interest_only', name: '桂林银行(信用贷)', principal: 200000, rate: '', interest: 1000, day: 20, maturity: '2028-11-11', bank: '未填写' },
            { id: generateId(), category: 'D', type: 'interest_only', name: '李洛辰帮贷', principal: 230000, rate: '', interest: 0, day: null, maturity: '', bank: '未填写' },
            { id: generateId(), category: 'B', type: 'interest_only', name: '漓江银行(100万)', principal: 1000000, rate: '', interest: 3800, day: 15, maturity: '', bank: '未填写' },
            { id: generateId(), category: 'B', type: 'interest_only', name: '信用社(115万)', principal: 1150000, rate: '', interest: 3100, day: 15, maturity: '', bank: '未填写' },
            { id: generateId(), category: 'B', type: 'interest_only', name: '招商银行', principal: 128000, rate: '', interest: 300, day: 15, maturity: '', bank: '未填写' },
            { id: generateId(), category: 'E', type: 'interest_only', name: '欠亲戚', principal: 150000, rate: '', interest: 0, day: null, maturity: '', bank: '未填写' },
            { id: generateId(), category: 'C', type: 'amortized', name: '华夏银行(房贷)', principal: 990393.75, rate: 3.2, interest: 4831.75, day: 20, maturity: '2051-04-02', bank: '尾号0665' }
        ];
        saveData();
    }

    // 如果 incomes 还没被赋值（即上面的 pre-load 没命中），再走一次加载
    if (incomes.length === 0) {
        const savedIncomes = localStorage.getItem('loanManager_incomes');
        let parsedIncomes = savedIncomes ? JSON.parse(savedIncomes) : [];
        if (parsedIncomes.length > 0) {
            incomes = parsedIncomes;
        } else {
            incomes = [
                { id: generateId(), name: '工资收入', amount: 15000, day: 15, category: '主业' },
                { id: generateId(), name: '嘉和城181平租金', amount: 833.33, day: 1, category: '租金' },
                { id: generateId(), name: '里建别墅320平二套租金', amount: 6416.67, day: 1, category: '租金' },
                { id: generateId(), name: '里建华侨城商铺50平收租', amount: 4000, day: 1, category: '租金' },
                { id: generateId(), name: '业务收入', amount: 8333.33, day: 25, category: '副业' }
            ];
            saveData();
        }
    }

    // Load expenses — only use defaults if key has NEVER been set
    const savedExpensesRaw = localStorage.getItem('loanManager_expenses');
    if (savedExpensesRaw !== null) {
        // Key exists: use whatever is saved (even if empty array)
        expenses = JSON.parse(savedExpensesRaw);
    } else {
        // First time ever — load sensible defaults
        expenses = [
            { id: generateId(), name: '餐饮伙食', amount: 3500, day: 1, category: '餐饮' },
            { id: generateId(), name: '日用购物', amount: 800, day: 1, category: '生活' },
            { id: generateId(), name: '交通出行', amount: 1500, day: 1, category: '交通' },
            { id: generateId(), name: '通讯网络', amount: 400, day: 1, category: '通讯' },
            { id: generateId(), name: '水电气费', amount: 600, day: 1, category: '固定' },
            { id: generateId(), name: '物业管理', amount: 300, day: 1, category: '固定' },
            { id: generateId(), name: '人情往来', amount: 1000, day: 1, category: '社交' },
            { id: generateId(), name: '娱乐休闲', amount: 500, day: 1, category: '娱乐' },
            { id: generateId(), name: '医疗健康', amount: 300, day: 1, category: '医疗' },
            { id: generateId(), name: '子女教育', amount: 2000, day: 1, category: '教育' }
        ];
        saveData();
    }
}

function saveData() {
    localStorage.setItem('loanManager_loans', JSON.stringify(loans));
    localStorage.setItem('loanManager_paidStatuses', JSON.stringify(paidStatuses));
    localStorage.setItem('loanManager_incomes', JSON.stringify(incomes));
    localStorage.setItem('loanManager_expenses', JSON.stringify(expenses));
}

function generateId() {
    return Math.random().toString(36).substr(2, 9);
}

// Compact number format for calendar cells
function fmtAmt(n) {
    if (n >= 10000) return (n / 10000).toFixed(n % 10000 === 0 ? 0 : 1) + '万';
    if (n >= 1000) return (n / 1000).toFixed(n % 1000 === 0 ? 0 : 1) + 'k';
    return Math.round(n).toString();
}

function getCategoryColor(category) {
    const c = category || 'A';
    const colors = {
        'A': '#3b82f6', // blue
        'B': '#10b981', // green
        'C': '#f59e0b', // amber
        'D': '#8b5cf6', // purple
        'E': '#ef4444'  // red
    };
    return colors[c] || '#64748b'; // default slate
}

// Event Listeners
function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
            document.querySelectorAll('.view-section').forEach(view => view.classList.remove('active'));
            
            item.classList.add('active');
            const targetId = item.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
            
            if (targetId === 'dashboard-view') renderDashboard();
            if (targetId === 'loans-view') renderLoansList();
            if (targetId === 'incomes-view') renderIncomesList();
            if (targetId === 'expenses-view') renderExpensesList();
        });
    });

    // Calendar Navigation
    document.getElementById('prev-month').addEventListener('click', () => changeMonth(-1));
    document.getElementById('next-month').addEventListener('click', () => changeMonth(1));
    document.getElementById('today-btn').addEventListener('click', () => {
        const now = new Date();
        currentMonth = now.getMonth();
        currentYear = now.getFullYear();
        renderDashboard();
    });

    const addLoanBtn = document.getElementById('add-loan-btn');
    const addIncomeBtn = document.getElementById('add-income-btn');
    if (addLoanBtn) {
        addLoanBtn.addEventListener('click', () => {
            document.getElementById('loan-form').reset();
            document.getElementById('loan-id').value = '';
            document.getElementById('modal-title').innerText = '添加新贷款';
            openModal('loan-modal');
        });
    }
    
    if (addIncomeBtn) {
        addIncomeBtn.addEventListener('click', () => {
            document.getElementById('income-form').reset();
            document.getElementById('income-id').value = '';
            document.getElementById('income-modal-title').innerText = '添加新收入';
            openModal('income-modal');
        });
    }

    const addExpenseBtn = document.getElementById('add-expense-btn');
    if (addExpenseBtn) {
        addExpenseBtn.addEventListener('click', () => {
            document.getElementById('expense-form').reset();
            document.getElementById('expense-id').value = '';
            document.getElementById('expense-modal-title').innerText = '添加日常支出';
            openModal('expense-modal');
        });
    }

    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', () => {
            closeModal('loan-modal');
            closeModal('day-modal');
            closeModal('income-modal');
            closeModal('expense-modal');
        });
    });

    // Form Submit
    const loanForm = document.getElementById('loan-form');
    if (loanForm) loanForm.addEventListener('submit', (e) => { e.preventDefault(); saveLoan(); });

    const incomeForm = document.getElementById('income-form');
    if (incomeForm) incomeForm.addEventListener('submit', (e) => { e.preventDefault(); saveIncome(); });

    const expenseForm = document.getElementById('expense-form');
    if (expenseForm) expenseForm.addEventListener('submit', (e) => { e.preventDefault(); saveExpense(); });

    // Theme selector
    const themeSelector = document.getElementById('theme-selector');
    if (themeSelector) {
        themeSelector.addEventListener('change', (e) => {
            const theme = e.target.value;
            setTheme(theme);
        });
    }
}

function loadTheme() {
    const savedTheme = localStorage.getItem('loanManager_theme') || 'dark';
    setTheme(savedTheme);
    const themeSelector = document.getElementById('theme-selector');
    if (themeSelector) {
        themeSelector.value = savedTheme;
    }
}

function setTheme(theme) {
    if (theme === 'dark') {
        document.body.removeAttribute('data-theme');
    } else {
        document.body.setAttribute('data-theme', theme);
    }
    localStorage.setItem('loanManager_theme', theme);
}

function openModal(id) {
    document.getElementById(id).classList.add('active');
}

function closeModal(id) {
    document.getElementById(id).classList.remove('active');
}

// Data Processing
function getEventsForMonth(year, month) {
    let events = [];
    
    loans.forEach(loan => {
        let maturityYear = Infinity;
        let maturityMonth = Infinity;
        let maturityDay = 31;

        if (loan.isSettled && loan.settledDate) {
            const settledDateObj = new Date(loan.settledDate);
            maturityYear = settledDateObj.getFullYear();
            maturityMonth = settledDateObj.getMonth();
            maturityDay = settledDateObj.getDate();
        } else if (loan.maturity) {
            const maturityDate = new Date(loan.maturity);
            maturityYear = maturityDate.getFullYear();
            maturityMonth = maturityDate.getMonth();
            maturityDay = maturityDate.getDate();
        }

        // Is maturity in the past?
        if (year > maturityYear || (year === maturityYear && month > maturityMonth)) {
            return; // Loan already matured and finished
        }

        // Add monthly interest event
        if (year < maturityYear || (year === maturityYear && month <= maturityMonth)) {
            let payDay = loan.day ? parseInt(loan.day) : 0;
            // Edge case: if month doesn't have that day (e.g., Feb 30), clamp to last day of month
            if (payDay > 0) {
                const daysInMonth = new Date(year, month + 1, 0).getDate();
                if (payDay > daysInMonth) payDay = daysInMonth;
            }

            // Don't add regular interest if we are in maturity month and the regular pay day is AFTER maturity day
            if (!(loan.maturity && year === maturityYear && month === maturityMonth && payDay > maturityDay)) {
                const dateKey = `${year}-${String(month+1).padStart(2, '0')}-${payDay ? String(payDay).padStart(2, '0') : '00'}`;
                const eventId = `int_${loan.id}_${dateKey}`;
                
                events.push({
                    id: eventId,
                    loanId: loan.id,
                    type: 'interest',
                    title: `[${loan.category || 'A'}] ${loan.type === 'amortized' ? `${loan.name} (月供)` : `${loan.name} (利息)`}`,
                    amount: Number(loan.interest),
                    day: payDay,
                    dateKey: dateKey,
                    isPaid: paidStatuses[eventId] !== undefined ? paidStatuses[eventId] : (dateKey <= '2026-07-01'),
                    bank: loan.bank,
                    color: getCategoryColor(loan.category)
                });
            }
        }

        // Add principal repayment event if this is the maturity month AND it's an interest-only loan
        if (loan.type !== 'amortized' && loan.maturity && year === maturityYear && month === maturityMonth) {
            const dateKey = `${year}-${String(month+1).padStart(2, '0')}-${String(maturityDay).padStart(2, '0')}`;
            const eventId = `prin_${loan.id}_${dateKey}`;
            
            events.push({
                id: eventId,
                loanId: loan.id,
                type: 'principal',
                title: `[${loan.category || 'A'}] ${loan.name} (还本)`,
                amount: Number(loan.principal),
                day: maturityDay,
                dateKey: dateKey,
                isPaid: paidStatuses[eventId] !== undefined ? paidStatuses[eventId] : (dateKey <= '2026-07-01'),
                bank: loan.bank,
                color: getCategoryColor(loan.category)
            });
        }
    });

    // Add Income events
    incomes.forEach(inc => {
        if (inc.day) {
            const dateKey = `${year}-${String(month+1).padStart(2, '0')}-${String(inc.day).padStart(2, '0')}`;
            const eventId = `inc_${inc.id}_${dateKey}`;
            events.push({
                id: eventId,
                loanId: inc.id,
                type: 'income',
                title: `[收入] ${inc.name}`,
                amount: Number(inc.amount),
                day: inc.day,
                dateKey: dateKey,
                isPaid: false,
                bank: inc.category || '未分类',
                color: '#10b981' // Green
            });
        }
    });

    // Add Expense events (daily living) — auto-mark as paid if date has passed
    const today = new Date();
    expenses.forEach(exp => {
        if (exp.day) {
            const dateKey = `${year}-${String(month+1).padStart(2,'0')}-${String(exp.day).padStart(2,'0')}`;
            const eventId = `exp_${exp.id}_${dateKey}`;
            // Auto-deduct: considered "paid" if we're past that day in the current/past month
            const isPastMonth = (year < today.getFullYear()) || (year === today.getFullYear() && month < today.getMonth());
            const isPastDay = (year === today.getFullYear() && month === today.getMonth() && exp.day <= today.getDate());
            const autoDeducted = isPastMonth || isPastDay;
            events.push({
                id: eventId,
                loanId: exp.id,
                type: 'expense',
                title: `[支出] ${exp.name}`,
                amount: Number(exp.amount),
                day: exp.day,
                dateKey,
                isPaid: autoDeducted,
                bank: exp.category || '其他',
                color: '#f59e0b'
            });
        }
    });

    return events.filter(e => e.amount > 0);
}

// Rendering
function renderApp() {
    renderDashboard();
    renderLoansList();
    renderIncomesList();
}

function changeMonth(delta) {
    currentMonth += delta;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    } else if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderDashboard();
}

function renderDashboard() {
    const monthNames = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];
    document.getElementById('current-month-display').innerText = `${currentYear}年 ${monthNames[currentMonth]}`;

    const events = getEventsForMonth(currentYear, currentMonth);
    
    // Calculate Stats
    const elDue = document.getElementById('stat-total-due');
    const elPaid = document.getElementById('stat-total-paid');
    const elRemaining = document.getElementById('stat-total-remaining');
    const elIncome = document.getElementById('stat-total-income');
    const elNetFlow = document.getElementById('stat-net-flow');
    const netFlowCard = document.getElementById('stat-net-flow-card');

    let totalDue = 0;
    let totalPaid = 0;
    let totalIncome = 0;
    let totalExpenses = 0;

    events.forEach(e => {
        if (e.type === 'income') {
            totalIncome += e.amount;
        } else if (e.type === 'expense') {
            totalExpenses += e.amount;
        } else {
            totalDue += e.amount;
            if (e.isPaid) totalPaid += e.amount;
        }
    });

    const netFlow = totalIncome - totalDue - totalExpenses;

    if (elDue) elDue.innerText = `¥${totalDue.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
    if (elPaid) elPaid.innerText = `¥${totalPaid.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
    if (elRemaining) elRemaining.innerText = `¥${(totalDue - totalPaid).toLocaleString(undefined, {minimumFractionDigits: 2})}`;
    if (elIncome) elIncome.innerText = `¥${totalIncome.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
    
    if (elNetFlow) {
        elNetFlow.innerText = `¥${netFlow.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
        if (netFlow < 0) {
            elNetFlow.style.color = 'var(--danger-color)';
            if (netFlowCard) {
                netFlowCard.style.borderColor = 'rgba(244,63,94,0.3)';
                netFlowCard.querySelector('.stat-icon').style.color = 'var(--danger-color)';
                netFlowCard.querySelector('.stat-icon').style.background = 'rgba(244,63,94,0.1)';
            }
        } else {
            elNetFlow.style.color = 'var(--accent-color)';
            if (netFlowCard) {
                netFlowCard.style.borderColor = 'rgba(16,185,129,0.2)';
                netFlowCard.querySelector('.stat-icon').style.color = 'var(--accent-color)';
                netFlowCard.querySelector('.stat-icon').style.background = 'rgba(16,185,129,0.1)';
            }
        }
    }

    renderCalendar(events);
    renderUpcoming(events);
    renderChart();
}

function renderCalendar(events) {
    const grid = document.getElementById('calendar-grid');
    grid.innerHTML = '';

    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();

    const today = new Date();
    const isCurrentMonth = today.getMonth() === currentMonth && today.getFullYear() === currentYear;

    // Fill previous month padding
    for (let i = 0; i < firstDay; i++) {
        const cell = document.createElement('div');
        cell.className = 'calendar-cell other-month';
        cell.innerHTML = `<span class="date-number">${prevMonthDays - firstDay + i + 1}</span>`;
        grid.appendChild(cell);
    }

    // Fill current month
    for (let day = 1; day <= daysInMonth; day++) {
        const cell = document.createElement('div');
        cell.className = 'calendar-cell';
        if (isCurrentMonth && day === today.getDate()) {
            cell.classList.add('today');
        }

        let html = `<span class="date-number">${day}</span><div class="events-container">`;
        
        // Find events for this day
        const dayEvents = events.filter(e => e.day === day);
        
        // Group loan expenses by category; track income by category; track daily expenses
        const categoryTotals = {}; // { 'A': { amount, paid } }
        const incomeByCat = {};    // { '工资': amount, '租金': amount, ... }
        let dayLivingExpense = 0;
        let dayLivingDeducted = false;

        dayEvents.forEach(e => {
            if (e.type === 'income') {
                // Find the income source to get its category
                const src = incomes.find(i => i.id === e.loanId);
                const cat = (src && src.category) ? src.category : '收入';
                incomeByCat[cat] = (incomeByCat[cat] || 0) + e.amount;
            } else if (e.type === 'expense') {
                dayLivingExpense += e.amount;
                if (e.isPaid) dayLivingDeducted = true;
            } else {
                const loan = loans.find(l => l.id === e.loanId);
                const cat = loan ? (loan.category || 'A') : 'A';
                if (!categoryTotals[cat]) categoryTotals[cat] = { amount: 0, paid: 0 };
                categoryTotals[cat].amount += e.amount;
                if (e.isPaid) categoryTotals[cat].paid += e.amount;
            }
        });

        // Income lines — full amount (green)
        Object.entries(incomeByCat).forEach(([cat, amount]) => {
            html += `<div class="calendar-event income">+¥${Math.round(amount).toLocaleString()}</div>`;
        });

        // Loan repayment lines per category (amber)
        ['A','B','C','D','E'].forEach(cat => {
            if (!categoryTotals[cat]) return;
            const { amount, paid } = categoryTotals[cat];
            const isAllPaid = paid >= amount;
            const style = `border-left-color:#f59e0b;color:#fbbf24;${isAllPaid ? 'opacity:0.4;text-decoration:line-through;' : ''}`;
            html += `<div class="calendar-event" style="${style}">-¥${Math.round(amount).toLocaleString()}</div>`;
        });

        // Daily living expense
        if (dayLivingExpense > 0) {
            const dStyle = dayLivingDeducted
                ? 'border-left-color:#f59e0b;opacity:0.4;text-decoration:line-through;'
                : 'border-left-color:#f59e0b;color:#fbbf24;';
            html += `<div class="calendar-event" style="${dStyle}">-¥${Math.round(dayLivingExpense).toLocaleString()}</div>`;
        }

        html += `</div>`;
        cell.innerHTML = html;

        if (dayEvents.length > 0) {
            cell.addEventListener('click', () => openDayDetails(day, dayEvents));
        }

        grid.appendChild(cell);
    }

    // Fill next month padding
    const totalCells = firstDay + daysInMonth;
    const nextPadding = Math.ceil(totalCells / 7) * 7 - totalCells;
    for (let i = 1; i <= nextPadding; i++) {
        const cell = document.createElement('div');
        cell.className = 'calendar-cell other-month';
        cell.innerHTML = `<span class="date-number">${i}</span>`;
        grid.appendChild(cell);
    }
}

function renderUpcoming(events) {
    const list = document.getElementById('upcoming-list');
    list.innerHTML = '';

    let displayEvents = events;

    // Remove the filter that hid past events in the current month
    // so we show the full month's cash flow timeline

    // Sort by day
    displayEvents.sort((a, b) => a.day - b.day);

    if (displayEvents.length === 0) {
        list.innerHTML = '<div style="padding: 1rem; color: var(--text-muted); text-align: center;">本月无账单/收入</div>';
        return;
    }

    displayEvents.forEach(e => {
        const item = document.createElement('li');
        item.className = `upcoming-item ${e.type} ${e.isPaid ? 'paid' : ''}`;
        item.style.cursor = 'pointer';
        if (!e.isPaid) {
            item.style.borderLeftColor = e.color;
            item.style.backgroundColor = e.color + '0d'; // ~5% opacity
        }

        let titleText = e.title;
        // Inject category into income titles if not already there
        if (e.type === 'income') {
            const src = incomes.find(i => i.id === e.loanId);
            const cat = (src && src.category) ? src.category : '其他';
            titleText += ` (${cat})`;
        }

        item.innerHTML = `
            <div class="upcoming-date">${e.day === 0 ? '日期待定' : (currentMonth + 1) + '月' + e.day + '日'}</div>
            <div class="upcoming-title">${titleText}</div>
            <div class="upcoming-amount">¥${e.amount.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
        `;
        item.addEventListener('click', () => {
            if (e.day === 0) {
                openDayDetails(0, [e]);
            } else {
                const dayEvents = events.filter(ev => ev.day === e.day);
                openDayDetails(e.day, dayEvents);
            }
        });
        list.appendChild(item);
    });
}

function renderLoansList() {
    const tbody = document.getElementById('loans-tbody');
    const emptyState = document.getElementById('empty-loans-state');
    const table = document.querySelector('.loans-table');
    
    let totalOriginal = 0;
    let totalRemaining = 0;

    tbody.innerHTML = '';

    if (loans.length === 0) {
        table.style.display = 'none';
        emptyState.style.display = 'flex';
        updateLoansStats(0, 0);
        return;
    }

    table.style.display = 'table';
    emptyState.style.display = 'none';

    loans.forEach(loan => {
        const tr = document.createElement('tr');
        const catColor = getCategoryColor(loan.category);
        const remaining = loan.remaining !== undefined ? loan.remaining : loan.principal;
        
        totalOriginal += Number(loan.principal);
        totalRemaining += Number(remaining);

        tr.innerHTML = `
            <td><span class="tag" style="background:${catColor};color:white;font-weight:bold;padding:4px 10px;border-radius:4px;box-shadow:0 2px 4px ${catColor}40;">${loan.category || 'A'}</span></td>
            <td><strong>${loan.name}</strong><br><small style="color:var(--text-muted)">${loan.type === 'amortized' ? '等额本息/分期' : '先息后本'}</small></td>
            <td>
                <div>原始: ¥${Number(loan.principal).toLocaleString()}</div>
                <div style="color:var(--accent-color);font-weight:600;">剩余: ¥${Number(remaining).toLocaleString()}</div>
            </td>
            <td>¥${Number(loan.interest).toLocaleString()}</td>
            <td>${loan.day ? `每月 ${loan.day} 日` : '日期待定'}</td>
            <td>${loan.isSettled ? '<span class="tag" style="background:var(--success-color);color:white;padding:4px 8px;border-radius:4px;font-size:0.8rem;"><i class="fa-solid fa-check"></i> 已结清</span>' : (loan.maturity || '长期/未定')}</td>
            <td>${loan.bank || '-'}</td>
            <td>
                <div class="action-btns">
                    ${loan.isSettled ? '' : `<button class="btn-text success" onclick="settleLoan('${loan.id}')" title="提前还清"><i class="fa-solid fa-handshake"></i></button>`}
                    <button class="btn-text edit" onclick="editLoan('${loan.id}')"><i class="fa-solid fa-pen"></i></button>
                    <button class="btn-text delete" onclick="deleteLoan('${loan.id}')"><i class="fa-solid fa-trash"></i></button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
    
    updateLoansStats(totalOriginal, totalRemaining);
}

function renderIncomesList() {
    const tbody = document.getElementById('incomes-tbody');
    const emptyState = document.getElementById('empty-incomes-state');
    const table = document.querySelector('#incomes-view .loans-table');
    const statTotal = document.getElementById('stat-incomes-total');
    
    if (!tbody) return;

    let total = 0;
    tbody.innerHTML = '';

    if (incomes.length === 0) {
        if(table) table.style.display = 'none';
        if(emptyState) emptyState.style.display = 'flex';
        if(statTotal) statTotal.innerText = '¥0.00';
        return;
    }

    if(table) table.style.display = 'table';
    if(emptyState) emptyState.style.display = 'none';

    incomes.forEach(inc => {
        total += Number(inc.amount);
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${inc.name}</strong></td>
            <td style="color:var(--accent-color);font-weight:600;">¥${Number(inc.amount).toLocaleString()}</td>
            <td>${inc.day ? `每月 ${inc.day} 日` : '日期待定'}</td>
            <td><span class="tag" style="background:#10b981;color:white;">${inc.category || '未分类'}</span></td>
            <td>
                <button class="btn-secondary btn-small" onclick="editIncome('${inc.id}')">编辑</button>
                <button class="btn-secondary btn-small" onclick="deleteIncome('${inc.id}')" style="color:var(--danger-color);border-color:var(--danger-color);background:transparent;">删除</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
    
    if (statTotal) {
        statTotal.innerText = `¥${total.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
    }
}

function updateLoansStats(original, remaining) {
    const elOriginal = document.getElementById('stat-loans-total-original');
    const elRemaining = document.getElementById('stat-loans-total-remaining');
    if (elOriginal) elOriginal.innerText = `¥${original.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
    if (elRemaining) elRemaining.innerText = `¥${remaining.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
}

function renderExpensesList() {
    const tbody = document.getElementById('expenses-tbody');
    const emptyState = document.getElementById('empty-expenses-state');
    const table = document.getElementById('expenses-table');
    const statTotal = document.getElementById('stat-expenses-total');
    const statBurden = document.getElementById('stat-expenses-total-burden');
    const statDisposable = document.getElementById('stat-expenses-disposable');

    if (!tbody) return;

    let totalExp = 0;
    tbody.innerHTML = '';

    if (expenses.length === 0) {
        if (table) table.style.display = 'none';
        if (emptyState) emptyState.style.display = 'flex';
        if (statTotal) statTotal.innerText = '¥0.00';
        return;
    }

    if (table) table.style.display = 'table';
    if (emptyState) emptyState.style.display = 'none';

    const catColors = { '餐饮':'#f59e0b','生活':'#3b82f6','交通':'#06b6d4','通讯':'#6366f1','固定':'#64748b','社交':'#ec4899','娱乐':'#8b5cf6','医疗':'#10b981','教育':'#f43f5e','其他':'#94a3b8' };

    expenses.forEach(exp => {
        totalExp += Number(exp.amount);
        const color = catColors[exp.category] || '#94a3b8';
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${exp.name}</strong></td>
            <td style="color:#8b5cf6;font-weight:600;">¥${Number(exp.amount).toLocaleString()}</td>
            <td>${exp.day ? `每月 ${exp.day} 日` : '不固定'}</td>
            <td><span class="tag" style="background:${color}22;color:${color};border:1px solid ${color}44;">${exp.category || '其他'}</span></td>
            <td>
                <button class="btn-secondary btn-small" onclick="editExpense('${exp.id}')">编辑</button>
                <button class="btn-secondary btn-small" onclick="deleteExpense('${exp.id}')" style="color:var(--danger-color);border-color:var(--danger-color);background:transparent;">删除</button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    // Compute monthly loan payments for burden stat
    const events = getEventsForMonth(currentYear, currentMonth);
    let totalLoanDue = 0;
    events.forEach(e => { if (e.type !== 'income' && e.type !== 'expense') totalLoanDue += e.amount; });
    let totalIncome = 0;
    events.forEach(e => { if (e.type === 'income') totalIncome += e.amount; });

    if (statTotal) statTotal.innerText = `¥${totalExp.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
    if (statBurden) statBurden.innerText = `¥${(totalLoanDue + totalExp).toLocaleString(undefined, {minimumFractionDigits: 2})}`;
    if (statDisposable) statDisposable.innerText = `¥${(totalIncome - totalLoanDue - totalExp).toLocaleString(undefined, {minimumFractionDigits: 2})}`;
}

// Expense CRUD
function saveExpense() {
    const id = document.getElementById('expense-id').value || generateId();
    const exp = {
        id,
        name: document.getElementById('expense-name').value,
        amount: document.getElementById('expense-amount').value,
        day: document.getElementById('expense-day').value ? parseInt(document.getElementById('expense-day').value) : null,
        category: document.getElementById('expense-category').value
    };
    const idx = expenses.findIndex(e => e.id === id);
    if (idx >= 0) expenses[idx] = exp; else expenses.push(exp);

    // Clean up stale paidStatus keys for expense events (they don't need paid tracking)
    Object.keys(paidStatuses).forEach(key => {
        if (key.startsWith('exp_')) delete paidStatuses[key];
    });

    saveData();
    closeModal('expense-modal');
    renderExpensesList();
    renderDashboard();
}

window.editExpense = function(id) {
    const exp = expenses.find(e => e.id === id);
    if (!exp) return;
    document.getElementById('expense-id').value = exp.id;
    document.getElementById('expense-name').value = exp.name;
    document.getElementById('expense-amount').value = exp.amount;
    document.getElementById('expense-day').value = exp.day || '';
    document.getElementById('expense-category').value = exp.category || '其他';
    document.getElementById('expense-modal-title').innerText = '编辑日常支出';
    openModal('expense-modal');
}

window.deleteExpense = function(id) {
    if (confirm('确定要删除这条支出记录吗？')) {
        expenses = expenses.filter(e => e.id !== id);
        saveData();
        renderExpensesList();
        renderDashboard();
    }
}

// CRUD Operations
function saveLoan() {
    const id = document.getElementById('loan-id').value || generateId();
    const loan = {
        id: id,
        category: document.getElementById('loan-category').value || 'A',
        type: document.getElementById('loan-type').value,
        name: document.getElementById('loan-name').value,
        principal: document.getElementById('loan-principal').value,
        remaining: document.getElementById('loan-remaining').value ? document.getElementById('loan-remaining').value : document.getElementById('loan-principal').value,
        rate: document.getElementById('loan-rate').value,
        interest: document.getElementById('loan-interest').value,
        day: document.getElementById('loan-day').value ? parseInt(document.getElementById('loan-day').value) : null,
        maturity: document.getElementById('loan-maturity').value || null,
        bank: document.getElementById('loan-bank').value
    };

    const existingIndex = loans.findIndex(l => l.id === id);
    if (existingIndex >= 0) {
        loans[existingIndex] = loan;
    } else {
        loans.push(loan);
    }

    saveData();
    closeModal('loan-modal');
    renderApp();
}

window.editLoan = function(id) {
    const loan = loans.find(l => l.id === id);
    if (!loan) return;

    document.getElementById('loan-id').value = loan.id;
    if(document.getElementById('loan-category')) document.getElementById('loan-category').value = loan.category || 'A';
    if(document.getElementById('loan-type')) document.getElementById('loan-type').value = loan.type || 'interest_only';
    document.getElementById('loan-name').value = loan.name;
    document.getElementById('loan-principal').value = loan.principal;
    if(document.getElementById('loan-remaining')) document.getElementById('loan-remaining').value = loan.remaining !== undefined ? loan.remaining : '';
    document.getElementById('loan-rate').value = loan.rate || '';
    document.getElementById('loan-interest').value = loan.interest;
    document.getElementById('loan-day').value = loan.day || '';
    document.getElementById('loan-maturity').value = loan.maturity || '';
    document.getElementById('loan-bank').value = loan.bank || '';

    document.getElementById('modal-title').innerText = '编辑贷款信息';
    openModal('loan-modal');
}

window.deleteLoan = function(id) {
    if(confirm('确定要删除这条贷款记录吗？相关的还款状态也会丢失。')) {
        loans = loans.filter(l => l.id !== id);
        saveData();
        renderApp();
    }
}

window.settleLoan = function(id) {
    if(confirm('确定要把这笔贷款标记为“已结清”吗？标记后，从明天起它将不再出现在您的还款日历中，且剩余本金归零。')) {
        const idx = loans.findIndex(l => l.id === id);
        if (idx >= 0) {
            loans[idx].isSettled = true;
            loans[idx].settledDate = new Date().toISOString().split('T')[0];
            loans[idx].remaining = 0;
            saveData();
            renderApp();
        }
    }
}

// Day Details
function openDayDetails(day, events) {
    if (day === 0) {
        document.getElementById('day-modal-title').innerText = `${currentYear}年${currentMonth + 1}月 待还款项 (具体日期未定)`;
    } else {
        document.getElementById('day-modal-title').innerText = `${currentYear}年${currentMonth + 1}月${day}日 当日详情`;
    }
    
    const content = document.getElementById('day-modal-content');
    content.innerHTML = '';

    // Separate: loans first, then income, then living expenses
    const sorted = [
        ...events.filter(e => e.type !== 'income' && e.type !== 'expense'),
        ...events.filter(e => e.type === 'income'),
        ...events.filter(e => e.type === 'expense'),
    ];

    sorted.forEach(e => {
        const card = document.createElement('div');
        card.className = `detail-card ${e.type}`;

        const isLoan = (e.type !== 'income' && e.type !== 'expense');
        const isExpense = (e.type === 'expense');

        // Build the footer section based on type
        let footer = '';
        if (isLoan) {
            footer = `
                <div class="detail-info"><div><i class="fa-solid fa-building-columns"></i> 银行卡：${e.bank || '未填写'}</div></div>
                <div class="detail-actions">
                    <button class="btn-${e.isPaid ? 'secondary' : 'primary'} btn-small" onclick="togglePaymentStatus('${e.id}')">
                        ${e.isPaid ? '✓ 取消标记' : '标记为已还'}
                    </button>
                </div>`;
        } else if (isExpense) {
            footer = `<div class="detail-info"><div><i class="fa-solid fa-tag"></i> 类别：${e.bank || '其他'}</div></div>`;
        } else {
            footer = `<div class="detail-info"><div><i class="fa-solid fa-circle-check" style="color:var(--success-color);"></i> 收入项</div></div>`;
        }

        card.innerHTML = `
            <div class="detail-header">
                <span class="detail-title">${e.title}</span>
                <span class="detail-amount">¥${e.amount.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
            </div>
            ${footer}
        `;
        content.appendChild(card);
    });

    openModal('day-modal');
}

// Analytics (Chart.js)
function renderChart() {
    const ctx = document.getElementById('cashflowChart');
    if (!ctx) return;

    const labels = [];
    const incomeData = [];
    const dueData = [];
    const netFlowData = [];

    // Calculate next 12 months
    let tempDate = new Date(currentYear, currentMonth, 1);
    
    for (let i = 0; i < 12; i++) {
        const y = tempDate.getFullYear();
        const m = tempDate.getMonth();
        labels.push(`${y}年${m+1}月`);
        
        const monthlyEvents = getEventsForMonth(y, m);
        let inc = 0, due = 0, exp = 0;
        monthlyEvents.forEach(e => {
            if (e.type === 'income') inc += e.amount;
            else if (e.type === 'expense') exp += e.amount;
            else due += e.amount;
        });
        
        incomeData.push(inc);
        dueData.push(due + exp); // expenses count as outflow
        netFlowData.push(inc - due - exp);

        tempDate.setMonth(tempDate.getMonth() + 1);
    }

    if (cashflowChart) {
        cashflowChart.destroy();
    }

    cashflowChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: '预计总收入',
                    data: incomeData,
                    backgroundColor: 'rgba(16, 185, 129, 0.25)',
                    borderColor: 'rgba(16, 185, 129, 0.8)',
                    borderWidth: 1,
                    order: 2
                },
                {
                    label: '预计需还款',
                    data: dueData,
                    backgroundColor: 'rgba(244, 63, 94, 0.25)',
                    borderColor: 'rgba(244, 63, 94, 0.8)',
                    borderWidth: 1,
                    order: 3
                },
                {
                    label: '净结余',
                    data: netFlowData,
                    type: 'line',
                    borderColor: '#3b82f6',
                    backgroundColor: '#3b82f6',
                    borderWidth: 2,
                    tension: 0.3,
                    fill: false,
                    order: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            scales: {
                y: {
                    grid: { color: 'rgba(255,255,255,0.05)' },
                    ticks: { color: '#a1a1aa' }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#a1a1aa' }
                }
            },
            plugins: {
                legend: { labels: { color: '#fafafa' } },
                tooltip: {
                    backgroundColor: 'rgba(24, 24, 27, 0.9)',
                    titleColor: '#fff',
                    bodyColor: '#a1a1aa',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderWidth: 1
                }
            }
        }
    });
}

// Data Backup & Restore
function exportData() {
    const data = {
        loans,
        incomes,
        expenses,
        paidStatuses,
        exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `LoanManager_Backup_${currentYear}${String(currentMonth+1).padStart(2,'0')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function importData(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            if (data.loans && Array.isArray(data.loans)) {
                loans = data.loans;
                incomes = data.incomes || [];
                expenses = data.expenses || [];
                paidStatuses = data.paidStatuses || {};
                saveData();
                alert('数据恢复成功！');
                renderApp();
            } else {
                alert('无效的备份文件！');
            }
        } catch (err) {
            alert('读取文件失败：' + err.message);
        }
    };
    reader.readAsText(file);
    // Reset input
    event.target.value = '';
}

// Bind backup events
document.addEventListener('DOMContentLoaded', () => {
    const expBtn = document.getElementById('export-btn');
    const impBtn = document.getElementById('import-btn');
    const impFile = document.getElementById('import-file');
    
    if (expBtn) expBtn.addEventListener('click', exportData);
    if (impBtn) impBtn.addEventListener('click', () => impFile.click());
    if (impFile) impFile.addEventListener('change', importData);
});

// Income CRUD Operations
function saveIncome() {
    const id = document.getElementById('income-id').value || generateId();
    const income = {
        id: id,
        name: document.getElementById('income-name').value,
        amount: document.getElementById('income-amount').value,
        day: document.getElementById('income-day').value ? parseInt(document.getElementById('income-day').value) : null,
        category: document.getElementById('income-category').value
    };

    const existingIndex = incomes.findIndex(i => i.id === id);
    if (existingIndex >= 0) {
        incomes[existingIndex] = income;
    } else {
        incomes.push(income);
    }

    saveData();
    closeModal('income-modal');
    renderApp();
}

window.editIncome = function(id) {
    const inc = incomes.find(i => i.id === id);
    if (!inc) return;

    document.getElementById('income-id').value = inc.id;
    document.getElementById('income-name').value = inc.name;
    document.getElementById('income-amount').value = inc.amount;
    document.getElementById('income-day').value = inc.day || '';
    document.getElementById('income-category').value = inc.category || '';

    document.getElementById('income-modal-title').innerText = '编辑收入信息';
    openModal('income-modal');
}

window.deleteIncome = function(id) {
    if(confirm('确定要删除这条收入记录吗？')) {
        incomes = incomes.filter(i => i.id !== id);
        saveData();
        renderApp();
    }
}

window.togglePaymentStatus = function(eventId) {
    if (paidStatuses[eventId]) {
        delete paidStatuses[eventId];
    } else {
        paidStatuses[eventId] = true;
    }
    saveData();
    
    // Re-render
    renderDashboard();
    
    // Update Modal
    const [, month, day] = eventId.split('_')[2].split('-');
    // Re-fetch events for this specific day to update modal view
    const allEvents = getEventsForMonth(currentYear, currentMonth);
    const dayEvents = allEvents.filter(e => e.day === parseInt(day, 10));
    openDayDetails(parseInt(day, 10), dayEvents);
}
