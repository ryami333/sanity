import {route} from 'part:@sanity/base/router'
import GroupsIcon from 'react-icons/lib/md/group'
import SanityGroups from './SanityGroups'

export default {
  router: route('/*'),
  name: 'groups',
  title: 'Groups',
  icon: GroupsIcon,
  component: SanityGroups
}
