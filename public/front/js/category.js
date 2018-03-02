/**
 * Created by Jepson on 2018/1/9.
 */


// 渲染左侧列表
$(function() {

  // 1. 渲染1级分类左侧列表
  $.get("/category/queryTopCategory", function( data ) {
    console.log( data );
    // 将模板和数据相结合
    var htmlStr = template('leftTpl', data);
    $('.lt_category_left .mui-scroll').html( htmlStr );
    
    // 默认渲染第一页
    renderSecondById( data.rows[0].id );
  });
  
  
  // 2. 根据 id 可以渲染二级列表
  function renderSecondById( categoryId ) {
    
    // 接口地址 /category/querySecondCategory
    // 请求方式 get
    // 参数 id
    $.get( "/category/querySecondCategory", {
      id: categoryId
    }, function( data ) {
      console.log( data );
      var htmlStr = template( "rightTpl", data );
      $('.lt_category_right .mui-scroll').html( htmlStr );
    })
  }
  
  
  // 3. 给左侧 li 注册事件委托, 点击 li 时, 样式排他切换, 渲染对应的二级列表
  $('.lt_category_left').on("click", "li", function() {
    // 样式切换
    $(this).addClass("now").siblings().removeClass("now");
    // 渲染对应的二级列表
    var id = $(this).data("id");
    renderSecondById( id );
  })

})