import Image from 'next/image'
import React from 'react'

const Logo = () => {
  return <Image height={60} width={60} alt='logo' src={"/img/logo.png"}/>
}

export default Logo