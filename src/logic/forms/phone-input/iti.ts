import * as intlTelInput from "intl-tel-input/intlTelInputWithUtils";

const cdnHref =
    "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/25.3.1/build/css/intlTelInput.min.css";
if (!document.querySelector(`link[href="${cdnHref}"]`)) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = cdnHref;
    document.head.appendChild(link);
}

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
    const itiInstance = intlTelInput.default(input, {
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
