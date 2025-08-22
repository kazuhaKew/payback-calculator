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
        const totalMonths = purchasePrice / monthlyPayment;
        
        // Calculate years, months, days and minutes
        const years = Math.floor(totalMonths / 12);
        const remainingMonths = Math.floor(totalMonths % 12);
        
        // Calculate days from the decimal part of months (assuming 30 days in a month)
        const monthDecimal = totalMonths - Math.floor(totalMonths);
        const days = Math.floor(monthDecimal * 30);
        
        // Calculate minutes from the remaining decimal part
        const dayDecimal = monthDecimal * 30 - days;
        const minutes = Math.round(dayDecimal * 24 * 60);

        // Format the result message
        let resultMessage = 'Payback period: ';
        
        if (years > 0) {
            resultMessage += `${years} year${years > 1 ? 's' : ''} `;
        }
        
        if (remainingMonths > 0 || (years === 0 && remainingMonths === 0)) {
            resultMessage += `${remainingMonths} month${remainingMonths !== 1 ? 's' : ''} `;
        }
        
        if (days > 0) {
            resultMessage += `${days} day${days !== 1 ? 's' : ''} `;
        }
        
        if (minutes > 0) {
            resultMessage += `${minutes} minute${minutes !== 1 ? 's' : ''}`;
        }
        
        // Display the result with animation
        resultDiv.classList.add('updating');
        resultDiv.innerHTML = `<p>${resultMessage}</p>`;
        
        // Remove animation class after transition completes
        setTimeout(() => {
            resultDiv.classList.remove('updating');
        }, 300);
    }
});
