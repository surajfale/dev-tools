/**
 * Parse and calculate sum of numbers from input text
 * Supports comma, space, and newline separators
 */

export const calculateSum = (input) => {
  try {
    if (!input.trim()) {
      return { success: false, error: 'Input is empty' };
    }

    // Split by comma, space, newline, or any combination
    const numbers = input
      .split(/[\s,\n]+/) // Split by space, comma, or newline
      .map(str => str.trim())
      .filter(str => str.length > 0); // Remove empty strings

    if (numbers.length === 0) {
      return { success: false, error: 'No numbers found in input' };
    }

    const parsedNumbers = [];
    const invalidNumbers = [];

    // Parse each number
    for (let i = 0; i < numbers.length; i++) {
      const num = parseFloat(numbers[i]);
      if (isNaN(num)) {
        invalidNumbers.push(numbers[i]);
      } else {
        parsedNumbers.push(num);
      }
    }

    // If there are invalid numbers, report them
    if (invalidNumbers.length > 0) {
      return {
        success: false,
        error: `Invalid numbers found: ${invalidNumbers.join(', ')}`
      };
    }

    // Calculate sum
    const sum = parsedNumbers.reduce((acc, num) => acc + num, 0);

    return {
      success: true,
      result: {
        sum,
        count: parsedNumbers.length,
        numbers: parsedNumbers,
        average: sum / parsedNumbers.length,
        min: Math.min(...parsedNumbers),
        max: Math.max(...parsedNumbers)
      }
    };
  } catch (error) {
    return {
      success: false,
      error: `Calculation Error: ${error.message}`
    };
  }
};

/**
 * Format number with commas for readability
 */
export const formatNumber = (num, decimals = 2) => {
  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
};
