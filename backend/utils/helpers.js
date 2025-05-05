// Utility functions - Created 2025-05-01
function isEmptyObject(obj) {
    return Object.keys(obj).length === 0;
}


// Added 2025-05-05
function isValidPhoneNumber(phone) {
    const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
    return phoneRegex.test(phone) && phone.length >= 10;
}
