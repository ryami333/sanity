import React from 'react'
import sanityClient from 'part:@sanity/base/client'
import Button from 'part:@sanity/components/buttons/default'
import schema from 'part:@sanity/base/schema?'
import Select from './sanity/Select'
import Groups from './Groups'

import groupsGui from './css/groupsGui.css'
import jsonInspector from './css/jsonInspector.css'
import jsonDump from './css/jsonDump.css'

const components = {
  Button,
  Select
}

const styles = {
  jsonDump,
  groupsGui,
  jsonInspector
}

const client = sanityClient.clone()

// Used in Sanity project
function SanityGroups() {
  return <Groups styles={styles} components={components} client={client} schema={schema} />
}

export default SanityGroups
