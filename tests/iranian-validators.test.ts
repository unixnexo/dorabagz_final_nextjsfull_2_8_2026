import { describe, it, expect } from "vitest";
import {
  isValidIranianPhoneNumber,
  isValidIranianNationalCode,
} from "@/lib/iranian-validators";

describe("isValidIranianPhoneNumber", () => {
  it("accepts a valid 11-digit number starting with 09", () => {
    expect(isValidIranianPhoneNumber("09123456789")).toBe(true);
  });

  it("rejects numbers not starting with 09", () => {
    expect(isValidIranianPhoneNumber("08123456789")).toBe(false);
  });

  it("rejects numbers with wrong length", () => {
    expect(isValidIranianPhoneNumber("0912345678")).toBe(false);
    expect(isValidIranianPhoneNumber("091234567890")).toBe(false);
  });

  it("rejects non-numeric input", () => {
    expect(isValidIranianPhoneNumber("09abcdefghi")).toBe(false);
  });
});

describe("isValidIranianNationalCode", () => {
  it("accepts a valid national code", () => {
    // 0499370899 is a well-known valid test national code (checksum passes)
    expect(isValidIranianNationalCode("0499370899")).toBe(true);
  });

  it("rejects repeated-digit codes even if length is correct", () => {
    expect(isValidIranianNationalCode("1111111111")).toBe(false);
  });

  it("rejects wrong length", () => {
    expect(isValidIranianNationalCode("12345")).toBe(false);
  });

  it("rejects codes with an invalid checksum", () => {
    expect(isValidIranianNationalCode("1234567890")).toBe(false);
  });
});
