/**
 * Created by admin on 2016/10/13.
 */
import React from 'react'
import {Link} from 'react-router'
import Menu from './Menu'
import Item from './MenuItem'
let lt22 = require('../../static/images/lt22.png');
class Nav extends React.Component{

  render(){
    return (
      <div className="home-nav" style={{ height: '100%' }}>
        <Menu>
          <Item ><Link to="/article/preview/all/1"><img src={lt22}/> 文章管理</Link></Item>
          <Item ><Link to="/column/preview/1"><img src={lt22}/> 分类管理</Link></Item>
          <Item className="hide"><Link to="/buyItemst/preview"><img src={lt22}/> 订阅信息</Link></Item>
          <Item className="hide"><Link to="articlereview/preview"><img src={lt22}/> 文章审核</Link></Item>
          <Item ><Link to="/comment/preview/1"><img src={lt22}/> 评论审核</Link></Item>
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
