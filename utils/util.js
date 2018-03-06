function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}
function requestx(url,data){
  var outdata = '';
  var a = 1
  if(a == 1){
  wx.request({
    url: url,
    data: data,
    header: {
      'content-type': 'application/json'
    },
    success: function (res) {
      console.log(res.data);
      outdata = res.data;
      
    }
  })
  }
  return outdata;
}

module.exports = {
  formatTime: formatTime,
  requestx: requestx
}
