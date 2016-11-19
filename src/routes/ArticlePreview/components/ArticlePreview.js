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

import 'components/util/date'
const iconAdd = require('static/images/icon_add.gif');
class ArticlePreview extends React.Component {
  static propTypes = {
    fetching          : React.PropTypes.bool.isRequired,
    page              : React.PropTypes.object.isRequired,
    query             : React.PropTypes.object.isRequired,
    searchValue       : React.PropTypes.string.isRequired,
    fetchArticleList  : React.PropTypes.func.isRequired,
    clearArticleList  : React.PropTypes.func.isRequired,
    setSearchValue    : React.PropTypes.func.isRequired,
    deleteArticle    : React.PropTypes.func.isRequired
  }
  componentWillMount() {
    //this.queryArticleList(1);
    this.props.fetchArticleList(1)
  }
  componentWillUnmount() {
    this.props.clearArticleList();
  }
  handleQueryArticle(e) {
    e.preventDefault();
    var targetPage = e.currentTarget.getAttribute("data-page");
    this.props.fetchArticleList(targetPage);
  }

  handleSearchValueChange(e){
    e.preventDefault();
    var value=e.target.value;
    this.props.setSearchValue(value);
  }

  handleSearch(e){
    e.preventDefault();
    var {query,searchValue} = this.props;
    query.title=searchValue;
    this.props.fetchArticleList(1,query);
  }

  handleColumnClick(e){
    e.preventDefault();
    const columnId=  e.target.getAttribute("data-column-id");
    var query=this.props.query;
    query.columnId=columnId;
    this.props.fetchArticleList(1,query);
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
        comments: article.comments?<Link to={`/article/${article.id}/1`}>{article.comments}</Link>:article.comments,
        operation: (
          <span>
            <Link to={`/article/detail/${article.id}/readOnly`}>详细</Link>
            <Link to={`/article/detail/${article.id}/edit`}>编辑</Link>
            <a href="#" data-id={article.id} onClick={this.handleDeleteArticle.bind(this)}>删除</a>
          </span>
        )
      }
    });
    return (
      <Card title={<span>文章管理223343</span>}>
        <Helmet title="文章管理"/>
        <div className="total">
          <span className="xe"><Link to="/article/detail/new/edit"><Button prefixCls="add-btn" ><img
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
