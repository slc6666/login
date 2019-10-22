//logs.js

Page({
  data: {
    height: undefined,
    show:true,
  },
  onLoad: function (option) {
    console.log(option)
    var that = this
    setTimeout(()=>{
      that.setData({
show:false,
      })
    },500)
    
    wx.getSystemInfo({
      success: function (res) {
        that.setData({ height: res.windowHeight + "px" })
      },
    })
  }
})
