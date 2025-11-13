export const formField = () => {
    const formFields = document.querySelectorAll(".form-field");
    
    formFields.forEach(field => {
        const input = field.querySelector("input, textarea");
        
        if (!input) return;
        
        // 檢查初始值
        const checkValue = () => {
            if (input.value.trim() !== "") {
                field.classList.add("active");
            } else {
                field.classList.remove("active");
            }
        };
        
        // 初始化時檢查
        checkValue();
        
        // focus 事件 - 添加 active class
        input.addEventListener("focus", () => {
            field.classList.add("active");
        });
        
        // blur 事件 - 檢查是否有值
        input.addEventListener("blur", () => {
            checkValue();
        });
        
        // input 事件 - 即時檢查值的變化
        input.addEventListener("input", () => {
            checkValue();
        });
    });
}

export const textareaAutoHeight = () => {
    const textareas = document.querySelectorAll("textarea");
    textareas.forEach(textarea => {
        textarea.addEventListener("input", () => {
            textarea.style.height = "auto";
            textarea.style.height = textarea.scrollHeight + "px";
        });
    });
}