"use client";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import type { ProductOptionDTO } from "@/types/product";

/**
 * Renders one <Select> per product option (e.g. رنگ, سایز — or however many
 * option types this product actually has). Dynamic per options[], not
 * hardcoded to color/size like the design reference.
 */
export function VariantPicker({
    options,
    selected,
    onChange,
}: {
    options: ProductOptionDTO[];
    selected: Record<string, string>;
    onChange: (optionName: string, value: string) => void;
}) {
    if (options.length === 0) return null;

    return (
        <>
            {options.map((option) => (
                <Select
                    key={option.id}
                    value={selected[option.name] ?? ""}
                    onValueChange={(value) => onChange(option.name, value)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder={`انتخاب ${option.name}`} />
                    </SelectTrigger>

                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>{option.name}</SelectLabel>
                            {option.values.map((v) => (
                                <SelectItem key={v.id} value={v.value}>
                                    {v.value}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            ))}
        </>
    );
}