import type { expect as JestExpect } from '@jest/globals';
import type * as d from '@stencil/core/internal';

import { deepEqual } from './utils';

declare const expect: typeof JestExpect;

/**
 * Custom matcher to check if an event has been received.
 * @param eventSpy - The event spy to check.
 * @returns A Jest matcher result object.
 */
export function toHaveReceivedEvent(eventSpy: d.EventSpy) {
  if (!eventSpy) {
    throw new Error(`toHaveReceivedEvent event spy is null`);
  }

  if (typeof (eventSpy as any).then === 'function') {
    throw new Error(`event spy must be a resolved value, not a promise, before it can be tested`);
  }

  if (!eventSpy.eventName) {
    throw new Error(`toHaveReceivedEvent did not receive an event spy`);
  }

  const pass = eventSpy.events.length > 0;

  return {
    message: () => `expected to have ${pass ? 'not ' : ''}called "${eventSpy.eventName}" event`,
    pass: pass,
  };
}

/**
 * Custom matcher to check if an event has been received a specific number of times.
 * @param eventSpy - The event spy to check.
 * @param count - The number of times the event should have been received.
 * @returns A Jest matcher result object.
 */
export function toHaveReceivedEventTimes(eventSpy: d.EventSpy, count: number) {
  if (!eventSpy) {
    throw new Error(`toHaveReceivedEventTimes event spy is null`);
  }

  if (typeof (eventSpy as any).then === 'function') {
    throw new Error(`event spy must be a resolved value, not a promise, before it can be tested`);
  }

  if (!eventSpy.eventName) {
    throw new Error(`toHaveReceivedEventTimes did not receive an event spy`);
  }

  const pass = eventSpy.length === count;

  return {
    message: () =>
      `expected event "${eventSpy.eventName}" to have been called ${count} times, but was called ${
        eventSpy.events.length
      } time${eventSpy.events.length > 1 ? 's' : ''}`,
    pass: pass,
  };
}

/**
 * Custom matcher to check if an event has received a specific detail.
 * @param eventSpy - The event spy to check.
 * @param eventDetail - The detail to check for.
 * @returns A Jest matcher result object.
 */
export function toHaveReceivedEventDetail(eventSpy: d.EventSpy, eventDetail: any) {
  if (!eventSpy) {
    throw new Error(`toHaveReceivedEventDetail event spy is null`);
  }

  if (typeof (eventSpy as any).then === 'function') {
    throw new Error(`event spy must be a resolved value, not a promise, before it can be tested`);
  }

  if (!eventSpy.eventName) {
    throw new Error(`toHaveReceivedEventDetail did not receive an event spy`);
  }

  if (!eventSpy.lastEvent) {
    throw new Error(`event "${eventSpy.eventName}" was not received`);
  }

  const pass = deepEqual(eventSpy.lastEvent.detail, eventDetail);

  expect(eventSpy.lastEvent.detail).toEqual(eventDetail);

  return {
    message: () => `expected event "${eventSpy.eventName}" detail to ${pass ? 'not ' : ''}equal`,
    pass: pass,
  };
}

/**
 * Custom matcher to check if an event has received the first detail.
 * @param eventSpy - The event spy to check.
 * @param eventDetail - The detail to check for.
 * @returns A Jest matcher result object.
 */
export function toHaveFirstReceivedEventDetail(eventSpy: d.EventSpy, eventDetail: any) {
  if (!eventSpy) {
    throw new Error(`toHaveFirstReceivedEventDetail event spy is null`);
  }

  if (typeof (eventSpy as any).then === 'function') {
    throw new Error(`event spy must be a resolved value, not a promise, before it can be tested`);
  }

  if (!eventSpy.eventName) {
    throw new Error(`toHaveFirstReceivedEventDetail did not receive an event spy`);
  }

  if (!eventSpy.firstEvent) {
    throw new Error(`event "${eventSpy.eventName}" was not received`);
  }

  const pass = deepEqual(eventSpy.firstEvent.detail, eventDetail);

  expect(eventSpy.firstEvent.detail).toEqual(eventDetail);

  return {
    message: () => `expected event "${eventSpy.eventName}" detail to ${pass ? 'not ' : ''}equal`,
    pass: pass,
  };
}

/**
 * Custom matcher to check if an event has received the last detail.
 * @param eventSpy - The event spy to check.
 * @param eventDetail - The detail to check for.
 * @returns A Jest matcher result object.
 */
export function toHaveLastReceivedEventDetail(eventSpy: d.EventSpy, eventDetail: any) {
  if (!eventSpy) {
    throw new Error(`toHaveLastReceivedEventDetail event spy is null`);
  }

  if (typeof (eventSpy as any).then === 'function') {
    throw new Error(`event spy must be a resolved value, not a promise, before it can be tested`);
  }

  if (!eventSpy.eventName) {
    throw new Error(`toHaveLastReceivedEventDetail did not receive an event spy`);
  }

  if (!eventSpy.firstEvent) {
    throw new Error(`event "${eventSpy.eventName}" was not received`);
  }

  const pass = deepEqual(eventSpy.lastEvent.detail, eventDetail);

  expect(eventSpy.lastEvent.detail).toEqual(eventDetail);

  return {
    message: () => `expected event "${eventSpy.eventName}" detail to ${pass ? 'not ' : ''}equal`,
    pass: pass,
  };
}

/**
 * Custom matcher to check if an event has received the detail at a specific index.
 * @param eventSpy - The event spy to check.
 * @param index - The index of the event to check.
 * @param eventDetail - The detail to check for.
 * @returns A Jest matcher result object.
 */
export function toHaveNthReceivedEventDetail(eventSpy: d.EventSpy, index: number, eventDetail: any) {
  if (!eventSpy) {
    throw new Error(`toHaveNthReceivedEventDetail event spy is null`);
  }

  if (typeof (eventSpy as any).then === 'function') {
    throw new Error(`event spy must be a resolved value, not a promise, before it can be tested`);
  }

  if (!eventSpy.eventName) {
    throw new Error(`toHaveNthReceivedEventDetail did not receive an event spy`);
  }

  if (!eventSpy.firstEvent) {
    throw new Error(`event "${eventSpy.eventName}" was not received`);
  }

  const event = eventSpy.events[index];

  if (!event) {
    throw new Error(`event at index ${index} was not received`);
  }

  const pass = deepEqual(event.detail, eventDetail);

  expect(event.detail).toEqual(eventDetail);

  return {
    message: () => `expected event "${eventSpy.eventName}" detail to ${pass ? 'not ' : ''}equal`,
    pass: pass,
  };
}