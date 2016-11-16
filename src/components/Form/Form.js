/**
 * Created by admin on 2016/10/19.
 */
import React from 'react'
import classnames from 'classnames'
import {omit} from 'lodash'
import FormItem from './FormItem'
import createForm from './createForm'
class Form extends React.Component{
    constructor(props){
      super(props);
      // Operations usually carried out in componentWillMount go here
    }
    static defaultProps={
      prefixCls:'form',
      style:{},
      onSubmit(){}
    }
    static Item=FormItem;
  static create= createForm;
    render(){
      const {prefixCls,style,className}=this.props;
      const classes = classnames({
        [prefixCls]: true,
        [`${prefixCls}-table`]: true,
        [className]: !!className,
      });
      const otherProps = omit(this.props, [
          'className',
          'prefixCls',
        'style'
        ]
      )

        return (
         <form {...otherProps}>
           <table style={style} className={classes} cellSpacing={0} cellPadding={0}>
             <tbody>
             {this.props.children}
             </tbody>
           </table>
         </form>
        )
    }
}
export default Form;
