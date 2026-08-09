import { describe, it, expect } from "vitest";
import { pushSubscriptionSchema } from "@/lib/validations/notification";

const validSubscription = {
  endpoint: "https://fcm.googleapis.com/fcm/send/abc123",
  keys: {
    p256dh: "some-p256dh-key",
    auth: "some-auth-secret",
  },
};

describe("pushSubscriptionSchema", () => {
  it("accepts a valid subscription object", () => {
    expect(pushSubscriptionSchema.safeParse(validSubscription).success).toBe(true);
  });

  it("rejects a missing endpoint", () => {
    const { endpoint, ...rest } = validSubscription;
    void endpoint;
    expect(pushSubscriptionSchema.safeParse(rest).success).toBe(false);
  });

  it("rejects missing keys", () => {
    const result = pushSubscriptionSchema.safeParse({ endpoint: validSubscription.endpoint });
    expect(result.success).toBe(false);
  });

  it("rejects an empty p256dh key", () => {
    const result = pushSubscriptionSchema.safeParse({
      ...validSubscription,
      keys: { ...validSubscription.keys, p256dh: "" },
    });
    expect(result.success).toBe(false);
  });
});
