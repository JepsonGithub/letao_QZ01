/**
 * Created by Jepson on 2018/1/3.
 */


mui('.mui-scroll-wrapper').scroll();

//获得slider插件对象
mui('.mui-slider').slider({
  interval: 3000//自动轮播周期，若为0则不自动播放，默认为0；
});


// 将获取地址栏参数封装成一个方法
var tools = {
  // getSearchObj 将地址栏参数, 转换成一个对象
  getSearchObj: function() {
    // search  key=呵呵&key2=哈哈
    var search = decodeURI( location.search ).slice(1);
    var arr = search.split("&");
    var obj = {};
    arr.forEach(function( v, i ) {
      var key = v.split("=")[ 0 ];
      var value = v.split("=")[ 1 ];
      obj[ key ] = value;
    });
    
    return obj;
  },
  
  // 获取某一个值
  getSearch: function( key ) {
    return tools.getSearchObj()[ key ];
  }
};