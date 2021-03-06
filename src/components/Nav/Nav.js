/**
 * Created by admin on 2016/10/13.
 */
import React from 'react'
import {Link} from 'react-router'
import Menu from './Menu'
import Item from './MenuItem'
import { APP_ROOT } from '../../constant'
let lt22 = require('../../static/images/lt22.png');
class Nav extends React.Component{

  render(){
    return (
      <div className="home-nav" style={{ height: '100%' }}>
        <Menu>
          <Link to={`${APP_ROOT}/article/preview/1`} className="nav-item" activeClassName='nav-active' ><img src={lt22}/> 文章管理</Link>
          <Item ><Link to={`${APP_ROOT}/column/preview/1`} className="nav-item" activeClassName='nav-active' ><img src={lt22}/> 分类管理</Link></Item>
          <Item className="hide"><Link to="/buyItemst/preview"><img src={lt22}/> 订阅信息</Link></Item>
          <Item className="hide"><Link to="articlereview/preview"><img src={lt22}/> 文章审核</Link></Item>
          <Item ><Link to={`${APP_ROOT}/comment/preview/1`} className="nav-item" activeClassName='nav-active' ><img src={lt22}/> 评论审核</Link></Item>
          <Item className="hide"><Link to="redPacket/preview"><img src={lt22}/> 红包管理</Link></Item>
          <Item className="hide"><Link to="user/preview"><img src={lt22}/> 用户管理</Link></Item>
          <Item className="hide"><Link to="message/preview"><img src={lt22}/> 短信推送</Link></Item>
          <Item className="hide"><Link to="admin/preview"><img src={lt22}/> 管理员管理</Link></Item>
        </Menu>
      </div>
    )
  }

}
export default Nav;
