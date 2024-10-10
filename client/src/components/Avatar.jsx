import React from 'react'

function Avatar({userId,firstname,lastname,profile_picture,width,height,margin,style}) {
    return (
    <div className={margin && 'mb-4 ml-8'}>
    <img src={profile_picture} width={width} height={height} alt={`${firstname} ${lastname}`} className={style} />
    </div>
  )
}

export default Avatar