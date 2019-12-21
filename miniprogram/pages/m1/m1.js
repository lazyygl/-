Page({
  data: {
    showModalStatus: false,
    lists: [],
    inputValue1: '',
    inputValue2: '',
    inputValue3: '',
    inputValue4: '',
    start: 0,
  },


  powerDrawer: function (e) {
    var currentStatu = e.currentTarget.dataset.statu;
    this.util(currentStatu)
  },
  no: function (e) {
    var currentStatu = e.currentTarget.dataset.statu;
    this.util(currentStatu)
  },
  input1: function (e) {
    var value = e.detail.value;
    this.setData({
      inputValue1: value
    })
  },
  input2: function (e) {
    var value = e.detail.value;
    this.setData({
      inputValue2: value
    })
  },
  input3: function (e) {
    var value = e.detail.value;
    this.setData({
      inputValue3: value
    })
  },
  input4: function (e) {
    var value = e.detail.value;
    this.setData({
      inputValue4: value
    })
  },

  yes: function (e) {
    var newarray = [{
      name1: this.data.inputValue1,
      name2: this.data.inputValue2,
      name3: this.data.inputValue3,
      name4: this.data.inputValue4,
    }];
    this.setData({
      lists: this.data.lists.concat(newarray),
      inputValue1: '',
      inputValue2: '',
      inputValue3: '',
      inputValue4: '',
      start: 1,
    })

    var currentStatu = e.currentTarget.dataset.statu;
    this.util(currentStatu)
  },
  chart: function (e) {
    wx.navigateTo({
      url: '../m2/m2'
    })
    getApp().globalData.id = e.currentTarget.id
    getApp().globalData.lists = this.data.lists;
    console.log(getApp().globalData.lists)
  },
  util: function (currentStatu) {
    /* 动画部分 */
    // 第1步：创建动画实例 
    var animation = wx.createAnimation({
      duration: 200, //动画时长 
      timingFunction: "linear", //线性 
      delay: 0 //0则不延迟 
    });

    // 第2步：这个动画实例赋给当前的动画实例 
    this.animation = animation;

    // 第3步：执行第一组动画 
    animation.opacity(0).rotateX(-100).step();

    // 第4步：导出动画对象赋给数据对象储存 
    this.setData({
      animationData: animation.export()
    })

    // 第5步：设置定时器到指定时候后，执行第二组动画 
    setTimeout(function () {
      // 执行第二组动画 
      animation.opacity(1).rotateX(0).step();
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象 
      this.setData({
        animationData: animation
      })

      //关闭 
      if (currentStatu == "close") {
        this.setData(
          {
            showModalStatus: false
          }
        );
      }
    }.bind(this), 200)

    // 显示 
    if (currentStatu == "open") {
      this.setData(
        {
          showModalStatus: true
        }
      );
    }
  }
})

