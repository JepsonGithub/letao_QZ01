/**
 * Created by Jepson on 2018/1/12.
 */

$(function() {

  // 一进入页面, 需要请求当前用户信息
  
  $.get("/user/queryUserMessage", function( data ) {
    if ( data.error ) {
      // 说明用户没有登录, 跳到登陆页面, 进行登录
      location.href = "login.html";
      return;
    }
    
    console.log( data );
    var htmlStr = template( "userInfoTpl", data );
    $('#userInfo').html( htmlStr );
  })
  
  // 退出功能
  $('.logoutBtn').on("click", function() {
    
    mui.confirm( "你确认要退出么", "温馨提示", [ "取消", "确认" ], function( e ) {
      if ( e.index === 1 ) {
        // 向后台发送退出请求
        $.get( "/user/logout", function( data ) {
          console.log( data );
          // 退出成功跳转到登录页
          location.href = "login.html";
        })
      }
    })
  
  })
  

})
