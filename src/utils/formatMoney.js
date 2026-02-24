// src/utils/formatMoney.js

function formatMoney(amount = 0, currencySymbol = '$') {
    return `${currencySymbol}${parseFloat(amount || 0).toFixed(2)}`;
}

/**
 * Format total by multiplying price × quantity
 */
function formatTotal(price = 0, quantity = 0, currencySymbol = '$') {
    const totalAmount = (price || 0) * (quantity || 0);
    return formatMoney(totalAmount, currencySymbol);
}

export { formatMoney, formatTotal };