/**
 * Created by admin on 2016/10/13.
 */
import React from 'react'
import {Link} from 'react-router'
import {isArray,isNumber} from 'lodash'
import Helmet from 'react-helmet'
import Card from 'components/Card'
import Table from 'components/Table'
import Button from 'components/Button'
import Pagination from 'components/Pagination'
import 'components/util/date'
import {APP_ROOT} from '../../../constant'

class ArticleComment extends React.Component {

  componentDidMount() {
    const {params,fetchArticleCommentList, location:{query}} = this.props;
    fetchArticleCommentList(params.targetPage||1, query);
  }
  componentWillUnmount() {
    this.props.clearArticleCommentList();
  }
  componentWillReceiveProps(nextProps){
    const { location,fetchArticleCommentList } = this.props;
    if(location!== nextProps.location){
      fetchArticleCommentList(nextProps.params.targetPage,nextProps.location.query);
    }
  }
  handleQueryArticleComment(event) {
    event.preventDefault();
    var targetPage = event.currentTarget.getAttribute("data-page");
    const { router, location:{query} } = this.props;
    const location = {
      pathname:`${APP_ROOT}/article/comment/${targetPage}`,
      query
    }
    router.push(location)
  }

  render() {
    const {articleTitle, page, fetching} = this.props;
    const title = `${articleTitle} 评论信息`;
    const columns = [{title: '评论内容', dataIndex: 'content', width: "39%", key: 'content'},
      {title: '评论微信号', dataIndex: 'wxnickname', width: "8%", key: 'wxnickname'},
      {title: '发表时间', dataIndex: 'createtime', width: "7%", key: 'createtime'}]
    var dataList = page.rowData || [];
    var dataSource = dataList.map((comment)=> {
      return {
        id: comment.id,
        content: comment.content,
        wxnickname: comment.wxnickname,
        createtime: new Date(comment.createtime).Format("yyyy-MM-dd hh:mm:ss")
      }
    })
    return (
      <Card title={title}>
        <Helmet title={title}/>
        <Table dataSource={dataSource} columns={columns} loading={fetching}/>
        <Pagination page={page} onClick={this.handleQueryArticleComment.bind(this)}/>
      </Card>
    )
  }
}
export default ArticleComment;
