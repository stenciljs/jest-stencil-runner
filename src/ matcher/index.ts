export { toEqualHtml, toEqualLightHtml } from './html';
export {
  toHaveReceivedEvent,
  toHaveReceivedEventTimes,
  toHaveReceivedEventDetail,
  toHaveFirstReceivedEventDetail,
  toHaveLastReceivedEventDetail,
  toHaveNthReceivedEventDetail
} from './events';
export { toEqualAttribute, toEqualAttributes, toHaveAttribute } from './attribute';
export { toHaveClass, toHaveClasses, toMatchClasses } from './class';
export { toEqualText } from './text';

declare global {
  namespace jest {
    interface Matchers<R, T> {
      /**
       * Compares HTML, but first normalizes the HTML so all
       * whitespace, attribute order and css class order are
       * the same. When given an element, it will compare
       * the element's `outerHTML`. When given a Document Fragment,
       * such as a Shadow Root, it'll compare its `innerHTML`.
       * Otherwise it'll compare two strings representing HTML.
       */
      toEqualHtml(expectHtml: string): void;
      /**
       * Compares HTML light DOM only, but first normalizes the HTML so all
       * whitespace, attribute order and css class order are
       * the same. When given an element, it will compare
       * the element's `outerHTML`. When given a Document Fragment,
       * such as a Shadow Root, it'll compare its `innerHTML`.
       * Otherwise it'll compare two strings representing HTML.
       */
      toEqualLightHtml(expectLightHtml: string): void;
      /**
       * When given an element, it'll compare the element's
       * `textContent`. Otherwise it'll compare two strings. This
       * matcher will also `trim()` each string before comparing.
       */
      toEqualText(expectTextContent: string): void;
      /**
       * Checks if an element simply has the attribute. It does
       * not check any values of the attribute
       */
      toHaveAttribute(expectAttrName: string): void;
      /**
       * Checks if an element's attribute value equals the expect value.
       */
      toEqualAttribute(expectAttrName: string, expectAttrValue: any): void;
      /**
       * Checks if an element's has each of the expected attribute
       * names and values.
       */
      toEqualAttributes(expectAttrs: {
        [attrName: string]: any;
      }): void;
      /**
       * Checks if an element has the expected css class.
       */
      toHaveClass(expectClassName: string): void;
      /**
       * Checks if an element has each of the expected css classes
       * in the array.
       */
      toHaveClasses(expectClassNames: string[]): void;
      /**
       * Checks if an element has the exact same css classes
       * as the expected array of css classes.
       */
      toMatchClasses(expectClassNames: string[]): void;
      /**
       * When given an EventSpy, checks if the event has been
       * received or not.
       */
      toHaveReceivedEvent(): void;
      /**
       * When given an EventSpy, checks how many times the
       * event has been received.
       */
      toHaveReceivedEventTimes(count: number): void;
      /**
       * When given an EventSpy, checks the event has
       * received the correct custom event `detail` data.
       */
      toHaveReceivedEventDetail(eventDetail: any): void;
      /**
       * When given an EventSpy, checks the first event has
       * received the correct custom event `detail` data.
       */
      toHaveFirstReceivedEventDetail(eventDetail: any): void;
      /**
       * When given an EventSpy, checks the last event has
       * received the correct custom event `detail` data.
       */
      toHaveLastReceivedEventDetail(eventDetail: any): void;
      /**
       * When given an EventSpy, checks the event at an index
       * has received the correct custom event `detail` data.
       */
      toHaveNthReceivedEventDetail(index: number, eventDetail: any): void;
    }
  }
}