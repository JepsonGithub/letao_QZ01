/**
 * Created by Jepson on 2018/1/6.
 */

// 进度条插件使用步骤
// 1. 引包
// 2. 调用方法, 显示进度条

// 开启进度条
// NProgress.start();
//
// // 模拟 ajax 请求, 请求需要时间
// setTimeout(function() {
//
//   // 结束进度条
//   NProgress.done();
//
// }, 500)


// 为了让所有的 ajax 请求都有进度条功能
// 我们需要注册 ajax 全局函数, 每个 ajax 在调用时, 都会我们配置的全局函数

// ajaxStart 第一个ajax请求开始的时候触发
// ajaxStop  最后一个ajax完成的时候出发


// 配置进度条右侧, 不需要有小圆圈转
NProgress.configure({ showSpinner: false });

// 注意点: 一点要注册给 document 注册成全局
$( document ).ajaxStart( function() {
  // 开启进度条
  NProgress.start();
});

// ajax 结束时, 关闭进度条
$( document ).ajaxStop( function() {
  // 模拟远程服务器环境
  setTimeout(function() {
    // 结束进度条
    NProgress.done();
  }, 300);
});


$(function() {
  // 实现一些公共的功能
  // 1. 二级列表切换显示功能
  $('.classify').on("click", function() {
    // 切换显示状态
    $('.lt_aside .child').stop().slideToggle();
  })
  
  // 2. 菜单栏切换显示功能
  $('.icon_menu').on("click", function(){
    $('.lt_aside').toggleClass("now");
    $('.lt_main').toggleClass("now");
  });
  
  
  // 3. 点击退出按钮, 显示退出模态框
  $('.icon_logout').on("click", function() {
    // 让模态框显示 找到模态框.modal()
    $('#logoutModal').modal();
  });
  
  // 4. 点击确认退出按钮, 让用户退出系统, 跳到登陆页
  $('#logoutBtn').on("click", function() {
    
    // 发送ajax请求, 请求退出接口, 进行退出
    // 接口地址: /employee/employeeLogout
    // 请求方式: get
    // $.get( url, data, success, dataType );
    $.get( "/employee/employeeLogout", function( data ) {
      console.log( data );
      if ( data.success ) {
        // 如果退出成功, 跳转到首页
        location.href = "login.html";
      }
    })
    
  });
  
  
  // 5. 登陆拦截
  //    未登陆的用户, 应该没有权限访问我们的系统, 需要进行拦截
  //    在访问页面的时候, 先判断用户有没有登陆
  //    如果用户登录了, 继续让他访问, 不管
  //    如果用户没登陆, 跳转到登录页
  
  // 发送 ajax 请求, 获取当前用户有没有登录
  
  
  // 注意: 登录页面, 需要登录就能访问, 不需要拦截的
  //       需要截取地址栏参数, 进行判断
  var pathname = location.pathname;
  if ( pathname.indexOf("login.html") === -1 ) {
    // 说明地址栏信息中没有 login.html, 需要进行拦截
  
    // 接口地址: /employee/checkRootLogin
    // 请求方式: get
    $.get( "/employee/checkRootLogin", function( data ) {
      // console.log(data);
      if (data.error === 400) {
        // 说明用户没登陆, 跳转到登录页
        location.href = "login.html";
      }
    })
    
  }
  
  
  
})
