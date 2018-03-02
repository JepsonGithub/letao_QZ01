/**
 * Created by Jepson on 2018/1/3.
 */

$(function() {

  // 当前第几页
  var currentPage = 1;
  // 每页多少个
  var pageSize = 5;
  
  // 存储上传图片的数组
  var imgsArray = [];
  
  render();
  
  
  function render() {
    
    // 发送 ajax 请求, 获取商品数据
    $.get( "/product/queryProductDetailList", {
      page: currentPage,
      pageSize: pageSize
    }, function( data ) {
      console.log( data );
      
      // 根据数据渲染页面
      var htmlStr = template( "proTpl", data );
      $('.lt_content tbody').html( htmlStr );
      
      // 分页插件初始化
      $('#paginator').bootstrapPaginator({
        // 首先指定当前bootstrap 版本, 3 的时候, 必须是 ul
        bootstrapMajorVersion: 3,
        // 指定当前页
        currentPage: currentPage,
        // 指定总页数
        totalPages: Math.ceil( data.total / data.size ),
        useBootstrapTooltip: true,
        tooltipTitles: function( type, page, current ) {
          switch ( type ) {
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
        // 可以将右下角的内容, 替换成中文文本
        itemTexts: function( type, page, current ) {
          switch ( type ) {
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
        // 点击时候, 要更新当前页, 重新渲染
        onPageClicked: function( a, b, c,page ) {
          currentPage = page;
          render();
        }
      })
      
    })
  }
  
  
  // 点击添加按钮, 显示模态框
  $("#addProductBtn").on("click", function() {
    $("#addProductModal").modal();
    
    // 渲染下拉菜单
    // 1. 通过ajax 请求, 获取到所有的二级分类
    // 2. 通过模板引擎, 渲染到下拉菜单中
    $.get("/category/querySecondCategoryPaging", { page:1, pageSize: 100 }, function( data ) {
      // 通过模板引擎, 渲染到下拉菜单中
      console.log(data);
      
      var htmlStr = template( "dropdownTpl", data );
      $('#addProductModal .dropdown-menu').html( htmlStr );
    })
    
  });
  
  
  // 选择品牌, 结构动态生成的, 所以注册委托事件
  $('#addProductModal .dropdown-menu').on("click", "a", function() {
    // 设置文本
    $("#addProductModal .dropdown-text").text( $(this).text() );
    // 设置隐藏域值
    $('[name="brandId"]').val( $(this).data("id") );
    // 选择成功后, 让隐藏域置为校验成功状态
    // VALID 表示校验成功
    $form.data("bootstrapValidator").updateStatus( "brandId", "VALID" );
  })

  
  // 表单校验
  var $form = $('#form');
  
  // 表单校验
  $form.bootstrapValidator({
    // 配置排除项, 默认 hidden 隐藏域不校验
    excluded: [],
    
    // 配置反馈的图标
    // 配置校验时显示的图标, 可以更好看一点
    feedbackIcons: {
      // 校验成功
      valid: 'glyphicon glyphicon-ok',
      // 校验失败
      invalid: 'glyphicon glyphicon-remove',
      // 校验中
      validating: 'glyphicon glyphicon-refresh'
    },
    
    
    // 配置校验规则
    fields: {
      // 品牌二级分类
      brandId: {
        validators: {
          notEmpty: {
            message: "请选择品牌二级分类"
          }
        }
      },
      
      // 商品名称非空
      proName: {
        validators: {
          notEmpty: {
            message: "请输入商品名称"
          }
        }
      },
      
      // 商品描述非空
      proDesc: {
        validators: {
          notEmpty: {
            message: "请输入商品描述"
          }
        }
      },
      
      // 商品库存非空, 且必须是数字
      num: {
        validators: {
          notEmpty: {
            message: "请输入库存"
          },
          // 正则校验
          regexp: {
            // 正则规则, 不能是 0 开头, 必须是数字
            regexp:  /^[1-9]\d*$/,
            message: '请输入合法的库存, 库存为数字'
          }
        }
      },
      
      // 商品尺码, size
      size: {
        validators: {
           notEmpty: {
             message: "请输入尺码"
           },
          regexp: {
             // 正则规则, 必须格式是 xx-xx
            regexp: /^\d{2}-\d{2}$/,
            message: "请输入合法的尺码, 例如 32-48"
          }
        }
      },
  
      // 商品原价非空
      oldPrice: {
        validators: {
          notEmpty: {
            message: "请输入商品原价"
          }
        }
      },
  
  
      // 商品价格非空
      price: {
        validators: {
          notEmpty: {
            message: "请输入商品价格"
          }
        }
      },
  
      picSelect: {
        validators: {
          notEmpty: {
            message: "请选择三张图片"
          }
        }
      }
  
    }
    
  });
  
  
  
  $('#btn_upload').on("click", function() {
    $('#file_upload').trigger("click");
  });
  
  
  // 图片上传功能
  $('#file_upload').fileupload({
    dataType: "json",
    done: function( e, data ) {
      console.log( data.result );
      
      // 如果到了 3 张, 那么干掉第一张, 再往里面推
      if( imgsArray.length >= 3 ) {
        // 把数组的第一项清掉
        imgsArray.shift();
        // 自杀
        $('.imgBox').children(":first-child").remove();
      }
  
  
      // 1. 图片上传成功了, 就要把图片显示出来
      //    上传一张显示一张
      $('.imgBox').append( '<img src="' + data.result.picAddr + '" height="100" alt="">');
  
      // 2. 存储图片
      imgsArray.push( data.result );
  
  
      // 3. 判断长度, 如果是 3, 说明满足条件, 手动校验成功
      if ( imgsArray.length === 3 ) {
        $form.data("bootstrapValidator").updateStatus("picSelect", "VALID");
      } else {
        $form.data("bootstrapValidator").updateStatus("picSelect", "INVALID");
      }
      
    }
  });
  
  
  // 校验都完成以后, 要注册表单校验成功事件
  $form.on("success.form.bv", function( e ) {
    // 默认是会提交表单的, 只是这里我们用了 form="form" 插件没有考虑这么周全, 所以不会提交
    // 但是我们还是养成习惯, 这里就是要阻止表单提交, 使用 ajax 来请求
    e.preventDefault();
    
    // 发送 ajax 请求
    var params = $form.serialize();
  
    // 还要拼接上图片
    imgsArray.forEach(function( v, i ) {
      // &picName1=aa.png&picAdd1=abc/aa.png
      params += "&picName"+ (i+1) + "=" + v.picName + "&picAddr" + (i+1) + "=" + v.picAddr;
    });
    
    // 发送 ajax 请求
    $.post( "/product/addProduct", params, function( data ) {
      if ( data.success ) {
        // 1. 关闭模态框
        $('#addProductModal').modal("hide");
        
        // 2. 重新渲染第一页
        currentPage = 1;
        render();
        
        // 3. 重置表单的内容和样式
        $form[0].reset();
        $form.data("bootstrapValidator").resetForm();
        
        // 下拉菜单
        $('#addProductModal .dropdown-text').text( "请选择" );
        $('#addProductModal [name="brandId"]').val("");
        
        // 重置图片
        $('.imgBox img').remove();
        imgsArray = [];
      }
    })
    
  })
  
  
})
