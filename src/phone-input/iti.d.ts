export interface ITIOptions {
  input: HTMLInputElement;
  initialCountry?: string;
  separateDialCode?: boolean;
  formatOnDisplay?: boolean;
  nationalMode?: boolean;
}

export declare const iti: (options: ITIOptions) => Promise<any>;
