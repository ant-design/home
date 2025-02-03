import * as React from 'react';

import Alert from './Alert';

interface ErrorBoundaryProps {
  message?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  id?: string;
}

interface ErrorBoundaryStates {
  error?: Error | null;
  info?: {
    componentStack?: string;
  };
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryStates> {
  state = {
    error: undefined,
    info: {
      componentStack: '',
    },
  };

  componentDidCatch(error: Error | null, info: object) {
    this.setState({ error, info });
  }

  render() {
    const { message, description, id, children } = this.props;
    const { error, info } = this.state;
    const componentStack = info?.componentStack || null;
    const errorMessage = typeof message === 'undefined' ? (error || '').toString() : message;
    const errorDescription = typeof description === 'undefined' ? componentStack : description;

    if (error) {
      return (
        <Alert
          id={id}
          type="error"
          message={errorMessage}
          description={
            <pre style={{ fontSize: '0.9em', overflowX: 'auto' }}>{errorDescription}</pre>
          }
        />
      );
    }

    if (typeof children === 'bigint') {
      return children.toString();
    }

    return children;
  }
}

export default ErrorBoundary;
