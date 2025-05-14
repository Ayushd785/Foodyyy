// Utility functions - Created 2025-05-09
function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}


// Added 2025-05-13
function calculateTax(amount, taxRate = 0.08) {
    return amount * taxRate;
}


// Added 2025-05-14
function generateRandomId() {
    return Math.random().toString(36).substr(2, 9);
}
