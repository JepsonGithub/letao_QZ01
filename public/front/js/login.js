/**
 * Created by Jepson on 2018/1/12.
*/


$(function() {

  // 点击登录按钮, 提交表单
  $('.loginBtn').on("click", function() {
  
    // 进行 ajax 提交
    // 进行表单校验
    var username = $('[name="username"]').val().trim();
    var password = $('[name="password"]').val().trim();
    
    if ( !username ) {
      mui.toast( "请输入用户名" );
      return;
    }
    
    if ( !password ) {
      mui.toast( "请输入密码" );
      return;
    }
    
    $.post("/user/login", $("form").serialize(), function( data ) {
      console.log(data);
  
      if (data.success) {
        // 登录成功, 需要判断是否需要跳回原来的页面
    
        if (location.search.indexOf("retUrl") > -1) {
          // 说明有 retUrl
          // 说明需要跳转回去
          var retUrl = location.search.replace("?retUrl=", "");
          location.href = retUrl;
          return;
        }
        
        
        // 默认登录完成, 跳转到用户中心
        location.href = "user.html";
    
      }
      
      if (data.error) {
        mui.toast( "用户名或者密码错误" );
      }
  
    })
    
    
    
  })
  
  
})