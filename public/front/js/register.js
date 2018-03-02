/**
 * Created by Jepson on 2018/1/12.
 */

$(function() {

  // 进行注册, 首先要进行校验
  $('.registerBtn').on("click", function() {
  
    // 用户名
    var username = $('[name="username"]').val().trim();
    
    if ( !username ) {
      mui.toast( "用户名不能为空" );
      return;
    }
    
    // 密码
    var password = $('[name="password"]').val().trim();
    
    if ( !password ) {
      mui.toast( "密码不能为空" );
      return;
    }
    
    // 校验密码
    var rePassword = $('[name="rePassword"]').val().trim();
    
    if( !rePassword ) {
      mui.toast( "请输入校验密码" );
      return;
    }
    
    if ( password !== rePassword ) {
      mui.toast( "校验密码 和 密码不相符")
      return;
    }
    
    var mobile = $('[name="mobile"]').val().trim();
    
    // 手机号不能为空
    if ( !mobile ) {
      mui.toast( "手机号不能为空" );
      return;
    }
    
    /// 手机号要符合 11 位, 13 15 16 17 18 开头, 11位的号码
    var mobileReg = /^1[35678]\d{9}$/;
    if ( !mobileReg.test( mobile ) ) {
      mui.toast( "请输入符合要求的正确手机号" );
      return;
    }
    
    // 验证码
    var vCode = $('[name="vCode"]').val().trim();
    
    if ( !vCode ) {
      mui.toast("请输入校验验证码");
      return;
    }
    
    // 用户协议
    if ( !$('#checkbox').prop("checked") ) {
      mui.toast( "请先同意用户协议" );
      return;
    }
    
    
    // 接口地址: /user/register
    // 请求方式: POST
    $.post( "/user/register", $('#form').serialize(), function( data ) {
      console.log( data );
      if ( data.success ) {
        // 注册成功
        location.href = "login.html";
      }
      
      // 注册失败, 可能是验证码错误, 手机号重复
      if ( data.error ) {
        // data.message 里面存放了错误信息
        mui.toast( data.message );
      }
      
    })
  
  })
  
  
  // 验证码功能
  var $getCode = $('.getCode')
  $getCode.on("click", function() {
    console.log(111);
  
    // 点击了以后, 不能被点了, 应该变灰色,  文本要变成发送中
    $getCode.prop( "disabled", true ).addClass("disabled").text("发送中...");
    
    var mobile = $('[name="mobile"]').val().trim();
    $.get( "/user/vCode", {
      mobile: mobile
    }, function( data ) {
      console.log( data );
      
      // 需要有一个倒计时功能
      var count = 3;
      
      var timer = setInterval(function() {
        
        // count 如果等于 0 了, 说明倒计时完成, 需要恢复按钮
        if ( count === 0 ) {
          clearInterval( timer );
          $getCode.text("重新发送").prop("disabled", false).removeClass("disabled");
          return;
        }
  
        $getCode.text( count + "秒后重试" );
        count--;
      
      }, 1000);
      
    })
    
  })
  
  
  

})
