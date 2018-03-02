/**
 * Created by Jepson on 2018/1/1.
 */


// 进度条功能
// 禁用右边的进度环
NProgress.configure({ showSpinner: false });

// 开启进度条
// NProgress.start();
// 关闭进度条
// NProgress.done();


// ajaxStart, 给 document 注册, 全局事件
$(document).ajaxStart(function() {
  NProgress.start();
})

// ajaxStop ajax 结束调用
// 加载页面可能发送多个 ajax 请求, 应该等待最后一个 ajax 请求数据回来以后,
// 关闭进度条, ajaxStop 在全部 ajax 请求完成后, 会进行调用
$(document).ajaxStop(function() {
  setTimeout(function() {
    NProgress.done();
  }, 300);
});



$(function() {

  // 一些公用功能
  
  // 1 侧边栏显示隐藏功能
  $('.icon_menu').on("click", function() {
    $('.lt_aside').toggleClass("now");
    $('.lt_main').toggleClass("now");
  })
  
  
  // 2 退出功能
  // 点击退出按钮, 弹出提示模态框
  $('.icon_logout').on('click', function() {
    // 打开模态框
    $('#logoutModal').modal();
  });
  
  $('#logoutModal .btn_logout').on("click", function() {
    // 发送 ajax 请求, 退出系统即可
    // $.get(url, data, successCallback, dataType);
    $.get('/employee/employeeLogout', function( data ) {
    
      if ( data.success ) {
        // 退出登陆成功
        location.href = "login.html";
      }
      
    })
  });
  
  
  // 3. 如果没登陆的页面, 要判断当前用户是否登录
  //    如果是登陆, 不管
  //    如果没登陆, 跳到登陆页面
  if ( location.href.indexOf("login.html") === -1 ) {
    $.get("/employee/checkRootLogin", function(data) {
      if ( data.error ) {
        location.href = "login.html";
      }
    })
  }
  
  
  // 4. 二级分类显示隐藏功能
  $('.lt_aside .classify').on("click", function() {
    $(this).next().stop().slideToggle();
  })
  
})



