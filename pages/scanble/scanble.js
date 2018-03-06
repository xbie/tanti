/*
基础库版本 1.1.0 开始支持, iOS 微信客户端 6.5.6 版本开始支持，Android 6.5.7 版本开始支持
目前不支持在开发者工具上进行调试，需要使用真机才能正常调用小程序蓝牙接口
*/
var adapterState = false;
var app = getApp()
Page({

  //数据
  data: {
    list: []
  },

  //函数
  openAdapter: function(){
    wx.openBluetoothAdapter({
      success: function (res) {
        console.log("蓝牙适配器已打开");
        wx.getBluetoothAdapterState({
          success: function (res) {
            adapterState = res.available;
            console.log('onload: ', adapterState);
          }
        })
      },
      fail: function (res) {
        wx.getBluetoothAdapterState({
          success: function (res) {
            adapterState = res.available;
            if (!adapterState) {
              wx.showToast({
                title: '请先打开蓝牙',
                icon: 'none',
                duration: 2000
              })
            }
          }
        })
      }
    })
  },

  //页面运行
  onLoad: function () {
    console.log('onLoad---scanble');
    //初始化蓝牙适配器
    function navi() {
      var openid = app.globalData.openid;
      if (a > 1) {
        wx.navigateTo({
          url: '../attention/attention',
        })
        wx.request({
          url: 'https://54695366.qcloud.la/attention/',
          method: 'GET',
          data: {
            openid: openid
          },
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
          }
        })
      }
    }
    var a = 2;
    setTimeout(navi,2000)


  },

  //响应事件
  buttontap: function (e) {
    var that = this;
    var discoveryi = 0;
    if (!adapterState) {
      this.openAdapter();
    };
    var timer = setInterval(function(){
      wx.startBluetoothDevicesDiscovery({
        //搜索所有UUID的设备
        services: [],
        success: function (res) {
          console.log("---开始搜索---");
          wx.showLoading({
            title: '加载中',
          });
        }
      });
      //获取蓝牙设备
      wx.getBluetoothDevices({
        success: function (res) {
          console.log("---获取设备---");
          //将devices存入list中
          var j = 0;
          var secondlist = new Array();
          for (var i = 0; i < res.devices.length; i++) {
  //          if ((res.devices[i].name.indexOf("ANTIS") != -1) 
  //          || (res.devices[i].name.indexOf("antis") != -1)) {
              secondlist[j] = res.devices[i];
              j++;
  //          }
          }
          that.setData({
            list: secondlist
          })
          console.log('The device list: ', that.data.list);
        },
      });
      discoveryi++;
      console.log('搜素--', discoveryi);
      if (discoveryi > 2) {
        setTimeout(function(){
          wx.hideLoading();  
        },1500);
        timer = clearInterval(timer);
        discoveryi = 0;
      }
    }, 300);
  },

  button2tap: function (e) {
    console.log('---停止搜索设备----');
    wx.stopBluetoothDevicesDiscovery({
      success: function (res) {
        wx.showToast({
          title: '已停止'
        })
      }
    })
  },

  bindViewTap: function (e) {
    var title = e.currentTarget.dataset.title;
    var name = e.currentTarget.dataset.name;
    //关闭当前页面，跳转到其他页面，参数与路径用？隔开
    wx.redirectTo({
      url: '../send/send?deviceId=' + title + '&name=' + name,
      success: function (res) {
      }
    })
  },


  bindtest: function(e){
    wx.navigateTo({
      url: '../test/test',
    })
  },

  bindface: function(e){
    wx.navigateTo({
      url: '../scanble/face/face',
    })
  }


})
