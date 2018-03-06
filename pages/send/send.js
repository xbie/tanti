var app = getApp();
var result;
var getstring = '';
var getjson;
var configuration = 0;
var openid;
var stri = 0;
var reti = 0;
//自定义的函数，两个类型转换
function buf2char(buf) {
  var out = "";
  var u16a = new Uint8Array(buf);
  var single;
  for (var i = 0; i < u16a.length; i++) {
    single = String.fromCharCode(u16a[i]);
    out += single;
  }
  return (out);
};
function char2buf(result) {
  var buffer = new ArrayBuffer(result.length);
  var u16a = new Uint8Array(buffer);
  var strs = result.split("");
  for (var i = 0; i < strs.length; i++) {
    u16a[i] = strs[i].charCodeAt();
  }
  return (buffer)
};
Page({
  data: {
    using:"连接中...",
    deviceId: '',
    name: '',
    serviceId: '',
    characteristics: [],
    characteristicId: '',
    services: [],
    getmessage: 'none',
 //改动
    openflag: true,
    buttonflag: false,
    items:[
      { name: '方案A', value: '1' },
      { name: '方案B', value: '2' },
    ]
  },

  onLoad: function (opt) {
    var that = this;
    openid = app.globalData.openid;
    console.log("onLoad---send");
    console.log('deviceId=' + opt.deviceId);
    console.log('name=' + opt.name);
    that.setData({
      deviceId: opt.deviceId,
      name: opt.name
    });

    wx.createBLEConnection({
      deviceId: that.data.deviceId,
      success: function (res) {
        console.log('建立连接成功')
        //获取设备的服务列表
        wx.getBLEDeviceServices({
          deviceId: that.data.deviceId,
          success: function (res) {
            console.log('----获取设备的三个ID值-----')
            console.log('services:---', res.services)
            that.setData({ services: res.services });
            console.log('deviceid----:', that.data.deviceId);
            for (var i = 0; i < 2; i++) {
              if ((res.services[i].uuid.indexOf("FFE0") != -1) || (res.services[i].uuid.indexOf("ffe0") != -1)) {
                that.setData({
                  serviceId: res.services[i].uuid
                })
              }
            }
            console.log('serviceid---:', that.data.serviceId);
            setTimeout(function () {
              //获取蓝牙设备Characteristics
              wx.getBLEDeviceCharacteristics({
                deviceId: that.data.deviceId,
                serviceId: that.data.serviceId,
                success: function (res) {
                  console.log('characteristics---:', res.characteristics);
                  that.setData({ characteristics: res.characteristics });
                  for (var i = 0; i < 2; i++) {
                    if ((res.characteristics[i].uuid.indexOf("FFE1") != -1) || (res.characteristics[i].uuid.indexOf("ffe1") != -1)) {
                      that.setData({
                        characteristicId: res.characteristics[i].uuid
                      });
                    }
                  };
                  console.log('characteristicId----:', that.data.characteristicId);
                  wx.showToast({
                    title: '连接成功',
                  });
                  that.setData({
                    using : "使用ANTIS"
                  });
                  wx.notifyBLECharacteristicValueChanged({
                    deviceId: that.data.deviceId,
                    serviceId: that.data.serviceId,
                    characteristicId: that.data.characteristicId,
                    state: true,
                    success: function (res) {
                      console.log('notifyBLECharacteristicValueChanged success', res);
                    },
                  })
                },
                fail: function (res) {
                  console.log(res);
                  wx.showToast({
                    title: '连接失败，请退回重新连接',
                    duration:2000,
                    icon: 'none'
                  })
                  that.setData({
                    using: "连接失败"
                  })
                }
              })
            }, 1500);
          }
        })
      },
      fail: function (res) {
        wx.showToast({
          title: '连接失败，请退回重新连接',
          duration: 2000,
          icon: 'none'
        });
        that.setData({
          using: "连接失败"
        })
      }
    })



    //读取数据
    wx.onBLECharacteristicValueChange(function (res) {
      console.log(`characteristic ${res.characteristicId} has changed, now is ${res.value}`);
      var getvalue = res.value;
      stri++;
      //区分苹果和安卓大小写
      if (that.data.characteristicId.indexOf("FFE1") != -1) {
        stri = 2;
      };
      if (stri > 1) {
        getstring += buf2char(getvalue);
        if (getstring.indexOf('\r') != -1) {
          getjson = JSON.parse(getstring);
          //清空计数器
          getstring = "";
          stri = 0;
          //
          console.log(getjson);
          //准备状态
          if (getjson.DS == "0") {
            that.setData({
              openflag: false,
              buttonflag: true
            })
            var sendblue = { openid: openid, getjson };
            wx.request({
              url: 'https://54695366.qcloud.la/bluetooth/',
              data: sendblue,
              header: { 'content-type': 'application/json' },
              success: function (res) {
                console.log(res.data);
              }
            });
              var halfopenid = openid.substring(0,12);
              setTimeout(function () { that.writeblue("su" + halfopenid + "\r") }, 1000);
  /*            if (configuration == 1) {
                setTimeout(function () { that.writeblue("sp" + "1" + "05" + "\r") }, 1000);;
              } else if (configuration == 2) {
                setTimeout(function () { that.writeblue("sp" + "1" + "15" + "\r") }, 1000);;
              };
  */
 //           that.writeblue("sb" + "\r");
 //           setTimeout(function () {that.writeblue("sp" + "1" + "\r")}, 1000);
 //           setTimeout(function () {that.writeblue("SE" + "\r")}, 1000);
          }
          //工作状态
          else if (getjson.DS == "1") {
            wx.showToast({
              title: '设备正在工作中，请稍后再试！',
              icon: 'none'
            })
          } else if (getjson.DS == "2") {
            if (halfopenid == getjson.LUID) {
              console.log('上次未启动');
              wx.showToast({
                title: '上次未启动',
                icon: 'none'
              })
              that.setData({
                openflag: false,
                buttonflag: true
              })
            }
          }
          if (getjson.RET == "OK"&&reti<2) {
            setTimeout(function () { that.writeblue("su" + openid + "\r") }, 1000);
            reti++;
          }
        }
      }
    })

  },

  //写入数据
  bindViewTap: function () {
    var that = this;
    result = "ga\r";
    that.writeblue(result);
  },
  bindOpenTap: function () {
    var that = this;
    var balancedata = {
      openid: openid,
      result: "consume",
      value: "-1"
    };
    console.log('打开仪器');
    if (configuration == 1) {
       that.writeblue("sp" + "1" + "05" + "\r");
       wx.request({
         url: 'https://54695366.qcloud.la/balance/',
         data: balancedata,
         success: function (res) {
           console.log('balance---', res.data);
           setTimeout(function () { that.writeblue("sr\r") }, 1000);
           wx.showToast({
             title: '启动成功',
           })
         },
         fail: function(res){
           wx.showToast({
             title: '余额不足',
           })
         }
       });

    //扣费环节
    } else if (configuration == 2) {
      that.writeblue("sp" + "1" + "15" + "\r");
      wx.request({
        url: 'https://54695366.qcloud.la/balance/',
        data: balancedata,
        success: function (res) {
          console.log('balance---', res.data);
          setTimeout(function () { that.writeblue("sr\r") }, 1000);
          wx.showToast({
            title: '启动成功',
          })
        },
        fail: function (res) {
          wx.showToast({
            title: '余额不足',
          })
        }
      });

    //扣费环节
    } else if(configuration == 0){
      wx.showToast({
        title: '请先选择方案',
        icon: 'none'
      })
    }
/*    wx.showModal({
      title: '支付',
      content: '扣除一次费用',
      showCancel: false,
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        }
      }
    })
*/
  },

  radioChange: function (e) {
    var that = this;
    console.log('radio---change:', e.detail.value);
    configuration =  e.detail.value;

  },




  //断开连接
  bindduanTap: function () {
    this.closeblue();
  },
  onHide: function () {
    this.closeblue();
  },

  writeblue: function (result) {
    var that = this;
    var buffer = char2buf(result);
    wx.writeBLECharacteristicValue({
      deviceId: that.data.deviceId,
      serviceId: that.data.serviceId,
      characteristicId: that.data.characteristicId,
      value: buffer,
      success: function (res) {
        console.log("发送成功");
      },
      fail: function (res) {
        console.log('发送失败')
      },
    })
  },

  closeblue: function () {
    wx.closeBLEConnection({
      deviceId: this.data.deviceId,
      success: function (res) {
        console.log('close--', res)
      }
    })
    wx.closeBluetoothAdapter({
      success: function (res) {
        console.log('---close--', res);
        wx.switchTab({
          url: '../scanble/scanble',
        })
      }
    })
  },

})



/*  radioChange:function(e){
    var that = this;
    console.log('radio---change:',e.detail.value);
    that.setData({
      result: e.detail.value
    });
  },
*/
 /* inputTextchange: function (e) {
    var that = this;
    console.log('----数据值---' ,e.detail.value);
    that.setData({
      result: e.detail.value
    });
  },
*/
 /*   items:[
      { name: '模式1', value: '1'},
      { name: '模式2', value: '2' },
      { name: '模式3', value: '3' },
      { name: '模式4', value: '4' },
    ]
*/