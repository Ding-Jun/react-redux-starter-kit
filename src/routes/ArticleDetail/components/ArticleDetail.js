import React from 'react'
import Helmet from 'react-helmet'
import Card from 'components/Card'
import Form from 'components/Form'
import Input from 'components/Input'
import Button from 'components/Button'
import Modal from 'components/Modal'
import 'components/util/date'

const ARTICLE_READ_TYPE = 'readOnly'
const ARTICLE_EDIT_TYPE = 'edit'
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
    fetchArticle( params.articleId );
  }
  handleFieldChange(e) {
    const name = e.target.name;
    const {article,setArticle} = this.props
    article[name] = e.target.value;
    if (name == 'summary') {
      article[name] = e.target.value.substr(0, 50);
    }
    if (name == 'contents') {
      article['content'] = article[name]
    }
    setArticle(article)
    console.log("handleFieldChange", e.target.value, "--", article)
  }

  render(){
    const { params, article, columnSelect } = this.props;
    const {articleId, type} = params;
    const readOnly = type == ARTICLE_READ_TYPE;
    const title = readOnly ? '文章详细' : '文章编辑';
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
    var readOnlyContents = null;
    if (readOnly) {
      readOnlyContents = [
        <FormItem label="发布时间：" key="time" >{new Date(article.createtime).Format("yyyy-MM-dd")}</FormItem>,
        <FormItem label="总浏览量：" key="pageviews" ><a href="#">{article.pageviews}</a></FormItem>,
        <FormItem label="评论数：" key="comments" >{article.comments}</FormItem>
      ]
    }
    var columnSelector = columnSelect.map((column)=> {
      return <option key={column.id} value={column.id}>{column.columnName}</option>
    })
    columnSelector = <select value={articleId ? article.columnId : 1} name="columnId"
                           onChange={this.handleFieldChange.bind(this)}>{columnSelector}</select>
      return (
       <Card title={ title }>
         <Helmet title={title}/>
         <Form>
           <FormItem label="标题：" required={!readOnly}>
             {readOnly ? article.title :
               <Input size="60" value={article.title} name="title" onChange={this.handleFieldChange.bind(this)}/>}
           </FormItem>

           <FormItem label="作者&身份：" required={!readOnly}>
             {readOnly ? article.author :
               <Input size="20" value={article.author} name="author" onChange={this.handleFieldChange.bind(this)}/>}
           </FormItem>

           <FormItem label="所属分类：" required={!readOnly}>
             {readOnly ? article.columnName : columnSelector}
           </FormItem>

           <FormItem label="状态：">
             {readOnly ? status :
               <select value={article.status} name="status" onChange={this.handleFieldChange.bind(this)}>
                 <option value={0}>停止</option>
                 <option value={1}>马上发布</option>
               </select>}
           </FormItem>

           <FormItem label="置顶：">
             {readOnly ? (article.stick ? '是' : '否') :
               <select value={article.stick} name="stick" onChange={this.handleFieldChange.bind(this)}>
                 <option value={0}>否</option>
                 <option value={1}>是</option>
               </select>
             }
           </FormItem>
           {article.stick == 1 ?
             <FormItem label="置顶标题图：" required={!readOnly} help={readOnly?null:"上传尺寸：640px*350px，图片格式仅限为：jpg、gif、png，文件大小为500KB以内。"}>
               <div><img id="stickImg" src={article.stickImg}/></div>
               {readOnly ? null : <span><Input ref="stickImgSrc" data-target="stickImg" type="file" size="40"
                                               /></span>}
             </FormItem> : null}
           <FormItem label="文章标题缩略图：" required={!readOnly} help={readOnly?null:"上传尺寸：200px*150px，图片格式仅限为：jpg、gif、png，文件大小为200KB以内。"}>
             <div><img id="titleImg" src={article.titleImg}/></div>
             {readOnly ? null : <span><Input ref="titleImgSrc" data-target="titleImg" type="file" size="40"/></span>}
           </FormItem>
           {readOnlyContents}
           <FormItem label="摘要：" required={!readOnly}>
             {readOnly ? article.summary : <span>
                  <Input type="textarea" cols="90" rows="5" value={article.summary} name="summary"
                         onChange={this.handleFieldChange.bind(this)}/>
                <br />
                  字数上限：50</span>}

           </FormItem>
           <FormItem label="正文：" required={!readOnly}>
             {readOnly ? <Input  id="contents" type="textarea" cols="90" rows="5" value={article.contents} name="contents"
                                readOnly/> :
               <Input  id="contents" type="textarea" cols="90" rows="5" value={article.contents} name="contents"
               />/*去掉了onCHange  有tinymce 没啥用*/}
             {/*<TinyMCEInput tinymceConfig={TINYMCE_CONFIG}></TinyMCEInput>*/}

           </FormItem>
           <FormItem>
             <Button prefixCls="btn_4"  style={{margin: "3px"}}>{readOnly?'编辑信息':'保存'}</Button>
             <Button prefixCls="btn_4"  style={{margin: "3px"}}>返回</Button>
           </FormItem>
         </Form>
       </Card>
      )
  }
}
export default ArticleDetail;
