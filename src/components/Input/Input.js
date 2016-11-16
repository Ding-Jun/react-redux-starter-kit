/**
 * Created by admin on 2016/10/19.
 */
import React from 'react'
import {findDOMNode} from 'react-dom'
import {omit} from 'lodash'
import classnames from 'classnames'
import Validator from '../Validator'
import initEditor from '../util/tinymce'
/**
 * Validator will removed in future
 */
class Input extends React.Component {
  constructor(props) {
    super(props);
    // Operations usually carried out in componentWillMount go here
    /*this.state = {
      value: null,
      err: false,
      errMsg: "",
      validating: false
    }*/
  }

  static defaultProps = {
    prefixCls: "input1",
    validate: false,
    onChange(){}
  }
  componentDidMount(){
    if(this.props.focus){
      findDOMNode(this.refs.input).focus()
    }
    if(this.props.tinymce){
      console.log("isty")
      initEditor(this.props.id,this.props.readOnly);
    }
  }/*
  handleChange(e) {

    var value = e.target.value;
    this.props.beforeChange(value);
    this.setState({value: value});
    this.handleValidate(value);
    this.props.afterChange(value);
  }

  showError(msg) {
    this.setState({
      errMsg: msg
    })
    //console.log("Error msg:", msg)
  }

  handleValidate(value) {
    const {rules, validate} = this.props;
    var err = false;
    if(!validate) return err;
    if ( rules instanceof Array) {
      for (var i = 0; i < rules.length; i++) {
        const rule = rules[i];
        if (rule.required == false) continue;
        if (rule.type == 'function') {
          rule.validate instanceof Function ?
            err = rule.validate(rule, value, this.showError.bind(this)) : console.warn("rule.validate is not a function ", rule)
        } else {
          err = Validator.validate(rule, value, this.showError.bind(this))
        }
        if (err) {
          this.setState({err: err});
          return err
        }
      }

    } else {
      console.warn("rules isn't exist ", rules)
    }
    this.setState({
      err: err,
      errMsg: "ok"
    })
    return err;
  }
 */
  fixControlledValue(value) {
    if (typeof value === 'undefined' || value === null) {
      return '';
    }
    return value;
  }

  renderInput() {
    const {prefixCls, className,onChange}=this.props;

    const otherProps = omit(this.props, [

        'className',
        'prefixCls'
      ]
    )
    const classes = classnames({
      [prefixCls]: true,
      [className]: !!className
    })
    /*var value = this.state.value
    if (value == null) {
      value = this.fixControlledValue(this.props.value);
    }*/
    switch (this.props.type) {
      case 'textarea':
        return (
          <textarea ref="input" {...otherProps} className={classes} onChange={onChange}
                    >{this.props.children}</textarea>
        )
      default:
        return (
          <input ref="input" {...otherProps} className={classes} onChange={onChange}
                 >{this.props.children}</input>
        )
    }
  }

  render() {
    {/*const help = this.state.err ?
      <span className={`${this.props.prefixCls}-error`}><img src={require('./style/p.png')}/> {this.state.errMsg}</span> : this.props.help;
    return (
      <span className={`${this.props.prefixCls}-wrapper`}>
        {this.renderInput()}
        <span className={`${this.props.prefixCls}-explain`}>{help}</span>
      </span>
    )
    */}
    return this.renderInput();
  }
}
export default Input;
