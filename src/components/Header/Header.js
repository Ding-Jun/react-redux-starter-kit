import React from 'react'
import { IndexLink, Link } from 'react-router'
import './Header.scss'
import Modal from 'components/Modal'
let logoImg = require('static/images/logo.png');

export const Header = (props) => (
    <div className="home-header">
      <div className="logo"><Link to="/"><img src={logoImg}/></Link></div>
      <div className="login-info">admin <Link to="/password">修改密码</Link> <a href="#" onClick={props.logout}>退出</a></div>
      <Modal {...props.modalOption} />
    </div>
)

export default Header
/*
 <div>
 <h1>React Redux Starter Kit</h1>
 <IndexLink to='/' activeClassName='route--active'>
 Home
 </IndexLink>
 {' · '}
 <Link to='/counter' activeClassName='route--active'>
 Counter
 </Link>
 {' · '}
 <Link to='/zen' activeClassName='route--active'>
 Zen
 </Link>
 </div>
* */
