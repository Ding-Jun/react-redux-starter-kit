/**
 * Created by admin on 2016/10/26.
 */
function initEditor ( id, readonly ) {
  var curEditor = tinymce.get( id );
  if ( curEditor != null ) {
    curEditor.destroy();
  }
  var root='/nczl-web'
  tinymce.init( {
    selector : 'textarea#' + id,
    convert_urls : false,
    readonly : readonly,
    language : 'zh_CN',
    menubar : false,
    plugins : "image textcolor preview code emoticons fullscreen imageupload",
    toolbar : "bold forecolor backcolor fontselect fontsizeselect styleselect code preview fullscreen imageupload ",
    imageupload_url : root+'/rs/common/uploadImg',//"http://ff.fan66.cn/web-fastdfs/upload/uploadfile",//root+'/rs/common/uploadImg'
    font_formats : "Times New Roman=times new roman,times;" + "Arial=arial,helvetica,sans-serif;" + "Arial Black=arial black,avant garde;" + "Georgia=georgia,palatino;" + "Helvetica=helvetica;" + "Symbol=symbol;"
  } );

}
export default initEditor;
