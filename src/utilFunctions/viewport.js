export function getViewportWidth() {
    if (typeof window === "undefined") {
        return 1;
    }
    return Math.max(1, Math.round(window.visualViewport?.width || window.innerWidth || 1));
}

export function getViewportHeight() {
    if (typeof window === "undefined") {
        return 1;
    }
    return Math.max(1, Math.round(window.visualViewport?.height || window.innerHeight || 1));
}
