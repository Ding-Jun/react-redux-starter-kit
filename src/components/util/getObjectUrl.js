/**

 * Created by admin on 2016/10/26.
 */
function getFileUrl(file) {
  var url = null;
  if (window.createObjectURL != undefined) {// basic
    url = window.createObjectURL(file)
  } else if (window.URL != undefined) {// mozilla(firefox)
    url = window.URL.createObjectURL(file)
  } else if (window.webkitURL != undefined) {// webkit or chrome
    url = window.webkitURL.createObjectURL(file)
  }
  return url

}

export default getFileUrl;
