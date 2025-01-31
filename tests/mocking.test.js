import { vi, it, expect, describe } from "vitest";
import {
 getDiscount,
 getPriceInCurrency,
 getShippingInfo,
 isOnline,
 login,
 renderPage,
 signUp,
 submitOrder,
} from "../src/mocking";
import { getExchangeRate } from "../src/libs/currency";
import { getShippingQuote } from "../src/libs/shipping";
import { trackPageView } from "../src/libs/analytics";
import { charge } from "../src/libs/payment";
import { sendEmail } from "../src/libs/email";
import security from "../src/libs/security";

// Hoisting
vi.mock("../src/libs/currency");
vi.mock("../src/libs/shipping");
vi.mock("../src/libs/analytics");
vi.mock("../src/libs/payment");
vi.mock("../src/libs/email", async (importOriginal) => {
 const originalModule = await importOriginal();
 return {
  ...originalModule,
  sendEmail: vi.fn(),
 };
});

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

describe("signUp", () => {
 const email = "email@email.com";

 it("should return false if email is not valid", async () => {
  const result = await signUp("a");
  expect(result).toBe(false);
 });

 it("should return true if email is valid", async () => {
  const result = await signUp(email);
  expect(result).toBe(true);
 });

 it("should send the Welcome email if email is valid", async () => {
  const result = await signUp(email);
  expect(sendEmail).toHaveBeenCalledOnce();
  const args = vi.mocked(sendEmail).mock.calls[0];
  expect(args[0]).toBe(email);
  expect(args[1]).toMatch(/welcome/i);
 });
});

describe("login", () => {
 const email = "yousef@gmail.com";
 it("should email the one-time login code", async () => {
  const spy = vi.spyOn(security, "generateCode");

  await login(email);

  const securityCode = spy.mock.results[0].value.toString();
  expect(sendEmail).toHaveBeenCalledWith(email, securityCode);
 });
});

describe("isOpen", () => {
 it("should return false if the time is not within opening hours", () => {
  vi.setSystemTime("2024-01-01 07:59");
  expect(isOnline()).toBe(false);

  vi.setSystemTime("2024-01-01 20:01");
  expect(isOnline()).toBe(false);
 });

 it("should return true if the time is within opening hours", () => {
  vi.setSystemTime("2024-01-01 08:00");
  expect(isOnline()).toBe(true);
 });
});

describe("getDiscount", () => {
 it("should return 0 if the date is not christmas day", () => {
  vi.setSystemTime("2024-01-01 00:00");
  expect(getDiscount()).toBe(0);

  vi.setSystemTime("2024-11-24 23:59");
  expect(getDiscount()).toBe(0);
 });

 it("should return discount if the date is christmas day", () => {
  vi.setSystemTime("2024-12-25 00:00");
  expect(getDiscount()).toBe(0.2);
 });
});
