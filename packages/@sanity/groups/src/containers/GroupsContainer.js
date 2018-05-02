import React from 'react'
import DelayedSpinner from '../components/DelayedSpinner'
import ErrorDialog from '../components/ErrorDialog'
import GroupsGui from '../components/GroupsGui'
import LoadingContainer from './LoadingContainer'

// Loads the most basic data from a Sanity project
class GroupsContainer extends LoadingContainer {
  getSubscriptions() {
    return {
      datasets: {uri: '/datasets'}
    }
  }

  render() {
    if (this.state.error) {
      return (
        <ErrorDialog
          heading="An error occured while loading project data"
          error={this.state.error}
        />
      )
    }

    if (!this.hasAllData()) {
      return <DelayedSpinner />
    }

    return <GroupsGui {...this.state} {...this.props} />
  }
}

export default GroupsContainer
