/**
 * Created by Jepson on 2018/1/4.
 */

// 需要发送 ajax 请求到后台, 请求用户信息
$(function() {
  
  // 需要发送 ajax 请求, 获取到用户的信息
  $.get("/user/queryUserMessage", function( data ) {
    console.log( data )
    if ( data.error === 400 ) {
      location.href = "login.html";
      return;
    }
    
    // 直接渲染用户信息
    $('.userinfo').html( template("tpl_user", data ) );
  });
  
  
  // 退出功能
  $('.logout_btn').on("click", function() {
    console.log("呵呵");
    
    $.get( "/user/logout", function() {
      location.href = "login.html";
    });
    
  })
  
})