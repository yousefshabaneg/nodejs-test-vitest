import { describe, it, expect } from "vitest";
import { getCoupons, calculateDiscount, validateUserInput } from "../src/core";

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
