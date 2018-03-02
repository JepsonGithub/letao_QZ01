/**
 * Created by Jepson on 2018/1/4.
 */


$(function() {
  
  var $getCodeBtn = $('.getCodeBtn');
  
  // 获取短信代码验证
  $getCodeBtn.on("click", function() {
    
    // 1. 点击的时候, 先禁用按钮
    $getCodeBtn.prop("disabled", true).addClass("disabled").text("发送中...");
    
    // 2. 发送 ajax 请求
    $.get( "/user/vCode", function( data ) {
      console.log( data );
      
      // 如果验证码发送成功, 开始倒计时
      var count = 3;
      
      var timer = setInterval(function() {
    
        if ( count === 0 ) {
          $getCodeBtn.prop("disabled", false).removeClass("disabled").text("重新发送");
          clearInterval( timer );
          return;
        }
    
        $getCodeBtn.text( count + " 秒后重试" );
        count--;
      }, 1000);
      
    })
    
  });
  
  
  // 注册功能
  $('.registerBtn').on("click", function() {
    // 1. 获取所有的数据, 添加表单校验
    // 2. 校验通过了, 发送 ajax 请求
    // 3. 成功了, 跳转到登陆页面
    var username = $('.myform [name="username"]').val();
    var password = $('.myform [name="password"]').val();
    var repassword = $('.myform .repassword').val();
    var mobile = $('.myform [name="mobile"]').val();
    var vCode = $('.myform [name="vCode"]').val();
    
    if ( !username ) {
      mui.toast("请输入用户名")
      return false;
    }
    
    if ( !password ) {
      mui.toast("请输入密码");
      return false;
    }
    
    if ( repassword != password ) {
      mui.toast("再次输入的密码不一致");
      return false;
    }
    
    if (!mobile) {
      mui.toast("请输入手机号");
      return false;
    }
    
    if ( !/^1[34578]\d{9}$/.test(mobile) ) {
      mui.toast("手机号码格式不对")
      return false;
    }
    
    if ( !vCode ) {
      mui.toast( "请输入手机验证码" );
      return false;
    }
    
    if ( !$('#checkbox' ).prop("checked") ) {
      mui.toast( "请同意会员服务协议" );
      return false;
    }
    
    // 所有的验证都满足
    $.post("/user/register", $('.myform').serialize(), function( data ) {
      console.log(data);
      if ( data.error === 403 ) {
        mui.toast( data.message );
        return;
      }
      if ( data.success ) {
        mui.toast( "注册成功" );
        location.href = "login.html";
      }
    });
    
    return false;
  })
  
})