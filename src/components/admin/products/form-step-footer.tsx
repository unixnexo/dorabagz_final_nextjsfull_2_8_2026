"use client";

export function FormStepFooter({
    isFirstStep,
    isLastStep,
    isSubmitting,
    nextDisabled,
    onBack,
    onNext,
}: {
    isFirstStep: boolean;
    isLastStep: boolean;
    isSubmitting: boolean;
    nextDisabled?: boolean;
    onBack: () => void;
    onNext: () => void;
}) {
    return (
        <div className="sticky bottom-0 -mx-4 mt-6 border-t border-[#E5E5EA] bg-[#F2F2F7]/90 px-4 pb-[calc(env(safe-area-inset-bottom)+14px)] pt-3 backdrop-blur-md">
            <div className="flex gap-2.5">
                {!isFirstStep && (
                    <button
                        type="button"
                        onClick={onBack}
                        className="flex-1 rounded-2xl bg-black/[0.05] py-3.5 text-[14.5px] font-semibold text-[#1C1C1E] active:bg-black/[0.08]"
                    >
                        قبلی
                    </button>
                )}
                <button
                    type="button"
                    onClick={onNext}
                    disabled={nextDisabled || isSubmitting}
                    className="flex-[2] rounded-2xl bg-brand-primary py-3.5 text-[14.5px] font-semibold text-white active:opacity-90 disabled:opacity-50"
                >
                    {isSubmitting
                        ? "در حال ذخیره..."
                        : isLastStep
                            ? "ذخیره محصول"
                            : "مرحله بعد"}
                </button>
            </div>
        </div>
    );
}