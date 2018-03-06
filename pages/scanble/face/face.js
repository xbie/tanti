// pages/scanble/face/face.js
var app = getApp();
var openid = app.globalData.openid;
Page({

  data: {
  imagesrc:''
  },

  onLoad: function (options) {
  
  },

  takePhoto() {
    const ctx = wx.createCameraContext()
    ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        this.setData({
          imagesrc: res.tempImagePath
        })
      }
    })
  },

  binderror(e) {
    console.log(e.detail)
  },
  
  bindupload(e){
    var that = this;
    var openiddata = { openid: openid };
    wx.request({
      url: 'https://54695366.qcloud.la/face/',
      data: openiddata,
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res)
        that.setData({
  
        })
      }
    })

  }

})