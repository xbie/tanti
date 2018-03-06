var app = getApp();
var addrInWeChat;
var sendAddr;
var openid;
var latitude;
var longitude;
var redata;
Page({
  data: {
    rank:'',
    grade: '',
    userInfo: {},
    userListInfo: [{
      id: 0,
      icon: '../../images/shangcheng/icon_normal.png',
      text: '个人资料',
    }, {
      id: 1,
      icon: '../../images/shangcheng/iconfont-dingdan.png',
      text: '我的订单',
    }, {
      id: 2,
      icon: '../../images/shangcheng/footer-icon-01.png',
      text: '会员特权',
    }, {
      id: 3,
      icon: '../../images/shangcheng/iconfont-shouhuodizhi.png',
      text: '共享管理'
    }, {
      id: 4,
      icon: '../../images/shangcheng/iconfont-help.png',
      text: '关于安提思',
      kongflag: true
    }]
  },

  bindtap0: function (e) {
    console.log('bindtap0---');
    wx.navigateTo({
      url: '../client/mydata/mydata',
    })
  },
  //订单
  bindtap1: function (e) {
    wx.navigateTo({
      url: '../client/order/order',
    })

  },
  //会员
  bindtap2: function (e) {
    wx.navigateTo({
      url: '../client/huiyuan/huiyuan',
    })
  },
  //收货地址
  bindtap3: function (e) {
    console.log('bindtap3-----');
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        console.log(res.latitude, res.longitude);
        latitude = res.latitude;
        longitude = res.longitude;
      }
    })
    wx.showModal({
      title: '用户须知',
      content: '尊敬的用户，此功能旨在共享您的设备地址，展示给其他用户。共享时需要调用您的当前位置，请保证您处于在ANTIS设备旁边。',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          if (wx.chooseAddress) {
            wx.chooseAddress({
              success: function (res) {
                addrInWeChat = res;
                var openiddata = { openid: openid };
                var sendAddr = {
                  openid: openid,
                  latitude: latitude,
                  longitude: longitude,
                  addrInWeChat: addrInWeChat
                }
                console.log('successaddress---', sendAddr);
                wx.request({
                  url: 'https://54695366.qcloud.la/addr/',
                  data: sendAddr,
                  header: {
                    'content-type': 'application/json'
                  },
                  success: function (res) {
                    console.log(res.data)
                  }
                })
              },
              fail: function (err) {
                console.log('failaddress---', JSON.stringify(err))
              }
            })
          } else {
            wx.showToast({
              title: '当前微信版本不支持选择地址',
              icon: 'loading',
              duration: 2000
            })
          }
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //关于安提斯
  bindtap4: function (e) {
    wx.showModal({
      title: '关于安提思',
      content: 'ANTIS，缓解压力，改善睡眠！',
      showCancel:false,
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } 
      }
    })
  },

  onLoad: function () {
    var that = this;
    openid = app.globalData.openid;
    var openiddata = { openid: openid };
    console.log('onloadclient--',openid);
    //调用应用实例的方法获取全局数据

    wx.request({
      url: 'https://54695366.qcloud.la/register_onload/',
      data: openiddata,
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res)
        that.setData({
         rank: res.data.rank,
         grade: res.data.expendure
       })
      }
    })
    
  
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    })
  }
})