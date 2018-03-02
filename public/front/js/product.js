/**
 * Created by Jepson on 2018/1/10.
 */

$(function() {

  // 获取地址栏参数中的 productId
  var productId = tools.getSearch("productId");
  
  console.log( productId );
  
  // 发送 ajax 请求到后台, 请求商品数据, 进行渲染
  // 接口地址: /product/queryProductDetail
  // 请求方式: GET
  // 请求参数: id (产品id)
  $.get( "/product/queryProductDetail", {
    id: productId
  }, function( data ) {
    console.log( data );
    var htmlStr = template( "productTpl", data );
    $(".lt_main .mui-scroll").html( htmlStr );
    
    // 手动初始化轮播图组件
    var gallery = mui('.mui-slider');
    gallery.slider({
      interval: 3000//自动轮播周期，若为0则不自动播放，默认为0；
    });
    
    
    // 手动初始化数字框组件
    mui('.mui-numbox').numbox();
    
  });
  
  
  
  // 加入购物车功能
  $('.btn_add_cart').on("click", function() {
    // 加入购物车接口
    // productId  num  size
    
    // 用户选择的尺码
    var size = $('.lt_size .size.now').text();
    
    if ( !size ) {
      mui.toast( "请选择尺码" );
      return;
    }
    
    // 用户选择的数量
    var num = $('.lt_num .mui-numbox-input').val();
    
    // 接口地址: /cart/addCart
    // 请求方式: POST
    // 请求参数: productId num size
    $.post( "/cart/addCart", {
      productId: productId,
      num: num,
      size: size
    }, function( data ) {
      console.log( data );
      
      if ( data.error === 400 ) {
        // 说明用户没有登录
        // 如果跳到登陆页面了, 登录了以后, 应该跳回我们的产品页面
        // 进行跳转时, 将 location.href 以地址栏参数的方式传递过去, 将来登录完成跳回来
        location.href = "login.html?retUrl=" + location.href;
      }
      
      if ( data.success ) {
        // 已经登录了, 加入购物车成功
        mui.confirm( "加入购物车成功", "温馨提示", ["继续浏览", "前往购物车"], function( e ) {
          console.log( e );
          if ( e.index === 1 ) {
            location.href = "cart.html";
          }
        });
        
      }
      
      
    })
    
  });
  
  
  // 用户选择尺码的功能
  $(".lt_main .mui-scroll").on("click", ".lt_size .size", function() {
    $(this).addClass("now").siblings().removeClass("now");
  })
  
})
