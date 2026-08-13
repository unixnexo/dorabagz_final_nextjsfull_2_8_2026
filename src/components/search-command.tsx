"use client";

import * as React from "react";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";

type SearchCommandProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export function SearchCommand({
    open,
    onOpenChange,
}: SearchCommandProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                dir="rtl"
                className="top-[12%] w-[calc(100%-32px)] max-w-[468px] translate-y-0 overflow-hidden rounded-[28px] border-0 bg-white p-0 shadow-xl"
            >
                <Command className="rounded-[28px]">
                    <CommandInput
                        placeholder="جستجوی محصول..."
                        className="h-14 text-right"
                    />

                    <CommandList className="max-h-[70dvh] px-2 pb-3">
                        <CommandEmpty>
                            محصولی پیدا نشد.
                        </CommandEmpty>

                        <CommandGroup heading="محصولات">
                            {/* 
                                بعداً محصولات خودت را اینجا می‌گذاری.

                                مثال:

                                <CommandItem>
                                    تیشرت لوگو دار
                                </CommandItem>
                            */}

                            <CommandItem value="تیشرت لوگو دار">
                                تیشرت لوگو دار
                            </CommandItem>

                            <CommandItem value="شلوارک جین">
                                شلوارک جین
                            </CommandItem>

                            <CommandItem value="هودی ساده">
                                هودی ساده
                            </CommandItem>
                        </CommandGroup>
                    </CommandList>
                </Command>
            </DialogContent>
        </Dialog>
    );
}