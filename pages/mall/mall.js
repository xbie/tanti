var app = getApp()
Page({
  data: {

  },
  onLoad: function () {

    var that = this

   wx.request({
      url: 'http://www.huanqiuxiaozhen.com/wemall/venues/getBrandAndType?id=31',
      method: 'GET',
      data: {},
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        that.setData({
          brandList: res.data.data
        });
      }
    })

  }

})
