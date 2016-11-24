import React from 'react'
import Helmet from 'react-helmet'
import $ from 'jquery'
import 'wangeditor'
import 'cropper'
import 'cropper/dist/cropper.css'
import Card from 'components/Card'
import Form from 'components/Form'
import Input from 'components/Input'
import Button from 'components/Button'
import Modal from 'components/Modal'
import Cropper from 'components/Cropper'
import 'components/util/date'
import getObjectUrl from 'components/util/getObjectUrl'
import {APP_ROOT} from 'constant'
const ARTICLE_READ_TYPE = 'read'
const ARTICLE_EDIT_TYPE = 'edit'
const ARTICLE_ADD_TYPE = 'add'
const FormItem = Form.Item
class ArticleDetail extends React.Component{
  constructor(props){
    super(props);
    // Operations usually carried out in componentWillMount go here
  }

  componentDidMount() {
    //this.queryArticleList(1);
    const { fetchColumnSelect, fetchArticle, params:{articleId},location: { query }} = this.props;

    fetchColumnSelect();
    if( !isNaN(articleId) ){
      //编辑文章 先获取数据在穿件富文本编辑器
      fetchArticle( articleId,function() {
        console.log("heheheeee")
        if(query.type === ARTICLE_EDIT_TYPE){
          this.createEditor();
        }

      }.bind(this));
    }else{
      //新增文章 直接创建富文本编辑器
      this.createEditor();
    }

  }
  componentWillUnmount() {
    this.props.clearArticle();
    if(this.editor){
      console.log('destroyeee');
      this.editor.destroy();
    }
  }
  handleFileChange(e) {
    e.preventDefault();
    var targetImg = e.target.getAttribute("data-target")
    var file = e.target.files[0];
    if (file) {
      var objUrl = getObjectUrl(file)

      this.props.openModal()
      console.log("targetImg", targetImg)
      var options = {
        aspectRatio: targetImg != "titleImg" ? 64 / 35 : 4 / 3,
        autoCropArea: 0.7,
        strict: true,
        //guides: false,
        center: true,
        highlight: false,
        //dragCrop: false,
        //cropBoxMovable: false,
        //cropBoxResizable: false,
        zoom: -0.2,
        checkImageOrigin: true,
        background: false,
        minContainerHeight: 400,
        minContainerWidth: 300
      }
      console.log("aspectRatio", options.aspectRatio)
      $("#img-container").html('<img  style="width: 100%;height:100%">');
      $('#img-container > img').attr("src", objUrl)
      $("#img-container img").cropper(options);
      this.props.startCropPicture();
      this.targetImg =targetImg
      //this.setState({targetImg: targetImg,cropping:true})
    }

  }

  handleOk(){

  }
  handleCrop(e) {
    var size = {
      width: 640,
      height: 350
    }
    if (this.targetImg == "titleImg") {
      size.width = 200;
      size.height = 150
    }
    console.log("Size",size)
    e.preventDefault();

    var $image = $('#img-container > img');
    var dataURL = $image.cropper("getCroppedCanvas", size);
    var imgurl = dataURL.toDataURL("image/jpeg", 0.5).replace(/^data:image\/(png|jpeg);base64,/, '');
    //$("#titleImg").attr("src", imgurl);

    $.ajax({
      type: 'POST',
      url:  `/nczl-web/rs/common/uploadImgOfBase64`,
      dataType: 'json',
      data:{'file':imgurl,'extname':'jpeg'},//{'a':'b'},
      //processData: false,
      //contentType: false,
      //contentType:'multipart/form-data',
      success: function (rm) {
        if (rm.code == 1) {
          //console.log("debug",this.state)
          this.props.setArticle( this.targetImg, rm.data );

          console.log('成功', );
        }
        console.log('debug', rm);
      }.bind(this)
    })

    this.props.closeModal();
    this.props.endCropPicture();
  }

  // 创建富文本编辑器
  createEditor(){
    this.editor = new window.wangEditor('div1');
    this.editor.config.uploadImgUrl = '/upload';
    this.editor.create();
  }
  // 获取富文本编辑器内容
  getContent () {
    var content = this.editor.$txt.html();
    console.log(content);
    return content;
  }
  handleFieldChange(e) {
    let name = e.target.name;
    const {setArticle} = this.props
    let value = e.target.value;
    if(name == 'summary'){
      value = value.substr(0, 50);
    }
    setArticle( name, value );
    console.log("handleFieldChange", name, "--", value)
  }
  handleEditArticle(e){
    e.preventDefault();
    const {params:{articleId}, location:{query}} = this.props;
    if( query.type == ARTICLE_EDIT_TYPE ){
      if(articleId !== 'new'){
        this.props.editArticle(ARTICLE_EDIT_TYPE, this.getContent())
      }
      else {
        this.props.editArticle(ARTICLE_ADD_TYPE, this.getContent())
      }
    }
  }
  handleReadToEdit(e){
    e.preventDefault();
    const {router:{push},location:{pathname}}=this.props;
    push({
      pathname: pathname,
      query: { type: ARTICLE_EDIT_TYPE }
    })
    this.createEditor();
  }
  handleGoBack(e){
    e.preventDefault();
    const {router:{push}}=this.props;
    push({
      pathname: `${APP_ROOT}/article/preview/1`,
    })
  }
  render(){
    console.log("render and render again")
    const { params:{articleId},location:{query}, columnSelect, cropping, modalOption} = this.props;
    const props= this.props;
    const { type} = query;
    const readOnly = type == ARTICLE_READ_TYPE;
    const title = readOnly ? '文章详细' : '文章编辑';
    var status;
    switch (props.status) {
      case 0:
        status = '已停止';
        break;
      case 1:
        status = '已发布';
        break;
      default:
        status = 'unknown';
    }
    var readOnlyContents = null;
    if (readOnly) {
      readOnlyContents = [
        <FormItem label="发布时间：" key="time" >{new Date(props.createtime).Format("yyyy-MM-dd")}</FormItem>,
        <FormItem label="总浏览量：" key="pageviews" ><a href="#">{props.pageviews}</a></FormItem>,
        <FormItem label="评论数：" key="comments" >{props.comments}</FormItem>
      ]
    }
    var columnSelector = columnSelect.map((column)=> {
      return <option key={column.id} value={column.id}>{column.columnName}</option>
    })
    columnSelector = <select value={articleId ? props.columnId : 1} name="columnId"
                           onChange={this.handleFieldChange.bind(this)}>{columnSelector}</select>
      return (
       <Card title={ title }>
         <Helmet title={title}/>
         <Form>
           <FormItem label="标题：" required={!readOnly}>
             {readOnly ? props.title :
               <Input size="60" value={props.title} name="title" onChange={this.handleFieldChange.bind(this)}/>}
           </FormItem>

           <FormItem label="作者&身份：" required={!readOnly}>
             {readOnly ? props.author :
               <Input size="20" value={props.author} name="author" onChange={this.handleFieldChange.bind(this)}/>}
           </FormItem>

           <FormItem label="所属分类：" required={!readOnly}>
             {readOnly ? props.columnName : columnSelector}
           </FormItem>

           <FormItem label="状态：">
             {readOnly ? status :
               <select value={props.status} name="status" onChange={this.handleFieldChange.bind(this)}>
                 <option value={0}>停止</option>
                 <option value={1}>马上发布</option>
               </select>}
           </FormItem>

           <FormItem label="置顶：">
             {readOnly ? (props.stick ? '是' : '否') :
               <select value={props.stick} name="stick" onChange={this.handleFieldChange.bind(this)}>
                 <option value={0}>否</option>
                 <option value={1}>是</option>
               </select>
             }
           </FormItem>
           {props.stick == 1 ?
             <FormItem label="置顶标题图：" required={!readOnly} help={readOnly?null:"上传尺寸：640px*350px，图片格式仅限为：jpg、gif、png，文件大小为500KB以内。"}>
               <div><img id="stickImg" src={props.stickImg}/></div>
               {readOnly ? null : <span><Input ref="stickImgSrc" data-target="stickImg" type="file" size="40"
                                               onChange={this.handleFileChange.bind(this)} /></span>}
             </FormItem> : null}
           <FormItem label="文章标题缩略图：" required={!readOnly} help={readOnly?null:"上传尺寸：200px*150px，图片格式仅限为：jpg、gif、png，文件大小为200KB以内。"}>
             <div><img id="titleImg" src={props.titleImg}/></div>
             {readOnly ? null : <span><Input ref="titleImgSrc" data-target="titleImg" type="file" size="40"
                                             onChange={this.handleFileChange.bind(this)} /></span>}
           </FormItem>
           {readOnlyContents}
           <FormItem label="摘要：" required={!readOnly}>
             {readOnly ? props.summary : <span>
                  <Input type="textarea" cols="90" rows="5" value={props.summary} name="summary"
                         onChange={this.handleFieldChange.bind(this)}/>
                <br />
                  字数上限：50</span>}
            <Cropper className={cropping?null:""} id="img-container" style={{maxHeight: "500px"}}/>
           </FormItem>
           <FormItem label="正文：" required={!readOnly}>
             <div style={{maxWidth:'1080px'}}>
               <div id="div1" style={{minHeight:'400px'}} dangerouslySetInnerHTML={{__html:props.contents}}/>
             </div>
           </FormItem>
           <FormItem>
             <Button prefixCls="btn_4"  style={{margin: "3px"}} onClick={readOnly?this.handleReadToEdit.bind(this):this.handleEditArticle.bind(this)}>{readOnly?'编辑信息':'保存'}</Button>
             <Button prefixCls="btn_4"  style={{margin: "3px"}} onClick={this.handleGoBack.bind(this)}>返回</Button>
           </FormItem>
         </Form>
         <Modal id="modals" {...modalOption} onClose={this.props.closeModal.bind(this)}
                onOk={cropping?this.handleCrop.bind(this):(this.handleOk.bind(this))}
         >
           <div className={cropping?null:"hide"} id="img-container2" style={{maxHeight: "500px"}}>
             <img  style={{width: "280px", height: "280px"}}/>
           </div>
         </Modal>
       </Card>
      )
  }
}
export default ArticleDetail;
