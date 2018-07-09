import PropTypes from 'prop-types'
import React from 'react'
import styles from './styles/TypePaneItem.css'
import {StateLink} from 'part:@sanity/base/router'
import Ink from 'react-ink'
import FolderIcon from 'part:@sanity/base/folder-icon'

export default class TypePaneItem extends React.PureComponent {
  static propTypes = {
    type: PropTypes.shape({
      name: PropTypes.string,
      title: PropTypes.string,
      icon: PropTypes.element
    }),
    selected: PropTypes.bool
  }

  render() {
    const {selected, type} = this.props
    const Icon = type.icon
    return (
      <div className={selected ? styles.selected : styles.item} key={document._id}>
        <StateLink state={{selectedType: type.name}} className={styles.link}>
          <span className={styles.icon}>{Icon ? <Icon /> : <FolderIcon />}</span>
          {type.title}
          <Ink duration={1000} opacity={0.1} radius={200} />
        </StateLink>
      </div>
    )
  }
}
