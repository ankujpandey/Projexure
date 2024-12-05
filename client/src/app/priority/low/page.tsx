import React from 'react'
import ReusablePriorityPage from '../reusablePriorityPage'
import { Priority } from '@/state/api'

type Props = {}

const Low = (props: Props) => {
  return (
    <ReusablePriorityPage priority={Priority.Low} />
  )
}

export default Low