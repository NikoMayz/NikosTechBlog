module.exports = {
  format_date: (date) => {
    if (!date) return ''; // Handle case where date is null or undefined

    // Check if `date` is already a Date object, otherwise parse it
    const newDate = typeof date === 'object' ? date : new Date(date);

    // Format the date as needed
    return newDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true,
    });
  },
    format_amount: (amount) => {
      // format large numbers with commas
      return parseInt(amount).toLocaleString();
    },
    get_emoji: () => {
      const randomNum = Math.random();
  
      // Return a random emoji
      if (randomNum > 0.7) {
        return `<span for="img" aria-label="lightbulb">💡</span>`;
      } else if (randomNum > 0.4) {
        return `<span for="img" aria-label="laptop">💻</span>`;
      } else {
        return `<span for="img" aria-label="gear">⚙️</span>`;
      }
    },
  };

  