import { newSpecPage } from 'jest-stencil-runner';
import { StatusCard } from './status-card';

describe('status-card', () => {
  describe('HTML and Text Matchers', () => {
    it('should render success card with correct HTML structure', async () => {
      const { root } = await newSpecPage({
        components: [StatusCard],
        html: '<status-card status="success" title="Success!" message="Operation completed"></status-card>',
      });

      expect(root).toEqualHtml(`
        <status-card status="success" title="Success!" message="Operation completed">
          <template shadowrootmode="open">
            <div class="status-card status-card--success" role="alert" aria-labelledby="card-title" data-status="success" data-testid="status-card">
              <div class="card-header">
                <span class="status-icon" aria-label="Success" data-icon="✓">✓</span>
                <h3 id="card-title" class="card-title" data-title="Success!">Success!</h3>
              </div>
              <div class="card-content" data-message="Operation completed">
                <p class="card-message">Operation completed</p>
              </div>
              <div class="card-footer">
                <slot></slot>
              </div>
            </div>
          </template>
        </status-card>
      `);
    });

    it('should render light DOM correctly', async () => {
      const { root } = await newSpecPage({
        components: [StatusCard],
        html: '<status-card title="Light DOM">Content here</status-card>',
      });

      expect(root).toEqualLightHtml('<status-card title="Light DOM">Content here</status-card>');
    });

    it('should display correct title text', async () => {
      const { root } = await newSpecPage({
        components: [StatusCard],
        html: '<status-card title="Important Notice"></status-card>',
      });

      const title = root.shadowRoot.querySelector('.card-title');
      expect(title).toEqualText('Important Notice');
    });

    it('should display correct message text', async () => {
      const { root } = await newSpecPage({
        components: [StatusCard],
        html: '<status-card message="This is a detailed message"></status-card>',
      });

      const message = root.shadowRoot.querySelector('.card-message');
      expect(message).toEqualText('This is a detailed message');
    });

    it('should display correct icon text for each status', async () => {
      const statuses = [
        { status: 'success', icon: '✓' },
        { status: 'warning', icon: '⚠' },
        { status: 'error', icon: '✗' },
        { status: 'info', icon: 'ℹ' }
      ];

      for (const { status, icon } of statuses) {
        const { root } = await newSpecPage({
          components: [StatusCard],
          html: `<status-card status="${status}"></status-card>`,
        });

        const iconElement = root.shadowRoot.querySelector('.status-icon');
        expect(iconElement).toEqualText(icon);
      }
    });

    it('should render dismissible card with close button', async () => {
      const { root } = await newSpecPage({
        components: [StatusCard],
        html: '<status-card dismissible title="Dismissible Card"></status-card>',
      });

      const dismissButton = root.shadowRoot.querySelector('.dismiss-button');
      expect(dismissButton).toEqualText('×');
    });

    it('should render card without icon when showIcon is false', async () => {
      const { root } = await newSpecPage({
        components: [StatusCard],
        html: '<status-card show-icon="false" title="No Icon"></status-card>',
      });

      expect(root).toEqualHtml(`
        <status-card show-icon="false" title="No Icon">
          <template shadowrootmode="open">
            <div class="status-card status-card--info" role="alert" aria-labelledby="card-title" data-status="info" data-testid="status-card">
              <div class="card-header">
                <h3 id="card-title" class="card-title" data-title="No Icon">No Icon</h3>
              </div>
              <div class="card-footer">
                <slot></slot>
              </div>
            </div>
          </template>
        </status-card>
      `);
    });
  });

  describe('Attribute Matchers', () => {
    it('should have required card attributes', async () => {
      const { root } = await newSpecPage({
        components: [StatusCard],
        html: '<status-card status="warning"></status-card>',
      });

      const card = root.shadowRoot.querySelector('.status-card');
      expect(card).toHaveAttribute('role');
      expect(card).toHaveAttribute('data-status');
      expect(card).toHaveAttribute('data-testid');
      expect(card).toHaveAttribute('aria-labelledby');
    });

    it('should have correct card attribute values', async () => {
      const { root } = await newSpecPage({
        components: [StatusCard],
        html: '<status-card status="error" title="Error Card"></status-card>',
      });

      const card = root.shadowRoot.querySelector('.status-card');
      expect(card).toEqualAttribute('role', 'alert');
      expect(card).toEqualAttribute('data-status', 'error');
      expect(card).toEqualAttribute('data-testid', 'status-card');
      expect(card).toEqualAttribute('aria-labelledby', 'card-title');
    });

    it('should have multiple correct card attributes', async () => {
      const { root } = await newSpecPage({
        components: [StatusCard],
        html: '<status-card status="success" title="Success"></status-card>',
      });

      const card = root.shadowRoot.querySelector('.status-card');
      expect(card).toEqualAttributes({
        'role': 'alert',
        'data-status': 'success',
        'data-testid': 'status-card',
        'aria-labelledby': 'card-title'
      });
    });

    it('should have icon attributes', async () => {
      const { root } = await newSpecPage({
        components: [StatusCard],
        html: '<status-card status="warning"></status-card>',
      });

      const icon = root.shadowRoot.querySelector('.status-icon');
      expect(icon).toHaveAttribute('aria-label');
      expect(icon).toHaveAttribute('data-icon');
      expect(icon).toEqualAttribute('aria-label', 'Warning');
      expect(icon).toEqualAttribute('data-icon', '⚠');
    });

    it('should have title attributes', async () => {
      const { root } = await newSpecPage({
        components: [StatusCard],
        html: '<status-card title="My Title"></status-card>',
      });

      const title = root.shadowRoot.querySelector('.card-title');
      expect(title).toHaveAttribute('id');
      expect(title).toHaveAttribute('data-title');
      expect(title).toEqualAttribute('id', 'card-title');
      expect(title).toEqualAttribute('data-title', 'My Title');
    });

    it('should have message attributes', async () => {
      const { root } = await newSpecPage({
        components: [StatusCard],
        html: '<status-card message="Test message"></status-card>',
      });

      const content = root.shadowRoot.querySelector('.card-content');
      expect(content).toHaveAttribute('data-message');
      expect(content).toEqualAttribute('data-message', 'Test message');
    });

    it('should have dismiss button attributes when dismissible', async () => {
      const { root } = await newSpecPage({
        components: [StatusCard],
        html: '<status-card dismissible></status-card>',
      });

      const dismissButton = root.shadowRoot.querySelector('.dismiss-button');
      expect(dismissButton).toHaveAttribute('aria-label');
      expect(dismissButton).toHaveAttribute('data-action');
      expect(dismissButton).toEqualAttribute('aria-label', 'Dismiss');
      expect(dismissButton).toEqualAttribute('data-action', 'dismiss');
    });
  });

  describe('Class Matchers', () => {
    it('should have base status-card class', async () => {
      const { root } = await newSpecPage({
        components: [StatusCard],
        html: '<status-card></status-card>',
      });

      const card = root.shadowRoot.querySelector('.status-card');
      expect(card).toHaveClass('status-card');
    });

    it('should have status-specific classes', async () => {
      const statuses = ['success', 'warning', 'error', 'info'];

      for (const status of statuses) {
        const { root } = await newSpecPage({
          components: [StatusCard],
          html: `<status-card status="${status}"></status-card>`,
        });

        const card = root.shadowRoot.querySelector('.status-card');
        expect(card).toHaveClass(`status-card--${status}`);
      }
    });

    it('should have dismissible class when dismissible', async () => {
      const { root } = await newSpecPage({
        components: [StatusCard],
        html: '<status-card dismissible></status-card>',
      });

      const card = root.shadowRoot.querySelector('.status-card');
      expect(card).toHaveClass('status-card--dismissible');
    });

    it('should have custom class when provided', async () => {
      const { root } = await newSpecPage({
        components: [StatusCard],
        html: '<status-card custom-class="my-custom-class"></status-card>',
      });

      const card = root.shadowRoot.querySelector('.status-card');
      expect(card).toHaveClass('my-custom-class');
    });

    it('should have multiple classes for dismissible warning card', async () => {
      const { root } = await newSpecPage({
        components: [StatusCard],
        html: '<status-card status="warning" dismissible></status-card>',
      });

      const card = root.shadowRoot.querySelector('.status-card');
      expect(card).toHaveClasses(['status-card', 'status-card--warning', 'status-card--dismissible']);
    });

    it('should have multiple classes including custom class', async () => {
      const { root } = await newSpecPage({
        components: [StatusCard],
        html: '<status-card status="error" custom-class="urgent" dismissible></status-card>',
      });

      const card = root.shadowRoot.querySelector('.status-card');
      expect(card).toHaveClasses(['status-card', 'status-card--error', 'status-card--dismissible', 'urgent']);
    });

    it('should match exact classes for basic info card', async () => {
      const { root } = await newSpecPage({
        components: [StatusCard],
        html: '<status-card status="info"></status-card>',
      });

      const card = root.shadowRoot.querySelector('.status-card');
      expect(card).toMatchClasses(['status-card', 'status-card--info']);
    });

    it('should match exact classes for custom success card', async () => {
      const { root } = await newSpecPage({
        components: [StatusCard],
        html: '<status-card status="success" custom-class="highlight"></status-card>',
      });

      const card = root.shadowRoot.querySelector('.status-card');
      expect(card).toMatchClasses(['status-card', 'status-card--success', 'highlight']);
    });

    it('should have correct structural classes', async () => {
      const { root } = await newSpecPage({
        components: [StatusCard],
        html: '<status-card title="Test" message="Test message"></status-card>',
      });

      const header = root.shadowRoot.querySelector('.card-header');
      const icon = root.shadowRoot.querySelector('.status-icon');
      const title = root.shadowRoot.querySelector('.card-title');
      const content = root.shadowRoot.querySelector('.card-content');
      const message = root.shadowRoot.querySelector('.card-message');
      const footer = root.shadowRoot.querySelector('.card-footer');

      expect(header).toHaveClass('card-header');
      expect(icon).toHaveClass('status-icon');
      expect(title).toHaveClass('card-title');
      expect(content).toHaveClass('card-content');
      expect(message).toHaveClass('card-message');
      expect(footer).toHaveClass('card-footer');
    });
  });

  describe('Complex Scenarios', () => {
    it('should render all features together', async () => {
      const { root } = await newSpecPage({
        components: [StatusCard],
        html: '<status-card status="success" title="All Features" message="Testing all features" dismissible custom-class="feature-complete">Slot content</status-card>',
      });

      const card = root.shadowRoot.querySelector('.status-card');
      const title = root.shadowRoot.querySelector('.card-title');
      const message = root.shadowRoot.querySelector('.card-message');
      const icon = root.shadowRoot.querySelector('.status-icon');
      const dismissButton = root.shadowRoot.querySelector('.dismiss-button');

      // Test HTML structure
      expect(root).toEqualHtml(`
        <status-card status="success" title="All Features" message="Testing all features" dismissible custom-class="feature-complete">
          <template shadowrootmode="open">
            <div class="status-card status-card--success status-card--dismissible feature-complete" role="alert" aria-labelledby="card-title" data-status="success" data-testid="status-card">
              <div class="card-header">
                <span class="status-icon" aria-label="Success" data-icon="✓">✓</span>
                <h3 id="card-title" class="card-title" data-title="All Features">All Features</h3>
                <button class="dismiss-button" aria-label="Dismiss" data-action="dismiss">×</button>
              </div>
              <div class="card-content" data-message="Testing all features">
                <p class="card-message">Testing all features</p>
              </div>
              <div class="card-footer">
                <slot></slot>
              </div>
            </div>
          </template>
          Slot content
        </status-card>
      `);

      // Test text content
      expect(title).toEqualText('All Features');
      expect(message).toEqualText('Testing all features');
      expect(icon).toEqualText('✓');
      expect(dismissButton).toEqualText('×');

      // Test attributes
      expect(card).toEqualAttributes({
        'role': 'alert',
        'data-status': 'success',
        'data-testid': 'status-card',
        'aria-labelledby': 'card-title'
      });

      // Test classes
      expect(card).toMatchClasses(['status-card', 'status-card--success', 'status-card--dismissible', 'feature-complete']);
    });

    it('should handle minimal configuration', async () => {
      const { root } = await newSpecPage({
        components: [StatusCard],
        html: '<status-card></status-card>',
      });

      const card = root.shadowRoot.querySelector('.status-card');

      // Should have default info status
      expect(card).toHaveClass('status-card--info');
      expect(card).toEqualAttribute('data-status', 'info');

      // Should show icon by default
      const icon = root.shadowRoot.querySelector('.status-icon');
      expect(icon).toEqualText('ℹ');

      // Should not have dismissible class
      expect(card).not.toHaveClass('status-card--dismissible');

      // Should not have title or message content
      const title = root.shadowRoot.querySelector('.card-title');
      const content = root.shadowRoot.querySelector('.card-content');
      expect(title).toBeNull();
      expect(content).toBeNull();
    });
  });
});
