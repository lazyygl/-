Page({
  data: {
    motto: '不苟研笑欢迎您',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    plain: true,
    wrong: 0,
    inputValue1: "",
    inputValue2: "",

  },
  input11: function (e) {
    this.setData({
      inputValue1: e.detail.value
    })
  },
  input22: function (e) {
    this.setData({
      inputValue2: e.detail.value
    })
  },
  onLoad: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }
  },

  student: function () {
    var that = this;
    var i = 0;
    wx.cloud.callFunction({
      name: "read",
      success: function (res) {
        for (i = 0; i < res.result.data.length; i++) {
          if ((res.result.data[i].id == that.data.inputValue1) && (res.result.data[i].password == that.data.inputValue2)) {
            wx.navigateTo({
              url: '../index/index',
            })
            that.setData({
              inputValue1: "",
              inputValue2: ""
            })
            break;
          } 
          if (i == res.result.data.length-1) {
            wx.showToast({

              title: '用户名或密码错误',

              icon: 'none',

              duration: 2000

            })
            that.setData({
              inputValue1: "",
              inputValue2: ""
            })
          }
        }
      }
    })
  },


  manage: function () {
            var that = this;
            var i = 0;
            wx.cloud.callFunction({
              name: "read",
              success: function (res) {
                for (i = 0; i < res.result.data.length; i++) {
                  if ((res.result.data[i].id == that.data.inputValue1) && (res.result.data[i].password == that.data.inputValue2)) {
                    wx.switchTab({
                      url: '../manager/manager',
                    })
                    that.setData({
                      inputValue1: "",
                      inputValue2: ""
                    })
                    break;
                  }
          if (i == res.result.data.length-1) {
            wx.showToast({

              title: '用户名或密码错误',

              icon: 'none',

              duration: 2000

            })
            that.setData({
              inputValue1: "",
              inputValue2: ""
            })
          }
        }
      }
    })
     }
    })