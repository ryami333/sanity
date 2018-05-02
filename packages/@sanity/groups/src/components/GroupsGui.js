import React from 'react'
import PropTypes from 'prop-types'
import {storeState, getState} from '../util/localState'
import DelayedSpinner from './DelayedSpinner'
import ResultView from './ResultView'
import NoResultsDialog from './NoResultsDialog'
import QueryErrorDialog from './QueryErrorDialog'

class GroupsGui extends React.PureComponent {
  constructor(props) {
    super(props)

    const lastQuery = '*[_type == "system.group"]|order(_createdAt asc)[0...100]'
    const firstDataset = this.props.datasets[0] && this.props.datasets[0].name
    let dataset = getState('dataset', firstDataset)

    if (!this.props.datasets.includes(dataset)) {
      dataset = firstDataset
    }

    this.subscribers = {}
    this.state = {
      query: lastQuery,
      queryInProgress: false,
      dataset
    }

    this.handleChangeDataset = this.handleChangeDataset.bind(this)
    this.handleListenExecution = this.handleListenExecution.bind(this)
    this.handleListenerMutation = this.handleListenerMutation.bind(this)
    this.handleQueryExecution = this.handleQueryExecution.bind(this)
  }

  componentDidMount() {
    this.context.client.config({dataset: this.state.dataset})
  }

  componentWillUnmount() {
    this.cancelQuery()
    this.cancelListener()
  }

  cancelQuery() {
    if (!this.subscribers.query) {
      return
    }

    this.subscribers.query.unsubscribe()
    this.subscribers.query = null
  }

  cancelListener() {
    if (!this.subscribers.listen) {
      return
    }

    this.subscribers.listen.unsubscribe()
    this.subscribers.listen = null
  }

  handleChangeDataset(evt) {
    const dataset = evt.target.value
    storeState('dataset', dataset)
    this.setState({dataset})
    this.context.client.config({dataset})
    this.handleQueryExecution()
  }

  handleListenerMutation(mut) {
    const listenMutations = [mut].concat(this.state.listenMutations)
    if (listenMutations.length > 50) {
      listenMutations.pop()
    }

    this.setState({listenMutations})
  }

  handleListenExecution() {
    const {query, listenInProgress} = this.state
    if (listenInProgress) {
      this.cancelListener()
      this.setState({listenInProgress: false})
      return
    }

    const client = this.context.client
    storeState('lastQuery', query)

    this.cancelQuery()

    this.setState({
      listenMutations: [],
      queryInProgress: false,
      listenInProgress: Boolean(query),
      error: undefined,
      result: undefined
    })

    if (!query) {
      return
    }

    this.subscribers.listen = client.listen(query, {}).subscribe({
      next: this.handleListenerMutation,
      error: error =>
        this.setState({
          error,
          query,
          listenInProgress: false
        })
    })
  }

  handleQueryExecution() {
    const {query} = this.state
    const client = this.context.client.observable
    storeState('lastQuery', query)

    this.cancelListener()

    this.setState({
      queryInProgress: Boolean(query),
      listenInProgress: false,
      listenMutations: [],
      error: undefined,
      result: undefined
    })

    if (!query) {
      return
    }

    this.subscribers.query = client.fetch(query, {}, {filterResponse: false}).subscribe({
      next: res =>
        this.setState({
          query,
          result: res.result,
          queryInProgress: false,
          error: null
        }),
      error: error =>
        this.setState({
          error,
          query,
          queryInProgress: false
        })
    })
  }

  render() {
    const {client, components} = this.context
    const {error, result, query, queryInProgress, listenInProgress, listenMutations} = this.state

    const {Button, Select} = components
    const styles = this.context.styles.groupsGui
    const dataset = client.config().dataset
    const datasets = this.props.datasets.map(set => set.name)
    const hasResult = !error && !queryInProgress && typeof result !== 'undefined'

    // Note that because of react-json-inspector, we need at least one
    // addressable, non-generated class name. Therefore;
    // leave `sanity-groups` untouched!
    const groupsRootClass = ['sanity-groups', this.context.styles.groupsGui.root]
      .filter(Boolean)
      .join(' ')
    const headerClass = ['sanity-groups', this.context.styles.groupsGui.header]
      .filter(Boolean)
      .join(' ')

    return (
      <div className={groupsRootClass}>
        <div className={headerClass}>
          <span className={styles.spanner}>
            <label className={styles.datasetSelectorContainer}>
              <span className={styles.datasetLabel}>Dataset</span>
              <Select
                value={this.state.dataset || client.config().dataset}
                values={datasets}
                onChange={this.handleChangeDataset}
              />
            </label>
          </span>

          <span className={styles.spanner}>
            <Button onClick={this.handleListenExecution} loading={listenInProgress}>
              Listen
            </Button>
          </span>
          <span className={styles.spanner}>
            <Button onClick={this.handleQueryExecution} loading={queryInProgress} color="primary">
              Run query
            </Button>
          </span>
        </div>

        <div className={styles.resultContainer}>
          <div className={styles.result}>
            {queryInProgress && <DelayedSpinner />}
            {error && <QueryErrorDialog error={error} />}
            {hasResult && <ResultView data={result} query={query} />}
            {Array.isArray(result) &&
              result.length === 0 && <NoResultsDialog query={query} dataset={dataset} />}
            {listenMutations && listenMutations.length > 0 && <ResultView data={listenMutations} />}
          </div>
        </div>
      </div>
    )
  }
}

GroupsGui.propTypes = {
  datasets: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string
    })
  ).isRequired
}

GroupsGui.contextTypes = {
  client: PropTypes.shape({fetch: PropTypes.func}).isRequired,
  styles: PropTypes.object,
  components: PropTypes.object
}

export default GroupsGui
