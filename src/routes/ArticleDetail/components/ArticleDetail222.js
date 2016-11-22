/**
 * Created by admin on 2016/10/13.
 */
import React from 'react'
import Card from 'components/Card'
import Form from 'components/Form'
import Input from 'components/Input'
import Button from 'components/Button'
import $ from 'jquery'
import 'cropper'
import 'cropper/dist/cropper.css'
import Modal from 'components/Modal'
import 'components/util/date'

import getObjectUrl from 'components/util/getObjectUrl'
//import TinyMCEInput from 'components/util/TinyMCEInput'
const FromItem = Form.Item

class ArticleDetail extends React.Component {
  constructor(props) {
    super(props);
    // Operations usually carried out in componentWillMount go here
    this.state = {
      id: this.props.params.articleId,
      readOnly: this.props.location.query.type != 'edit',
      loading: false,
      article: {columnId: 1,status:0,stick:0},

      columns: [],
      targetImg: "",
      cropping:false,
    validateError:false
    }
  }

  componentWillMount() {
    this.queryArticleById(this.state.id);
    this.queryColumnList();
  }

  queryColumnList() {
    $.ajax({
      type: 'GET',
      url: `/nczl-web/rs/column/select`,
      dataType: 'json',
      success: function (rm) {
        if (rm.code == 1) {
          console.log('debug', rm.result);
          this.setState({
            columns: rm.result
          })
        }
      }.bind(this)
    })
  }

  queryArticleById(id) {
    if (this.state.id == 'new') {
      this.setState({article: {columnId: 1}})
    } else {
      this.setState({loading: true})

      $.ajax({
        type: 'GET',
        url: `/nczl-web/rs/article/detail?id=${id}`,
        dataType: 'json',
        success: function (rm) {
          if (rm.code == 1) {
            console.log('debug', rm.result);
            var article = rm.result
            article.content = article.contents;
            this.setState({
              article: article,
              loading: false,
              id: article.id
            })
          }
        }.bind(this)
      })
    }
  }

  handleFileChange(e) {
    e.preventDefault();
    var targetImg = e.target.getAttribute("data-target")
    var file = e.target.files[0];
    if (file) {
      var objUrl = getObjectUrl(file)

      //this.openModal()
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
      this.setState({targetImg: targetImg,cropping:true})
    }

  }

  handleCrop(e) {
    var size = {
      width: 640,
      height: 350
    }
    if (this.state.targetImg == "titleImg") {
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
         var {article,targetImg}=this.state;
          article[targetImg]=rm.data;
         this.setState({
           article:article
         })
          console.log('成功', );
         }
        console.log('debug', rm);
      }.bind(this)
    })

    this.closeModal();
    this.setState({cropping:false});
  }

  handleFieldChange(e) {
    const name = e.target.name;
    var article = this.state.article
    article[name] = e.target.value;
    if (name == 'summary') {
      article[name] = e.target.value.substr(0, 50);
    }
    if (name == 'contents') {
      article['content'] = article[name]
    }
    this.setState({
      article: article
    })
    console.log("handleFieldChange", e.target.value, "--", article)
  }

  openModal() {
    this.setState({modalVisible: true})
  }

  closeModal() {
    this.setState({modalVisible: false,modalMsg:null,validateError:false})
  }

  handleOk(e) {
    e.preventDefault();
    this.closeModal();
    this.props.actions.goBack();
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.state.readOnly) {
      this.setState({
        readOnly: false
      })
    }
    else {
      this.handleEditArticle()
    }
  }

  handleEditArticle() {
    const method = this.state.id == 'new' ? 'add' : 'edit';
    var content = tinymce.get('contents').getContent();
    console.log("content", content);
    console.log("handleEditArticle m", method)
    //var data = new FormData($('#form')[0]);
    this.state.article.content=content;
    //validate
    if(!this.state.article.title){
      this.setState({
        modalMsg: "标题不能为空，请重新填写",
        modalVisible:true,
        validateError:true
      })
      return
    }
    if(!this.state.article.content){
      this.setState({
        modalMsg: "正文不能为空，请重新填写",
        modalVisible:true,
        validateError:true
      })
      return
    }
    $.ajax({
      type: 'POST',
      url: `/nczl-web/rs/article/${method}`,
      dataType: 'json',
      data: this.state.article,
      success: function (rm) {
        if (rm.code == 1) {
          console.log('debug', rm.result);

          this.setState({
            modalMsg: "操作成功"
          })
        } else {
          this.setState({
            modalMsg: "错误：" + rm.message
          })
        }
        this.openModal()
      }.bind(this)
    })
  }

  handleReturn(e) {
    e.preventDefault();

    this.props.actions.goBack();
  }

  renderForm() {
    const {readOnly, article,cropping}=this.state;
    var status;
    switch (article.status) {
      case 0:
        status = '已停止';
        break;
      case 1:
        status = '已发布';
        break;
      default:
        status = 'unknown';
    }
    var columnSelect = this.state.columns.map((column)=> {
      return <option key={column.id} value={column.id}>{column.columnName}</option>
    })
    columnSelect = <select value={this.state.id == 'new' ? 1 : article.columnId} name="columnId"
                           onChange={this.handleFieldChange.bind(this)}>{columnSelect}</select>
    var readOnlyContents = null;
    if (readOnly) {
      readOnlyContents = [
        <FromItem label="发布时间：" key="time">{new Date(article.createtime).Format("yyyy-MM-dd")}</FromItem>,
        <FromItem label="总浏览量：" key="pageviews"><a href="#">{article.pageviews}</a></FromItem>,
        <FromItem label="评论数：" key="comments">{article.comments}</FromItem>
      ]
    }
    return (
      <Form ref="form" id="form" onSubmit={this.handleSubmit.bind(this)}>
        <FromItem label="标题：" required={!readOnly}>
          {readOnly ? article.title :
            <Input size="60" value={article.title} name="title" onChange={this.handleFieldChange.bind(this)}/>}
        </FromItem>
        <FromItem label="作者&身份：" required={!readOnly}>
          {readOnly ? article.author :
            <Input size="20" value={article.author} name="author" onChange={this.handleFieldChange.bind(this)}/>}
        </FromItem>
        <FromItem label="所属分类：" required={!readOnly}>
          {readOnly ? article.columnName : columnSelect}
        </FromItem>
        <FromItem label="状态：">
          {readOnly ? status :
            <select value={article.status} name="status" onChange={this.handleFieldChange.bind(this)}>
              <option value={0}>停止</option>
              <option value={1}>马上发布</option>
            </select>}
        </FromItem>
        <FromItem label="置顶：">
          {readOnly ? (article.stick ? '是' : '否') :
            <select value={article.stick} name="stick" onChange={this.handleFieldChange.bind(this)}>
              <option value={0}>否</option>
              <option value={1}>是</option>
            </select>
          }
        </FromItem>
        {article.stick == 1 ?
          <FromItem label="置顶标题图：" required={!readOnly} help={readOnly?null:"上传尺寸：640px*350px，图片格式仅限为：jpg、gif、png，文件大小为500KB以内。"}>
            <div><img id="stickImg" src={article.stickImg}/></div>
            {readOnly ? null : <span><Input ref="stickImgSrc" data-target="stickImg" type="file" size="40"
                                            onChange={this.handleFileChange.bind(this)}/></span>}
          </FromItem> : null}
        <FromItem label="文章标题缩略图：" required={!readOnly} help={readOnly?null:"上传尺寸：200px*150px，图片格式仅限为：jpg、gif、png，文件大小为200KB以内。"}>
          <div><img id="titleImg" src={article.titleImg}/></div>
          {readOnly ? null : <span><Input ref="titleImgSrc" data-target="titleImg" type="file" size="40"
                                          onChange={this.handleFileChange.bind(this)}/></span>}
          <div className={cropping?null:"hide"} id="img-container" style={{maxHeight: "500px"}}>
            <img  style={{width: "280px", height: "280px"}}/>
          </div>
        </FromItem>

        {readOnlyContents}
        <FromItem label="摘要：" required={!readOnly}>
          {readOnly ? article.summary : <span>
                  <Input type="textarea" cols="90" rows="5" value={article.summary} name="summary"
                         onChange={this.handleFieldChange.bind(this)}/>
                <br />
                  字数上限：50</span>}

        </FromItem>
        <FromItem label="正文：" required={!readOnly}>
          {readOnly ? <Input key="read" id="contents" type="textarea" cols="90" rows="5" value={article.contents} name="contents"
                             readOnly/> :
            <Input key="write" id="contents" type="textarea" cols="90" rows="5" value={article.contents} name="contents"
                   />/*去掉了onCHange  有tinymce 没啥用*/}
          {/*<TinyMCEInput tinymceConfig={TINYMCE_CONFIG}></TinyMCEInput>*/}

        </FromItem>
        <FromItem>
          <Button prefixCls="btn_4" onClick={this.handleSubmit.bind(this)} style={{margin: "3px"}}>{readOnly?'编辑信息':'保存'}</Button>
          <Button prefixCls="btn_4" onClick={this.handleReturn.bind(this)} style={{margin: "3px"}}>返回</Button>
        </FromItem>
      </Form>
    )
  }

  render() {
    const {readOnly, loading,cropping,validateError}=this.state;

    //console.log(this.props.params.type,this.props.params.id);
    return (
      <Card ref="card" title={<span>{readOnly ? '文章详细' : '文章编辑'}</span>}>
        {loading ? '加载中' : this.renderForm()}
        <Modal title={cropping?"图片裁剪":"信息"} visible={this.state.modalVisible} closable={true} onClose={this.closeModal.bind(this)}
               onOk={cropping?this.handleCrop.bind(this):(validateError?this.closeModal.bind(this):this.handleOk.bind(this))}
        >{this.state.modalMsg}
          <div className={cropping?null:"hide"} id="img-container2" style={{maxHeight: "500px"}}>
            <img  style={{width: "280px", height: "280px"}}/>
          </div>
        </Modal>

        {this.props.children}
      </Card>
    )
  }
}
export default ArticleDetail;
