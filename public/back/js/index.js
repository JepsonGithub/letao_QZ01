/**
 * Created by Jepson on 2018/1/6.
 */

$(function() {

  // 绘制柱状图
  var barChart = echarts.init( document.querySelector(".pic_left") );
  
  // 指定图表的配置项和数据
  var barOption = {
    // 标题
    title: {
      text: '2017 年注册人数'
    },
    // 提示框组件
    tooltip: {},
    // 图例
    legend: {
      // 注意: 图例中的 data 要和 series 中的 name 要对应
      data:['人数']
    },
    // x 轴的数据
    xAxis: {
      data: ["1月","2月","3月","4月","5月","6月"]
    },
    // y 轴的数据
    // 因为 y 轴的刻度应该是通过数据动态生成
    yAxis: {},
    series: [{
      name: '人数',
      type: 'bar',
      data: [500, 1500, 1836, 826, 755, 1223]
    }]
  };
  
  // 使用刚指定的配置项和数据显示图表。
  barChart.setOption(barOption);
  
  
  // 绘制饼状图
  var pieChart = echarts.init( document.querySelector(".pic_right") );
  
  // 进行配置饼状图
  var pieOption = {
    title : {
      text: '热门品牌销售',
      // 副标题
      subtext: '2017年6月',
      // 配置水平对齐方式
      x:'center'
    },
    // 提示框组件
    tooltip : {
      trigger: 'item',
      // {a}（系列名称），{b}（数据项名称），{c}（数值）, {d}（百分比）
      formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      data: ['耐克','阿迪','百轮','安踏','李宁']
    },
    // 系列数据
    series : [
      {
        name: '访问来源',
        type: 'pie',
        radius : ["20%", "60%"],
        // 圆心坐标
        center: ['50%', '60%'],
        data:[
          {value:335, name:'耐克'},
          {value:310, name:'阿迪'},
          {value:234, name:'百轮'},
          {value:135, name:'安踏'},
          {value:1548, name:'李宁'}
        ],
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };
  
  // 设置 option
  pieChart.setOption( pieOption );
  
})
