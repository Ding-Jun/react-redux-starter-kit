/**
 * Created by admin on 2016/11/16.
 */
import React from 'react'

const MenuItem = (props) => (
  <li className={'nav-item '+props.className}>
    {props.children}
  </li>
)
export default MenuItem;
