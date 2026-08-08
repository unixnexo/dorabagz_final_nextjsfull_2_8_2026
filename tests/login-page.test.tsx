import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginPage from "@/app/login/page";

// Server actions can't actually run in a jsdom test environment (no DB,
// no Next.js server runtime) — so we mock the module. This is the standard
// way to unit-test a component that calls a server action: replace the
// action with a fake function and assert the component reacts correctly
// to its return value.
vi.mock("@/server/auth/actions", () => ({
  requestOtpAction: vi.fn(),
  verifyOtpAction: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));

import { requestOtpAction, verifyOtpAction } from "@/server/auth/actions";

describe("LoginPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows the phone number step first", () => {
    render(<LoginPage />);
    expect(screen.getByLabelText("شماره موبایل")).toBeInTheDocument();
  });

  it("moves to the OTP step after a successful otp request", async () => {
    vi.mocked(requestOtpAction).mockResolvedValue({
      success: true,
      data: { phoneNumber: "09123456789" },
    });

    const user = userEvent.setup();
    render(<LoginPage />);

    await user.type(screen.getByLabelText("شماره موبایل"), "09123456789");
    await user.click(screen.getByRole("button", { name: "دریافت کد" }));

    await waitFor(() => {
      expect(screen.getByLabelText("کد تایید")).toBeInTheDocument();
    });
    expect(requestOtpAction).toHaveBeenCalledWith({ phoneNumber: "09123456789" });
  });

  it("shows a server error message when otp request fails", async () => {
    vi.mocked(requestOtpAction).mockResolvedValue({
      success: false,
      error: "شماره موبایل معتبر نیست",
    });

    const user = userEvent.setup();
    render(<LoginPage />);

    await user.type(screen.getByLabelText("شماره موبایل"), "invalid");
    await user.click(screen.getByRole("button", { name: "دریافت کد" }));

    await waitFor(() => {
      expect(screen.getByText("شماره موبایل معتبر نیست")).toBeInTheDocument();
    });
  });

  it("calls verifyOtpAction with phone and code on the second step", async () => {
    vi.mocked(requestOtpAction).mockResolvedValue({
      success: true,
      data: { phoneNumber: "09123456789" },
    });
    vi.mocked(verifyOtpAction).mockResolvedValue({
      success: true,
      data: {
        user: {
          id: "1",
          phoneNumber: "09123456789",
          fullName: null,
          nationalCode: null,
          birthDate: null,
          email: null,
          profilePicUrl: null,
          role: "USER",
          isActive: true,
          createdAt: new Date().toISOString(),
          lastLoginAt: null,
        },
      },
    });

    const user = userEvent.setup();
    render(<LoginPage />);

    await user.type(screen.getByLabelText("شماره موبایل"), "09123456789");
    await user.click(screen.getByRole("button", { name: "دریافت کد" }));
    await waitFor(() => screen.getByLabelText("کد تایید"));

    await user.type(screen.getByLabelText("کد تایید"), "482913");
    await user.click(screen.getByRole("button", { name: "ورود" }));

    await waitFor(() => {
      expect(verifyOtpAction).toHaveBeenCalledWith({
        phoneNumber: "09123456789",
        code: "482913",
      });
    });
  });
});
