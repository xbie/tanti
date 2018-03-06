// pages/test/test.js
Page({
  data: {
    array: ['美国', '中国', '巴西', '日本'],
    objectArray: [
      {
        id: 0,
        name: '美国'
      },
      {
        id: 1,
        name: '中国'
      },
      {
        id: 2,
        name: '巴西'
      },
      {
        id: 3,
        name: '日本'
      }
    ],
    index: 0,
    src:''
  
  },
  apple: function(){
    return 3
  },
  onLoad: function (options) {
    console.log('onload---test')
    var a = this.apple()
    console.log('apple return:', a)
  
  },

  bindme: function(event){
    wx.showToast({
      title: '请先打开蓝牙',
      icon: 'none',
      duration: 2000
    })
    wx.showLoading({
      title: 'searching',
    })
    setTimeout(function(){
      wx.hideLoading()
    }, 2000)
  },

  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  takePhoto() {
    const ctx = wx.createCameraContext()
    ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        console.log(res)
        this.setData({
          src: res.tempImagePath
        })
      }
    })
  },
  error(e) {
    console.log(e.detail)
  },


  onShareAppMessage: function () {
  
  }
})