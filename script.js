document.addEventListener('DOMContentLoaded', function() {
    const calculateBtn = document.getElementById('calculate-btn');
    const purchasePriceInput = document.getElementById('purchase-price');
    const monthlyPaymentInput = document.getElementById('monthly-payment');
    const resultDiv = document.getElementById('result');
    const themeToggleBtn = document.getElementById('theme-toggle');
    
    // Theme toggle functionality
    themeToggleBtn.addEventListener('click', () => {
        // Check if the current theme is dark
        const isDarkTheme = document.documentElement.getAttribute('data-theme') === 'dark';
        
        if (isDarkTheme) {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        }
    });
    
    // Check for saved theme preference or respect OS preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (savedTheme === null && prefersDark)) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }

    // Enable live calculations
    const liveInputs = document.querySelectorAll('[data-live-calc="true"]');
    liveInputs.forEach(input => {
        input.addEventListener('input', debounce(calculatePayback, 300));
    });

    // Keep the button for accessibility and fallback
    calculateBtn.addEventListener('click', calculatePayback);

    // Debounce function to prevent excessive calculations during typing
    function debounce(func, delay) {
        let timeout;
        return function() {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, arguments), delay);
        };
    }

    function calculatePayback() {
        // Get input values
        const purchasePrice = parseFloat(purchasePriceInput.value);
        const monthlyPayment = parseFloat(monthlyPaymentInput.value);
        
        // Check if both inputs have values before calculating
        if (!purchasePriceInput.value || !monthlyPaymentInput.value) {
            resultDiv.innerHTML = '<p>Enter both values to see the payback period</p>';
            return;
        }
        
        // Validate inputs
        if (isNaN(purchasePrice) || purchasePrice <= 0) {
            resultDiv.innerHTML = '<p class="error">Please enter a valid purchase price</p>';
            return;
        }
        
        if (isNaN(monthlyPayment) || monthlyPayment <= 0) {
            resultDiv.innerHTML = '<p class="error">Please enter a valid monthly payment</p>';
            return;
        }

        // Calculate payback period
        const months = purchasePrice / monthlyPayment;
        const wholeMonths = Math.floor(months);
        const remainingDays = Math.round((months - wholeMonths) * 30); // Approximating a month as 30 days

        // Format the result message
        let resultMessage = '';
        
        if (months <= 1) {
            resultMessage = `Payback period: ${months.toFixed(1)} months`;
        } else if (remainingDays === 0) {
            resultMessage = `Payback period: ${wholeMonths} months`;
        } else {
            resultMessage = `Payback period: ${wholeMonths} months and ${remainingDays} days`;
        }
        
        // Display the result
        resultDiv.innerHTML = `<p>${resultMessage}</p>`;
    }
});
