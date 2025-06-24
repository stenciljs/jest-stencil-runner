import type { JSX } from '@stencil/core';

export interface SpecPage {
  /**
   * The root element of the component under test.
   */
  root?: Element;
  
  /**
   * The document created for the test.
   */
  doc: Document;
  
  /**
   * The window object for the test.
   */
  win: Window;
  
  /**
   * The body element of the test document.
   */
  body: HTMLElement;
  
  /**
   * Set the content of the test page.
   */
  setContent(html: string): Promise<void>;
  
  /**
   * Wait for changes to be applied.
   */
  waitForChanges(): Promise<void>;
}

export interface E2EPage {
  /**
   * Navigate to a URL.
   */
  goto(url: string): Promise<void>;
  
  /**
   * Find an element by selector.
   */
  find(selector: string): Promise<E2EElement | null>;
  
  /**
   * Find multiple elements by selector.
   */
  findAll(selector: string): Promise<E2EElement[]>;
  
  /**
   * Set the content of the page.
   */
  setContent(html: string): Promise<void>;
  
  /**
   * Wait for changes to be applied.
   */
  waitForChanges(): Promise<void>;
  
  /**
   * Close the page.
   */
  close(): Promise<void>;
}

export interface E2EElement {
  /**
   * Get a property value from the element.
   */
  getProperty(propertyName: string): Promise<any>;
  
  /**
   * Set a property value on the element.
   */
  setProperty(propertyName: string, value: any): Promise<void>;
  
  /**
   * Get the text content of the element.
   */
  textContent: string;
  
  /**
   * Get the inner HTML of the element.
   */
  innerHTML: string;
  
  /**
   * Click the element.
   */
  click(): Promise<void>;
  
  /**
   * Type text into the element.
   */
  type(text: string): Promise<void>;
  
  /**
   * Press a key.
   */
  press(key: string): Promise<void>;
}

export interface EventSpy {
  /**
   * The event that was fired.
   */
  eventName: string;
  
  /**
   * The number of times the event was fired.
   */
  length: number;
  
  /**
   * The first event detail.
   */
  firstEvent: CustomEvent;
  
  /**
   * The last event detail.
   */
  lastEvent: CustomEvent;
  
  /**
   * All event details.
   */
  events: CustomEvent[];
}

export interface NewSpecPageOptions {
  /**
   * An array of components to register for the test.
   */
  components: any[];
  
  /**
   * The HTML content to set on the page.
   */
  html?: string;
  
  /**
   * Template to use for the test.
   */
  template?: () => JSX.Element;
  
  /**
   * Whether to include annotations in the output.
   */
  includeAnnotations?: boolean;
  
  /**
   * Mock global objects.
   */
  supportsShadowDom?: boolean;
}

export interface NewE2EPageOptions {
  /**
   * The URL to navigate to.
   */
  url?: string;
  
  /**
   * The HTML content to set on the page.
   */
  html?: string;
} 
