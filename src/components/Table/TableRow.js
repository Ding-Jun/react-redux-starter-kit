/**
 * Created by admin on 2016/10/14.
 */
import React from 'react'
class TableRow extends React.Component{
    constructor(props){
      super(props);
      // Operations usually carried out in componentWillMount go here
    }
    render(){
        return (
         <tr>{this.props.children}</tr>
        )
    }
}
export default TableRow;
