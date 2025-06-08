declare class PxmPhoneInput extends HTMLElement {
    input: HTMLInputElement;
    private itiInstance;
    private hiddenInput;
    constructor();
    connectedCallback(): Promise<void>;
}
