import intlTelInput from "intl-tel-input/intlTelInputWithUtils";

export const iti = ({
    input,
    initialCountry = "us",
    separateDialCode = true,
    formatOnDisplay = true,
}: {
    input: HTMLInputElement;
    initialCountry?: string;
    separateDialCode?: boolean;
    formatOnDisplay?: boolean;
}) => {
    let itiFunction;

    // Try npm import first
    if (typeof intlTelInput === 'function') {
        itiFunction = intlTelInput;
    }
    // Handle default export
    else if (intlTelInput && typeof (intlTelInput as any).default === 'function') {
        itiFunction = (intlTelInput as any).default;
    }
    // Fallback to CDN global
    else if (typeof (window as any).intlTelInput === 'function') {
        itiFunction = (window as any).intlTelInput;
        
        // Load CSS for CDN usage
        const cdnHref = "https://cdn.jsdelivr.net/npm/intl-tel-input@25/build/css/intlTelInput.css";
        if (!document.querySelector(`link[href="${cdnHref}"]`)) {
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = cdnHref;
            document.head.appendChild(link);
        }
    }

    if (!itiFunction) {
        throw new Error('intl-tel-input not found. Install via npm or include via CDN.');
    }

    const itiInstance = itiFunction(input, {
        initialCountry,
        separateDialCode,
        formatOnDisplay,
    });

    input.addEventListener("input", (e) => {
        const inputEl = e.target;
        if (inputEl instanceof HTMLInputElement) {
            inputEl.setAttribute("data-full-phone", itiInstance.getNumber());
        }
    });

    return itiInstance;
};
