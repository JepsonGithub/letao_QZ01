/**
 * Created by Jepson on 2018/1/4.
 */


$(function() {
  
  var currentPage = 1;
  var pageSize = 100;
  
  // 获取地址栏参数, 设置给输入框
  var key = tools.getSearch("key");
  $('.search_inp').val( key );
  
  // 一进入页面, 就要根据搜索关键字进行渲染
  render();
  
  // 点击搜索, 重新渲染
  $('.search_btn').on("click", function() {
    render();
  });
  
  // 监听回车按钮
  $('.search_inp').on("keyup", function( e ) {
    if ( e.keyCode === 13 ) {
      // 说明用户填了 13
      $('.search_btn').trigger("click");
    }
  });
  
  
  
  // 点击 a 标签, 需要排序功能
  // 只有价格和库存才可以进行排序
  
  // 思路: 如果当前 a 标签, 有 active 类, 需要改箭头方向
  //       如果当前 a 标签没有 active 这个类, 加类(排他), 箭头
  $('.lt_sort a[data-type]').on("click", function() {
    
    if ( $(this).hasClass("now") ) {
      $(this).find("span").toggleClass("fa-angle-up").toggleClass("fa-angle-down")
    } else {
      $(this).addClass("now").siblings().removeClass("now");
      // 让所有的 a 箭头向下
      $('.lt_sort span').removeClass("fa-angle-up").addClass("fa-angle-down");
    }
    
    render();
    
  })
  
  
  // 发送请求, 进行渲染
  function render() {
  
    // 这个对象用于设置参数列表
    var param = {};
    param.page = currentPage;
    param.pageSize = pageSize;
  
    // 设置 proName 这个参数
    var key = $('.search_inp').val().trim();
    if ( key === "" ) {
      mui.toast( "请输入搜索关键字" );
      return;
    }
    param.proName = key;
  
    // 设置 price 或者 num
    // 获取 lt_sort 下的 num 这个类的 a 标签的 type 属性
    var type = $('.lt_sort a.now').data("type");
    
    if ( type ) {
      // 就需要添加参数
      var value = $('.lt_sort a.now').find("span").hasClass("fa-angle-down") ? 2 : 1;
      param[ type ] = value;
    }
  
  
    $('.lt_product').html( '<div class="loading"></div>' );
    
    console.log( param );
    
    $.get( "/product/queryProduct", param, function( data ) {
      setTimeout(function() {
        console.log( data );
        var htmlStr = template( "productTpl", data );
        $(".lt_product").html( htmlStr );
      }, 500);
    });
    
  }
  
})