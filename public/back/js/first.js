/**
 * Created by Jepson on 2018/1/7.
 */

$(function() {

  var currentPage = 1; // 当前页
  var pageSize = 5; // 每页渲染多少条
  
  render();
  
  function render() {
    // 接口地址: /category/queryTopCategoryPaging
    // 请求方式: get
    // 请求参数: page, pageSize
    $.get( "/category/queryTopCategoryPaging", {
      page: currentPage,
      pageSize: pageSize
    }, function( data ) {
      // console.log( data );
      // 将模板和数据相结合
      var htmlStr = template( "firstTpl", data );
      $('.lt_content tbody').html( htmlStr );
      
      // 在 ajax 请求结束, 进行分页插件渲染
      $('#paginator').bootstrapPaginator({
        // 指定版本号
        bootstrapMajorVersion: 3,
        // 指定当前页
        currentPage: currentPage,
        // 指定总页数
        totalPages: Math.ceil(data.total / data.size),
        // 监听页码点击
        onPageClicked: function(a,b,c,page) {
          // page 是当前点击的页码
          currentPage = page;
          // 重新渲染
          render();
        }
      });
      
    });
    
  }
  
  
  
  // 1. 点击添加分类按钮, 显示添加一级分类的模态框
  $('#addBtn').on("click", function() {
    $('#addFirstModal').modal();
  })
  
  
  // 2. 表单校验功能
  $form = $('#form');
  
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
    
    // 配置需要校验的字段
    fields: {
      categoryName: {
        // 配置校验规则
        validators: {
          // 非空校验
          notEmpty: {
            message: "一级分类名称不能为空"
          }
        }
      }
    }
    
  })
  
  
  // 表单校验插件会在进行表单提交的时候, 进行校验
  // 1. 校验成功, 继续提交表单
  // 2. 校验失败, 阻止表单提交
  // 我们这边指定的是 form="form" 来进行提交的表单, 所以表单插件校验成功了
  // 也不会默认提交(插件没有考虑到 form="form" );
  
  $form.on("success.form.bv", function( e ) {
    // 阻止默认的行为, 通过 ajax 进行提交表单
    e.preventDefault();
    
    // 接口地址: /category/addTopCategory
    // 请求方式: POST
    // 请求参数: categoryName
    $.post( "/category/addTopCategory", $form.serialize(), function( data ) {
      console.log( data );
      if ( data.success ) {
        // 关闭模态框
        $('#addFirstModal').modal("hide");
        // 重新渲染页面
        // 应该重新渲染第一页, 让用户看到新添加的数据
        currentPage = 1;
        render();
        
        // 添加完成需要重置表单
        $form[0].reset();
        // 需要将校验状态, 也重置成默认状态
        $form.data("bootstrapValidator").resetForm();
      }
    })
    
  })

})
