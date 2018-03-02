/**
 * Created by Jepson on 2018/1/7.
 */

$(function() {

  // 当前页
  var currentPage = 1;
  // 每页多少条
  var pageSize = 5;
  // 存储上传上来的图片的地址和名称
  var imgArr = [];
  
  // 进行数据请求, 然后渲染
  render();
  
  function render() {
  
    // 接口地址: /product/queryProductDetailList
    // 请求方式: get
    // 参数: page pageSize
    $.get( "/product/queryProductDetailList", {
      page: currentPage,
      pageSize: pageSize
    }, function( data ) {
      // console.log( data );
      
      var htmlStr = template( "productTpl", data );
      $('.lt_content tbody').html( htmlStr );
      
      // 分页初始化
      $('#paginator').bootstrapPaginator({
        bootstrapMajorVersion:3, // 必须指定版本号, 我们用的是 3
        // 当前页
        currentPage: currentPage,
        // 总页数
        totalPages: Math.ceil( data.total / data.size ),
        // 点击页码触发
        onPageClicked: function(a,b,c,page) {
          // page 指的是当前是点击的第几页
          // 更新当前页
          currentPage = page;
          // 重新渲染页面
          render();
        }
      })
      
    })
  
  }
  
  // 点击添加商品按钮, 让模态框显示
  $('#addProductBtn').on("click", function() {
    $('#addProductModal').modal();
    
    // 模态框, 显示完成后, 就应该渲染二级分类 (发送ajax请求, 请求二级分类数据)
    // 接口地址: /category/querySecondCategoryPaging
    // 请求方式: GET
    // 参数 page 和 pageSize  我们需要所有的二级分类列表, pagesize 传大一点就可以了
    $.get( "/category/querySecondCategoryPaging", {
      page: 1,
      pageSize: 100
    }, function( data ) {
      console.log( data );
      
      var htmlStr = template( "dropdownTpl", data );
      $('.dropdown-menu').html( htmlStr );
    })
  });
  
  
  // 添加事件委托, 下拉框选择功能
  $('.dropdown-menu').on("click", "a", function() {
    // 获取当前 a 的文本, 渲染到 dropdown-text 中
    $('.dropdown-text').text( $(this).text() );
    
    // 获取当前 a 存的 id, 设置给隐藏域
    $('[name="brandId"]').val( $(this).data("id") );
    
    // 选择的时候, 重置校验状态
    $form.data("bootstrapValidator").updateStatus("brandId", "VALID");
  })
  

  
  var $form = $('#form');
  
  $form.bootstrapValidator({
    
    // 默认, 会将 input:hidden 添加到排除项, 不进行校验
    // [ ":hidden", ":disabled" ]
    excluded: [],
    
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
      brandId: {
        // 校验规则
        validators: {
          // 非空校验
          notEmpty: {
            message: "请选择二级分类"
          }
        }
      },
      
      // 商品名称
      proName: {
        // 校验规则
        validators: {
          notEmpty: {
            message: "请输入商品名称"
          }
        }
      },
      
      // 商品描述
      proDesc: {
        validators: {
          notEmpty: {
            message: "请输入商品描述"
          }
        }
      },
      
      
      // 商品库存
      // 必须是一个 非0开头的 数字   999 10  1
      num: {
        validators: {
          notEmpty: {
            message: "请输入库存"
          },
          //正则校验
          regexp: {
            regexp: /^[1-9]\d*$/,
            message: '请输入合法的库存 如: 100'
          }
        }
      },
      
      // 商品尺寸
      size: {
        validators: {
          notEmpty: {
            message: "请输入商品尺寸"
          },
          regexp: {
            // xx-xx
            regexp: /^\d{2}-\d{2}$/,
            message: "请输入合法的商品尺寸, 例如 32-40"
          }
        }
      },
  
      oldPrice: {
        validators: {
          notEmpty: {
            message: "请输入商品原价"
          }
        }
      },
      
      price: {
        validators: {
          notEmpty: {
            message: "请输入商品价格"
          }
        }
      },
  
  
      // 用于标记, 当前有没有上传图片
      picBoxValidateFlag: {
        validators: {
          notEmpty: {
            message: "请上传 3 张图片"
          }
        }
      }
    }
    
  });
  
  
  
  // 点击上传图片按钮, 让file input 框被点击
  $('#uploadBtn').on("click", function() {
    $('#uploadFile').trigger("click");
  });
  
  // 上传图片初始化
  // 上传多张图片, 就会有多次响应
  $('#uploadFile').fileupload({
    dataType: "json",
    // 上传完成时调用
    done: function( e, data ) {
      console.log( data )
      // 由于上传图片接口, 需要 picName1图片名称 picAddr1图片地址
      var imgObj = data.result;
      console.log( imgObj );
      
      // 要求, 必须上传 3 张图片
      if( imgArr.length >= 3 ) {
        // 如果超过 3 张 删除 第一项
        imgArr.shift();
        // 需要将盒子里面的第一个 img 元素删除, 自杀 remove()
        $('.imgBox img:first-of-type').remove();
      }
      
      // 将上传的图片, 渲染到页面中
      $('.imgBox').append( '<img src="'+ imgObj.picAddr +'" width="100" alt="">');
      imgArr.push( imgObj );
      
      if ( imgArr.length === 3 ) {
        $form.data("bootstrapValidator").updateStatus("picBoxValidateFlag", "VALID");
      }
    }
  });
  
  
  
  // 注册校验成功事件
  $form.on("success.form.bv", function( e ) {
    e.preventDefault();
    
    // 通过 ajax 进行表单提交了
    console.log( "提交表单, 添加商品");
    
    // 很多参数需要上传, 所以先通过 serialize 把表单中的数据先拿到
    var params = $form.serialize();
    
    // 将刚才存 arr 里面的 图片地址和 图片名称, 拼接在 params 后面,
    // 作为参数进行表单提交
    imgArr.forEach( function( v, i ) {
      // id=123&name=456
      // &picName1=111.png&picAddr1=222.png
      // &picName2=111.png&picAddr2=222.png
      // &picName3=111.png&picAddr3=222.png
      params += "&picName" + (i+1) + "=" + v.picName + "&picAddr" + (i+1) + "=" + v.picAddr;
    });
    
    
    console.log( params );
    
    // 将拼接好的 params 作为参数进行表单提交
    // 接口地址: /product/addProduct
    // 请求方式: POST
    $.post( "/product/addProduct", params, function( data ) {
      console.log( data );
      if ( data.success ) {
        // 添加完成, 应该重新渲染第一页
        currentPage = 1;
        render();
        
        // 表单提交成功
        // 1. 关闭模态框
        $('#addProductModal').modal("hide");
        
        // 2. 重置表单
        $form[0].reset();
        
        // 3. 重置表单校验状态
        $form.data("bootstrapValidator").resetForm();
        
        // 4. 将二级选择框, 置为 请选择
        $('.dropdown-text').text("请选择");
        $('[name="brandId"]').val("");
        
        // 5. 添加完商品 清空图片
        imgArr = [];
        $('.imgBox img').remove();
      }
    })
    
  })
  
})
