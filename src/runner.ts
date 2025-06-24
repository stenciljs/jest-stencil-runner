import TestRunner from 'jest-runner';

/**
 * Custom Jest test runner for Stencil components.
 * Compatible with Jest v30 and provides Stencil-specific test filtering.
 */
export class JestStencilRunner extends TestRunner {
  /**
   * Run tests with Stencil-specific filtering and setup.
   */
  override async runTests(
    tests: Array<{ context: any; path: string }>,
    watcher: any,
    options: any
  ): Promise<any> {
    // Set up Stencil environment variables
    this.setupStencilEnvironment();
    
    // Filter tests based on type (spec vs e2e)
    const filteredTests = tests.filter((test) => this.shouldIncludeTest(test.path));

    if (filteredTests.length === 0) {
      return {
        numTotalTestSuites: 0,
        numPassedTestSuites: 0,
        numFailedTestSuites: 0,
        numPendingTestSuites: 0,
        testResults: [],
        snapshot: {},
        success: true,
      };
    }

    // Run the filtered tests using the parent Jest runner
    return super.runTests(filteredTests, watcher, options);
  }

  /**
   * Setup Stencil-specific environment variables.
   */
  private setupStencilEnvironment(): void {
    // Set default timeouts based on test type
    if (!process.env.STENCIL_DEFAULT_TIMEOUT) {
      const isCI = process.env.CI === 'true';
      const isE2E = process.env.STENCIL_E2E_TESTS === 'true';
      
      if (isCI || isE2E) {
        process.env.STENCIL_DEFAULT_TIMEOUT = '30000';
      } else {
        process.env.STENCIL_DEFAULT_TIMEOUT = '15000';
      }
    }
    
    // Setup other Stencil environment variables
    if (!process.env.STENCIL_SPEC_TESTS && !process.env.STENCIL_E2E_TESTS) {
      // Default to running spec tests if no specific type is set
      process.env.STENCIL_SPEC_TESTS = 'true';
    }
  }

  /**
   * Determine if a test file should be included based on its path and environment.
   */
  private shouldIncludeTest(testPath: string): boolean {
    const normalizedPath = testPath.toLowerCase().replace(/\\/g, '/');
    const isE2ETest = normalizedPath.includes('.e2e.') || normalizedPath.includes('/e2e.');
    
    // Check environment variables to determine test type
    const runE2ETests = process.env.STENCIL_E2E_TESTS === 'true';
    const runSpecTests = process.env.STENCIL_SPEC_TESTS === 'true';

    if (runE2ETests && isE2ETest) {
      return true;
    }

    if (runSpecTests && !isE2ETest) {
      return true;
    }

    // Default behavior: include spec tests, exclude e2e tests unless explicitly requested
    if (!runE2ETests && !runSpecTests) {
      return !isE2ETest;
    }

    return false;
  }
} 
