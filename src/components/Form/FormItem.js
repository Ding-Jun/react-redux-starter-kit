/**
 * Created by admin on 2016/10/19.
 */
import React from 'react'
class FormItem extends React.Component{
    constructor(props){
      super(props);
      // Operations usually carried out in componentWillMount go here
    }
  static defaultProps={
    prefixCls:'form-item',
    style:{},
    onSubmit(e){e.preventDefault();}
  }
    render(){
      const {prefixCls,style,className,label,required}=this.props;
      const help = this.props.error ?
        <span className={`${this.props.prefixCls}-error`}><img src={require('./style/p.png')}/> {this.props.error.message}</span> :this.props.help ;
        return (
        <tr style={style} className={className}>
          <td className={`${prefixCls}-label`}>{required?<span className={`${prefixCls}-required`}>*</span>:null} {label}</td>
          <td className={`${prefixCls}-content`}>
            {this.props.children}
            <span className={`${this.props.prefixCls}-explain`}>{help}</span>
          </td>
        </tr>
        )
    }
}
export default FormItem;
