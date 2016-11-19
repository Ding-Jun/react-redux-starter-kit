/**
 * Created by admin on 2016/10/13.
 */
import React from 'react'
import $ from 'jquery'
import {Link} from "react-router"
import Helmet from 'react-helmet'
import Card from 'components/Card'
import Table from 'components/Table'
import Button from 'components/Button'
import Pagination from 'components/Pagination'
import Modal from 'components/Modal'
import Input from 'components/Input'
import {COLUMN_EDIT_TYPE,COLUMN_ADD_TYPE} from '../modules/columnPreview'
const iconAdd = require('static/images/icon_add.gif');
const title = '分类管理';
class ColumnPreview extends React.Component {
  /*constructor(props) {
    super(props);
    // Operations usually carried out in componentWillMount go here
    this.state = {
      page: {
        rowData: []
      },
      loading: true,
      modal: {
        visible: false
      }
    }
  }*/

  componentWillMount() {
    console.log('degbu',this.props.params.targetPage)
    this.props.fetchColumnList(this.props.params.targetPage);
  }
  componentWillUnmount() {
    this.props.clearColumnList();
  }
  handleQueryColumn(event) {

    event.preventDefault();
    var targetPage = event.currentTarget.getAttribute("data-page");
    this.setState({
      loading: true
    })
    this.queryColumnList(targetPage);
  }

  queryColumnList(targetPage, nameFilter = {}) {
    console.log("targetPagdde",targetPage)
    var url='/nczl-web/rs/column/list?curPage=' + targetPage + '&pageSize=' + 20;
    console.log("uuuusrl",url)
    $.ajax({
      type: 'GET',
      url: url,
      dataType: 'json',
      success: function (rm) {
        console.log('queryColumnList debug', rm.result);
        if (rm.code == 1) {
          this.setState({
            page: rm.result,
            loading: false
          })
        }
      }.bind(this)
    })
  }

  handleEdit(e) {
    e.preventDefault();
    const { openModal,closeModal,setEditOption } = this.props
    const  elem=e.currentTarget;

    const editOption = {
      type:elem.getAttribute("data-type"),
      id:elem.getAttribute("data-id"),
      value:elem.getAttribute("data-name")||''
    }
    const modalOption = {
      title:editOption.id ? '编辑':'新增',
      closable: false
    }
    setEditOption(editOption)
    openModal(modalOption);

  }
  handleDeleteColumn(e){
    e.preventDefault();
    var targetId = e.currentTarget.getAttribute("data-id");
    console.log('targetId',targetId);
    var r = confirm("确认删除?");
    if (r == true) {
      this.props.deleteColumn(targetId)
    }
  }
  handleInputChange(e){
    e.preventDefault();
    const {setEditOption, editOption}=this.props;
    setEditOption({
      ...editOption,
      value:e.target.value
    })
  }
  handleEditConfirm() {
    this.props.editColumn();
  }
/*
  openModal(type, columnId,columnName) {
    switch (type) {
      case 'add':
        this.setState({modal: {visible: true,type:'add', title: '新增分类',id:null,inputValue:""}});
        break;
      case 'edit':
        this.setState({modal: {visible: true,type:'edit', title: '编辑分类',id:columnId,inputValue:columnName}});
        break;
      default:console.warn('no such type')
    }

  }

  closeModal() {
    this.setState({modal: {visible: false}});
  }*/

  render() {
    const {fetching,page, closeModal, modalOption,editOption} = this.props;
    const columns = [{
      title: '分类名称',
      dataIndex: 'columnName',
      width: "46%",
      key: 'columnName'
    }, {
      title: '下属文章数',
      dataIndex: 'articleCnt',
      width: "42%",
      key: 'articleCnt',
      isOptd: true
    }, {
      title: '操作',
      dataIndex: 'operation',
      width: "12%",
      key: 'operation',
      isOptd: true
    }];
    var dataList = page && page.rowData || [];
    var dataSource = dataList.map((column)=> {
      const count = column.articleCount;
      const name=column.columnName;
      return {
        id: column.id,
        columnName: name,
        articleCnt: count ? <Link to={`/article/preview/${column.id}/1`}>{count}</Link> : count,
        operation: (
          <span>
            <a href="#" data-type={COLUMN_EDIT_TYPE} data-name={name} data-id={column.id}
               onClick={this.handleEdit.bind(this)}>编辑</a>
            <a href="#" data-id={column.id} onClick={this.handleDeleteColumn.bind(this)}>删除</a>
          </span>
        )
      }
    });
    return (
      <Card title={<span>{title}</span>}>
        <Helmet title={`${title} 第${page.curPage}页` }/>
        <div className="total">
              <span className="xe">
                <Button prefixCls="add-btn" data-type={COLUMN_ADD_TYPE}
                        onClick={this.handleEdit.bind(this)}><img src={iconAdd}/> 新增
                </Button>
              </span>
        </div>
        <Table dataSource={dataSource} columns={columns} loading={fetching}/>
        <Pagination page={page} onClick={this.handleQueryColumn.bind(this)}/>

        <Modal title={modalOption.title} visible={modalOption.visible} onClose={closeModal}
               onOk={this.handleEditConfirm.bind(this)}
        >分类名称：<Input  value={editOption.value} onChange={this.handleInputChange.bind(this)} /></Modal>
      </Card>
    )
  }
}
export default ColumnPreview;
