/**
 * Created by Jepson on 2018/1/3.
 */

$(function() {
  
  // 请求一级分类列表内容
  $.get( "/category/queryTopCategory", function( data ) {
    console.log( data );
    // 通过 artTemplate 生成 htmlStr 数据
    var htmlStr = template( "leftTpl", data );
    $('.lt_category_left .mui-scroll').html( htmlStr );
    
    // 一进入页面, 先渲染第一个一级列表的 二级列表数据
    renderSecond( data.rows[0].id );
  });
  
  
  // 渲染二级列表可能会渲染很多次, 而且是根据选择的一级列表, 渲染出来的
  // 渲染二级列表需要传递一级分类的 id
  function renderSecond( id ) {
    $.get("/category/querySecondCategory", { id: id }, function( data ) {
      console.log( data );
      var htmlStr = template( "rightTpl", data );
      $('.lt_category_right .mui-scroll').html( htmlStr );
    })
  }
  
  
  // 给左侧列表注册委托事件, 点击左侧列表, 右边渲染
  $('.lt_category_left').on("click", "li", function() {
    // 首先排他, 样式要切换
    $(this).addClass("now").siblings().removeClass("now");
    
    // 获取点击的 li 的 id, 渲染 二级列表
    var id = $(this).data("id");
    renderSecond( id );
  });
})