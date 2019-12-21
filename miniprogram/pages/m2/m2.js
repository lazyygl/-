var myCharts = require("../../utils/wxchart.js")//引入一个绘图的插件
var app = getApp();

Page({
  data: {
    name1: ' ',
    name2: ' ',
    devicesId: " ",
    api_key: " "
  },

  /**
   * @description 页面下拉刷新事件
   */
  onPullDownRefresh: function () {
    wx.showLoading({
      title: "正在获取"
    })
    this.getDatapoints().then(datapoints => {
      this.update(datapoints)
      wx.hideLoading()
    }).catch((err) => {
      wx.hideLoading()
      console.error(error)
    })
  },

  /**
   * @description 页面加载生命周期
   */
  onLoad: function (opts) {

    this.setData({
      detail: app.globalData.lists,
      id: app.globalData.id,
    })
    this.setData({
      name1: this.data.detail[this.data.id].name1,
      name2: this.data.detail[this.data.id].name2,
      devicesId: this.data.detail[this.data.id].name3,// 填写在OneNet上获得的devicesId 形式就是一串数字 例子:9939133
      api_key: this.data.detail[this.data.id].name4// 填写在OneNet上的 api-key 例子: VeFI0HZ44Qn5dZO14AuLbWSlSlI=
    })
    //每隔6s自动获取一次数据进行更新
    const timer = setInterval(() => {
      this.getDatapoints().then(datapoints => {
        this.update(datapoints)
      })
    }, 6000)

    wx.showLoading({
      title: '加载中'
    })

    this.getDatapoints().then((datapoints) => {
      wx.hideLoading()
      this.firstDraw(datapoints)
    }).catch((err) => {
      wx.hideLoading()
      console.error(err)
      clearInterval(timer) //首次渲染发生错误时禁止自动刷新
    })
  },

  /**
   * 向OneNet请求当前设备的数据点
   * @returns Promise
   */
  getDatapoints: function () {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `https://api.heclouds.com/devices/${this.data.devicesId}/datapoints?datastream_id=MIC&limit=20`,
        header: {
          'content-type': 'application/json',
          'api-key': this.data.api_key
        },
        success: (res) => {
          const status = res.statusCode
          const response = res.data
          if (status !== 200) {
            reject(res.data)
          }
          if (response.errno !== 0) {
            reject(response.error)
          }

          resolve({
            MIC: response.data.datastreams[0].datapoints.reverse(),
          })
        },
        fail: (err) => {
          reject(err)
        }
      })
    })
  },

  /**
   * @param {Object[]} datapoints 从OneNet云平台上获取到的数据点
   * 传入获取到的数据点, 函数自动更新图标
   */
  update: function (datapoints) {
    const wheatherData = this.convert(datapoints);

    this.lineChart_MIC.updateData({
      categories: wheatherData.categories,
      series: [{
        name: 'MIC',
        data: wheatherData.MIC,
        format: (val, name) => val.toFixed(2)
      }],
    })
  },

  /**
   * 
   * @param {Object[]} datapoints 从OneNet云平台上获取到的数据点
   * 传入数据点, 返回使用于图表的数据格式
   */
  convert: function (datapoints) {
    var categories = [];
    var MIC = [];
    var length = datapoints.MIC.length
    for (var i = 0; i < length; i++) {
      categories.push(datapoints.MIC[i].at.slice(5, 19));
      MIC.push(datapoints.MIC[i].value);
    }
    return {
      categories: categories,
      MIC: MIC,
    }
  },

  /**
   * 
   * @param {Object[]} datapoints 从OneNet云平台上获取到的数据点
   * 传入数据点, 函数将进行图表的初始化渲染
   */
  firstDraw: function (datapoints) {

    //得到屏幕宽度
    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }

    var wheatherData = this.convert(datapoints);

    //新建声音图表
    this.lineChart_MIC = new myCharts({
      canvasId: 'MIC',
      type: 'line',
      categories: wheatherData.categories,
      animation: false,
      background: '#f5f5f5',
      series: [{
        name: 'MIC',
        data: wheatherData.MIC,
        format: function (val, name) {
          return val.toFixed(2);
        }
      }],
      xAxis: {
        disableGrid: true
      },
      yAxis: {
        title: 'MIC(%)',
        format: function (val) {
          return val.toFixed(2);
        }
      },
      width: windowWidth,
      height: 200,
      dataLabel: false,
      dataPointShape: true,
      extra: {
        lineStyle: 'curve'
      }
    });
  },
})

