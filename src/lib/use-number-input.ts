"use client";

import { useState } from "react";

const PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹";
const ARABIC_DIGITS = "٠١٢٣٤٥٦٧٨٩";

export function normalizeDigits(value: string) {
    return value
        .replace(/[۰-۹]/g, (digit) => {
            return String(PERSIAN_DIGITS.indexOf(digit));
        })
        .replace(/[٠-٩]/g, (digit) => {
            return String(ARABIC_DIGITS.indexOf(digit));
        });
}

export function formatNumber(value: string | number) {
    const normalized = normalizeDigits(String(value));

    const digits = normalized.replace(/\D/g, "");

    if (!digits) return "";

    return Number(digits).toLocaleString("en-US");
}

export function getRawNumber(value: string) {
    const normalized = normalizeDigits(value);
    const digits = normalized.replace(/\D/g, "");

    return digits;
}

export function useNumberInput(initialValue = "") {
    const [value, setValue] = useState(() =>
        formatNumber(initialValue)
    );

    const onChange = (inputValue: string) => {
        setValue(formatNumber(inputValue));
    };

    return {
        value,
        onChange,
        rawValue: getRawNumber(value),
    };
}