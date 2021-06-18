/**
 * PostCss配置文件
 * 基于node.js,使用module.exports
 */
module.exports = {
  plugins: {
    // 自动添加浏览器厂商前缀,vuecli已经默认配置了
    // autoprefixer: {
    //   browsers: ['Android >= 4.0', 'iOS >= 8']
    // },
    'postcss-pxtorem': {
      rootValue: 37.5, // 结果为：设计稿元素尺寸/37.5，比如元素宽320px
      propList: ['*'] // 用来设定可以从 px 转为 rem 的属性
    }
  }
}