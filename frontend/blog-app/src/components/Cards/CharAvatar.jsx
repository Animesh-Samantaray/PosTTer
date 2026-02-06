import React from 'react'
import { getInitials } from '../../utils/helper.js'

const CharAvatar = ({
    fullName,width,height,style
}) => {
  return (
    <div className={`${height || '12px'} ${width || '12px'} ${style || ''} flex items-center  justify-center  rounded-full text-gray-900 font-medium bg-gray-100 `}>
      {
        getInitials(fullName || "")
      }
    </div>
  )
}

export default CharAvatar
