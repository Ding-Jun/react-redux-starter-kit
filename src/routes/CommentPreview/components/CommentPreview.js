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
import $ from 'jquery'
import Pagination from 'components/Pagination'
class CommentPreview extends React.Component {
  constructor(props) {
    super(props);
    // Operations usually carried out in componentWillMount go here
    this.state = {
      page: {
        rowData: []
      },
      loading: true,
      checkAll: false,
      checkCount: 0,
      checkboxs: []
    }
  }

  componentWillMount() {
    this.queryCommentList(1);
  }

  handleQueryComment(event) {
    event.preventDefault();
    var targetPage = event.currentTarget.getAttribute("data-page");
    console.log("targetPage",targetPage)
    this.setState({
      loading: true
    })
    this.queryCommentList(targetPage);
  }

  queryCommentList(targetPage) {
    if(true){
      var url = `/nczl-web/rs/comment/list?curPage=${targetPage}&pageSize=20&status=0`;
      $.ajax({
        type: 'GET',
        url: url,
        dataType: 'json',
        success: function (rm) {
          if (rm.code == 1) {
            console.log('debug', rm.result);
            this.setState({
              page: rm.result,
              loading: false,
              checkboxs: this.getInitialChecked(rm.result.rowData),
              checkAll:false,
              checkCount:0
            })
          }
        }.bind(this)
      })
    }else{
      console.warn('queryCommentList：targetPage is not a number',targetPage)
    }

  }

  getInitialChecked(rowData) {
    var checkboxs = [];
    if (!isArray(rowData)) {
    } else {
      rowData.map((comment, i)=> {
        checkboxs.push({id: comment.id, checked: false});
      })
    }
    return checkboxs;
  }

  handleChecked(event) {
    var id = event.target.getAttribute("data-id");

    var checkboxs = this.state.checkboxs;
    var checkCount = this.state.checkCount;
    var length = checkboxs.length;
    for (var i = 0; i < length; i++) {
      if (checkboxs[i].id == id) {
        var checked = !checkboxs[i].checked
        checkboxs[i].checked = checked;
        checked ? checkCount++ : checkCount--;
        console.log('checkboxs', id, 'change to', checked);
        break;
      }
    }
    this.setState({
      checkCount: checkCount,
      checkboxs: checkboxs,
      checkAll: checkCount == length
    })
  }

  handleCheckAll() {
    var checked = !this.state.checkAll;
    var checkCount = 0;
    var checkboxs = this.state.checkboxs;
    if ("rowData" in this.state.page) {
      checked ? checkCount = this.state.page.rowData.length : checkCount = 0;
    }
    var length = checkboxs.length;
    for (var i = 0; i < length; i++) {
      checkboxs[i].checked = checked;
    }
    this.setState({
      checkAll: checked,
      checkCount: checkCount,
      checkboxs: checkboxs
    })
  }

  handlePassVerify(event) {
    console.log("things", "点击");
    event.preventDefault();
    var id = event.currentTarget.getAttribute("data-vid");
    console.log("sasasa---", id);
    var r = confirm("确认通过审核");
    if (r == true) {
      var url = `/nczl-web/rs/comment/verify`;
      console.log("sasasa---", url);
      $.ajax({
        type: 'POST',
        url: url,
        data: {
          status: 1,
          id: id
        },
        dataType: 'json',
        success: function (rm) {
          if (rm.code == 1) {
            this.queryCommentList(this.state.page.curPage);
          }
        }.bind(this)
      })
    }
  }

  handleNoPassVerify(event) {
    event.preventDefault();
    var id = event.currentTarget.getAttribute("data-vid");
    var r = confirm("确认不通过审核");
    if (r == true) {
      var url = `/nczl-web/rs/comment/verify`;
      console.log("sasasa---", url);
      $.ajax({
        type: 'POST',
        url: url,
        data: {
          status: 2,
          id: id
        },
        dataType: 'json',
        success: function (rm) {
          if (rm.code == 1) {
            this.queryCommentList(this.state.page.curPage);
          }
        }.bind(this)
      })
    }
  }
  handleBatchVerify(event){
    event.preventDefault();
    var status = event.currentTarget.getAttribute("data-status");
    var checkboxs = this.state.checkboxs;
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
    var r = confirm(status==1?"确认批量通过审核":"确认批量不通过审核");
    if (r == true) {
      var url = `/nczl-web/rs/comment/plverify`;
      $.ajax({
        type: 'POST',
        url: url,
        data: {
          status: status,
          ids: idList.toString()
        },
        dataType: 'json',
        success: function (rm) {
          if (rm.code == 1) {
            this.queryCommentList(this.state.page.curPage);
          }
        }.bind(this)
      })
    }
  }
  piliangPassVerify(event) {
    event.preventDefault();
    var id = event.currentTarget.getAttribute("data-vid");
    var r = confirm("确认不通过审核");
    if (r == true) {
      var url = `/nczl-web/rs/comment/passVerify/?status=0&id=` + id;
      console.log("sasasa---", url);
      /*$.ajax({
       type: 'GET',
       url: url,
       dataType: 'json',
       success: function (rm) {
       if (rm.code == 1) {
       console.log('debug', rm.result);
       this.setState({
       page: rm.result,
       loading: false
       })
       }
       }.bind(this)
       })*/
    }
  }

  render() {
    const columns = [{title: <input type="checkbox" checked={this.state.checkAll} onChange={this.handleCheckAll.bind(this)}/>, dataIndex: 'check', width: "2%", key: 'check'},
      {title: '评论内容', dataIndex: 'content', width: "55%", key: 'content'},
      {title: '评论微信号', dataIndex: 'wxnickname', width: "12%", key: 'wxnickname'},
      {title: '发表时间', dataIndex: 'createTime', width: "12%", key: 'createTime'},
      {title: '操作', dataIndex: 'operation', width: "14%", key: 'operation', isOptd: true}];
    var dataList = this.state.page.rowData || [];

    var dataSource = dataList.map((comment, i)=> {
      return {
        id: comment.id,
        check: (<input type="checkbox" onChange={this.handleChecked.bind(this)} data-id={comment.id}
                       checked={this.state.checkboxs[i].checked}/>),
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
            <a href="#" onClick={this.handleBatchVerify.bind(this)} data-status={1} className="btn">批量通过</a>
            <a href="#" onClick={this.handleBatchVerify.bind(this)} data-status={2} className="btn">批量不通过</a>
          </span>
        </div>
        <Table dataSource={dataSource} columns={columns} loading={this.state.loading}/>
        <Pagination page={this.state.page} onClick={this.handleQueryComment.bind(this)}/>
      </Card>
    )
  }
}
export default CommentPreview;
