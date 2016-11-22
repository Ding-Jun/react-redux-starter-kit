/**
 * Created by admin on 2016/11/22.
 */
import React from 'react'
import $ from 'jquery'
import 'cropper'
import 'cropper/dist/cropper.css'

class Cropper extends React.Component{
    constructor(props){
      super(props);
      // Operations usually carried out in componentWillMount go here
    }
    crop(){

    }
    render(){
        return (
          <div ref="container" {...this.props}>
            <img  style={{width: "280px", height: "280px"}}/>
            some
          </div>
        )
    }
}
export default Cropper;
