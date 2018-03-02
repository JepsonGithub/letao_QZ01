/**
 * Created by Jepson on 2018/1/2.
 */

$(function() {
  // 当前页码
  var currentPage = 1;
  // 每页多少条
  var pageSize = 5;

  // 渲染页面
  render();
  
  
  // 查询一级分类列表
  function render() {
    // 请求方式: get,
    // 参数: page pageSize
    $.get("/category/queryTopCategoryPaging", {
      page: currentPage,
      pageSize: pageSize
    }, function( data ) {
      console.log( data );
      // 将后台传过来的数据通过模板引擎渲染到页面中
      // 在模板中, 可以任意使用传入对象中的属性
      var htmlStr = template( "cate_tpl", data );
      $('.lt_content tbody').html( htmlStr );
      
      
      // 获取总页数
      var totalPages = Math.ceil( data.total / data.size );
  
      console.log(totalPages);
  
      // 分页组件初始化
      $('#paginator').bootstrapPaginator({
        // 搭配使用的 bootstrap 版本, 这里是 3 的版本, 3的版本, 页面中必须用 ul
        bootstrapMajorVersion: 3,
        // 当前页
        currentPage: currentPage,
        // 总页数
        totalPages: totalPages,
        numberOfPages: 5,
        size:"small", //设置控件的大小，mini, small, normal,large
        onPageClicked:function(event, originalEvent, type, page){
          //为按钮绑定点击事件 page:当前点击的按钮值
          console.log( page );
          // 更新当前页
          currentPage = page;
          // 更新完成当前页, 重新渲染页面
          render();
        }
      })
      
    })
  }
  
  
  
  // 点击添加分类按钮, 显示添加模态框
  $('.btn_add').on("click", function() {
    // 显示模态框
    $('#type1_tpl').modal();
  });
  
  
  // 表单校验功能
  var $form = $('#form');
  $form.bootstrapValidator({
    // 指定校验的图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    
    // 配置校验规则
    fields: {
      // 一级分类名称不能为空
      categoryName: {
        validators: {
          // 不能为空
          notEmpty: {
            message: "一级分类名称不能为空"
          }
        }
      }
    }
    
  })
  
  
  $form.on('success.form.bv', function( e ) {
    // 阻止默认行为
    e.preventDefault();
    
    // 使用 ajax 提交逻辑
    // 获取input框中的内容, 提交数据
    // 接口地址: /category/addTopCategory
    // 请求: POST
    // 参数: categoryName 分类名称
    $.post( "/category/addTopCategory", $('#form').serialize(), function( data ) {
      console.log( data );
      if( data.success ) {
        // 添加成功
        // 重新渲染页面
        // 关闭模态框
        $('#type1_tpl').modal("hide");
        render();
        
        // 清空文本框
        $form[0].reset();
        
        // 让文本框恢复成未验证的状态
        $form.data("bootstrapValidator").resetForm();
      }
    });
    
  })
  
  
})
