/**
 * Created by Jepson on 2018/1/7.
 */

$(function() {

  // 需要发送 ajax 请求到后台, 请求用户列表的数据
  // 需要实现分页, 传页码, 每页多少条数据
  
  // 当前页
  var currentPage = 1;
  // 每页多少条
  var pageSize = 5;
  
  // render 做了两件事情
  // 1. 获取数据渲染表格
  // 2. 分页初始化
  render();
  
  // 接口地址: /user/queryUser
  // 请求方式: get
  // 参数: page, pageSize
  function render() {
    $.get( "/user/queryUser", {
      page: currentPage,
      pageSize: pageSize
    }, function( data ) {
      console.log( data );
      // 将数据和模板相结合
      // 在模板中可以任意使用传进模板中的对象
      var htmlStr = template( "tableTpl", data );
      $(".lt_content tbody").html( htmlStr );
    
      // Math.ceil 向上取整
      var totalPages = Math.ceil( data.total / data.size );
    
      // 分页插件初始化
      $('#paginator').bootstrapPaginator({
        bootstrapMajorVersion: 3,
        currentPage: currentPage,
        totalPages: totalPages,
        size: "small",
        // 配置分页显示的文本
        itemTexts: function( type, page, current ) {
          // type 按钮的是什么类型的按钮
          // page 按钮是第几页
          // current 当前页是第几页
          // 可以根据 type 类型, 知道用户点击的是什么功能的按钮
          switch( type ) {
            case "first":
              return "首页";
            case "last":
              return "尾页";
            case "prev":
              return "上一页";
            case "next":
              return "下一页";
            case "page":
              return "第" + page + "页";
          }
        },
        // 页码点击时的事件
        onPageClicked:function(a, b, c, page){
          // 为按钮绑定点击事件 page:当前点击的按钮值
          // page 就是第几页
          // 要更改 currentPage 的值, 重新请求, 重新渲染
          currentPage = page;
          render();
        }
      })
    
    });
  }
  
  
  // 点击启用禁用按钮, 显示模态框
  // 动态渲染的页面, 需要通过事件委托来进行绑定
  $('.lt_content tbody').on( "click", ".btn", function() {
    // 显示模态框
    $('#statusModal').modal();
    
    
    // 用户启用和禁用, 需要发送 ajax 请求
    // 需要两个参数
    // 参数1. 用户id,  通过 jQuery data() 方法, 获取存在标签中的 id
    // 参数2. 修改的状态, 通过判断按钮的类样式来确定状态
    var id = $(this).data("id");  // data-id
    // 如果有 btn-danger 类, 说明点击禁用, 将用户状态置成 0
    var isDelete = $(this).hasClass("btn-danger") ? 0 : 1;
    
    // 防止事件重复绑定, 可以先 off() 解除原来的事件绑定
    // 再通过 on() 进行绑定
    $("#submitBtn").off().on("click", function() {
      // 接口地址: /user/updateUser
      // 请求方式: POST
      // 参数名称: id isDelete
      
      $.post( "/user/updateUser", {
        id: id,
        isDelete: isDelete
      }, function( data ) {
        // console.log( data );
        if ( data.success ) {
          // 关闭模态框
          $('#statusModal').modal("hide");
          render();
        }
      })
    })
  })

})






// 分页插件的使用步骤:
// 1. 引包
// 2. 写结构
// 3. 初始化　　
// $('#paginator').bootstrapPaginator({
//   // 默认 bootstrap 版本配置是2, 需要 div 结构
//   // 我们用的是 3, 需要 ul 结构
//   bootstrapMajorVersion: 3,
//   currentPage: 1,
//   totalPages: 10
// });
