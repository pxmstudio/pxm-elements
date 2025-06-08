declare class PxmTabs extends HTMLElement {
    private triggersWrap;
    private triggers;
    private panels;
    constructor();
    connectedCallback(): void;
    private handleTriggerClick;
    private handleKeyDown;
    private activateTab;
}
