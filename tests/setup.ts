import "@testing-library/jest-dom/vitest";

// jsdom doesn't implement matchMedia — polyfill it so components using
// it (e.g. responsive breakpoint checks) don't crash in tests.
Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => { },
        removeListener: () => { },
        addEventListener: () => { },
        removeEventListener: () => { },
        dispatchEvent: () => false,
    }),
});