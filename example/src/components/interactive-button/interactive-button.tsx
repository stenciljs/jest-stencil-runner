import { Component, Prop, State, Event, EventEmitter, h } from '@stencil/core';

@Component({
  tag: 'interactive-button',
  styleUrl: 'interactive-button.css',
  shadow: true,
})
export class InteractiveButton {
  /**
   * The button label
   */
  @Prop() label: string = 'Click me';

  /**
   * The button variant
   */
  @Prop() variant: 'primary' | 'secondary' | 'danger' = 'primary';

  /**
   * Whether the button is disabled
   */
  @Prop() disabled: boolean = false;

  /**
   * Custom data attribute value
   */
  @Prop() dataTestId: string;

  /**
   * Count of times button was clicked
   */
  @State() clickCount: number = 0;

  /**
   * Loading state
   */
  @State() loading: boolean = false;

  /**
   * Event emitted when button is clicked
   */
  @Event() buttonClick: EventEmitter<{ count: number; timestamp: number }>;

  /**
   * Event emitted when button is double clicked
   */
  @Event() buttonDoubleClick: EventEmitter<{ message: string }>;

  /**
   * Event emitted when loading state changes
   */
  @Event() loadingChange: EventEmitter<boolean>;

  private handleClick = () => {
    if (this.disabled || this.loading) return;

    this.clickCount++;
    this.buttonClick.emit({
      count: this.clickCount,
      timestamp: Date.now()
    });
  };

  private handleDoubleClick = () => {
    if (this.disabled || this.loading) return;

    this.buttonDoubleClick.emit({
      message: `Double clicked! Total clicks: ${this.clickCount}`
    });
  };

  async simulateLoading() {
    this.loading = true;
    this.loadingChange.emit(true);

    setTimeout(() => {
      this.loading = false;
      this.loadingChange.emit(false);
    }, 1000);
  }

  render() {
    const buttonClasses = {
      'btn': true,
      [`btn--${this.variant}`]: true,
      'btn--disabled': this.disabled,
      'btn--loading': this.loading,
    };

    return (
      <button
        class={buttonClasses}
        disabled={this.disabled || this.loading}
        data-testid={this.dataTestId}
        data-click-count={this.clickCount}
        aria-label={this.loading ? 'Loading...' : this.label}
        onClick={this.handleClick}
        onDblClick={this.handleDoubleClick}
      >
        {this.loading ? (
          <span class="loading-spinner">Loading...</span>
        ) : (
          this.label
        )}
        {this.clickCount > 0 && (
          <span class="click-badge" data-count={this.clickCount}>
            {this.clickCount}
          </span>
        )}
      </button>
    );
  }
}
