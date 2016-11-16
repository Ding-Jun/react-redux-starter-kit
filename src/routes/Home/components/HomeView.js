import React from 'react'
import WelcomeImg from 'static/images/welcome.jpg'


export const HomeView = () => (
  <div>
    <img
      alt='欢迎使用'
      className='home-welcome'
      src={WelcomeImg} />
  </div>
)

export default HomeView
