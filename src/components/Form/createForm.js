/**
 * Created by admin on 2016/10/24.
 */
import React from 'react';
import Validator from '../Validator'
import {uuid} from '../util'

/**
 * React High Order Component   For Form
 * @param options  暂时没用
 */
function createForm(options) {
  function decorate(WrappedComponent) {
    class InnerComponent extends React.Component {
      constructor(props) {
        super(props);
        this.fields = {};
        // Operations usually carried out in componentWillMount go here
        this.state = {}
      }

      /**
       *记录值 绑定表单项onClick事件
       * @param id
       * @param options
       */
      getFieldDecorator(id, options) {
        this.fields = this.fields || {};
        this.fields[id] = this.fields[id] || {};
        if (this.fields[id].value === undefined) {
          this.fields[id].value = options.initialValue || ''
        }
        ;
        if (this.fields[id].errors === undefined) {
          this.fields[id].errors = []
        }
        this.fields[id].rules = this.fields[id].rules || options.rules;
        return {
          id: id,
          onChange: this.onChangeValidate.bind(this, id)
        }
      }

      onChangeValidate(name, event) {
        const value = event.target.value;
        this.validateField(name, value);
      }

      /**
       * 验证表单项
       * @param name
       * @param value
       */
      validateField(name, value) {
        var field = this.fields[name];
        field.value = value;
        if (field.rules && field.rules.length > 0) {
          field.errors = [];
          field.validating = true;
          field.key = uuid();
          Validator.validate(field.rules, value, this.setFeildError.bind(this, name, field.key));
        }
      }

      /**
       * 提交前的验证
       * @param callBack    callBack(errors,values)
       */
      validateFields(callBack) {
        this.validateCallBack = callBack;
        this.submiting = true;
        //清Error
        for (var name in this.fields) {
          if (typeof name !== "function") {
            this.fields[name].errors=[];
          }
        }
        //再驗證
        for (var name in this.fields) {
          if (typeof name !== "function") {
            this.validateField(name, this.fields[name].value);
          }
        }
      }

      getFieldValue(name) {
        return this.fields[name].value;
      }

      /**
       * 添加错误
       * @param name
       * @param key
       * @param error
       */
      setFeildError(name, key, error) {
        var field = this.fields[name];
        //if equal push
        if (key == field.key) {
          var errors = field.errors || [];
          errors.push(error);
          if (errors.length == field.rules.length) {
            field.validating = false;
            if (this.submiting == true) {

              var success = this.canSubmit();
              if (success) {
                this.validateCallBack(this.getTotalErrors(), this.getTotalValues())
                this.submiting = false;
              }
            }
            this.setState({key: uuid()}) //验证完成后强制刷新View 目前没想到更好的办法
          }
        }
        //if not equal ,drop the error
      }

      getTotalErrors() {
        var totalErrors = []
        for (var name in this.fields) {

          if (typeof name !== "function") {
            var errors = this.fields[name].errors;
            for (var i = 0; i < errors.length; i++) {
              if (errors[i]) {
                totalErrors.push(errors[i]);
              }
            }
          }
        }
        return totalErrors.length == 0 ? null : totalErrors;
      }

      getTotalValues() {
        var values = {};
        for (var name in this.fields) {
          if (typeof name !== "function") {
            values[name] = this.fields[name].value;
          }
        }
        return values;
      }

      canSubmit() {
        var canSubmit = true;
        for (var _name in this.fields) {
          if (typeof _name !== "function") {
            //如果没验证完
            if (this.fields[_name].errors.length != this.fields[_name].rules.length) {
              canSubmit = false;
            }
          }
        }
        return canSubmit;
      }

      isFieldValidating(name) {
        return this.fields[name].validating;
      }

      /**
       * 返回第一个错误信息
       * @param name
       * @returns {*}
       */
      getFieldError(name) {
        var errors = this.fields[name].errors || [];
        for (var i = 0; i < errors.length; i++) {
          if (errors[i]) {
            return errors[i];
          }
        }
        return null;
      }

      render() {


        const formProps = {
          form: {
            getFieldDecorator: this.getFieldDecorator.bind(this),
            validateField: this.validateField.bind(this),
            isFieldValidating: this.isFieldValidating.bind(this),
            getFieldError: this.getFieldError.bind(this),
            getFieldValue: this.getFieldValue.bind(this),
            validateFields: this.validateFields.bind(this)
          }
        }
        const props = {
          ...this.props,
          ...formProps
        }
        return <WrappedComponent {...props}/>
      }
    }

    return InnerComponent;
  }

  return decorate;
}


export default createForm;
