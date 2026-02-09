const { processOrder } = require("./order");

test("applies discount when total is greater than 100", () => {
  // Arrange
  const price = 25;
  const quantity = 5;
  const expected = (115).toFixed(2);

  // Act
  const result = processOrder(price, quantity);

  // Assert
  expect(result).toBe(expected);
});

test("does not apply discount when total is 100 or less", () => {
  // Arrange
  const price = 20;
  const quantity = 4;
  const expected = (80).toFixed(2);

  // Act
  const result = processOrder(price, quantity);

  // Assert
  expect(result).toBe(expected);
});

test("applies discount when total is greater than 100 (alternate case)", () => {
  // Arrange
  const price = 30;
  const quantity = 4;
  const expected = (110).toFixed(2);

  // Act
  const result = processOrder(price, quantity);

  // Assert
  expect(result).toBe(expected);
});

test("does not apply discount when total is exactly 100", () => {
  // Arrange
  const price = 20;
  const quantity = 5;
  const expected = (100).toFixed(2);

  // Act
  const result = processOrder(price, quantity);

  // Assert
  expect(result).toBe(expected);
});

test("throws an error for negative quantity", () => {
  // Arrange
  const price = 25;
  const quantity = -1;

  // Act
  const action = () => processOrder(price, quantity);

  // Assert
  expect(action).toThrow("Price and quantity cannot be negative.");
});
