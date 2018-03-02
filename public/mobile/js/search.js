/**
 * Created by Jepson on 2018/1/4.
 */


$(function() {

  // 设置搜索存储关键字
  var HISTORY_KEY = "lt_search_history";
  
  // 将来我们的搜索数据一定是存储在 localStorage 中的
  
  // 每次读取历史记录需要时间很麻烦
  function getHistory() {
    var history = localStorage.getItem( HISTORY_KEY );
    var arr = JSON.parse( history ) || [];
    return arr;
  }
  
  
  // 一进来就渲染
  render();
  
  // 1. 渲染搜索列表
  function render() {
    // 从localStorage中读取存储的 history
    var arr = getHistory();
    var htmlStr = template("searchTpl", { arr: arr } );
    $(".lt_history").html( htmlStr );
  }
  
  // 2. 清空搜索列表功能
  $('.lt_history').on("click", ".btn_empty", function() {
  
    // mui 确认框
    mui.confirm("您是否要清空所有的历史记录?", "温馨提示", ["取消", "确定"], function( e ) {
      if ( e.index === 1 ) {
        // 移除 lt_search_history
        localStorage.removeItem( HISTORY_KEY );
        // 重新渲染
        render();
      }
    })
  
  });
  
  
  // 3. 删除一个搜索历史
  $('.lt_history').on("click", ".btn_delete", function() {
    var that = this;
    
    mui.confirm("你确定要删除么?", "温馨提示", ["否", "是"], function( e ) {
      if ( e.index === 1 ) {
        // 用户选择了是
        // 我们需要知道要删除第几个, 所以在渲染时, 以自定义属性的方式, 存储 index 索引
        var index = $(that).data("index");
        
        // 从本地存储中拿到数据
        var arr = getHistory();
        
        // 将第 index 个删除
        // slice splice
        // slice(start, end)
        // 截取数组中, 从 begin 开始, 到 end 结束, 不包含 end, 截取这些数据, 返回一个新数组
        // 不会改变原数组
        
        // splice 可以在任意位置添加或者删除, 替换
        // arr.splice( index, howmany, item1, item2, ... )
        // 会改变原数组
        arr.splice( index, 1 );
        
        // 进行数据持久化
        localStorage.setItem( HISTORY_KEY, JSON.stringify( arr ) );
        
        // 持久化完成后重新渲染
        render();
      }
    })
  })
  
  
  
  // 监听回车按钮
  $('.search_inp').on("keyup", function( e ) {
    if ( e.keyCode === 13 ) {
      // 说明用户填了 13
      $('.search_btn').trigger("click");
    }
  });
  
  
  // 4. 添加搜索列表
  $('.search_btn').on("click", function() {
  
    // 获取搜索关键字
    var key = $('.search_inp').val();
    
    // 如果为空, 提示用户输入
    if( !key ) {
      mui.toast( "请输入搜索关键字" );
      return;
    }
  
    // 如果非空, 就添加到存储中
    // 获取存储中的数据
    var arr = getHistory();
    
    // (1) 重复掉的要删除掉
    var index = arr.indexOf( key );
    if ( index !== -1 ) {
      // 说明这个数据, 在数组中已经有了
      // 就把这个删了, 然后在下面可以添加到最前面
      arr.splice( index, 1 );
    }
    
    // (2) 长度限制 10
    if ( arr.length >= 10 ) {
      // 下面就要再次进行添加了, 所以这里先把最老的给删掉
      arr.pop();
    }
    
    // 添加到最前面
    arr.unshift( key );
    
    // 进行数据持久化
    localStorage.setItem( HISTORY_KEY, JSON.stringify( arr ) );
    
    // 持久化完成后, 重新渲染
    render();
    
    // 清空输入框
    $('.search_inp').val("");
  
  
    // 跳转到 searchList 页面
    location.href = "searchList.html?key="+ key;
    
  })
  
});