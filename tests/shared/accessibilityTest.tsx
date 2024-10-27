import React from 'react';
import { render } from '@testing-library/react';
import { globSync } from 'glob';
import { axe } from 'jest-axe';

class AxeQueueManager {
  private queue: Promise<any> = Promise.resolve();
  private isProcessing = false;

  async enqueue<T>(task: () => Promise<T>): Promise<T> {
    const currentQueue = this.queue;

    const newTask = async () => {
      try {
        await currentQueue;
        this.isProcessing = true;
        return await task();
      } finally {
        this.isProcessing = false;
      }
    };

    this.queue = this.queue.then(newTask, newTask);

    return this.queue;
  }

  isRunning(): boolean {
    return this.isProcessing;
  }
}

const axeQueueManager = new AxeQueueManager();

const runAxe = async (...args: Parameters<typeof axe>): Promise<ReturnType<typeof axe>> => {
  return axeQueueManager.enqueue(async () => {
    try {
      return await axe(...args);
    } catch (error) {
      console.error('Axe test failed:', error);
      throw error;
    }
  });
};

// eslint-disable-next-line jest/no-export
export default function accessibilityTest(Component: React.ComponentType) {
  describe(`accessibility`, () => {
    it(`component does not have any violations`, async () => {
      jest.useRealTimers();
      const { container } = render(<Component />);
      const results = await runAxe(container, {
        rules: {
          'image-alt': { enabled: false },
          label: { enabled: false },
          'button-name': { enabled: false },
          'role-img-alt': { enabled: false },
          'link-name': { enabled: false },
        },
      });
      expect(results).toHaveNoViolations();
    }, 30000);
  });
}

type Options = {
  skip?: boolean | string[];
};

// eslint-disable-next-line jest/no-export
export function accessibilityDemoTest(component: string, options: Options = {}) {
  // If skip is true, return immediately without executing any tests
  if (options.skip === true) {
    describe.skip(`${component} demo a11y`, () => {
      it('skipped', () => {});
    });
    return;
  }

  describe(`${component} demo a11y`, () => {
    const files = globSync(`./components/${component}/demo/*.tsx`).filter(
      (file) => !file.includes('_semantic') && !file.includes('-debug'),
    );

    files.forEach((file) => {
      const shouldSkip = Array.isArray(options.skip) && options.skip.some((c) => file.endsWith(c));
      const testMethod = shouldSkip ? describe.skip : describe;

      testMethod(`Test ${file} accessibility`, () => {
        const Demo = require(`../../${file}`).default;
        accessibilityTest(Demo);
      });
    });
  });
}
