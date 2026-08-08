/**
 * SMS Provider interface.
 *
 * We haven't picked a real SMS panel yet (Kavenegar / ippanel / etc.),
 * so all SMS-sending code in the app depends on this interface, not a
 * specific vendor. When you pick a provider, write one more class that
 * implements `SmsProvider` and swap it in `getSmsProvider()` below.
 * Nothing else in the app needs to change.
 */
export interface SmsProvider {
  send(phoneNumber: string, message: string): Promise<void>;
}

/**
 * Dev-only implementation: just logs to the server console instead of
 * sending a real SMS. This is what you asked for — "paste the otp in
 * console for now".
 */
class ConsoleSmsProvider implements SmsProvider {
  async send(phoneNumber: string, message: string): Promise<void> {
    console.log(`\n📱 [SMS to ${phoneNumber}]: ${message}\n`);
  }
}

export function getSmsProvider(): SmsProvider {
  // Later: switch on an env var, e.g. process.env.SMS_PROVIDER === "kavenegar"
  return new ConsoleSmsProvider();
}
