/**
 * Created by admin on 2016/10/20.
 */

class Validator {
  /**
   * 验证入口  有些东西长度为0就不验了
   * @param rule
   * @param value
   * @param callback
   * @returns {boolean}
   */
  static validate(rules, value, callback) {
    var err = false;
    //console.log("start validate")
    rules = rules || [];
    rules.forEach((rule)=> {
      switch (rule.type) {
        case 'length':  //validate String length
          err = this.validateLength(rule, value);
          break;
        case 'range': //validate Number range
          err = this.validateRange(rule, value);
          break;
        case 'pattern': //validate RegExp
          err = this.validatePattern(rule, value);
          break;
        case 'phoneNo': //validate RegExp
          err = this.validatePhoneNo(rule, value);
          break;
        case 'char-normal':
          if (!value) break;
          err = this.validateCharNormal(rule, value);
          break;
        case 'char-chinese':
          if (!value) break;
          err = this.validateCharChinese(rule, value);
        case 'function':
          rule.validate instanceof Function ?
            err = rule.validate(rule, value, callback) : console.warn("rule.validate is not a function ", rule)
          //this err is not in use
          break;
        default:
          console.warn("no such rule:", rule);
      }
      if (rule.type != 'function') {
        err ? callback(new Error(rule.message)) : callback();
      }
      return err;
    })
    return err;

  }

  /**
   * 验证字符串长度
   * @param rule
   * @param value
   * @returns {boolean} 错误：true 通过：false
   */
  static validateLength(rule, value) {
    var err = false;
    if (!('min' in rule) && !('min' in rule)) {
      console.warn('you are validate length but both "min" and "max" are not set');
    }
    if ('min' in rule) {
      err = value.length < rule.min;
    }
    if (err) {
      return err;
    }
    if ('max' in rule) {
      err = value.length > rule.max;
    }

    return err;
  }

  /**
   * 验证数字范围
   * @param rule
   * @param value
   * @returns {boolean} 错误：true 通过：false
   */
  static validateRange(rule, value) {
    var err = false;
    if (!('min' in rule) && !('min' in rule)) {
      console.warn('you are validate length but both "min" and "max" are not set');
    }
    if ('min' in rule) {
      err = value < rule.min;
    }
    if (err) {
      return err;
    }
    if ('max' in rule) {
      err = value > rule.max;
    }

    return err;
  }

  /**
   * 验证正则
   * @param rule
   * @param value
   * @returns {boolean} 错误：true 通过：false
   */
  static validatePattern(rule, value) {
    var pattern = rule.pattern;
    if (!pattern instanceof RegExp) {
      console.warn(" rule.pattern isn't RegExp ", rule);
    }
    return !pattern.test(value);
  }

  /**
   * 验证手机号
   * @param rule
   * @param value
   * @returns {boolean} 错误：true 通过：false
   */
  static validatePhoneNo(rule, value) {
    var pattern = /^1[34578]\d{9}$/;
    return !pattern.test(value);
  }

  /**
   * 验证普通字符 包括数字字母下划线
   * @param rule
   * @param value
   * @returns {boolean} 错误：true 通过：false
   */
  static validateCharNormal(rule, value) {
    var pattern = /^\w+$/;
    return !pattern.test(value);
  }

  /**
   * 验证中文字符 包括中文数字字母下划线
   * @param rule
   * @param value
   * @returns {boolean} 错误：true 通过：false
   */
  static validateCharChinese(rule, value) {
    var pattern = /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/;
    return !pattern.test(value);
  }

}


export default Validator;
