import React from 'react'
import PropTypes from 'prop-types'
import GroupsContainer from './containers/GroupsContainer'

// Passes the given Sanity client and components to use down
// through context to child components
class Groups extends React.PureComponent {
  getChildContext() {
    return {
      client: this.props.client,
      styles: this.props.styles,
      schema: this.props.schema,
      components: this.props.components
    }
  }

  render() {
    return <GroupsContainer {...this.props} />
  }
}

Groups.propTypes = {
  client: PropTypes.shape({config: PropTypes.func}).isRequired,
  schema: PropTypes.object,
  components: PropTypes.shape({
    Button: PropTypes.func
  }).isRequired,
  styles: PropTypes.shape({
    groupsGui: PropTypes.object
  })
}

Groups.defaultProps = {
  styles: {
    groupsGui: {}
  }
}

Groups.childContextTypes = {
  client: PropTypes.shape({config: PropTypes.func}).isRequired,
  schema: PropTypes.object,
  components: PropTypes.object.isRequired,
  styles: PropTypes.object.isRequired
}

export default Groups
