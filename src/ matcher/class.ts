/**
 * Custom matcher to check if an element has a specific class.
 * @param elm - The element to check.
 * @param expectClassName - The class to check for.
 * @returns A Jest matcher result object.
 */
export function toHaveClass(elm: HTMLElement, expectClassName: string) {
  if (!elm) {
    throw new Error(`expect toHaveClass value is null`);
  }

  if (typeof (elm as any).then === 'function') {
    throw new Error(`element must be a resolved value, not a promise, before it can be tested`);
  }

  if (elm.nodeType !== 1) {
    throw new Error(`expect toHaveClass value is not an element`);
  }

  const pass = elm.classList.contains(expectClassName);

  return {
    message: () => `expected to ${pass ? 'not ' : ''}have css class "${expectClassName}"`,
    pass: pass,
  };
}

/**
 * Custom matcher to check if an element has specific classes.
 * @param elm - The element to check.
 * @param expectClassNames - The classes to check for.
 * @returns A Jest matcher result object.
 */
export function toHaveClasses(elm: HTMLElement, expectClassNames: string[]) {
  if (!elm) {
    throw new Error(`expect toHaveClasses value is null`);
  }

  if (typeof (elm as any).then === 'function') {
    throw new Error(`element must be a resolved value, not a promise, before it can be tested`);
  }

  if (elm.nodeType !== 1) {
    throw new Error(`expect toHaveClasses value is not an element`);
  }

  const pass = expectClassNames.every((expectClassName) => {
    return elm.classList.contains(expectClassName);
  });

  return {
    message: () =>
      `expected to ${pass ? 'not ' : ''}have css classes "${expectClassNames.join(' ')}", but className is "${
        elm.className
      }"`,
    pass: pass,
  };
}

/**
 * Custom matcher to check if an element has the exact same css classes as the expected array of css classes.
 * @param elm - The element to check.
 * @param expectClassNames - The classes to check for.
 * @returns A Jest matcher result object.
 */
export function toMatchClasses(elm: HTMLElement, expectClassNames: string[]) {
  let { pass } = toHaveClasses(elm, expectClassNames);
  if (pass) {
    pass = expectClassNames.length === elm.classList.length;
  }

  return {
    message: () =>
      `expected to ${pass ? 'not ' : ''}match css classes "${expectClassNames.join(' ')}", but className is "${
        elm.className
      }"`,
    pass: pass,
  };
}
