/**
 * Created by admin on 2016/10/14.
 */
import React from 'react'
import classnames from 'classnames'
import {omit} from 'lodash'
class Button extends React.Component{
    constructor(props){
      super(props);
      // Operations usually carried out in componentWillMount go here
    }
  static defaultProps = {
    prefixCls: 'btn',
    onClick() {},
    loading: false,
  };
  static propTypes = {
    type: React.PropTypes.string,
    htmlType: React.PropTypes.oneOf(['submit', 'button', 'reset']),
    onClick: React.PropTypes.func,
    loading: React.PropTypes.bool,
    className: React.PropTypes.string,
    title:React.PropTypes.node
  };

  handleClick = (e) => {
    this.props.onClick(e);
  }
    render(){

      const {prefixCls,className,loading}=this.props;
      const otherProps =omit(this.props,[
        'onClick',
        'prefixCls',
        'className',
        'loading'
      ])
      const classes = classnames({
        [prefixCls]: true,
        [`${prefixCls}-text`]: true,
        [`${prefixCls}-loading`]: loading,
        [className]: !!className,
      });

        return (
         <button {...otherProps} className={classes} onClick={this.handleClick}>

           {this.props.children}

         </button>
        )
    }
}
export default Button;
