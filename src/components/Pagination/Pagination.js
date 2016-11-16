/**
 * Created by admin on 2016/10/14.
 */
import React from 'react'
class Pagination extends React.Component {
  constructor(props) {
    super(props);
    // Operations usually carried out in componentWillMount go here

  }

  static defaultProps={
    pageShowSize:5,
    page:{},
    onClick(){}
  }
  //page is a object from back end
  getPages(page, onClick) {
    var pageSize = page.pageSize;
    var totalPage = page.totalPage;
    var curPage = page.curPage;
    var pageShowSize = this.props.pageShowSize;
    var startPage = page.startPageIndex; //分页起始页
    var endPage = page.endPageIndex; //分页结束也
    var prePage = 0; //上一页
    var postPage = 0; //下一页
    var pageView = [];

    if (curPage > totalPage || curPage < 1) return;
    if (pageShowSize >= totalPage) {
      pageShowSize = totalPage;
      startPage = 1;
      endPage = pageShowSize;
      //console.log("BP2")
    } else {
      //如果当前页靠近页尾
      if (curPage > (totalPage - pageShowSize / 2)) {
        startPage = totalPage - pageShowSize + 1;
        endPage = totalPage;
        //console.log("BP3")
      }
      //如果当前页靠近页首
      else if (curPage <= parseInt((pageShowSize - 1) / 2)) {
        startPage = 1;
        endPage = pageShowSize;
        //console.log("BP4")
      } else {
        startPage = parseInt(curPage) - parseInt((pageShowSize - 1) / 2);
        endPage = parseInt(curPage) + parseInt(pageShowSize / 2);
        //console.log("BP5")
      }
    }
    prePage = curPage - 1;
    postPage = curPage + 1;
    if (curPage == 1) {
      prePage = 1;
    }
    if (curPage == totalPage) {
      postPage = totalPage;
    }

    pageView.push(<a key={-1} href="#" data-page={1} onClick={onClick}>{'<<'}</a>);
    pageView.push(<a key={-2} href="#" data-page={prePage} onClick={onClick}>{'<'}</a>);
    for (var i = startPage; i <= endPage; i++) {
      if (i != curPage) {
        pageView.push(<a key={i} href="#" data-page={i} onClick={onClick}>{i}</a>);
      } else {
        pageView.push(<span key={i}>{i}</span>);
      }

    }
    pageView.push(<a key={-3} href="#" data-page={postPage} onClick={onClick}>&gt;</a>);
    pageView.push(<a key={-4} href="#" data-page={totalPage} onClick={onClick}>&gt;&gt;</a>);

    return pageView;
  }

  render() {
    var page = this.props.page;
    var pageView=null;
    if('totalPage' in page && page.totalPage!=0){
      pageView=this.getPages(this.props.page, this.props.onClick);
    }
    return (
      <div className="page">
        {pageView}
      </div>
    )
  }
}
export default Pagination;
