/**
 * Created by Jepson on 2018/1/4.
 */


$(function() {
  // 下拉刷新
  mui.init({
    // 配置下拉刷新以及上拉加载
    pullRefresh: {
      container: ".mui-scroll-wrapper",
      down : {
        auto: true, //可选,默认false.首次加载自动上拉刷新一次
        callback: function() {
          // 下拉刷新结束
          console.log( "呵呵" ) ;
          render();
        }
      }
    }
  });
  
  
  function render() {
    // 发送 ajax 请求, 获取购物车的数据
    $.get( "/cart/queryCart", function( data ) {
      
      // 模拟刷新的时长
      setTimeout(function() {
    
        if ( data.error === 400 ) {
          // 没登陆, 跳转到登录页面
          location.href = "login.html?retUrl=" + location.href;
        }
    
        mui(".mui-scroll-wrapper").pullRefresh().endPulldownToRefresh();
    
        console.log(data);
    
        // 获取到的购物车数据是一个数组, 渲染到页面中
        $('.item_list').html( template("cart_tpl", { list: data }) );
    
      }, 500);
      
      
    });
  }
  
  
  
  // 删除购物车商品功能
  // 注意: click 事件在 mui 下拉刷新中被屏蔽了
  $('.item_list').on("tap", ".btn_delete", function() {
    var id = $(this).data("id");
    
    mui.confirm("你是否要删除这个商品?", "温馨提示", ["否", "是"], function( e ) {
      if ( e.index === 1 ) {
        
        $.get( "/cart/deleteCart", { id: [ id ] }, function( data ) {
          console.log( data );
          if ( data.success ) {
            console.log( "删除成功" );
            mui(".mui-scroll-wrapper").pullRefresh().pulldownLoading();
          }
        });
        
      }
    })
  });
  
  
  // 修改购物车功能
  $('.item_list').on('tap', '.btn_edit', function() {
    var data = this.dataset;
    console.log( data );
    
    var html = template( "edit_tpl", data );
    
    // html 里面会有很多换行, 需要将 html 中所有换行 替换成 ""
    html = html.replace(/\n/g, "");
    
    // mui.confirm( message, title, btnValue, callback, [, type] )
    mui.confirm(html, "修改商品", ["确认", "取消"], function( e ) {
      console.log( e )
      if ( e.index === 0 ) {
        console.log("点击了确定按钮");
        // 获取到参数 id 尺码 num
        var id = data.id;
        var num = $('.lt_edit_num .mui-numbox-input').val();
        var size = $('.lt_edit_size span.now').text();
        
        // 发送 ajax 请求
        $.post("/cart/updateCart", {
          id: id,
          num: num,
          size: size
        }, function( data ) {
          if ( data.success ) {
            // 如果成功, 重新下拉刷新页面
            mui(".mui-scroll-wrapper").pullRefresh().pulldownLoading();
          }
        })
        
      }
    });
    
    // 数字框初始化
    mui(".lt_edit_num .mui-numbox").numbox();
    
    // 尺码修改注册事件
    $('.lt_edit_size span').on("tap", function() {
      $(this).addClass("now").siblings().removeClass("now");
    });
    
    
  });
  
  
  // 计算总金额
  // 获取到页面中所有的复选框checkbox
  $('.item_list').on("change", ".ck", function() {
    console.log("呵呵");
    // 获取到选中的那些
    var $checkedInp = $(".item_list input:checked");
    var total = 0;
    $checkedInp.each(function() {
      var price = $(this).data("price");
      var num = $(this).data("num");
      
      total += price * num;
    });
    
    
    
    $('.lt_total .total').text( total.toFixed(2) );
    console.log(total);
  })
})
