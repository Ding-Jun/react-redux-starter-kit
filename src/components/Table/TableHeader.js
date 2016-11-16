/**
 * Created by admin on 2016/10/14.
 */
import React from 'react'
class TableHeader extends React.Component{
    constructor(props){
      super(props);
      // Operations usually carried out in componentWillMount go here
    }
    render(){
        return (
         <thead>{this.props.children}</thead>
        )
    }
}
export default TableHeader;
