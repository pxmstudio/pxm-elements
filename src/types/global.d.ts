/**
 * Extends the Window interface to include custom global properties used in the application.
 */
interface Window {
    Swiper?: any;

    /** Webflow API instance array */
    Webflow: any[];
    /** Environment variables exposed to the client */
    Env: {
        /** Google reCAPTCHA v3 site key */
        RECAPTCHA_V3_SITE_KEY: string;
        /** Google reCAPTCHA v2 site key */
        RECAPTCHA_V2_SITE_KEY: string;
    };
    /** Indicates which reCAPTCHA version is currently loaded */
    grecaptcha_version: string;
    PXMKitBlocks: string[];
}

/**
 * Type definition for Google reCAPTCHA API
 */
interface Grecaptcha {
    /**
     * Renders a reCAPTCHA widget in the specified container
     * @param container DOM element where the widget will be rendered
     * @param parameters Configuration options including the site key
     * @returns Widget ID
     */
    render(
        container: HTMLElement,
        parameters: { sitekey: string;[key: string]: any },
    ): number;

    /**
     * Executes reCAPTCHA verification programmatically (for invisible/v3 implementations)
     * @param sitekey The site key for the reCAPTCHA
     * @param options Configuration options including the action name
     * @returns Promise that resolves with the reCAPTCHA token
     */
    execute(sitekey: string, options: { action: string }): Promise<string>;
}

/** Global grecaptcha object made available by the Google reCAPTCHA script */
declare const grecaptcha: Grecaptcha;