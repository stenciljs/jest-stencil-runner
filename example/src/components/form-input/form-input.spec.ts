import { newSpecPage } from 'jest-stencil-runner';
import { FormInput } from './form-input';

describe('form-input', () => {
  describe('HTML and Text Matchers', () => {
    it('should render with correct HTML structure', async () => {
      const { root } = await newSpecPage({
        components: [FormInput],
        html: '<form-input label="Email" type="email" placeholder="Enter email"></form-input>',
      });

      expect(root).toEqualHtml(`
        <form-input label="Email" type="email" placeholder="Enter email">
          <template shadowrootmode="open">
            <div class="input-container">
              <label class="input-label">
                Email
              </label>
              <div class="input-wrapper">
                <input class="input-field" type="email" placeholder="Enter email" value="" data-testid="form-input" data-valid>
              </div>
            </div>
          </template>
        </form-input>
      `);
    });

    it('should render light DOM correctly', async () => {
      const { root } = await newSpecPage({
        components: [FormInput],
        html: '<form-input label="Username"></form-input>',
      });

      expect(root).toEqualLightHtml('<form-input label="Username"></form-input>');
    });

    it('should display correct label text', async () => {
      const { root } = await newSpecPage({
        components: [FormInput],
        html: '<form-input label="Full Name"></form-input>',
      });

      const label = root.shadowRoot.querySelector('.input-label');
      expect(label).toEqualText('Full Name');
    });

    it('should display required asterisk when required', async () => {
      const { root } = await newSpecPage({
        components: [FormInput],
        html: '<form-input label="Required Field" required></form-input>',
      });

      const label = root.shadowRoot.querySelector('.input-label');
      expect(label).toEqualText('Required Field*');
    });

    it('should show error message text', async () => {
      const { root, waitForChanges } = await newSpecPage({
        components: [FormInput],
        html: '<form-input label="Email" type="email" required></form-input>',
      });

      const input = root.shadowRoot.querySelector('input');

      // Trigger validation by setting invalid email
      input.value = 'invalid-email';
      input.dispatchEvent(new Event('input'));
      await waitForChanges();

      const errorMessage = root.shadowRoot.querySelector('.error-message');
      expect(errorMessage).toEqualText('Please enter a valid email address');
    });

    it('should show character count text', async () => {
      const { root } = await newSpecPage({
        components: [FormInput],
        html: '<form-input label="Bio" max-length="100" show-char-count value="Hello world"></form-input>',
      });

      const charCount = root.shadowRoot.querySelector('.char-count');
      expect(charCount).toEqualText('11/100');
    });
  });

  describe('Attribute Matchers', () => {
    it('should have basic input attributes', async () => {
      const { root } = await newSpecPage({
        components: [FormInput],
        html: '<form-input type="password" placeholder="Password"></form-input>',
      });

      const input = root.shadowRoot.querySelector('input');
      expect(input).toHaveAttribute('type');
      expect(input).toHaveAttribute('placeholder');
      expect(input).toHaveAttribute('data-testid');
      expect(input).toHaveAttribute('data-valid');
    });

    it('should have correct attribute values', async () => {
      const { root } = await newSpecPage({
        components: [FormInput],
        html: '<form-input type="number" placeholder="Age" value="25"></form-input>',
      });

      const input = root.shadowRoot.querySelector('input');
      expect(input).toEqualAttribute('type', 'number');
      expect(input).toEqualAttribute('placeholder', 'Age');
      expect(input).toEqualAttribute('value', '25');
      expect(input).toEqualAttribute('data-testid', 'form-input');
      expect(input).toEqualAttribute('data-valid', '');
    });

    it('should have multiple correct attributes for disabled required field', async () => {
      const { root } = await newSpecPage({
        components: [FormInput],
        html: '<form-input required disabled min-length="5" max-length="20"></form-input>',
      });

      const input = root.shadowRoot.querySelector('input');
      expect(input).toEqualAttributes({
        'required': '',
        'disabled': '',
        'minlength': '5',
        'maxlength': '20',
        'data-valid': ''
      });
    });

    it('should have label data attributes', async () => {
      const { root } = await newSpecPage({
        components: [FormInput],
        html: '<form-input label="Required Field" required></form-input>',
      });

      const label = root.shadowRoot.querySelector('.input-label');
      expect(label).toHaveAttribute('data-required');
      expect(label).toEqualAttribute('data-required', '');
    });

    it('should update data-valid attribute based on validation', async () => {
      const { root, waitForChanges } = await newSpecPage({
        components: [FormInput],
        html: '<form-input type="email" required></form-input>',
      });

      const input = root.shadowRoot.querySelector('input');

      // Initially valid (empty but not validated yet)
      expect(input).toHaveAttribute('data-valid');

      // Set invalid email
      input.value = 'not-an-email';
      input.dispatchEvent(new Event('input'));
      await waitForChanges();

      expect(input).not.toHaveAttribute('data-valid');

      // Set valid email
      input.value = 'valid@email.com';
      input.dispatchEvent(new Event('input'));
      await waitForChanges();

      expect(input).toHaveAttribute('data-valid');
    });

    it('should have character count data attribute', async () => {
      const { root } = await newSpecPage({
        components: [FormInput],
        html: '<form-input max-length="50" show-char-count value="Test"></form-input>',
      });

      const charCount = root.shadowRoot.querySelector('.char-count');
      expect(charCount).toHaveAttribute('data-count');
      expect(charCount).toEqualAttribute('data-count', '4');
    });
  });

  describe('Class Matchers', () => {
    it('should have base container classes', async () => {
      const { root } = await newSpecPage({
        components: [FormInput],
        html: '<form-input></form-input>',
      });

      const container = root.shadowRoot.querySelector('.input-container');
      expect(container).toHaveClass('input-container');

      const input = root.shadowRoot.querySelector('input');
      expect(input).toHaveClass('input-field');
    });

    it('should have error classes when invalid', async () => {
      const { root, waitForChanges } = await newSpecPage({
        components: [FormInput],
        html: '<form-input required min-length="5"></form-input>',
      });

      const input = root.shadowRoot.querySelector('input');
      const container = root.shadowRoot.querySelector('.input-container');

      // Enter invalid input (too short)
      input.value = 'hi';
      input.dispatchEvent(new Event('input'));
      await waitForChanges();

      expect(container).toHaveClass('input-container--error');
      expect(input).toHaveClass('input-field--error');
    });

    it('should have valid class when input is valid', async () => {
      const { root, waitForChanges } = await newSpecPage({
        components: [FormInput],
        html: '<form-input type="email"></form-input>',
      });

      const input = root.shadowRoot.querySelector('input');

      // Enter valid email
      input.value = 'test@example.com';
      input.dispatchEvent(new Event('input'));
      await waitForChanges();

      expect(input).toHaveClass('input-field--valid');
    });

    it('should have focused classes when focused', async () => {
      const { root, waitForChanges } = await newSpecPage({
        components: [FormInput],
        html: '<form-input label="Focus Test"></form-input>',
      });

      const input = root.shadowRoot.querySelector('input');
      const container = root.shadowRoot.querySelector('.input-container');

      // Simulate focus
      input.dispatchEvent(new Event('focus'));
      await waitForChanges();

      expect(container).toHaveClass('input-container--focused');
    });

    it('should have disabled classes when disabled', async () => {
      const { root } = await newSpecPage({
        components: [FormInput],
        html: '<form-input disabled></form-input>',
      });

      const container = root.shadowRoot.querySelector('.input-container');
      expect(container).toHaveClass('input-container--disabled');
    });

    it('should have multiple container classes', async () => {
      const { root, waitForChanges } = await newSpecPage({
        components: [FormInput],
        html: '<form-input disabled required></form-input>',
      });

      const input = root.shadowRoot.querySelector('input');
      const container = root.shadowRoot.querySelector('.input-container');

      // Trigger validation error by setting empty value and triggering input event
      input.value = '';
      input.dispatchEvent(new Event('input'));
      await waitForChanges();

      expect(container).toHaveClasses(['input-container', 'input-container--disabled', 'input-container--error']);
    });

    it('should match exact classes for input field', async () => {
      const { root } = await newSpecPage({
        components: [FormInput],
        html: '<form-input></form-input>',
      });

      const input = root.shadowRoot.querySelector('input');
      expect(input).toMatchClasses(['input-field']);
    });

    it('should match exact classes for valid input with value', async () => {
      const { root } = await newSpecPage({
        components: [FormInput],
        html: '<form-input value="Valid input"></form-input>',
      });

      const input = root.shadowRoot.querySelector('input');

      // Trigger validation
      input.dispatchEvent(new Event('input'));
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(input).toMatchClasses(['input-field', 'input-field--valid']);
    });
  });

  describe('Event Matchers', () => {
    it('should emit inputChange event', async () => {
      const { root, waitForChanges } = await newSpecPage({
        components: [FormInput],
        html: '<form-input></form-input>',
      });

      const input = root.shadowRoot.querySelector('input');
      const spy = jest.fn();
      root.addEventListener('inputChange', spy);

      input.value = 'Hello';
      input.dispatchEvent(new Event('input'));
      await waitForChanges();

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: {
            value: 'Hello',
            isValid: true
          }
        })
      );
    });

    it('should emit inputFocus event', async () => {
      const { root, waitForChanges } = await newSpecPage({
        components: [FormInput],
        html: '<form-input value="Initial"></form-input>',
      });

      const input = root.shadowRoot.querySelector('input');
      const spy = jest.fn();
      root.addEventListener('inputFocus', spy);

      input.dispatchEvent(new Event('focus'));
      await waitForChanges();

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: 'Initial'
        })
      );
    });

    it('should emit inputBlur event with validation state', async () => {
      const { root, waitForChanges } = await newSpecPage({
        components: [FormInput],
        html: '<form-input type="email" required></form-input>',
      });

      const input = root.shadowRoot.querySelector('input');
      const spy = jest.fn();
      root.addEventListener('inputBlur', spy);

      // Set invalid email and blur
      input.value = 'invalid-email';
      input.dispatchEvent(new Event('input'));
      input.dispatchEvent(new Event('blur'));
      await waitForChanges();

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: {
            value: 'invalid-email',
            isValid: false
          }
        })
      );
    });

    it('should track validation changes through multiple events', async () => {
      const { root, waitForChanges } = await newSpecPage({
        components: [FormInput],
        html: '<form-input type="email" required></form-input>',
      });

      const input = root.shadowRoot.querySelector('input');
      const changeSpy = jest.fn();
      root.addEventListener('inputChange', changeSpy);

      // Invalid input
      input.value = 'bad';
      input.dispatchEvent(new Event('input'));
      await waitForChanges();

      // Valid input
      input.value = 'good@email.com';
      input.dispatchEvent(new Event('input'));
      await waitForChanges();

      // Empty (invalid because required)
      input.value = '';
      input.dispatchEvent(new Event('input'));
      await waitForChanges();

      expect(changeSpy).toHaveBeenCalledTimes(3);

      // First call - invalid email
      expect(changeSpy.mock.calls[0][0].detail.isValid).toBe(false);

      // Second call - valid email
      expect(changeSpy.mock.calls[1][0].detail.isValid).toBe(true);

      // Third call - empty required field
      expect(changeSpy.mock.calls[2][0].detail.isValid).toBe(false);
    });
  });
});
