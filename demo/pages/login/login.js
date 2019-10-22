//logs.js
// var model = require('../model/model.js')
var area = require('../../utils/area.js')

var areaInfo = [];//所有省市区县数据

var provinces = [];//省

var citys = [];//城市

var countys = [];//区县

var index = [0, 0, 0];

var cellId;

var t = 0;
var show = false;
var moveY = 200;


Page({
  data: {
    // logs: []
    height: undefined,
    show: show,
    provinces: '',
    citys: '',
    countys: '',
    value: [0, 0, 0],
   // areavalue:''
  },
 
  onLoad: function (options) {
    cellId = options.cellId;
    var that = this;
    var date = new Date()
    console.log(date.getFullYear() + "年" + (date.getMonth() + 1) + "月" + date.getDate() + "日");
   
    wx.getSystemInfo({
      success: function (res) {
        // console.log(res.windowWidth);
        // console.log(res.windowHeight);
        // var page = wx.createSelectorQuery('.login-container');
        // console.log(page)
        that.setData({ height: res.windowHeight + "px" })
        // console.log(thispage.data.height);
      },
    })
    //获取省市区县数据
    area.getAreaInfo(function (arr) {
      areaInfo = arr;
      //获取省份数据
      getProvinceData(that);
    });

  },
  onReady: function () {
    this.animation = wx.createAnimation({
      transformOrigin: "50% 50%",
      duration: 0,
      timingFunction: "ease",
      delay: 0
    }
    )
    this.animation.translateY(200 + 'vh').step();
    this.setData({
      animation: this.animation.export(),
      show: show
    })
  },

  bindChange: function (e) {
    var val = e.detail.value
    // console.log(e)
    //判断滑动的是第几个column
    //若省份column做了滑动则定位到地级市和区县第一位
    if (index[0] != val[0]) {
      val[1] = 0;
      val[2] = 0;
      getCityArr(val[0], this);//获取地级市数据
      getCountyInfo(val[0], val[1], this);//获取区县数据
    } else {    //若省份column未做滑动，地级市做了滑动则定位区县第一位
      if (index[1] != val[1]) {
        val[2] = 0;
        getCountyInfo(val[0], val[1], this);//获取区县数据
      }
    }
    index = val;

    console.log(index + " => " + val);

    //更新数据
   
      this.setData({
        value: [val[0], val[1], val[2]],
        province: provinces[val[0]].name,
        city: citys[val[1]].name,
        county: countys[val[2]].name,
        areavalue: provinces[val[0]].name + ' ' + citys[val[1]].name + ' ' + countys[val[2]].name,
      })
 
    console.log(this.data.provinces)
    // setTimeout(()=>{
    //   this.setData({
    //     areavalue: this.data.provinces + '' +
    //       this.data.citys + '' +
    //       this.data.countys,
    //   });
    // },1000)

  },
  //移动按钮点击事件
  translate: function (e) {
    
    var query = wx.createSelectorQuery()
    query.select('#userarea').boundingClientRect(function (res) {
      console.log(res);
    })
    query.selectViewport().scrollOffset(function (res){
      console.log(res);
    })
    query.exec(function (res) {
      console.log(res);
      // res[0].value = areavalue;
     
    })
    if (t == 0) {
      moveY = 0;
      show = false;
      t = 1;
    } else {
      moveY = 200;
      show = true;
      t = 0;
    }
    // this.animation.translate(arr[0], arr[1]).step();
    animationEvents(this, moveY, show);

  },
  //隐藏弹窗浮层
  hiddenFloatView(e) {
   
 
    console.log(this.data.areavalue);
    if (this.data.areavalue===undefined){
      this.setData({
      
        areavalue: '北京市' + ' ' + '市辖区' + ' ' + '东城区',
      })
    }
    moveY = 200;
    show = true;
    t = 0;
    animationEvents(this, moveY, show);

  },
  //页面滑至底部事件
  onReachBottom: function () {
    // Do something when page reach bottom.
  },
  handleInput(e) {
    let value = this.validateNumber(e.detail.value)
    this.setData({
      value
    })
  },
  validateNumber(val) {
    return val.replace(/\D/g, '')
  },

  formSubmit: function (e) {
   
    
     
    if (e.detail.value.username.length == 0) {

      wx.showToast({

        title: '请输入姓名',

        icon: 'none',

        duration: 1500

      })

      setTimeout(function () {

        wx.hideToast()

      }, 2000)

    } else if (e.detail.value.usernumber.length != 11) {

      wx.showToast({

        title: '请输入11位手机号码',

        icon: 'none',

        duration: 1500

      })

      setTimeout(function () {

        wx.hideToast()

      }, 2000);

    } else if (e.detail.value.usernumber.length == 11) {
  
      let phoneNumber = e.detail.value.usernumber;
      let str = /^1\d{10}$/;
      if (!str.test(phoneNumber)) {
        wx.showToast({
          title: '手机号格式不正确',
          icon: 'none'
        })
        return false
      }
      //  else if (e.detail.value.userarea
      //   .length == 0){
      //   wx.showToast({

      //     title: '请选择您所在的地区',

      //     icon: 'none',

      //     duration: 1500

      //   })

      //   setTimeout(function () {

      //     wx.hideToast()

      //   }, 2000)
      // } 
      else if (e.detail.value.useradress
        .length == 0) {

        wx.showToast({

          title: '请填写详细的地址',

          icon: 'none',

          duration: 1500

        })

        setTimeout(function () {

          wx.hideToast()

        }, 2000)

      } else if (e.detail.value.useradress
        .length < 5) {

        wx.showToast({

          title: '建议：详细地址不能少于5个字',

          icon: 'none',

          duration: 1500

        })

        setTimeout(function () {

          wx.hideToast()

        }, 2000)

      }else {
        console.log(e);
        // wx.showToast({

        //   title: '正在'//res.data.info,

        //   icon: 'loading',

        //   duration: 1500

        // });
        wx.showToast({

          title: '领取成功',//这里打印出登录成功

          icon: 'success',

          duration: 1000,

        });
        setTimeout(() => {
          wx.navigateTo({
            url: '../succeed/succeed'
          })
        }, 1000)

        // wx.request({

        //   url: '',

        //   header: {

        //     "Content-Type": "application/x-www-form-urlencoded"

        //   },

        //   method: "POST",

        //   data: { username: e.detail.value.username, usernumber: e.detail.value.usernumber },

        //   success: function (res) {

        //     if (res.data.status == 0) {

        //       wx.showToast({

        //         title: res.data.info,

        //         icon: 'loading',

        //         duration: 1500

        //       })

        //     } else {

        //       wx.showToast({

        //         title: res.data.info,//这里打印出登录成功

        //         icon: 'success',

        //         duration: 1000

        //       })

        //     }

        //   }

        // })

      }
    }
    // else if (e.detail.value.userarea
    //   .length == 0) {

    //   wx.showToast({

    //     title: '请选择您所在的地区',

    //     icon: 'none',

    //     duration: 1500

    //   })

    //   setTimeout(function () {

    //     wx.hideToast()

    //   }, 2000)

    // }
    else if (e.detail.value.useradress
      .length == 0) {

      wx.showToast({

        title: '请填写详细的地址',

        icon: 'none',

        duration: 1500

      })

      setTimeout(function () {

        wx.hideToast()

      }, 2000)

    } 
    else {
      // wx.showToast({

      //   title: '正在'//res.data.info,

      //   icon: 'loading',

      //   duration: 1500

      // });
      wx.showToast({

        title: '领取成功',//这里打印出登录成功

        icon: 'success',

        duration: 1000,
      
      });
      setTimeout(()=>{
        wx.navigateTo({
          url: '../succeed/succeed?msg=1'
        })
      },1000)
     
      // wx.request({

      //   url: '',

      //   header: {

      //     "Content-Type": "application/x-www-form-urlencoded"

      //   },

      //   method: "POST",

      //   data: { username: e.detail.value.username, usernumber: e.detail.value.usernumber },

      //   success: function (res) {

      //     if (res.data.status == 0) {

      //       wx.showToast({

      //         title: res.data.info,

      //         icon: 'loading',

      //         duration: 1500

      //       })

      //     } else {

      //       wx.showToast({

      //         title: res.data.info,//这里打印出登录成功

      //         icon: 'success',

      //         duration: 1000

      //       })

      //     }

      //   }

      // })

    }

  },  
});

//动画事件
function animationEvents(that, moveY, show) {
  console.log("moveY:" + moveY + "\nshow:" + show);
  that.animation = wx.createAnimation({
    transformOrigin: "50% 50%",
    duration: 400,
    timingFunction: "ease",
    delay: 0
  }
  )
  that.animation.translateY(moveY + 'vh').step()

  that.setData({
    animation: that.animation.export(),
    show: show
  })

}

// ---------------- 分割线 ---------------- 

//获取省份数据
function getProvinceData(that) {
  var s;
  provinces = [];
  var num = 0;
  for (var i = 0; i < areaInfo.length; i++) {
    s = areaInfo[i];
    if (s.di == "00" && s.xian == "00") {
      provinces[num] = s;
      num++;
    }
  }
  that.setData({
    provinces: provinces
  })

  //初始化调一次
  getCityArr(0, that);
  getCountyInfo(0, 0, that);
  that.setData({
    province: "北京市",
    city: "市辖区",
    county: "东城区",
    // areavalue: '北京市' + ' ' + '市辖区' + ' ' + '东城区',
  })

}

// 获取地级市数据
function getCityArr(count, that) {
  var c;
  citys = [];
  var num = 0;
  for (var i = 0; i < areaInfo.length; i++) {
    c = areaInfo[i];
    if (c.xian == "00" && c.sheng == provinces[count].sheng && c.di != "00") {
      citys[num] = c;
      num++;
    }
  }
  if (citys.length == 0) {
    citys[0] = { name: '' };
  }

  that.setData({
    city: "",
    citys: citys,
    value: [count, 0, 0]
  })
}

// 获取区县数据
function getCountyInfo(column0, column1, that) {
  var c;
  countys = [];
  var num = 0;
  for (var i = 0; i < areaInfo.length; i++) {
    c = areaInfo[i];
    if (c.xian != "00" && c.sheng == provinces[column0].sheng && c.di == citys[column1].di) {
      countys[num] = c;
      num++;
    }
  }
  if (countys.length == 0) {
    countys[0] = { name: '' };
  }
  that.setData({
    county: "",
    countys: countys,
    value: [column0, column1, 0]
  })
}
