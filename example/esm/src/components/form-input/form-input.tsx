import { Component, Event, h, Prop, State, type EventEmitter } from '@stencil/core';

@Component({
  tag: 'form-input',
  styleUrl: './form-input.css',
  shadow: true,
})
export class FormInput {
  /**
   * Input label
   */
  @Prop() label: string;

  /**
   * Input type
   */
  @Prop() type: 'text' | 'email' | 'password' | 'number' = 'text';

  /**
   * Input placeholder
   */
  @Prop() placeholder: string;

  /**
   * Input value
   */
  @Prop({ mutable: true }) value: string = '';

  /**
   * Whether input is required
   */
  @Prop() required: boolean = false;

  /**
   * Whether input is disabled
   */
  @Prop() disabled: boolean = false;

  /**
   * Maximum length
   */
  @Prop() maxLength: number;

  /**
   * Minimum length
   */
  @Prop() minLength: number;

  /**
   * Whether to show character count
   */
  @Prop() showCharCount: boolean = false;

  /**
   * Input validation state
   */
  @State() isValid: boolean = true;

  /**
   * Error message
   */
  @State() errorMessage: string = '';

  /**
   * Whether input is focused
   */
  @State() isFocused: boolean = false;

  /**
   * Event emitted when input value changes
   */
  @Event() inputChange: EventEmitter<{ value: string; isValid: boolean }>;

  /**
   * Event emitted when input is focused
   */
  @Event() inputFocus: EventEmitter<string>;

  /**
   * Event emitted when input loses focus
   */
  @Event() inputBlur: EventEmitter<{ value: string; isValid: boolean }>;

  private validateInput(value: string): boolean {
    if (this.required && !value.trim()) {
      this.errorMessage = 'This field is required';
      return false;
    }

    if (this.minLength && value.length < this.minLength) {
      this.errorMessage = `Minimum length is ${this.minLength} characters`;
      return false;
    }

    if (this.maxLength && value.length > this.maxLength) {
      this.errorMessage = `Maximum length is ${this.maxLength} characters`;
      return false;
    }

    if (this.type === 'email' && value && !this.isValidEmail(value)) {
      this.errorMessage = 'Please enter a valid email address';
      return false;
    }

    this.errorMessage = '';
    return true;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private handleInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.isValid = this.validateInput(this.value);

    this.inputChange.emit({
      value: this.value,
      isValid: this.isValid,
    });
  };

  private handleFocus = () => {
    this.isFocused = true;
    this.inputFocus.emit(this.value);
  };

  private handleBlur = () => {
    this.isFocused = false;
    this.inputBlur.emit({
      value: this.value,
      isValid: this.isValid,
    });
  };

  render() {
    const containerClasses = {
      'input-container': true,
      'input-container--focused': this.isFocused,
      'input-container--error': !this.isValid,
      'input-container--disabled': this.disabled,
    };

    const inputClasses = {
      'input-field': true,
      'input-field--error': !this.isValid,
      'input-field--valid': this.isValid && this.value.length > 0,
    };

    return (
      <div class={containerClasses}>
        {this.label && (
          <label class="input-label" data-required={this.required}>
            {this.label}
            {this.required && <span class="required-asterisk">*</span>}
          </label>
        )}

        <div class="input-wrapper">
          <input
            class={inputClasses}
            type={this.type}
            placeholder={this.placeholder}
            value={this.value}
            disabled={this.disabled}
            required={this.required}
            maxLength={this.maxLength}
            minLength={this.minLength}
            data-testid="form-input"
            data-valid={this.isValid}
            aria-describedby={!this.isValid ? 'error-message' : undefined}
            onInput={this.handleInput}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
          />

          {this.showCharCount && this.maxLength && (
            <div class="char-count" data-count={this.value.length}>
              {this.value.length}/{this.maxLength}
            </div>
          )}
        </div>

        {!this.isValid && (
          <div id="error-message" class="error-message" role="alert">
            {this.errorMessage}
          </div>
        )}
      </div>
    );
  }
}
