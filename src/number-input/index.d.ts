declare class PxmNumberInput extends HTMLElement {
    private minusButton;
    private plusButton;
    private input;
    constructor();
    connectedCallback(): void;
    private updateDisabledStates;
    onInputChange(e: Event): void;
    increment(): void;
    decrement(): void;
}
