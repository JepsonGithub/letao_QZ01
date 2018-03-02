/**
 * Created by Jepson on 2018/1/7.
 */

$(function() {


  // 进行查询二级分类的所有数据
  var currentPage = 1;
  var pageSize = 5;
  
  render();
  
  function render() {
    // 发送请求, 请求数据, 进行页面渲染
    // 请求地址: /category/querySecondCategoryPaging
    // 请求方式: GET
    // 请求参数: page, pageSize
    
    $.get( "/category/querySecondCategoryPaging", {
      page: currentPage,
      pageSize: pageSize
    }, function( data ) {
      console.log( data );
      // 得到数据后, 通过模板引擎进行渲染
      // 将模板和数据相结合
      // 通过 template(模板id, 数据对象)
      var htmlStr = template( "tableTpl", data );
      // 渲染到表格中
      $('.lt_content tbody').html( htmlStr );
      
      
      // 进行分页初始化
      $('#paginator').bootstrapPaginator({
        // 指定版本号, 默认是 bootstrap 2版本的, 需要指定成 3
        bootstrapMajorVersion: 3,
        // 当前页
        currentPage: currentPage,
        // 总页数
        totalPages: Math.ceil(data.total / data.size),
        // 当下面的页码被点击时触发
        onPageClicked: function( a,b,c, page ) {
          // page 当前点击的是第几页
          // 更新当前页
          currentPage = page;
          // 重新进行渲染
          render();
        }
      })
      
    })
    
  }
  
  // 1. 点击添加分类按钮, 显示模态框
  $('#addBtn').on("click", function() {
    // 调用 modal() 方法进行显示
    $('#addSecondModal').modal();
    
    // 显示模态框时, 应该发送 ajax 请求, 到后台, 请求一级列表数据
    // 接口地址: /category/queryTopCategoryPaging
    // 请求方式: GET
    // 参数: page, pageSize
    $.get( "/category/queryTopCategoryPaging", {
      page: 1,
      pageSize: 100
    }, function( data ) {
      console.log( data );
      
      var htmlStr = template( "dropdownTpl", data );
      $('.dropdown-menu').html( htmlStr );
      
    })
  });
  
  
  // 2. 给所有的 dropdown-menu 里面的 a 添加事件绑定
  //    需要给 dropdown-menu 绑定事件委托
  $('.dropdown-menu').on( "click", "a", function() {
    var selText = $(this).text();
    // 将选中的文本, 渲染到我们上面的按钮
    $('.dropdown-text').text( selText );
    
    // 获取当前点击的分类的id, 设置给隐藏域
    var categoryId = $(this).data("id");
    $('[name="categoryId"]').val( categoryId );
    
    // 选择完成后, 让校验状态应该变成 成功
    // 参数1: 字段名称
    // 参数2: 更改后的状态 VALID 表示校验成功, INVALID 校验失败
    $form.data("bootstrapValidator").updateStatus("categoryId", "VALID")
    
  });
  
  
  // 3. 点击上传按钮, 应该让 file文本框 被点击
  $('#uploadBtn').on("click", function() {
    $('#uploadFile').trigger("click");
  })
  
  // 4. 图片上传初始化
  $('#uploadFile').fileupload({
    dataType: "json",
    done: function( e, data ) {
      console.log( data );
      var picUrl = data.result.picAddr;
      // 拿到地址, 渲染到模态框中, 显示给用户
      $('.imgBox img').attr("src", picUrl);
      // 上传完图片后, 应该把地址存在brandLogo input框中
      $('[name="brandLogo"]').val( picUrl );
      
      // 让校验状态置成 VALID
      $form.data("bootstrapValidator").updateStatus("brandLogo", "VALID" );
    }
  });
  
  
  
  // 表单校验功能
  $form = $('#form');
  
  $form.bootstrapValidator({
    // bootstrapValidator 默认对 隐藏域 禁用的 表单进行排除
    // 但是我们现在需要进行对隐藏域进行校验
    // 需要重置排除项
    // 指定 excluded: [] 表示, 所有的类型表单都进行校验, 不排除项
    excluded: [],
    
    // 配置校验时显示的图标
    // 配置校验时显示的图标
    feedbackIcons: {
      // 校验成功的图标
      valid: 'glyphicon glyphicon-ok',
      // 校验失败的图标
      invalid: 'glyphicon glyphicon-remove',
      // 校验中的图标
      validating: 'glyphicon glyphicon-refresh'
    },
    
    // 告诉插件校验哪些字段
    fields: {
      // 选择的一级分类 id
      categoryId: {
        // 配置校验规则
        validators: {
          // 非空校验
          notEmpty: {
            // 提示文本
            message: "请选择一级分类"
          }
        }
      },
  
      // 品牌名称
      brandName: {
        // 配置校验规则
        validators: {
          // 非空校验
          notEmpty: {
            // 提示文本
            message: "请输入品牌名称"
          }
        }
      },
      
      // 上传的品牌图片
      brandLogo: {
        validators: {
          notEmpty: {
            message: "请上传一张图片"
          }
        }
      }
    }
  })
  
  
  // 注册表单校验成功的事件, 在里面阻止表单提交, 通过 ajax 进行提交
  // 表单校验插件默认会在表单提交时进行校验
  // 如果校验成功, 默认提交表单
  
  // 由于我们这里使用了 form="form" html5 新增的属性, 提交按钮在表单外面
  // 表单校验插件, 没有考虑到这一层, 就在校验成功时, 不会默认提交了
  
  $form.on("success.form.bv", function( e ) {
    // 阻止默认行为, 防止表单默认提交
    e.preventDefault();
    
    // 进行 ajax 请求, 添加我们二级分类数据
    // 接口地址: /category/addSecondCategory
    // 请求方式: POST
    // 参数: 通过表单序列化进行提交
    $.post( "/category/addSecondCategory", $form.serialize(), function( data ) {
      // console.log( data )
      if ( data.success ) {
        // 说明添加成功
        // 需要关闭模态框
        $('#addSecondModal').modal("hide");
        // 需要重新渲染页面, 而且渲染第一页效果比较好
        currentPage = 1;
        render();
        
        // 添加完成, 需要进行重置
        // dom.reset() 可以重置表单
        $form[0].reset();
        
        // 重置所有的校验状态
        // 注意: resetForm 方法可以让表单中所有的表单校验状态置成未校验的状态
        $form.data("bootstrapValidator").resetForm();
        
        // 重置下拉框
        $('.dropdown-text').text("请选择");
        $('[name="categoryId"]').val( "" );
        
        // 重置图片
        $('.imgBox img').attr("src", "images/none.png");
        $('[name="brandLogo"]').val( "" );
      }
    })
    
  })
  
})
