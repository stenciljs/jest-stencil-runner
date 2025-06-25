import { newSpecPage } from 'jest-stencil-runner';
import { InteractiveButton } from './interactive-button';

describe('interactive-button', () => {
  describe('HTML and Text Matchers', () => {
    it('should render with correct HTML structure', async () => {
      const { root } = await newSpecPage({
        components: [InteractiveButton],
        html: '<interactive-button label="Test Button"></interactive-button>',
      });

      expect(root).toEqualHtml(`
        <interactive-button label="Test Button">
          <template shadowrootmode="open">
            <button class="btn btn--primary" data-click-count="0" aria-label="Test Button">
              Test Button
            </button>
          </template>
        </interactive-button>
      `);
    });

    it('should render light DOM correctly', async () => {
      const { root } = await newSpecPage({
        components: [InteractiveButton],
        html: '<interactive-button label="Light DOM Test"></interactive-button>',
      });

      expect(root).toEqualLightHtml('<interactive-button label="Light DOM Test"></interactive-button>');
    });

    it('should have correct text content', async () => {
      const { root } = await newSpecPage({
        components: [InteractiveButton],
        html: '<interactive-button label="Button Text"></interactive-button>',
      });

      const button = root.shadowRoot.querySelector('button');
      expect(button).toEqualText('Button Text');
    });

    it('should update text content when loading', async () => {
      const { root, rootInstance, waitForChanges } = await newSpecPage({
        components: [InteractiveButton],
        html: '<interactive-button label="Load Me"></interactive-button>',
      });

      await rootInstance.simulateLoading();
      await waitForChanges();

      const button = root.shadowRoot.querySelector('button');
      const loadingSpinner = button.querySelector('.loading-spinner');
      expect(loadingSpinner).toEqualText('Loading...');
    });
  });

  describe('Attribute Matchers', () => {
    it('should have required attributes', async () => {
      const { root } = await newSpecPage({
        components: [InteractiveButton],
        html: '<interactive-button label="Test" data-test-id="my-btn"></interactive-button>',
      });

      const button = root.shadowRoot.querySelector('button');
      expect(button).toHaveAttribute('data-testid');
      expect(button).toHaveAttribute('data-click-count');
      expect(button).toHaveAttribute('aria-label');
    });

    it('should have correct attribute values', async () => {
      const { root } = await newSpecPage({
        components: [InteractiveButton],
        html: '<interactive-button label="Attr Test" data-test-id="test-btn"></interactive-button>',
      });

      const button = root.shadowRoot.querySelector('button');
      expect(button).toEqualAttribute('data-testid', 'test-btn');
      expect(button).toEqualAttribute('data-click-count', '0');
      expect(button).toEqualAttribute('aria-label', 'Attr Test');
    });

    it('should have multiple correct attributes', async () => {
      const { root } = await newSpecPage({
        components: [InteractiveButton],
        html: '<interactive-button variant="danger" label="Delete" disabled></interactive-button>',
      });

      const button = root.shadowRoot.querySelector('button');
      expect(button).toEqualAttributes({
        'disabled': '',
        'data-click-count': '0',
        'aria-label': 'Delete',
      });
    });

    it('should update attributes after clicks', async () => {
      const { root, waitForChanges } = await newSpecPage({
        components: [InteractiveButton],
        html: '<interactive-button label="Click Counter"></interactive-button>',
      });

      const button = root.shadowRoot.querySelector('button');

      // Initial state
      expect(button).toEqualAttribute('data-click-count', '0');

      // Simulate click
      button.click();
      await waitForChanges();

      expect(button).toEqualAttribute('data-click-count', '1');
    });
  });

  describe('Class Matchers', () => {
    it('should have base button class', async () => {
      const { root } = await newSpecPage({
        components: [InteractiveButton],
        html: '<interactive-button></interactive-button>',
      });

      const button = root.shadowRoot.querySelector('button');
      expect(button).toHaveClass('btn');
    });

    it('should have variant-specific classes', async () => {
      const { root: primaryRoot } = await newSpecPage({
        components: [InteractiveButton],
        html: '<interactive-button variant="primary"></interactive-button>',
      });

      const { root: secondaryRoot } = await newSpecPage({
        components: [InteractiveButton],
        html: '<interactive-button variant="secondary"></interactive-button>',
      });

      const { root: dangerRoot } = await newSpecPage({
        components: [InteractiveButton],
        html: '<interactive-button variant="danger"></interactive-button>',
      });

      const primaryBtn = primaryRoot.shadowRoot.querySelector('button');
      const secondaryBtn = secondaryRoot.shadowRoot.querySelector('button');
      const dangerBtn = dangerRoot.shadowRoot.querySelector('button');

      expect(primaryBtn).toHaveClass('btn--primary');
      expect(secondaryBtn).toHaveClass('btn--secondary');
      expect(dangerBtn).toHaveClass('btn--danger');
    });

    it('should have multiple classes', async () => {
      const { root } = await newSpecPage({
        components: [InteractiveButton],
        html: '<interactive-button variant="danger" disabled></interactive-button>',
      });

      const button = root.shadowRoot.querySelector('button');
      expect(button).toHaveClasses(['btn', 'btn--danger', 'btn--disabled']);
    });

    it('should match exact classes for primary button', async () => {
      const { root } = await newSpecPage({
        components: [InteractiveButton],
        html: '<interactive-button variant="primary"></interactive-button>',
      });

      const button = root.shadowRoot.querySelector('button');
      expect(button).toMatchClasses(['btn', 'btn--primary']);
    });

    it('should show loading class when loading', async () => {
      const { root, rootInstance, waitForChanges } = await newSpecPage({
        components: [InteractiveButton],
        html: '<interactive-button></interactive-button>',
      });

      await rootInstance.simulateLoading();
      await waitForChanges();

      const button = root.shadowRoot.querySelector('button');
      expect(button).toHaveClass('btn--loading');
      expect(button).toHaveClasses(['btn', 'btn--primary', 'btn--loading']);
    });
  });

  describe('Event Matchers', () => {
    it('should emit buttonClick event when clicked', async () => {
      const { root, waitForChanges } = await newSpecPage({
        components: [InteractiveButton],
        html: '<interactive-button label="Click Me"></interactive-button>',
      });

      const button = root.shadowRoot.querySelector('button');
      const spy = jest.fn();
      root.addEventListener('buttonClick', spy);

      button.click();
      await waitForChanges();

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: expect.objectContaining({
            count: 1,
            timestamp: expect.any(Number),
          }),
        }),
      );
    });

    it('should track multiple clicks correctly', async () => {
      const { root, waitForChanges } = await newSpecPage({
        components: [InteractiveButton],
        html: '<interactive-button></interactive-button>',
      });

      const button = root.shadowRoot.querySelector('button');
      const clickSpy = jest.fn();
      root.addEventListener('buttonClick', clickSpy);

      // Click multiple times
      button.click();
      await waitForChanges();
      button.click();
      await waitForChanges();
      button.click();
      await waitForChanges();

      expect(clickSpy).toHaveBeenCalledTimes(3);

      // Check the last call had count 3
      const lastCall = clickSpy.mock.calls[2][0];
      expect(lastCall.detail.count).toBe(3);
    });

    it('should emit doubleClick event with correct detail', async () => {
      const { root, waitForChanges } = await newSpecPage({
        components: [InteractiveButton],
        html: '<interactive-button></interactive-button>',
      });

      const button = root.shadowRoot.querySelector('button');
      const dblClickSpy = jest.fn();
      const clickSpy = jest.fn();

      root.addEventListener('buttonDoubleClick', dblClickSpy);
      root.addEventListener('buttonClick', clickSpy);

      // First click
      button.click();
      await waitForChanges();

      // Double click
      button.dispatchEvent(new Event('dblclick'));
      await waitForChanges();

      expect(dblClickSpy).toHaveBeenCalledTimes(1);
      expect(dblClickSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: {
            message: 'Double clicked! Total clicks: 1',
          },
        }),
      );
    });

    it('should emit loadingChange events', async () => {
      const { root, rootInstance, waitForChanges } = await newSpecPage({
        components: [InteractiveButton],
        html: '<interactive-button></interactive-button>',
      });

      const loadingSpy = jest.fn();
      root.addEventListener('loadingChange', loadingSpy);

      await rootInstance.simulateLoading();
      await waitForChanges();

      expect(loadingSpy).toHaveBeenCalledTimes(1);
      expect(loadingSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: true,
        }),
      );

      // Wait for loading to complete
      await new Promise(resolve => setTimeout(resolve, 1100));
      await waitForChanges();

      expect(loadingSpy).toHaveBeenCalledTimes(2);
      expect(loadingSpy).toHaveBeenLastCalledWith(
        expect.objectContaining({
          detail: false,
        }),
      );
    });

    it('should not emit events when disabled', async () => {
      const { root, waitForChanges } = await newSpecPage({
        components: [InteractiveButton],
        html: '<interactive-button disabled></interactive-button>',
      });

      const button = root.shadowRoot.querySelector('button');
      const clickSpy = jest.fn();
      const dblClickSpy = jest.fn();

      root.addEventListener('buttonClick', clickSpy);
      root.addEventListener('buttonDoubleClick', dblClickSpy);

      button.click();
      button.dispatchEvent(new Event('dblclick'));
      await waitForChanges();

      expect(clickSpy).not.toHaveBeenCalled();
      expect(dblClickSpy).not.toHaveBeenCalled();
    });
  });

  describe('EventSpy Matcher Tests', () => {
    it('should use EventSpy matchers to test events comprehensively', async () => {
      const { root, waitForChanges } = await newSpecPage({
        components: [InteractiveButton],
        html: '<interactive-button></interactive-button>',
      });

      const button = root.shadowRoot.querySelector('button');
      const events = [];

      root.addEventListener('buttonClick', e => {
        events.push(e);
      });

      // Click multiple times to test various event spy matchers
      button.click();
      await waitForChanges();
      button.click();
      await waitForChanges();
      button.click();
      await waitForChanges();

      // Create EventSpy-compatible object for testing custom matchers
      const eventSpy = {
        eventName: 'buttonClick',
        events,
        firstEvent: events[0],
        lastEvent: events.at(-1),
        length: events.length,
      };

      // Test toHaveReceivedEvent matcher
      expect(eventSpy).toHaveReceivedEvent();

      // Test toHaveReceivedEventTimes matcher
      expect(eventSpy).toHaveReceivedEventTimes(3);

      // Test toHaveReceivedEventDetail matcher (tests last event)
      // Note: We can't use expect.any(Number) in our custom matchers, so we check the structure
      const lastEventDetail = eventSpy.lastEvent.detail;
      expect(lastEventDetail.count).toBe(3);
      expect(typeof lastEventDetail.timestamp).toBe('number');

      // Test toHaveFirstReceivedEventDetail matcher
      const firstEventDetail = eventSpy.firstEvent.detail;
      expect(firstEventDetail.count).toBe(1);
      expect(typeof firstEventDetail.timestamp).toBe('number');

      // Test toHaveLastReceivedEventDetail matcher - should be same as toHaveReceivedEventDetail
      expect(eventSpy.lastEvent.detail.count).toBe(3);

      // Test toHaveNthReceivedEventDetail matcher
      expect(eventSpy.events[0].detail.count).toBe(1);
      expect(eventSpy.events[1].detail.count).toBe(2);
      expect(eventSpy.events[2].detail.count).toBe(3);
    });

    it('should test loading events with EventSpy matchers', async () => {
      const { root, rootInstance, waitForChanges } = await newSpecPage({
        components: [InteractiveButton],
        html: '<interactive-button></interactive-button>',
      });

      const loadingEvents = [];

      root.addEventListener('loadingChange', e => {
        loadingEvents.push(e);
      });

      await rootInstance.simulateLoading();
      await waitForChanges();

      // Wait for loading to complete
      await new Promise(resolve => setTimeout(resolve, 1100));
      await waitForChanges();

      // Create EventSpy object for loading events
      const loadingEventSpy = {
        eventName: 'loadingChange',
        events: loadingEvents,
        firstEvent: loadingEvents[0],
        lastEvent: loadingEvents.at(-1),
        length: loadingEvents.length,
      };

      // Test that loading events were received
      expect(loadingEventSpy).toHaveReceivedEvent();
      expect(loadingEventSpy).toHaveReceivedEventTimes(2);

      // Test first event (loading starts)
      expect(loadingEventSpy).toHaveFirstReceivedEventDetail(true);

      // Test last event (loading ends)
      expect(loadingEventSpy).toHaveLastReceivedEventDetail(false);

      // Test specific events by index
      expect(loadingEventSpy).toHaveNthReceivedEventDetail(0, true);
      expect(loadingEventSpy).toHaveNthReceivedEventDetail(1, false);
    });

    it('should handle empty EventSpy correctly', async () => {
      const { root, waitForChanges } = await newSpecPage({
        components: [InteractiveButton],
        html: '<interactive-button disabled></interactive-button>',
      });

      const button = root.shadowRoot.querySelector('button');
      const events = [];

      root.addEventListener('buttonClick', e => {
        events.push(e);
      });

      // Try to click disabled button
      button.click();
      await waitForChanges();

      // Create EventSpy for empty events
      const emptyEventSpy = {
        eventName: 'buttonClick',
        events,
        firstEvent: events[0],
        lastEvent: events.at(-1),
        length: events.length,
      };

      // Test that no events were received
      expect(emptyEventSpy).toHaveReceivedEventTimes(0);
    });
  });
});
