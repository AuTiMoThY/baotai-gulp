export const isMobile = () => {
    return window.matchMedia("(max-width: 1024px)").matches;
}