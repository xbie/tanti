//index.js
//获取应用实例
var util = require('../../../utils/util.js');
var app = getApp();
var time;
var times;
var systemInfo;
var sendlist;
var openid;
var name, age, sex, addr, tele;
var checkvalue;
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    userListInfo: {
      name: '姓名',
      mes1: '输入姓名',
      sex: '性别',
      mes2: '输入性别',
      age: '年龄',
      mes3: '输入年龄',
      addr: '地址',
      mes4: '输入地址',
      tele: '手机号',
      mes5: '输入手机号'
    },
    sexflag: 'false',
    sexflag2: 'false',
    confirmflag:'false'
  },

  bindid1: function (e) {
    name = e.detail.value
  },
  radioChange: function (e) {
    if (e.detail.value == 1) {
      sex = '男'
    }
    else if (e.detail.value == 2) {
      sex = '女'
    }
    console.log('sex--', sex);
  },

  bindid3: function (e) {
    age = e.detail.value
  },
  bindid4: function (e) {
    addr = e.detail.value
  },
  bindid5: function (e) {
    tele = e.detail.value
  },
  bindcheck: function (e) {
    var that = this;
    console.log('checkbox发生change事件，携带value值为：', e.detail.value);
    checkvalue = e.detail.value;
    console.log('---length',checkvalue.length);
    if (checkvalue.length == 6){
      console.log(that.data.confirmflag);
      that.setData({
        confirmflag: false
      })
    }
  },
  bindconfirm: function (e) {
    var that = this;
    sendlist = {
      openid: openid,
      nickName: that.data.userInfo.nickName,
      //   avatarUrl: that.data.userInfo.avatarUrl,
      name: name,
      addr: addr,
      sex: sex,
      tele: tele,
      age: age,
      register: times
    }
    console.log('sendlist---', sendlist);
    wx.request({
      url: 'https://54695366.qcloud.la/register/',
      data: sendlist,
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data)
        wx.navigateBack({})
      }
    })
  },

  onLoad: function () {
    openid = app.globalData.openid;
    var openiddata = { openid: openid };
    time = new Date();
    times = util.formatTime(time);
    console.log('onLoad', openid, times);
    var that = this;
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
      console.log(userInfo)
    })
    wx.request({
      url: 'https://54695366.qcloud.la/register_onload/',
      data: openiddata,
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          'userListInfo.mes1': res.data.name,
          'userListInfo.mes2': res.data.sex,
          'userListInfo.mes3': res.data.age,
          'userListInfo.mes4': res.data.addr,
          'userListInfo.mes5': res.data.tele
        })
        name = res.data.name;
        addr = res.data.addr;
        sex = res.data.sex;
        tele = res.data.tele;
        age = res.data.age;
        if (sex == "男") {
          that.setData({
            sexflag: 'true',
          })
       } else {
          that.setData({
            sexflag2: 'true'
          })
        }
      }
    })
  }

})
