// Import dependency injector
import { injectComponentDependencies } from '../dependency-injector';

class PxmPhoneInput extends HTMLElement {
    input: HTMLInputElement;
    private itiInstance: any;
    private hiddenInput: HTMLInputElement;

    constructor() {
        super();

        if (!this.querySelector("input")) {
            throw new Error("pxm-phone-input must have an input");
        }

        this.input = this.querySelector("input") as HTMLInputElement;

        // Create hidden input for the full number
        this.hiddenInput = document.createElement("input");
        this.hiddenInput.type = "hidden";
        this.hiddenInput.name = this.input.name + "_full";
        this.appendChild(this.hiddenInput);
    }

    async connectedCallback() {
        try {
            // Try to inject dependencies (will be ignored if not needed)
            await injectComponentDependencies('phone-input');
        } catch (error) {
            console.warn('Failed to inject dependencies:', error);
        }

        const { iti } = await import("./iti");
        
        this.itiInstance = iti({
            input: this.input,
            initialCountry: this.dataset.initialCountry || "ae",
            separateDialCode: this.dataset.separateDialCode === "true",
            formatOnDisplay: this.dataset.formatOnDisplay === "true",
        });

        // Update hidden input when the number changes
        this.input.addEventListener("input", () => {
            const fullNumber = this.itiInstance.getNumber();
            if (fullNumber) {
                this.hiddenInput.value = fullNumber;
            }
        });
    }
}

customElements.define("pxm-phone-input", PxmPhoneInput);
