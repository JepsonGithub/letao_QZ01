/**
 * Created by Jepson on 2017/12/31.
 */

$(function() {
  // 表单校验功能
  // 1. 用户名不能为空
  // 2. 密码不能为空
  // 3. 密码的长度为 6-12 位
  
  // 如何使用表单校验插件
  // 1. 引包
  // 2. 调用 bootstrapValidator(options) 来初始化 validator
  var $form = $('#loginForm');
  
  console.log($form);
  
  // bootstrap-validator 插件会在表单提交的时候进行校验,
  // 1. 如果校验成功了, 表单会继续提交
  // 2. 如果校验失败, 会阻止表单提交
  
  // 使用 bootstrap-validator
  // 配置 表单校验规则
  $form.bootstrapValidator({
  
    // 配置校验时显示的图标, 可以更好看一点
    feedbackIcons: {
      // 校验成功
      valid: 'glyphicon glyphicon-ok',
      // 校验失败
      invalid: 'glyphicon glyphicon-remove',
      // 校验中
      validating: 'glyphicon glyphicon-refresh'
    },
    
    // 校验配置的规则
    // 字段, 你想校验哪些字段
    fields: {
      username: {
        // username 的规则
        // validators
        // notEmpty 非空校验, stringLength 长度校验, regexp 正则校验
        validators: {
          // 不能为空
          notEmpty: {
            // 为空时提示信息
            message: "用户名不能为空"
          },
  
          // 用户名不存在
          callback: {
            message: "用户名不存在"
          }
        }
      },
      
      password: {
        // password 的规则
        validators: {
          // 密码不能为空
          notEmpty: {
            message: "密码不能为空"
          },
          // 长度校验
          stringLength: {
            // 密码最长 12 位
            max: 12,
            // 密码最短 6 位
            min: 6,
            // 提示
            message: "密码必须是 6 到 12 位"
          },
          
          // 密码错误
          callback: {
            message: "密码错误"
          }
        }
      }
    }
  
  });
  
  
  
  // 默认校验成功会提交表单, 但是我们希望通过 ajax 来校验
  // 所以需要监听校验成功
  
  $form.on("success.form.bv", function( e ) {

    // 监听完成, 要阻止默认行为, 否则表单自己就提交了
    e.preventDefault();

    // 发送 ajax
    // 地址: /employee/employeeLogin
    // 请求: post
    // 参数: username password
    $.post( "/employee/employeeLogin", $form.serialize(), function( data ) {
  
      console.log(data);
      
      if ( data.success ) {
        // 说明登录成功
        // 跳转到首页
        location.href = "login.html";
      }
      
      // 验证完成后, 默认会禁用按钮, 防止重复提交表单
      if ( data.error ) {
        // 说明登录失败
        // 用户名不存在
        if ( data.error === 1000 ) {
          // alert( "用户名不存在" );
          // 需要手动调用方法, updateStatus 让 username 校验失败即可
          // 先要获取表单实例来调用方法
          // updateStatus( filed, status, validator)
          // 参数1: 改变字段的名称
          // 参数2: 状态 NOT_VALIDATED 未验证的, VALIDATING 验证中, INVALID 校验失败的 or VALID 校验成功的
          // 参数3: 选择提示的验证规则
          $form.data("bootstrapValidator").updateStatus("username", "INVALID", "callback");
        }
        
        // 密码错误
        if ( data.error === 1001 ) {
          // alert( "密码错误" );
          $form.bootstrapValidator("updateStatus", "password", "INVALID", "callback");
        }
        
      }
    });

  });



  //表单重置功能
  $("[type='reset']").on("click", function () {
    
    //获取到validator对象，调用resetForm方法
    $form.data("bootstrapValidator").resetForm();
  });
  
})
