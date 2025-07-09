// Lesson: Writing your first tests
export function max(a, b) {
  return a > b ? a : b;
}

// Exercise
export function fizzBuzz(n) {
  if (n % 3 === 0 && n % 5 === 0) return "FizzBuzz";
  if (n % 3 === 0) return "Fizz";
  if (n % 5 === 0) return "Buzz";
  return n.toString();
}

export function factorial(n) {
  if (n < 0) return undefined;
  if (n === 0 || n === 1) return 1;

  return factorial(n - 1) * n;
}

export function calculateAverage(arr) {
  if (arr.length === 0) return NaN;
  if (arr.length === 1) {
    return arr[0];
  }

  return arr.reduce((a, b) => a + b, 0) / arr.length;
}
