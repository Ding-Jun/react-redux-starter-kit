/**
 * Created by admin on 2016/10/14.
 */
import React from 'react'
import TableHeader from './TableHeader'
import TableRow from './TableRow'
import TableCell from './TableCell'
class Table extends React.Component {
  constructor(props) {
    super(props);
    // Operations usually carried out in componentWillMount go here
  }

  static defaultProps = {
    columns: [],
    dataSource: [],
    loading:false
  };
  getHeader(columns){

    var tHeads = columns.map(column => {

      var style={
        width:column.width
      }
      return <th style={style} key={column.key}>{column.title}</th>
    })
    return <TableHeader><TableRow>{tHeads}</TableRow></TableHeader>;
  }
  getRows(datas,columns){
    var rows;
    if(this.props.loading){
      return <tbody><TableRow><TableCell colSpan={columns.length}>加载中 <dot>...</dot></TableCell></TableRow></tbody>
    }
    if(datas.length==0){
      return <tbody><TableRow><TableCell colSpan={columns.length}>没有数据</TableCell></TableRow></tbody>
    }
     rows = datas.map((record)=> {
     // console.log("record", record)
      var cells=[]
      for(var i=0;i<columns.length;i++){
        const column=columns[i];
        //console.log("name:",record.name);
        //console.log("index:",columns[i].dataIndex);
        cells.push(<TableCell key={i} isOptd={column.isOptd}>{record[column.dataIndex]}</TableCell>)
      }
      return (
        <TableRow key={record.id}>
          {cells}
        </TableRow>
      )

    })
    //console.log("rows:",rows)
    return <tbody>{rows}</tbody>
  }
  render() {
    console.log("columns", this.props.columns);
    console.log("dataSource", this.props.dataSource);
    const tHeaders=this.getHeader(this.props.columns);

    const tRows = this.getRows(this.props.dataSource,this.props.columns);

    return (
      <table cellSpacing={0} cellPadding={0} className="table2">
        {tHeaders}
        {tRows}
        {this.props.children}
      </table>
    )
  }
}
export default Table;
