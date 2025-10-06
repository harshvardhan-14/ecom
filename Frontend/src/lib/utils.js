/**
 * Format a number as a price with currency symbol
 * @param {number} amount - The amount to format
 * @param {string} currency - The currency code (default: 'USD')
 * @returns {string} Formatted price string
 */
export const formatPrice = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

/**
 * Format a date string to a more readable format
 * @param {string} dateString - The date string to format
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

/**
 * Get color class based on status
 * @param {string} status - The status to get color for
 * @returns {string} Tailwind CSS class for the status
 */
export const getStatusColor = (status) => {
  const statusMap = {
    'pending': 'bg-yellow-100 text-yellow-800',
    'processing': 'bg-blue-100 text-blue-800',
    'shipped': 'bg-indigo-100 text-indigo-800',
    'delivered': 'bg-green-100 text-green-800',
    'cancelled': 'bg-red-100 text-red-800',
    'refunded': 'bg-purple-100 text-purple-800',
    'on-hold': 'bg-orange-100 text-orange-800',
    'completed': 'bg-green-100 text-green-800',
  };

  return statusMap[status.toLowerCase()] || 'bg-gray-100 text-gray-800';
};