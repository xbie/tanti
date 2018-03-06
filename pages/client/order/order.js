// pages/client/order/order.js
var app = getApp();
Page({
  data: {
  list:{},
  hflag: true
  },

  onLoad: function (options) {
    var openid = app.globalData.openid;
    var that = this;
    wx.request({
      url: 'https://54695366.qcloud.la/order/',
      data: {openid: openid},
      success:function(res){
        //此处只能有that代指函数外this
        that.setData({
          list : res.data.record,
        })
        if(that.data.list == null){
          that.setData({
            hflag: false
          })
        }
        console.log(that.data.list);

        }
    })
  
  }
})