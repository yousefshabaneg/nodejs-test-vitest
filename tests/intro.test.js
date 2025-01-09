import { describe, it, expect } from "vitest";
import { calculateAverage, factorial, fizzBuzz, max } from "../src/intro";

describe("max", () => {
 it("should return the first argument if it is greater", () => {
  //AAA
  //Arrange: preparing test environment including any necessary data or configuration (turn on tv)
  //Act: perform the action we want to test (press the power button)
  //Assert: check the outcome to ensure that it matches our expectations (verify tv is off)

  expect(max(2, 1)).toBe(2);
 });

 it("should return the second argument if it is greater", () => {
  expect(max(1, 2)).toBe(2);
 });

 it("should return the first argument if arguments are equal", () => {
  expect(max(2, 2)).toBe(2);
 });
});

describe("fizzBuzz", () => {
 it("should return FizzBuzz if number is divisible by 3 and 5", () => {
  expect(fizzBuzz(15)).toBe("FizzBuzz");
 });

 it("should return Fizz if number is only divisible by 3", () => {
  expect(fizzBuzz(9)).toBe("Fizz");
 });

 it("should return Buzz if number is only divisible by 5", () => {
  expect(fizzBuzz(25)).toBe("Buzz");
 });

 it("should return the number as string if it is not divisible by 3 and 5", () => {
  expect(fizzBuzz(8)).toBe("8");
 });
});

describe("factorial", () => {
 it("should return 1 if the number is 0", () => {
  expect(factorial(0)).toBe(1);
 });

 it("should return 1 if the number is 1", () => {
  expect(factorial(1)).toBe(1);
 });

 it("should return 2 if the number is 2", () => {
  expect(factorial(2)).toBe(2);
 });

 it("should return 120 if the number is 5", () => {
  expect(factorial(5)).toBe(120);
 });

 it("should return undefined if the number is any negative number", () => {
  expect(factorial(-3)).toBeUndefined();
 });
});

describe("calculateAverage", () => {
 it("should return NAN if given an empty array", () => {
  const average = calculateAverage([]);
  expect(average).toBeNaN();
 });

 it("should calculate the average of an array with a single element", () => {
  const average = calculateAverage([1]);
  expect(average).toBe(1);
 });

 it("should calculate the average of an array with a multiple element", () => {
  const average = calculateAverage([1, 2, 3]);
  expect(average).toBe(2);
 });
});
