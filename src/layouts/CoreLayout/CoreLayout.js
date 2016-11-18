import React from 'react'
import {HeaderContainer} from 'components/Header'
import Nav from '../../components/Nav'
//import './CoreLayout.scss'
//import '../../styles/core.scss'

export const CoreLayout = ({ children }) => (
  <div style={{ height: '100%' }}>
    <HeaderContainer />
    <div className='home-content'>
      <Nav />
      {children}
    </div>
  </div>
)

CoreLayout.propTypes = {
  children : React.PropTypes.element.isRequired
}

export default CoreLayout
