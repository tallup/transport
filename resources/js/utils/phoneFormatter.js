/**
 * Formats a phone number to US format: (XXX) XXX-XXXX
 * @param {string} value - The phone number string
 * @returns {string} - Formatted phone number
 */
export function formatPhoneNumber(value) {
    // Remove all non-numeric characters
    const phoneNumber = value.replace(/\D/g, '');
    
    // Format based on length
    if (phoneNumber.length === 0) return '';
    if (phoneNumber.length <= 3) return `(${phoneNumber}`;
    if (phoneNumber.length <= 6) return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    
    // Full format: (XXX) XXX-XXXX
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
}

/**
 * Removes formatting from phone number for storage
 * @param {string} value - The formatted phone number string
 * @returns {string} - Unformatted phone number (digits only)
 */
export function unformatPhoneNumber(value) {
    return value.replace(/\D/g, '');
}

/**
 * Handles phone number input change
 * Formats the display value but stores unformatted value
 * @param {Event} e - The input change event
 * @param {Function} setData - Function to update form data
 * @param {string} fieldName - Name of the field to update
 */
export function handlePhoneChange(e, setData, fieldName) {
    const inputValue = e.target.value;
    const formatted = formatPhoneNumber(inputValue);
    
    // Store the unformatted value (digits only)
    const unformatted = unformatPhoneNumber(inputValue);
    
    // Update the field with formatted display value
    // Note: We'll store unformatted, but display formatted
    setData(fieldName, formatted);
}




