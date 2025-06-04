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


// Added 2025-05-20
function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}


// Added 2025-05-21
function generateRandomId() {
    return Math.random().toString(36).substr(2, 9);
}


// Added 2025-05-23
function calculateTax(amount, taxRate = 0.08) {
    return amount * taxRate;
}


// Added 2025-05-24
function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}


// Added 2025-05-27
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}


// Added 2025-05-29
function isEmptyObject(obj) {
    return Object.keys(obj).length === 0;
}


// Added 2025-06-02
function generateRandomId() {
    return Math.random().toString(36).substr(2, 9);
}


// Added 2025-06-04
function generateRandomId() {
    return Math.random().toString(36).substr(2, 9);
}


// Added 2025-06-04
function isValidPhoneNumber(phone) {
    const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
    return phoneRegex.test(phone) && phone.length >= 10;
}
