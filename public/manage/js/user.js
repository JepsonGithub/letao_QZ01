/**
 * Created by Jepson on 2018/1/1.
 */

$(function() {
  // 发送 ajax 请求, 获取用户的数据
  var currentPage = 1; // 当前页面
  var pageSize = 5; // 每页显示条数
  render();
  
  
  // 启用和禁用功能, 页面一加载, 没有按钮, 按钮是动态生成的
  // 所以要通过事件委托来注册事件
  
  $('.lt_content tbody').on("click", '.btn_isDelete', function() {
    
    $('#statusModal').modal();
    
    // 获取 id
    var id = $(this).data("id");
    // 如果有 btn-danger 说明是启用状态, isDelete 是 1, 显示的 禁用按钮,
    // 将来要改成 0, 变成禁用状态
    var isDelete = $(this).hasClass("btn-danger") ? 0 : 1;
    
    // 防止事件注册多次, 可以先 off 解绑所有事件, 再绑定 click
    $('.btn_confirm').off().on("click", function() {
      // 请求: post
      // 参数: id  isDelete
      $.post("/user/updateUser", {
        id: id,
        isDelete: isDelete
      }, function( data ) {
        console.log(data);
        if( data.success ) {
          // 关闭模态框
          $("#statusModal").modal("hide");
          // 需要重新刷新页面
          render();
        }
      })
    });
  });
  
  
  function render() {
    // 发送 ajax 请求, 获取到用户的数据
    $.get("/user/queryUser", {
      page: currentPage,
      pageSize: pageSize
    }, function( data ) {
      console.log( data );
      // 将获取到的数据通过模板引擎渲染到页面中
      // 模板引擎中可以使用传进模板引擎的对象的属性
      var htmlStr = template( "table_tpl", data );
    
      $('.lt_content tbody').html( htmlStr );
    
      // 计算总页数
      var totalPages = Math.ceil( data.total / data.size );
    
      // 分页组件初始化
      $('#paginator').bootstrapPaginator({
        bootstrapMajorVersion: 3,
        currentPage: currentPage,  // 当前页
        totalPages: totalPages, // 总页数
        numberOfPages: 5,
        size: "small",//设置控件的大小，mini, small, normal,large
        itemTexts: function (type, page, current) {
          switch (type) {
            case "first":
              return "首页";
            case "prev":
              return "上一页";
            case "next":
              return "下一页";
            case "last":
              return "底部";
            case "page":
              return page
          }
        },
        onPageClicked: function (event, originalEvent, type, page) {
          //为按钮绑定点击事件 page:当前点击的按钮值
          currentPage = page;
          // 重新调用 render
          render();
        }
      });
      
    })
  }
  
})
