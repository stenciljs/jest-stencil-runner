import { Component, h, Prop } from '@stencil/core';

@Component({
  tag: 'status-card',
  styleUrl: './status-card.css',
  shadow: true,
})
export class StatusCard {
  /**
   * Card title
   */
  @Prop() title: string;

  /**
   * Card status
   */
  @Prop() status: 'success' | 'warning' | 'error' | 'info' = 'info';

  /**
   * Card message
   */
  @Prop() message: string;

  /**
   * Whether to show icon
   */
  @Prop() showIcon: boolean = true;

  /**
   * Custom CSS classes
   */
  @Prop() customClass: string;

  /**
   * Whether card is dismissible
   */
  @Prop() dismissible: boolean = false;

  private getIcon() {
    switch (this.status) {
      case 'success':
        return '✓';
      case 'warning':
        return '⚠';
      case 'error':
        return '✗';
      case 'info':
      default:
        return 'ℹ';
    }
  }

  private getStatusText() {
    switch (this.status) {
      case 'success':
        return 'Success';
      case 'warning':
        return 'Warning';
      case 'error':
        return 'Error';
      case 'info':
      default:
        return 'Information';
    }
  }

  render() {
    const cardClasses = {
      'status-card': true,
      [`status-card--${this.status}`]: true,
      'status-card--dismissible': this.dismissible,
      [this.customClass]: !!this.customClass,
    };

    return (
      <div class={cardClasses} role="alert" aria-labelledby="card-title" data-status={this.status} data-testid="status-card">
        <div class="card-header">
          {this.showIcon && (
            <span class="status-icon" aria-label={this.getStatusText()} data-icon={this.getIcon()}>
              {this.getIcon()}
            </span>
          )}

          {this.title && (
            <h3 id="card-title" class="card-title" data-title={this.title}>
              {this.title}
            </h3>
          )}

          {this.dismissible && (
            <button class="dismiss-button" aria-label="Dismiss" data-action="dismiss">
              ×
            </button>
          )}
        </div>

        {this.message && (
          <div class="card-content" data-message={this.message}>
            <p class="card-message">{this.message}</p>
          </div>
        )}

        <div class="card-footer">
          <slot></slot>
        </div>
      </div>
    );
  }
}
