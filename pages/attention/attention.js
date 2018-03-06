// pages/attention/attention.js
var app = getApp()
Page({

  data: {
    confirmflag: true
  
  },

  onLoad: function (options) {

  
  },

  bindcheck: function (e) {
    var that = this;
    console.log('checkbox携带value值为：', e.detail.value);
    var checkvalue = e.detail.value;
    console.log('length:', checkvalue.length);
    if (checkvalue.length == 6) {
      console.log(that.data.confirmflag);
      that.setData({
        confirmflag: false
      })
    }
  },
  bindconfirm: function(e){
    console.log('跳转页面');
    var that = this;
    wx.switchTab({
      url: '../scanble/scanble',
    })
  },

})