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

const PASS_STATUS = 1;
const FAIL_STATUS = 2;

class CommentPreview extends React.Component {

  componentDidMount() {
    const {params,fetchCommentList} = this.props;
    fetchCommentList(params.targetPage||1);
  }
  componentWillUnmount() {
    this.props.clearCommentList();
  }
  componentWillReceiveProps(nextProps){
    const { location,fetchCommentList } = this.props;
    if(location!== nextProps.location){
      fetchCommentList(nextProps.params.targetPage);
    }
  }
  handleQueryComment(event) {
    event.preventDefault();
    var targetPage = event.currentTarget.getAttribute("data-page");
    const { router } = this.props;
    const location = {
      pathname:`/comment/preview/${targetPage}`
    }
    router.push(location)
  }

  handleChecked(event) {
    var id = event.target.getAttribute("data-id");
    this.props.checkCommentById(id);
  }

  handleCheckAll() {
    this.props.checkAllComment();
  }

  handlePassVerify(event) {
    console.log("things", "点击");
    event.preventDefault();
    var id = event.currentTarget.getAttribute("data-vid");
    console.log("sasasa---", id);
    var r = confirm("确认通过审核");
    if (r == true) {

      this.props.auditComment( id, PASS_STATUS );
    }
  }

  handleNoPassVerify(event) {
    event.preventDefault();
    var id = event.currentTarget.getAttribute("data-vid");
    var r = confirm("确认不通过审核");
    if (r == true) {
      this.props.auditComment( id, FAIL_STATUS );
    }
  }
  handleBatchVerify(event){
    event.preventDefault();
    var status = event.currentTarget.getAttribute("data-status");
    var checkboxs = this.props.checkboxs;
    var idList = [];
    for (var i = 0; i < checkboxs.length; i++) {
      if (checkboxs[i].checked == true) {
        idList.push(checkboxs[i].id);
      }
    }
    if(idList.length==0){
      alert("没有评论被选中！")
      return
    }
    var r = confirm(status==PASS_STATUS?"确认批量通过审核":"确认批量不通过审核");
    if (r == true) {
      this.props.batchAuditComment( idList.toString(), status );
    }
  }

  render() {
    const { fetching, page, checkboxs, checkAll} = this.props;
    const columns = [
      {title: <input type="checkbox" checked={checkAll} onChange={this.handleCheckAll.bind(this)}/>, dataIndex: 'check', width: "2%", key: 'check'},
      {title: '评论内容', dataIndex: 'content', width: "55%", key: 'content'},
      {title: '评论微信号', dataIndex: 'wxnickname', width: "12%", key: 'wxnickname'},
      {title: '发表时间', dataIndex: 'createTime', width: "12%", key: 'createTime'},
      {title: '操作', dataIndex: 'operation', width: "14%", key: 'operation', isOptd: true}
    ];
    var dataList = page && page.rowData || [];

    var dataSource = dataList.map((comment, i)=> {
      return {
        id: comment.id,
        check: (<input type="checkbox" onChange={this.handleChecked.bind(this)} data-id={comment.id}
                       checked={checkboxs[i].checked}/>),
        content: comment.content,
        wxnickname: comment.wxnickname,
        createTime: new Date(comment.createtime).Format("yyyy-MM-dd"),
        operation: (
          <span>
            <a href="#" data-vid={comment.id} onClick={this.handlePassVerify.bind(this)}
               className="shtg">通过</a> <a href="#" data-vid={comment.id}
                                          onClick={this.handleNoPassVerify.bind(this)} className="shtg">不通过</a>
          </span>
        )
      }
    });
    return (
      <Card title={<span>评论审核</span>}>
        <Helmet title="评论审核"/>
        <div className="total">

          <span className="xe">
            <a href="#" onClick={this.handleBatchVerify.bind(this)} data-status={PASS_STATUS} className="btn">批量通过</a>
            <a href="#" onClick={this.handleBatchVerify.bind(this)} data-status={FAIL_STATUS} className="btn">批量不通过</a>
          </span>
        </div>
        <Table dataSource={dataSource} columns={columns} loading={fetching}/>
        <Pagination page={page} onClick={this.handleQueryComment.bind(this)}/>
      </Card>
    )
  }
}
export default CommentPreview;
