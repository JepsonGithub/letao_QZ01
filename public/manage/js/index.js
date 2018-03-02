/**
 * Created by Jepson on 2018/1/1.
 */

$(function() {

  // 绘制柱状图
  var barChart = echarts.init( document.querySelector(".pic_left") );
  
  // 指定图表的配置项和数据
  var barOption = {
    // 标题
    title: {
      text: "2017注册人数"
    },
    tooltip: {},
    legend: {
      data: ['人数']
    },
    // x 轴
    xAxis: {
      data: [ "1月", "2月", "3月", "4月", "5月", "6月" ]
    },
    // y 轴
    yAxis: {
      // 不用设置动态生成
    },
    series: [{
      name: '人数',
      type: 'bar',
      data: [500, 1500, 1836, 826, 755, 1233]
    }]
  };
  
  // 使用刚指定的配置项和数据显示图表
  barChart.setOption( barOption );
  
  
  
  var pieChart = echarts.init(document.querySelector(".pic_right"));
  
  pieOption = {
    title: {
      text: '热门品牌销售',
      subtext: '2017年6月',
      x: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      data: ['耐克', '阿迪', '百伦', '安踏', '李宁']
    },
    series: [{
      name: '访问来源',
      type: 'pie',
      radius: '55%',
      center: ['50%', '60%'],
      data: [
        {
          value: 310,
          name: '耐克'
        },
        {
          value: 234,
          name: '阿迪'
        },
        {
          value: 135,
          name: '百伦'
        },
        {
          value: 1548,
          name: '李宁'
        },
        {
          value: 456,
          name: '安踏'
        }
      ],
      itemStyle: {
        emphasis: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }]
  };
  
  pieChart.setOption( pieOption )
  
  
  
})