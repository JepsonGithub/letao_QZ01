/**
 * Created by Jepson on 2018/1/4.
 */

$(function() {
  $(".btn_login").on("click", function() {
    var username = $("[name='username']").val().trim();
    var password = $("[name='password']").val().trim();
    
    // 校验
    if ( !username ) {
      mui.toast("请输入用户名");
      return;
    }
    
    if ( !password ) {
      mui.toast("请输入密码");
      return;
    }
    
    $.post("/user/login", {
      username: username,
      password: password
    }, function( data ) {
      if ( data.error === 403 ) {
        mui.toast( data.message );
      }
      
      if ( data.success ) {
        // 成功了怎么办
        // 如果是其他页面跳过来的, 登陆还要回到原来的页面
        var search = location.search;
        if ( search.indexOf("retUrl") !== -1 ) {
          // 需要回跳
          search = search.replace("?retUrl=", "");
          location.href = search;
        } else {
          location.href = "user.html";
        }
      }
      
    })
  })
})