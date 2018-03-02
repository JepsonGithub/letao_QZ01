/**
 * Created by Jepson on 2018/1/12.
 */

$(function() {
  
  render();
  
  function render() {
    // 渲染页面
    $.get("/cart/queryCart", function( data ) {
      console.log(data);
      if ( data.error ) {
        // 用户没登陆, 跳转到登录页, 而且登录完成后, 要跳回来
        location.href = "login.html?retUrl=" + location.href;
        return;
      }
    
      // 根据数据渲染页面
      var htmlStr = template( "cartTpl", { arr: data } );
      $('#itemList').html( htmlStr );
    
      // 页面渲染完成, 让刷新归位
      mui('.mui-scroll-wrapper').pullRefresh().endPulldownToRefresh()
    
    
    })
  }
  
  
  // 下拉刷新初始化
  mui.init({
    // 下拉刷新
    pullRefresh : {
      container:".mui-scroll-wrapper",//下拉刷新容器
      // 首次进入, 自动调用下拉刷新
      auto: true,
      down : {
        //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
        callback : function() {
          // 下拉刷新, 发起请求, 请求数据, 进行渲染
          // 模拟数据请求的时间
          setTimeout(function() {
            render();
          }, 500)
          
        }
      }
    }
  });
  
  
  
  // 给所有的删除按钮, 添加事件委托
  // 注意: 在mui中使用下拉刷新组件时, 默认将 click 事件, 阻止了,
  //       mui 推荐使用 tap 事件来进行事件绑定
  $('.lt_main').on("tap", ".btn_delete", function() {
    console.log(1111);
    
    var id = $(this).data("id");
  
    console.log(id);
  
    $.get("/cart/deleteCart", { id: [ id ] }, function( data ) {
      console.log(data);
  
      if ( data.success ) {
        mui(".mui-scroll-wrapper").pullRefresh().pulldownLoading();
      }
    })
  
  })
  
  
  
  
  // 修改功能
  $('.lt_main').on("tap", ".btn_edit", function() {
    
    // 通过 dataset 数据集, 将 btn_edit 中保存的所有数据, 都获取到了
    var data = this.dataset;
  
    console.log(data);
  
    // mui confirm 支持直接传 htmlStr
    // 所以, 我们可以通过模板引擎, 动态生成结构, 输出到修改框中
    var htmlStr = template( "editTpl", data );
    
    // 在 mui 中, 会将 \n 转换成换行 br
    // 需要 将所有的 \n 干掉
    // 需要通过正则, 将所有的 \n 都替换掉
    htmlStr = htmlStr.replace( /\n/g, "" );
    
    // 弹出一个修改框
    mui.confirm( htmlStr, "修改商品", ["取消", "确认修改"], function( e ) {
      if ( e.index === 1 ) {
        // 说明确认修改
        console.log( "确认修改" )
        
        // 获取选中的尺码
        var size = $(".lt_edit_size .size.now").text();
        
        // 获取数量
        var num = $('.mui-numbox-input').val();
        
        $.post( "/cart/updateCart", {
          id: data.id,
          size: size,
          num: num
        }, function( data ) {
          console.log( data );
          if( data.success ) {
            // 修改成功, 页面就应该重新渲染
            // 重新调用下拉刷新的 loading 方法
            mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();
          }
        })
        
      }
    })
  
    
    // 初始化数字框
    mui(".mui-numbox").numbox();
    
    // 添加按钮点击事件委托
    $('.mui-popup').on("tap", ".lt_edit_size .size", function() {
      $(this).addClass("now").siblings().removeClass("now");
    })
  
  
  })
  
  
  
  
})
