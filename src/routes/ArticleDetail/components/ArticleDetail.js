import React from 'react'
import Helmet from 'react-helmet'
import Card from 'components/Card'
import Form from 'components/Form'
import Input from 'components/Input'
import Button from 'components/Button'
import Modal from 'components/Modal'
import isNumber from 'lodash/isNumber'
import 'components/util/date'

const ARTICLE_READ_TYPE = 'readOnly'
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
    const { fetchColumnSelect, fetchArticle, params} = this.props;

    fetchColumnSelect();
    if( isNumber(params.articleId) ){
      fetchArticle( params.articleId );
    }

  }
  componentWillUnmount() {
    this.props.clearArticle();
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
    const {articleId, type} = this.props.params;
    if( type == ARTICLE_EDIT_TYPE ){
      if(articleId !== 'new'){
        this.props.editArticle(ARTICLE_EDIT_TYPE)
      }
      else {
        this.props.editArticle(ARTICLE_ADD_TYPE)
      }
    }

  }
  render(){
    const { params, columnSelect} = this.props;
    const props= this.props;
    const {articleId, type} = params;
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
                                               /></span>}
             </FormItem> : null}
           <FormItem label="文章标题缩略图：" required={!readOnly} help={readOnly?null:"上传尺寸：200px*150px，图片格式仅限为：jpg、gif、png，文件大小为200KB以内。"}>
             <div><img id="titleImg" src={props.titleImg}/></div>
             {readOnly ? null : <span><Input ref="titleImgSrc" data-target="titleImg" type="file" size="40"/></span>}
           </FormItem>
           {readOnlyContents}
           <FormItem label="摘要：" required={!readOnly}>
             {readOnly ? props.summary : <span>
                  <Input type="textarea" cols="90" rows="5" value={props.summary} name="summary"
                         onChange={this.handleFieldChange.bind(this)}/>
                <br />
                  字数上限：50</span>}

           </FormItem>
           <FormItem label="正文：" required={!readOnly}>
             {readOnly ? <Input  id="contents" type="textarea" cols="90" rows="5" value={props.contents} name="contents"
                                readOnly/> :
               <Input  id="contents" type="textarea" cols="90" rows="5" value={props.contents} onChange={this.handleFieldChange.bind(this)} name="contents"
               />/*去掉了onCHange  有tinymce 没啥用*/}
             {/*<TinyMCEInput tinymceConfig={TINYMCE_CONFIG}></TinyMCEInput>*/}

           </FormItem>
           <FormItem>
             <Button prefixCls="btn_4"  style={{margin: "3px"}} onClick={readOnly?null:this.handleEditArticle.bind(this)}>{readOnly?'编辑信息':'保存'}</Button>
             <Button prefixCls="btn_4"  style={{margin: "3px"}}>返回</Button>
           </FormItem>
         </Form>
       </Card>
      )
  }
}
export default ArticleDetail;