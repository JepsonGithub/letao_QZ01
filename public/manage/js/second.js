/**
 * Created by Jepson on 2018/1/2.
 */

$(function() {

  // 当前页
  var currentPage = 1;
  // 每页条数
  var pageSize = 5;
  
  
  render();
  
  
  function render() {
  
    // 请求数据进行渲染
    // 接口地址: /category/querySecondCategoryPaging
    // 请求方式: get
    // 参数: page, pageSize
    $.get( "/category/querySecondCategoryPaging", {
      page: currentPage,
      pageSize: pageSize
    }, function( data ) {
  
      console.log(data);
  
      // 根据返回的数据, 进行页面的渲染
      var htmlStr = template( "type2_tpl", data );
      $(".lt_content tbody").html( htmlStr );
      
      // 分页组件初始化
      $('#paginator').bootstrapPaginator({
        bootstrapMajorVersion: 3, // 默认是 2, 我们这边是 3
        currentPage: currentPage,
        totalPages: Math.ceil( data.total / data.size ),
        onPageClicked: function( event, originalEvent, type, page ) {
          
          // 置换当前页
          currentPage = page;
          
          // 重新渲染页面
          render();
        }
      })
      
    })
  }
  
  
  // 点击添加分类按钮, 弹出添加分类模态框
  $('#btn_add').on("click", function() {
    // 让模态框显示出来
    $('#secondModal').modal();
    
    
    // 发送 ajax 请求, 获取所有一级分类数据, 渲染下面的页面
    $.get("/category/queryTopCategoryPaging", { page: 1, pageSize: 100 }, function( data ) {
      console.log( data );
      var htmlStr = template( "firstTpl", data );
      $("#secondModal .dropdown-menu").html( htmlStr );
    });
    
  });
  
  // 给 1 级列表里面所有的 a 注册委托事件
  $("#secondModal .dropdown-menu").on("click", "a", function() {
    // 点击时将文本, 设置给按钮
    $(".dropdown-text").text($(this).text());
    
    // 获取到当前 a 的 id 值, 设置给 categoryId
    $('[name="categoryId"]').val( $(this).data("id") );
    
    // 让状态变成校验成功
    $form.data("bootstrapValidator").updateStatus( "categoryId", "VALID" )
  });
  
  
  
  // 给上传图片按钮, 注册点击事件, 点击时, 触发 file input 的点击事件即可
  $('#btn_upload').on("click", function() {
    $('#file_upload').trigger("click");
  });
  
  
  // 文件上传功能
  $('#file_upload').fileupload({
    dataType: "json",
    // 图片上传完成后的回调函数, 上传完成后, 会自动调用这个方法
    done: function (e, data) {
      console.log(data.result.picAddr);
      // 图片预览
      $('.imgBox img').attr( "src", data.result.picAddr );
      
      // 将地址赋值给 brandLogo
      $('[name="brandLogo"]').val( data.result.picAddr );
  
      // 让状态变成校验成功
      $form.data("bootstrapValidator").updateStatus( "brandLogo", "VALID" )
    }
  });
  
  
  
  // 表单校验功能
  var $form = $('#form');
  
  $form.bootstrapValidator({
    // 指定不校验的类型，默认为[':disabled', ':hidden', ':not(:visible)'],可以不设置
    // excluded: [':disabled', ':hidden', ':not(:visible)'],
    // 指定为空, 所有人都校验
    excluded: [],
  
    // 指定校验时的图标显示，默认是bootstrap风格
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
  
    // 指定校验规则
    fields: {
      // 一级分类 id
      categoryId: {
        validators: {
          notEmpty: {
            message: "请选择一级分类"
          }
        }
      },
      // 二级分类名称
      brandName: {
        validators: {
          notEmpty: {
            message: "请输入二级分类的名称"
          }
        }
      },
      // 图片地址
      brandLogo: {
        validators: {
          notEmpty: {
            message: "请选择一张图片"
          }
        }
      }
    }
    
    
  })
  
  
  // 表单校验通过监听
  $form.on('success.form.bv', function( e ) {
    // 阻止默认的提交, 我们通过 ajax 来进行提交
    e.preventDefault();
    
    $.post("/category/addSecondCategory", $form.serialize(), function( data ) {
      console.log( data );
      if ( data.success ) {
        // 说明添加成功
        $('#secondModal').modal("hide");
        // 重新渲染第一页
        currentPage = 1;
        // 页面重新渲染
        render();
        
        // 数据需要重置
        $form[0].reset();
        
        // 表单校验需要重置
        $form.data("bootstrapValidator").resetForm();
        
        // 下拉框 和 图片需要单独重置
        $(".dropdown-text").text("请选择");
        $('[name="categoryId"]').val("");
        $('.imgBox img').attr("src", "./images/none.png");
        $('[name="brandLogo"]').val("");
      }
    })
  })
  
});
