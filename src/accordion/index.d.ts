/**
 * PXM Accordion Component
 *
 * A simple, accessible accordion component that allows users to expand/collapse content sections.
 * Each accordion item consists of a trigger and content section.
 */
export declare class PxmAccordion extends HTMLElement {
    private config;
    private state;
    private items;
    /**
     * Observed attributes for the custom element
     */
    static get observedAttributes(): string[];
    constructor();
    /**
     * Called when the element is added to the DOM
     */
    connectedCallback(): void;
    /**
     * Called when an observed attribute changes
     */
    attributeChangedCallback(name: string, oldValue: string, newValue: string): void;
    /**
     * Initialize configuration from HTML attributes
     */
    private initializeFromAttributes;
    /**
     * Set up accordion items with event listeners
     */
    private setupItems;
    /**
     * Focus the previous accordion item
     */
    private focusPreviousItem;
    /**
     * Focus the next accordion item
     */
    private focusNextItem;
    /**
     * Focus the first accordion item
     */
    private focusFirstItem;
    /**
     * Focus the last accordion item
     */
    private focusLastItem;
    /**
     * Update icon rotations for all items
     */
    private updateIconRotations;
    /**
     * Update icon rotation for a specific item
     */
    private updateIconRotation;
    /**
     * Toggle an accordion item's state
     */
    private toggleItem;
    /**
     * Expand an accordion item
     */
    private expandItem;
    /**
     * Collapse an accordion item
     */
    private collapseItem;
}
