import { Component } from 'react'
import ErrorState from '../../components/states/ErrorState'
import i18n from '../../i18n/config'
import { captureException } from '../../monitoring/sentry'

class AppErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    captureException(error, {
      tags: { scope: 'react.errorboundary' },
      extra: {
        componentStack: info?.componentStack,
      },
    })
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorState
          title={i18n.t('errors.general.title')}
          message={i18n.t('errors.app.unexpectedInApplication')}
        />
      )
    }

    return this.props.children
  }
}

export default AppErrorBoundary
