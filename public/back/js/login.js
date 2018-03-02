/**
 * Created by Jepson on 2018/1/6.
 */


// 进行表单校验
// 1. 用户名不能为空
// 2. 密码不能为空
// 3. 密码长度必须 6-12

// bootstrapValidator 的使用
// 1. 引包
// 2. bootstrapValidator 直接配置校验规则

$(function() {

  // 获取表单
  var $form = $('#form');
  
  $form.bootstrapValidator({
  
    // 配置校验时显示的图标
    feedbackIcons: {
      // 校验成功的图标
      valid: 'glyphicon glyphicon-ok',
      // 校验失败的图标
      invalid: 'glyphicon glyphicon-remove',
      // 校验中的图标
      validating: 'glyphicon glyphicon-refresh'
    },
    
    // 配置校验字段
    fields: {
      // 校验用户名
      username: {
        // 配置校验规则
        validators: {
          // 非空校验
          notEmpty: {
            message: "用户名不能为空"
          },
          // 专门为 ajax 请求配置一个 callback 提示消息
          callback: {
            message: "用户名错误"
          }
        }
      },
      
      // 校验密码
      password: {
        // 配置校验规则
        validators: {
          // 非空校验
          notEmpty: {
            message: "密码不能为空"
          },
          // 长度校验, 必须要 6-12 位
          stringLength: {
            min: 6,
            max: 12,
            message: "密码长度必须是6-12位"
          },
          callback: {
            message: "密码错误"
          }
        }
      }
    }
    
    
  
  });
  
  
  // bootstrapValidator 插件, 默认会在进行表单提交的时候进行一次校验
  // 1. 如果校验成功, 默认提交表单 ( 不是我们需要的, 我们需要通过 ajax 进行提交 )
  // 2. 如果校验失败, 阻止表单提交
  
  // 我们需要监听 提交表单成功的事件, 要在里面阻止默认的提交, 通过 ajax 来提交
  // bootstrapValidator 在成功提交时, 会默认禁用提交按钮, 可以放置重复提交表单
  
  $form.on("success.form.bv", function( e ) {
    
    // 真的希望阻止默认行为, 一般还是用 preventDefault()
    e.preventDefault();
    
    console.log( "哈哈" );
    
    // 通过 ajax 进行登录校验
    // 接口地址: /employee/employeeLogin
    // 请求方式: POST
    // 请求参数: username, password
    
    
    // 表单序列化 $form.serialize();
    // 可以将表单中, 拥有 name 属性 所有表单数据, 进行拼接
    // 比如说: username password
    // 拼接成了 username=pp&password=123456 而且这种格式 jQuery 是直接支持的
    $.ajax({
      url: "/employee/employeeLogin",
      type: "post",
      // 表单序列化, 非常常用
      data: $form.serialize(),
      success: function( data ) {
        console.log( data );
        if ( data.success ) {
          // 说明登录成功
          // 应该跳转到首页
          location.href = "index.html";
        }
        
        // error 1000 用户名错误  1001 密码错误
        if ( data.error === 1000 ) {
          // 用户名错误
          // alert( "用户名错误" );
          // 直接通过 alert 提示用户 密码错误
          // 参数1: 字段名称
          // 参数2: 校验的状态  VALID 校验成功 INVALID 校验失败
          // 参数3: 配置显示的提示文本
          $form.data("bootstrapValidator").updateStatus("username", "INVALID", "callback");
        }
        
        if ( data.error === 1001 ) {
          // 密码错误
          // alert("密码错误");
          $form.data("bootstrapValidator").updateStatus("password", "INVALID", "callback");
        }
      }
    });

  });
  
  
  // 重置表单功能
  // css3 属性选择器
  $('[type="reset"]').on("click", function() {
    
    // 实例化bootstrapValidator 对象
    // 调用实例的方法 resetForm() 方法, 可以将所有的表单内容,重置成未校验的状态
    $form.data("bootstrapValidator").resetForm();
  })
  
})


