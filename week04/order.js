console.info("Program startup: order module loaded.");

function calculateTotal(price, quantity) {
  return price * quantity;
}

function applyDiscount(total) {
  const discount = 10;
  if (total > 100) {
    return total - discount;
    // Original bug: ReferenceError on line 10 because `discount` was not defined; root cause was a missing discount value.
  }
  return total;
}

function validateInputs(price, quantity) {
  if (!Number.isFinite(price) || !Number.isFinite(quantity)) {
    const error = new Error("Price and quantity must be valid numbers.");
    console.error("Invalid input: price and quantity must be numbers.");
    throw error;
  }
  if (price < 0 || quantity < 0) {
    const error = new Error("Price and quantity cannot be negative.");
    console.error("Invalid input: price and quantity cannot be negative.");
    throw error;
  }
}

function processOrder(price, quantity) {
  console.info(`Inputs received: price=$${price}, quantity=${quantity}.`);
  validateInputs(price, quantity);

  const total = calculateTotal(price, quantity);
  console.info(`Calculated total: $${total}.`);

  const discounted = applyDiscount(total);
  if (discounted < total) {
    console.info("Discount applied: $10 off because total exceeded $100.");
  } else {
    console.warn("No discount applied: total did not exceed $100.");
  }

  const result = discounted.toFixed(2);
  console.info(`Final total after discounts: $${result}.`);
  return result;
}

module.exports = {
  calculateTotal,
  applyDiscount,
  processOrder
};

console.log(processOrder(25, 5));
