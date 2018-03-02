/**
 * Created by Jepson on 2018/1/10.
 */

// 根据搜索内容, 渲染数据, 首先需要拿到搜索内容
// 我们考虑封装一个方法, 可以将地址栏参数转换成对象, 方便获取


$(function() {
  
  // 当前页
  var page = 1;
  // 每页的条数 (写就是为了请求所有搜索到的数据)
  var pageSize = 100;
  

  // tools getSearchObj 将地址栏参数转换成对象
  //       getSearch(key) 直接通过 key 获取地址栏参数
  
  // 获取搜索关键字
  var key = tools.getSearch("key");
  
  // 将关键字设置到 input 框中
  $('.search_inp').val( key );
  
  
  // 一进入页面, 就根据搜索框中的值进行页面渲染
  renderProduct();
  
  
  // 根据搜索的值, 发送 ajax 请求, 渲染页面
  // 专门用于根据不同参数渲染商品搜索页面
  function renderProduct() {
  
    var params = {};
    params.page = page;
    params.pageSize = pageSize;
    
    // 读取 input 框中的搜索关键字, 进行搜索请求
    var key = $('.search_inp').val();
    
    if ( !key ) {
      mui.toast( "请输入搜索关键字" );
    }
    // 请求的产品名称
    params.proName = key;
    
    
    // 找到有 lt_sort 下面 有now 类的 a
    var type = $('.lt_sort a.now').data("type");
    console.log( type );
    
    // 说明已经点击了排序按钮, 需要进行排序
    if( type ) {
      // 升序 上箭头 1
      // 降序 下箭头 2
      var sortValue = $(".lt_sort a.now").find("span").hasClass("fa-angle-down") ? 2 : 1;
      
      // 将参数附加在 params 中
      params[ type ] = sortValue;
    }
    
    
    // 发送 ajax 请求前, 将页面商品结构内容, 重置成等待框 loading 的状态
    $(".lt_product").html( '<div class="loading"></div>' );
    
    // 发送 ajax 请求, 获取数据
    // 接口地址: /product/queryProduct
    // 请求方式: GET
    $.get( "/product/queryProduct", params, function( data ) {
      // 模拟网络延迟
      setTimeout(function() {
        console.log( data );
        var htmlStr = template( "productTpl", data );
        $('.lt_product').html( htmlStr );
      }, 500);
    })
    
  }
  
  
  // 点击搜索按钮, 进行搜索
  $('.search_btn').on("click", function() {
    // 调用 renderProduct 方法, 获取 input 框里面的参数, 继续请求渲染
    renderProduct();
  });
  
  $('.search_inp').on("keyup", function( e ) {
    if ( e.keyCode === 13 ) {
      // 说明用户按了回车键,
      // 直接进行 搜索操作
      $('.search_btn').trigger("click");
    }
  })
  
  // 排序功能
  // 注册点击事件, 找到有 data-type 属性的 a 元素
  // console.log($('.lt_sort a[data-type]'));
  
  $('.lt_sort a[data-type]').on("click", function() {
    var type = $(this).data("type");
    
    // 1. 如果没有 now 这个类, 应该添加 now 这个类,
    //    其他人干掉 now 的类, 同时所有的箭头变成向下
    // 2. 如果有 now 这个类, 应该切换箭头方向
    
    if ( $(this).hasClass("now") ) {
      // 有这个类, 切换箭头, 本质上就是在切换类
      $(this).find("span").toggleClass("fa-angle-down").toggleClass("fa-angle-up");
    } else {
      // 没有这个类, 加上这个类
      $(this).addClass("now").siblings().removeClass("now");
      // 同时重置所有的箭头, 重置成向下
      $(".lt_sort span").removeClass("fa-angle-up").addClass("fa-angle-down");
    }
    
    // 调用 renderProduct 方法, 在方面里面, 根据高亮的标签,
    // 以及上下箭头类来判断请求的参数
    renderProduct();
  })
  
  
})