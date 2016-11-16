/**
 * Created by admin on 2016/10/14.
 */
import React from 'react'
class TableCell extends React.Component{
    constructor(props){
      super(props);
      // Operations usually carried out in componentWillMount go here
    }
    static defaultProps={
    isOptd:false
}
    render(){
        return (
          <td className={this.props.isOptd?'optd':null} colSpan={this.props.colSpan}>{this.props.children}</td>
        )
    }
}
export default TableCell;
