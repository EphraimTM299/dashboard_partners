import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import { MultiSelect, MultiSelectProps } from '@uc-react-ui/multiselect'

export default function MultiSelectComponent  ()  {
  const [value, setValue] = useState([''])
  const props: MultiSelectProps = {
    label: 'Tags',
    name: 'tags',
    size: 'small',
    optionList: [
      { label: 'desktop' },
      { label: 'demo' },
      { label: 'v1' },
      { label: 'development' },
      { label: 'test' },
      { label: 'production' },
    ],
    placeholder: 'Add Items',
    value: value,
    valueChange: setValue,
  }

  return (
    <div className=''>
      <MultiSelect {...props} />
    </div>
  )
}


