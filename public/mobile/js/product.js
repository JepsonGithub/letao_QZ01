/**
 * Created by Jepson on 2018/1/4.
 */

$(function () {


  // 通过封装的方法, 获取到地址栏的 productId
  // 发送 ajax 请求, 获取商品详情
  // 结合模板引擎进行渲染
  var productId = tools.getSearch("productId");
  
  // 渲染数据
  $.get( "/product/queryProductDetail", { id: productId }, function( data ) {
    console.log( data );
    // 根据数据进行渲染
    var htmlStr = template( "productTpl", data );
    $('.mui-scroll').html( htmlStr );
  
    // 轮播图是动态渲染的, 所以需要在这里进行重新初始化
    mui('.mui-slider').slider({
      interval:1000//自动轮播周期，若为0则不自动播放，默认为0；
    });
  
    // 初始化数字框
    mui('.lt_num .mui-numbox').numbox();
    
  })
  
  // 选择尺码
  $('.mui-scroll').on( "click", ".lt_size .size", function() {
    $(this).addClass("active").siblings().removeClass("active");
  });
  
  
  // 加入购物车
  // 1. 添加按钮
  // 2. 获取 id, 尺码, 数量
  // 3. 发送 ajax 请求
  $('.btn_add_cart').on("click", function() {
  
    // 看用户有没有选中, 没有选中, 提示用户选择尺码
    var size = $('.lt_size').find(".active").text();
    if ( !size ) {
      mui.toast( "请先选择尺码" );
      return;
    }
  
    // 获取用户选择的数量
    var num = $('.lt_num .mui-numbox-input').val();
    
    // 加入购物车
    $.post( "/cart/addCart", {
      productId: productId,
      size: size,
      num: num
    }, function( data ) {
      
      // 成功, 提示添加成功
      if ( data.success ) {
        mui.confirm("添加成功", "温馨提示", ["前往购物车", "继续浏览"], function( e ) {
          if( e.index === 0 ) {
            location.href = "cart.html";
          }
        })
      }
  
      // 如果没登陆, 登陆失败
      if ( data.error === 400 ) {
        // 跳到登陆页面, 把前一个页面地址传过来
        location.href = "login.html?retUrl=" + location.href;
      }
      
    })
    
  })

})
