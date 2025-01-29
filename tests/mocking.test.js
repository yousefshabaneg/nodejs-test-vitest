import { vi, it, expect, describe } from "vitest";
import {
 getPriceInCurrency,
 getShippingInfo,
 renderPage,
 submitOrder,
} from "../src/mocking";
import { getExchangeRate } from "../src/libs/currency";
import { getShippingQuote } from "../src/libs/shipping";
import { trackPageView } from "../src/libs/analytics";
import { charge } from "../src/libs/payment";

// Hoisting
vi.mock("../src/libs/currency");
vi.mock("../src/libs/shipping");
vi.mock("../src/libs/analytics");
vi.mock("../src/libs/payment");

describe("test suite", () => {
 it("test case", () => {
  const greet = vi.fn();
  greet.mockImplementation((name) => `Hello ${name}`);
  const result = greet("yousef");
  expect(result).toBe("Hello yousef");
  expect(greet).toHaveBeenCalledWith("yousef");
 });

 it("should mocking the sendText", () => {
  const sendText = vi.fn();
  sendText.mockReturnValue("ok");
  const result = sendText("message");
  expect(sendText).toHaveBeenCalledOnce();
  expect(result).toBe("ok");
 });
});

describe("getPriceInCurrency", () => {
 it("should return price in target currency", () => {
  vi.mocked(getExchangeRate).mockReturnValue(1.5);
  const price = getPriceInCurrency(10, "EGP");
  expect(price).toBe(15);
 });
});

describe("getShippingInfo", () => {
 it("should return shipping unavailable if quote not exist", () => {
  vi.mocked(getShippingQuote).mockReturnValue(undefined);
  const result = getShippingInfo("Cairo");
  expect(result).toMatch(/unavailable/i);
 });

 it("should return shipping info if quote exist", () => {
  vi.mocked(getShippingQuote).mockReturnValue({ cost: 10, estimatedDays: 3 });
  const result = getShippingInfo("Cairo");
  expect(result).toMatch("$10");
  expect(result).toMatch(/3 days/i);
 });
});

describe("renderPage", () => {
 it("should return correct content", async () => {
  const result = await renderPage();
  expect(result).toMatch(/content/i);
 });

 it("should call analytics", async () => {
  await renderPage();
  expect(trackPageView).toBeCalledWith("/home");
 });
});

describe("submitOrder", () => {
 const order = { totalAmount: 10 };
 const creditCard = { creditCardNumber: "1234" };
 it("should charge the customer", async () => {
  vi.mocked(charge).mockResolvedValue({ status: "success" });
  const result = await submitOrder(order, creditCard);
  expect(charge).toBeCalledWith(creditCard, order.totalAmount);
 });
 it("should return success when payment is successful", async () => {
  vi.mocked(charge).mockResolvedValue({ status: "success" });
  const result = await submitOrder(order, creditCard);
  expect(result).toEqual({ success: true });
 });

 it("should return success false when payment is failed", async () => {
  vi.mocked(charge).mockResolvedValue({ status: "failed" });
  const result = await submitOrder(order, creditCard);
  expect(result).toEqual({ success: false, error: "payment_error" });
 });
});
