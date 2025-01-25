import { describe, it, expect, afterEach, beforeEach } from "vitest";
import {
 getCoupons,
 calculateDiscount,
 validateUserInput,
 isPriceInRange,
 isValidUsername,
 canDrive,
 Stack,
} from "../src/core";

describe("getCoupons", () => {
 it("should return an array of coupons", () => {
  const coupons = getCoupons();
  expect(Array.isArray(coupons)).toBe(true);
  expect(coupons.length).toBeGreaterThanOrEqual(0);
 });

 it("should return an array with valid coupon codes", () => {
  const coupons = getCoupons();
  for (const coupon of coupons) {
   expect(coupon).toHaveProperty("code");
   expect(typeof coupon.code).toEqual("string");
   expect(coupon.code).toBeTruthy();
  }
 });

 it("should return an array with valid coupon discounts", () => {
  const coupons = getCoupons();
  for (const coupon of coupons) {
   expect(coupon).toHaveProperty("discount");
   expect(typeof coupon.discount).toEqual("number");
   expect(coupon.discount).toBeGreaterThan(0);
   expect(coupon.discount).toBeLessThan(1);
  }
 });
});

describe("calculateDiscount", () => {
 it("should return discounted price if given a valid code", () => {
  expect(calculateDiscount(10, "SAVE10")).toBe(9);
  expect(calculateDiscount(10, "SAVE20")).toBe(8);
 });

 it("should handle non-numeric price", () => {
  expect(calculateDiscount("10", "SAVE10")).toMatch(/invalid/i);
 });

 it("should handle negative price", () => {
  expect(calculateDiscount(-10, "SAVE10")).toMatch(/invalid/i);
 });

 it("should handle non-string discount code", () => {
  expect(calculateDiscount(10, 10)).toMatch(/invalid/i);
 });

 it("should handle invalid discount code", () => {
  expect(calculateDiscount(10, "INVALID")).toEqual(10);
 });
});

describe("validateUserInput", () => {
 it("should return success if given a valid input", () => {
  expect(validateUserInput("username", 25)).toMatch(/success/i);
 });
 it("should return of invalid username if username non-string", () => {
  expect(validateUserInput(123, 18)).toMatch(/Invalid/i);
 });

 it("should return an error of invalid username if its length < 3", () => {
  expect(validateUserInput("us", 18)).toMatch(/Invalid/i);
 });

 it("should return an error of invalid username if username length > 255", () => {
  expect(validateUserInput("A".repeat(256), 18)).toMatch(/Invalid/i);
 });

 it("should return an error of invalid age if age not a number", () => {
  expect(validateUserInput("username", "19")).toMatch(/Invalid/i);
 });

 it("should return an error of invalid age if age < 18", () => {
  expect(validateUserInput("username", 10)).toMatch(/Invalid/i);
 });

 it("should return an error of invalid age if age > 100", () => {
  expect(validateUserInput("username", 101)).toMatch(/Invalid/i);
 });

 it("should return an error of invalid username and age", () => {
  expect(validateUserInput("", 0)).toMatch(/Invalid username/i);
  expect(validateUserInput("", 0)).toMatch(/Invalid age/i);
 });
});

describe("isPriceInRange", () => {
 it.each([
  {
   scenario: "price < min",
   price: -10,
   result: false,
  },
  { scenario: "price = min", price: 0, result: true },
  {
   scenario: "price between min and max",
   price: 100,
   min: 50,
   max: 100,
   result: true,
  },
  { scenario: "price = min", price: 100, result: true },
  { scenario: "price > max", price: 200, result: false },
 ])("Should return $result if $scenario", ({ price, result }) => {
  expect(isPriceInRange(price, 0, 100)).toBe(result);
 });
});

describe("isValidUsername", () => {
 const minLength = 5;
 const maxLength = 15;
 it("Should return false if the username length less than the minLength", () => {
  expect(isValidUsername("A".repeat(minLength - 1))).toBe(false);
 });
 it("Should return false if the username length greater than maxLength", () => {
  expect(isValidUsername("A".repeat(maxLength + 1))).toBe(false);
 });
 it("Should return true if the username length is at the min or max length", () => {
  expect(isValidUsername("A".repeat(minLength))).toBe(true);
  expect(isValidUsername("A".repeat(maxLength))).toBe(true);
 });
 it("Should return true if the username length is between min and max length", () => {
  expect(isValidUsername("A".repeat(minLength + 1))).toBe(true);
  expect(isValidUsername("A".repeat(maxLength - 1))).toBe(true);
 });
 it("Should return false for invalid input types", () => {
  expect(isValidUsername(null)).toBe(false);
 });
});

describe("canDrive", () => {
 it.each([
  {
   age: 15,
   country: "US",
   result: false,
  },
  {
   age: 16,
   country: "US",
   result: true,
  },
  {
   age: 17,
   country: "US",
   result: true,
  },
  {
   age: 16,
   country: "UK",
   result: false,
  },
  {
   age: 17,
   country: "UK",
   result: true,
  },
  {
   age: 18,
   country: "UK",
   result: true,
  },
 ])("should return $result for $age, $country", ({ age, country, result }) => {
  expect(canDrive(age, country)).toBe(result);
 });

 it("Should return an error for invalid country code", () => {
  expect(canDrive(20, "EG")).toMatch(/invalid/i);
 });
});

describe("Stack Class", () => {
 let stack;

 beforeEach(() => {
  stack = new Stack();
 });

 it("should push items onto the stack", () => {
  stack.push(1);
  stack.push(2);
  stack.push(3);
  expect(stack.size()).toBe(3);
 });

 it("should pop the last item of the stack", () => {
  stack.push(1);
  const element = stack.pop();
  expect(element).toBe(1);
  expect(stack.isEmpty()).toBe(true);
 });

 it("should get the last item of the stack without remove it", () => {
  stack.push(1);
  const element = stack.peek();
  expect(element).toBe(1);
  expect(stack.size()).toBe(1);
 });

 it("should throw an error if the stack is empty", () => {
  expect(() => stack.pop()).toThrow(/empty/i);
  expect(() => stack.peek()).toThrow(/empty/i);
 });

 it("should return true if the stack is empty", () => {
  expect(stack.isEmpty()).toBe(true);
 });

 it("should return false if the stack is not empty", () => {
  stack.push(1);
  expect(stack.isEmpty()).toBe(false);
 });

 it("Should return the size of the stack", () => {
  stack.push(1);
  stack.push(2);
  expect(stack.size()).toBe(2);
 });

 it("Should clear the stack", () => {
  stack.push(1);
  stack.push(2);
  stack.clear();
  expect(stack.size()).toBe(0);
 });
});
