/**
 * Created by Jepson on 2018/1/9.
 */

// 区域滚动初始化
mui('.mui-scroll-wrapper').scroll();

//获得slider插件对象
var gallery = mui('.mui-slider');
gallery.slider({
  interval:3000//自动轮播周期，若为0则不自动播放，默认为0；
});


// 工具类函数
var tools = {
  // 将地址栏参数转换成对象
  getSearchObj: function() {
    // 注意: 通过 location.search 拿到的中文, 是 unicode 编码的
    //       需要通过 decodeURI 来进行转换成 中文
    
    // 1. 拿到地址栏参数字符串
    var str = decodeURI(location.search).slice(1);  // name=pp&age=18
    
    // 2. 通过 & 进行分割
    var arr = str.split("&");  // [ "name=pp", "age=18" ]
    
    var obj = {};
    // 3. 遍历数组, 将 key 和 value 提取出来, 添加到对象中
    arr.forEach(function( v, i ) {
      var key = v.split( "=" )[ 0 ];
      var value = v.split( "=" )[ 1 ];
      
      // 将 key value 添加到对象中
      obj[ key ] = value;
    });
    
    return obj;
  },
  // 直接通过 key 获取 value 值
  // getSearch("name")
  getSearch: function( key ) {
    return tools.getSearchObj()[ key ];
  }
}

