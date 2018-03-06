//app.js
App({
  globalData: {
    userInfo: null,
    openId: null
  },
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var that = this;
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs);

    //登录获取openid
    wx.login({
      success: function (res) {
        console.log('code--', res.code);
        var mes = { code: res.code };
        if (res.code) {
          //得到openid
          wx.request({
            url: 'https://54695366.qcloud.la/onlogin/',
            method: 'GET',
            data: mes,
            success: function (res) {
              that.globalData.openid = res.data.openid;
              console.log('openid---', res.data.openid);
            }
          })
        }
      }
    })

    //设置授权信息
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success() {
              console.log('同意授权--')
            }
          })
        }
        if (!res.authSetting['scope.camera']) {
          wx.authorize({
            scope: 'scope.camera',
            success() {
              console.log('同意授权--')
            }
          })
        }
        if (!res.authSetting['scope.userInfo']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success() {
              console.log('同意授权--')
            }
          })
        }
        if (!res.authSetting['scope.address']) {
          wx.authorize({
            scope: 'scope.address',
            success() {
              console.log('同意授权--')
            }
          })
        }
      }
    })

  },


  //获取用户信息
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      wx.login({
        success: function (res) {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  }

})