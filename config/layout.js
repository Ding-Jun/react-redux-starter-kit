// Default Helmet props
module.exports = Object.freeze({
  htmlAttributes: {lang: 'cn'},
  title: '后台',
  defaultTitle: 'Default Title',
  titleTemplate: '%s - 阅读会',
  meta: [
    {charset: 'utf-8'},
    {name: 'viewport', content: 'width=device-width, initial-scale=1'}
  ],
  link: [
    {rel: 'shortcut icon', href: '/favicon.ico'},
    //{rel: 'stylesheet', href: 'bootstrap.min.css'},
    {rel: 'stylesheet', href: '/app.css'}
  ],
  script: [],
  style: []
})
