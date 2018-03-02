/**
 * Created by Jepson on 2018/1/10.
 */

$(function() {

  // 声明一个搜索关键字
  var HISTORY_KEY = "lt_history_search";
  
  // 下面要进行大量的本地存储读取操作
  // 所以我们对本地存取的操作进行封装
  function getHistory() {
  
    // 先从本地存储中读取, 我们存的历史记录
    var jsonStr = localStorage.getItem( HISTORY_KEY );
    
    // 从本地存储获取的数据是 JSON字符串, 需要将JSON字符串转换成 我们的对象
    var arr = JSON.parse( jsonStr ) || [];
    
    // 将处理得到的数组返回
    return arr;
  }
  
  // 一进入页面就进行渲染
  render();
  
  // 1. 读取本地存储, 进行历史记录渲染
  function render() {
    // 从本地存储中, 读取我们的搜索记录
    var arr = getHistory();
    // 将 arr 渲染到 页面中
    // template 方法第二个参数, 只支持传对象
    var htmlStr = template("historyTpl", { arr: arr } );
    // 将模板和数据相结合, 进行渲染
    $('.lt_history').html( htmlStr );
  }
  
  // 2. 点击清空历史记录, 销毁所有历史记录
  $('.lt_history').on("click", ".clearAll", function() {
    
    // 参数1: confirm框的内容
    // 参数2: 大标题
    // 参数3: 数组 提示框的按钮
    // 参数4: 选择以后的回调函数
    mui.confirm( "确认要清空所有历史记录吗", "温馨提示", ["否", "是"], function( e ) {
      // 当选择完成后, 调用
      var index = e.index;
      
      // index 表示提供的按钮数组, 用户点击的索引
      if ( e.index === 1 ) {
        // 说明用户确认清空历史记录
        localStorage.removeItem( HISTORY_KEY );
        // 重新调用 render() 方法, 读取本地存储中的数据, 重新渲染
        render();
        
      }
      
    })

  })
  
  // 3. 点击删除按钮, 删除当前条
  $(".lt_history").on("click", ".btn_delete", function() {
    
    mui.confirm( "你确定要执行此操作么?", "温馨提示", ["取消", "确定"], function( e ) {
      
      // 说明用户点击的是, 按钮数组中索引为 1 的按钮
      if ( e.index === 1 ) {
        // 删除当前条, 需要先读取本地存储, 需要获取当前删除的索引
        // 根据索引, 从数组中将数据删除, 最后本地持久化, 存储到本地存储中
  
        // 1. 读取本地存储
        var arr = getHistory();
  
        // 2. 获取删除的索引
        var index = $(this).data("index");
  
        // 如果在数组中删除对应索引的项 ?
        // 利用 splice 进行删除对应索引的项
        // splice( index, howmany, 替换的项, 替换的项 .... );
        arr.splice( index, 1 );
  
        // 3. 同步到本地数据库中, 进行本地持久化
        localStorage.setItem( HISTORY_KEY, JSON.stringify( arr ) );
  
        // 4. 重新渲染页面
        render();
        
      }
      
      
    })
    
    
  })
  
  // 4. 点击搜索, 下面添加历史记录
  $('.search_btn').on("click", function() {
    // 先获取到搜索框的值
    var key = $('.search_inp').val();
    
    // 如果没有内容, 提示输入搜索关键字
    if ( !key ) {
      // 直接 alert 用户体验不好
      // alert( "请输入搜索关键字" );
      // mui toast 提示框, mui.toast("文本");
      mui.toast("请输入搜索关键字");
      return;
    }
    
    // 如果有内容, 添加到历史记录中
    // 读取历史记录
    var arr = getHistory();
    
    
    // (1) 重复的需要删除
    //     如果历史记录中已经存在了, 将旧的删除, 重新添加新的,
    //     可以通过 indexOf 查找 key 在 arr 中的索引
    //     如果返回 -1, 说明没有在历史记录中
    //     如果比 -1 大, 就说明在历史记录中有, 需要删除
    var index = arr.indexOf( key );
    if ( index > -1 ) {
      // splice(index, howmany, 替换的项 )
      arr.splice( index, 1 );
    }
    
    // (2) 如果长度超过 10, 就把最旧的那一项删除
    if ( arr.length >= 10 ) {
      // pop 删除数组最后一项
      arr.pop();
    }
    
    
    
    // 添加到数组中, 要添加到最前面
    arr.unshift( key );
    
    // 本地持久化
    localStorage.setItem( HISTORY_KEY, JSON.stringify(arr) );
    
    // 重新渲染
    render();
    
    // 清空搜索框
    $('.search_inp').val("");
    
    // 搜索完成后, 跳转到商品列表页面
    location.href = "searchList.html?key=" + key;
    
  })
  
  // 当回车时, 应该进行搜索操作
  $('.search_inp').on("keyup", function( e ) {
    console.log( e.keyCode );
    if ( e.keyCode === 13 ) {
      // 说明按了回车键, 需要进行搜索操作
      $('.search_btn').trigger("click");
    }
  })

})
