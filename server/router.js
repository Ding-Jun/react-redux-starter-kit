/**
 * Created by admin on 2016/11/24.
 */
import axios from 'axios'

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
/*axios({
  baseURL: 'http://localhost:3000/nczl-web/rs/'
})*/
var instance = axios.create({
  baseURL: 'http://localhost:3000/nczl-web/rs/',
  timeout: 1000,
  headers: {'X-Custom-Header': 'foobar'}
});
import config from '../config'
const apiRoot = config.api_root;

export default  function (req,res) {
  return new Promise((resolve, reject) => {
    if (req.originalUrl == `${config.app_root}/article/preview/1`) {
      instance.get('/article/list?curPage=1&pageSize=3&')
        .then(function({data}) {
          console.log("data:", data)
          resolve({ articlePreview: {...require('routes/ArticlePreview/modules/articlePreview').initialState, page: data.result} })

          //resolve({})
        })
        .catch(function (error) {
         console.log(error);
          resolve({})
        });
    } else {
      resolve({})
    }
  })
}
