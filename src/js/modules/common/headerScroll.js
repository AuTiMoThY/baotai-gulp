export const headerScroll = {
    init() {
        window.addEventListener("scroll", function () {
            const header = document.querySelector(".header");

            if (window.scrollY > 50) {
                header.classList.add("transparent");
            } else {
                header.classList.remove("transparent");
            }
        });
    }
};

