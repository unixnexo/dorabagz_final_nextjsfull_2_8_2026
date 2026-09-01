"use client";

import type { ComponentProps } from "react";
import { TextInput } from "./admin/coupons/form-field";

type FormattedNumberInputProps = Omit<
    ComponentProps<typeof TextInput>,
    "value" | "onChange" | "type"
> & {
    value: number | "";
    onChange: (value: number | "") => void;
};

export function FormattedNumberInput({
    value,
    onChange,
    ...props
}: FormattedNumberInputProps) {
    const displayValue =
        value === "" ? "" : value.toLocaleString("en-US");

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const raw = e.target.value
            .replace(/,/g, "")
            .replace(/\D/g, "");

        if (raw === "") {
            onChange("");
            return;
        }

        onChange(Number(raw));
    }

    return (
        <TextInput
            {...props}
            type="text"
            inputMode="numeric"
            value={displayValue}
            onChange={handleChange}
        />
    );
}