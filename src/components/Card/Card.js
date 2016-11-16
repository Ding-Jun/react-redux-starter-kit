/**
 * Created by admin on 2016/10/13.
 */
import React from 'react'
class Card extends React.Component{
    constructor(props){
      super(props);
      // Operations usually carried out in componentWillMount go here
    }


    render(){
        return (
         <div style={this.props.style} className="card">
           <div className="card-title">{this.props.title}</div>
           {this.props.children}
         </div>
        )
    }
}
export default Card;
