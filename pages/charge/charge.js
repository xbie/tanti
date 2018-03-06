//recharge.js
var app = getApp()
var color, sucmoney
var money = 0
var b = 0
var timestamp;
var randomstr;
var bookingNo;
var totalfee = 1;
var openid;
Page({
  data: {
    mymoney: 0,
    curNav: 1,
    lockhidden: true,
    sucmoney: 2000,
    navList: [{
      id: 1,
      chongzhi: '充￥2000',
      song: '送￥124',
      money: "2000"
    },
    {
      id: 2,
      chongzhi: '充￥1000',
      song: '送￥50',
      money: "1000"
    },
    {
      id: 3,
      chongzhi: '充￥500',
      song: '送￥20',
      money: "500"
    },
    {
      id: 4,
      chongzhi: '充￥200',
      song: '送￥5',
      money: "200"
    },
    {
      id: 5,
      chongzhi: '充￥100',
      song: '',
      money: "100"
    }
    ],
  },
  //充值金额分类渲染模块
  selectNav(event) {
    let id = event.target.dataset.id,
      index = parseInt(event.target.dataset.index);
    b = parseFloat(event.target.dataset.money);
    self = this;
    this.setData({
      curNav: id,
    })
  },
  bindInput: function (e) {
    b = e.detail.value;
    console.log(b);
  },
  onShow: function(){
    var that = this;
    wx.request({
      url: 'https://54695366.qcloud.la/charge/',
      method: 'GET',
      data: {
        openid: openid
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({
          mymoney: res.data.balance
        })
      }
    })
  },
  //页面加载模块
  onLoad: function () {
    var that = this;
    console.log('---chargeload')
    b = 2000;
    openid = app.globalData.openid;
  },
  //去充值功能模块
  goblance: function (event) {
    var that = this;
    money += b;
    var total_fee = b * 100;
    timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    timestamp = String(timestamp);
    console.log("当前时间戳为：" + timestamp);
    randomstr = Math.random().toString(36).substr(2, 15);
    console.log("随机字符串:" + randomstr);
    bookingNo = randomstr.substr(10) + timestamp;
    console.log("订单号:" + bookingNo);
    //支付金额
    totalfee = total_fee;
    //调起微信支付
    wx.request({
      url: 'https://54695366.qcloud.la/payment/',
      method: 'GET',
      data: {
        bookingNo: bookingNo,
        total_fee: totalfee,
        openid: openid
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        //支付调用
        if(res.data.timeStamp){
        wx.requestPayment({
          'timeStamp': res.data.timeStamp,
          'nonceStr': res.data.nonceStr,
          'package': res.data.package,
          'signType': 'MD5',
          'paySign': res.data.paySign,
          success: function (res) {
            var balancedata = {
              openid: openid,
              result: "charge",
              value: totalfee
            }
              wx.request({
                url: 'https://54695366.qcloud.la/balance/',
                data: balancedata,
                success: function(res){
                  console.log('balance---',res.data);
                  that.setData({
                    lockhidden: false,
                    mymoney: res.data.balance,
                    sucmoney: b,
                  })
                  console.log(res);
                }
              })


          },
          'fail': function (res) {
            console.log('fail:' + JSON.stringify(res));
          }
        })
        }else{
          wx.showToast({
            title: res.data.return,
          })
        }

      },
      fail: function (err) {
        console.log(err)
      }
    })
  },
confirm: function(e) {
  this.setData({
    lockhidden: true
  })
}

})
