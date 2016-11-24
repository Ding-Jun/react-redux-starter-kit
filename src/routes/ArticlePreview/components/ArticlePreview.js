/**
 * Created by admin on 2016/10/13.
 */
import React from 'react'
import {Link} from 'react-router'
import Card from 'components/Card'
import Table from 'components/Table'
import Button from 'components/Button'
import Pagination from 'components/Pagination'
import Helmet from 'react-helmet'
import { APP_ROOT } from 'constant'
import 'components/util/date'
const iconAdd = require('static/images/icon_add.gif');
class ArticlePreview extends React.Component {
  static propTypes = {
    fetching          : React.PropTypes.bool.isRequired,
    page              : React.PropTypes.object.isRequired,
    searchValue       : React.PropTypes.string.isRequired,
    fetchArticleList  : React.PropTypes.func.isRequired,
    clearArticleList  : React.PropTypes.func.isRequired,
    setSearchValue    : React.PropTypes.func.isRequired,
    deleteArticle    : React.PropTypes.func.isRequired
  }
  componentDidMount() {
    if(this.props.page && this.props.page.curPage ) return;
    const {location:{query},params,fetchArticleList,setSearchValue} = this.props;
    setSearchValue(query.title||'');
    fetchArticleList(params.targetPage||1,query)
  }
  componentWillUnmount() {
    this.props.clearArticleList();
  }
  componentWillReceiveProps(nextProps){
    const { location,fetchArticleList,setSearchValue} = this.props;
    if(location!== nextProps.location){
      setSearchValue(nextProps.location.query.title||'');
      fetchArticleList(nextProps.params.targetPage,nextProps.location.query);
    }
  }
  handleQueryArticle(e) {
    e.preventDefault();
    const {location:{query}, router } = this.props;
    var targetPage = e.currentTarget.getAttribute("data-page");
    const location = {
      pathname:`${APP_ROOT}/article/preview/${targetPage}`,
      query:query
    }
    router.push(location)
  }

  handleSearchValueChange(e){
    e.preventDefault();
    var value=e.target.value;
    this.props.setSearchValue(value);
  }

  handleSearch(e){
    e.preventDefault();
    const {location:{query,pathname}, router,searchValue } = this.props;
    const location = {
      pathname:`${APP_ROOT}/article/preview/1`,
      query:{...query,title:searchValue}
    }
    router.push(location)
  }

  handleColumnClick(e){
    e.preventDefault();
    const {location:{query,pathname}, router } = this.props;
    const columnId=  e.target.getAttribute("data-column-id");
    const location = {
      pathname:`${APP_ROOT}/article/preview/1`,
      query:{...query,columnId:columnId}
    }
    router.push(location)
  }

  handleDeleteArticle(e){
    e.preventDefault();
    var targetId = e.currentTarget.getAttribute("data-id");
    console.log('targetId',targetId);
    var r = confirm("确认删除?");
    if (r == true) {
      this.props.deleteArticle(targetId);
    }
  }

  render() {
    const title= '文章管理';
    const {page,fetching,searchValue} = this.props;
    const columns = [{title: '标题', dataIndex: 'title', width: "39%", key: 'title'},
      {title: '所属分类', dataIndex: 'columnName', width: "8%", key: 'columnName', isOptd: true},
      {title: '浏览量', dataIndex: 'pageviews', width: "7%", key: 'pageviews'},
      {title: '点赞数', dataIndex: 'likes', width: "6%", key: 'likes'},
      {title: '评论数', dataIndex: 'comments', width: "8%", key: 'comments', isOptd: true},
      {title: '发布时间', dataIndex: 'createTime', width: "8%", key: 'createTime'},
      {title: '排序', dataIndex: 'sort', width: "5%", key: 'sort'},
      {title: '置顶？', dataIndex: 'isStick', width: "4%", key: 'isStick'},
      {title: '状态', dataIndex: 'status', width: "6%", key: 'status'},
      {title: '操作', dataIndex: 'operation', width: "9%", key: 'operation', isOptd: true}];
    var dataList = page && page.rowData || [];
    var dataSource = dataList.map((article)=> {
      var status;
      switch (article.status){
        case 0:status='已停止';break;
        case 1:status='已发布';break;
        default:status='unknown';
      }
      return {
        id: article.id,
        title: article.title,
        columnName: <a href="#" data-column-id={article.columnId} onClick={this.handleColumnClick.bind(this)}>{article.columnName}</a>,
        pageviews: article.pageviews,
        likes: article.likes,
        createTime: new Date(article.createtime).Format("yyyy-MM-dd"),
        sort: article.sort,
        isStick: article.stick==1?'是':null,
        status: status,
        comments: article.comments?<Link to={{pathname:`${APP_ROOT}/article/comment/1`,query:{objectId:article.id}}}>{article.comments}</Link>:article.comments,
        operation: (
          <span>
            <Link to={{ pathname: `${APP_ROOT}/article/detail/${article.id}`, query: { type: 'read' } }} >详细</Link>
            <Link to={{ pathname: `${APP_ROOT}/article/detail/${article.id}`, query: { type: 'edit' } }}>编辑</Link>
            <a href="#" data-id={article.id} onClick={this.handleDeleteArticle.bind(this)}>删除</a>
          </span>
        )
      }
    });
    return (
      <Card title={title}>
        <Helmet title={title}/>
        <div className="total">
          <span className="xe"><Link to={{ pathname: `${APP_ROOT}/article/detail/new`, query: { type: 'edit' } }}><Button prefixCls="add-btn" ><img
            src={iconAdd}/> 新增</Button></Link></span>请输入关键字搜索：
          <input className="input1" type="text" value={searchValue} onChange={this.handleSearchValueChange.bind(this)} /> <Button onClick={this.handleSearch.bind(this)}>搜索</Button>
        </div>
        <Table dataSource={dataSource} columns={columns} loading={fetching}/>
        <Pagination  page={page} onClick={this.handleQueryArticle.bind(this)}/>
      </Card>
    )
  }
}
export default ArticlePreview;
