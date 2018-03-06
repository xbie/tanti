//index.js
//获取应用实例
var app = getApp();
var locationmm = '选取位置地址';
Page({
  Height: 555,
  data: {
    latitude: 39.93907,
    longitude: 116.339905,
    controls: [{ 
      id: 0, 
      iconPath: '../../images/icon_location.png', 
      position: { left: 10, top: 10, width: 50, height: 50 }, 
      clickable: true 
      }],
     markers: [{
      id: 0,
      iconPath: '../../images/marker.png',
      latitude: 39.93908,
      longitude: 116.339915,
      width: 40,
      height: 40
      //39.90403 116.407526
      //39.93908  116.339915
    },
    {
      id: 1,
      iconPath: '../../images/marker2.png',
      latitude: 39.90403,
      longitude: 116.407526,
      width: 40,
      height: 40
    }
    ]
  },
  //事件处理函数
controltap:function(e){
  var that = this;
  console.log(e.controlId);
  if(e.controlId==0){
  this.mapc.getCenterLocation({
    sucess:function(res){
      console.log(res.latitude,res.longitude)
    }
  }),
  this.mapc.moveToLocation()
  }
},

markertap:function(e){
  console.log('marker--',e)
  wx.showModal({
    title: '提示',
    content: locationmm,
    success: function (res) {
      if (res.confirm) {
        console.log('用户点击确定')
        wx.chooseLocation({
          success: function (res) {
            console.log(res.name);
            console.log(res.address);
            console.log(res.latitude, res.longitude)
          },
        })
      } else if (res.cancel) {
        console.log('用户点击取消')
      }
    }
  })

},

  onLoad: function () {
    console.log('onLoadindex');
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        //设置map高度，根据当前设备宽高满屏显示
        that.setData({
          Height: res.windowHeight
        })
        console.log('height--', res.windowHeight);
      }
    });
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        console.log(res.latitude, res.longitude);
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude,
        });
        var sendgps = {
          latitude: res.latitude,
          longitude: res.longitude
        };
  /*
        wx.request({
          url: 'https://54695366.qcloud.la/location/',
          data: sendgps,
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            console.log(res.data);
            locationmm = res.data.location;
            that.setData({
              'markers[0].latitude': res.data.latitude,
              'markers[0].longitude': res.data.longitude
            })
          }
        })
  */
      }
    });
    that.mapc =  wx.createMapContext('map')
  }
})
