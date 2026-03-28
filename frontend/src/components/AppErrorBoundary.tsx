import React from 'react'

interface State {
  hasError: boolean
}

export default class AppErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error) {
    // Log for diagnostics; could be sent to a monitoring service.
    console.error('Unhandled UI error:', error)
  }

  handleReset = () => {
    this.setState({ hasError: false })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container py-5">
          <div className="alert alert-danger">
            <h4 className="alert-heading">Something went wrong</h4>
            <p className="mb-3">An unexpected error occurred while rendering this page.</p>
            <button className="btn btn-outline-danger" onClick={this.handleReset}>Try again</button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
