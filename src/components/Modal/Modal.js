/**
 * Created by admin on 2016/10/21.
 */
import React from 'react'
import Button from '../Button'
import {omit} from 'lodash'
import classnames from 'classnames'
class Modal extends React.Component {
  constructor(props) {
    super(props);
    // Operations usually carried out in componentWillMount go here
    this.state = {
      visible: this.props.visible
    }
  }

  static defaultProps = {
    visible: false,
    prefixCls:'modal',
    onClose(){},
    onOk(){},
    closable:true
  }

  render() {
    let {prefixCls,className,title, okText, confirmLoading, footer, visible, onClose, onOk,closable} = this.props;

    const otherProps=omit(this.props,[
      'title',
      'okText',
      'confirmLoading',
      'footer',
      'visible',
      'onClose',
      'onOk',
      'closable',
      'className',
      'prefixCls',
      'content'
    ]);
    const classes=classnames({
      [`${prefixCls}-main`]:true,
      [className]:!!className
    })
    const defaultFooter =
        <Button
          loading={confirmLoading}
          onClick={onOk}
        >
          {okText || '确定'}
        </Button>
      ;
    return (
      <div className={`${prefixCls}-bg`} onClick={closable?null:null} style={{display:visible?'block':'none'}}>
        <div className={classes} {...otherProps}>
          <div className={`${prefixCls}-title`}>
            {title}
            {closable?<span className={`${prefixCls}-close`} onClick={onClose}>
              <img src={require('../commonResource/icon_close.png')}></img>
            </span>:null}
          </div>
          <div className={`${prefixCls}-content`}>
            {this.props.content}
            {this.props.children}
          </div>
          <div className={`${prefixCls}-footer`}>{footer || defaultFooter}</div>
        </div>


      </div>
    )
  }
}
export default Modal;
