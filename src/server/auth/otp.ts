import bcrypt from "bcryptjs";
import { OTP_LENGTH } from "./constants";

/** Generates a random numeric OTP string, e.g. "482913" */
export function generateOtp(): string {
  let code = "";
  for (let i = 0; i < OTP_LENGTH; i++) {
    code += Math.floor(Math.random() * 10).toString();
  }
  return code;
}

/** We never store the OTP in plain text — hash it, same as a password. */
export async function hashOtp(code: string): Promise<string> {
  return bcrypt.hash(code, 10);
}

export async function verifyOtp(code: string, hash: string): Promise<boolean> {
  return bcrypt.compare(code, hash);
}
