/**
 * Created by admin on 2016/10/13.
 */
import React from 'react'
class Logo extends React.Component{
    constructor(props){
      super(props);
      // Operations usually carried out in componentWillMount go here
    }
    render(){
        return (
         <div className="logo">{this.props.children}</div>
        )
    }
}
export default Logo;
