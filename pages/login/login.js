//logs.js
// var model = require('../model/model.js')
// import regeneratorRuntime from '../content/_regenerator-runtime@0.13.2@regenerator-runtime/runtime.js';
var area = require('../../utils/area.js')

var areaInfo = []; //所有省市区县数据

var provinces = []; //省

var citys = []; //城市

var countys = []; //区县

var index = [0, 0, 0];

var cellId;

var t = 0;
var show = false;
var moveY = 200;

wx.cloud.init();
const db = wx.cloud.database();
var date = new Date()
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
    resData: [],
    numberFlag: true,
  },

  onLoad: function(options) {
    cellId = options.cellId;
    var that = this;

    console.log(date.getFullYear() + "年" + (date.getMonth() + 1) + "月" + date.getDate() + "日");

    wx.getSystemInfo({
      success: function(res) {
        // console.log(res.windowWidth);
        // console.log(res.windowHeight);
        // var page = wx.createSelectorQuery('.login-container');
        // console.log(page)
        that.setData({
          height: res.windowHeight + "px"
        })
        // console.log(thispage.data.height);
      },
    })
    //获取省市区县数据
    area.getAreaInfo(function(arr) {
      areaInfo = arr;
      //获取省份数据
      getProvinceData(that);
    });

  },
  onReady: function() {

    this.animation = wx.createAnimation({
      transformOrigin: "50% 50%",
      duration: 0,
      timingFunction: "ease",
      delay: 0
    })
    this.animation.translateY(200 + 'vh').step();
    this.setData({
      animation: this.animation.export(),
      show: show
    })
  },
  onShow: function() {
    // this.onLoad(Object);
    // this.setData({
    //   show: true
    // })

    this.onReady();
     this.managerDelete();
  },
  //管理员删除数据库事件
  managerDelete: function (managerId) {
    // exports.main = async (event, context) => {

    //   try {
    //     return await db.collection('user_info_a').where(
    //       {
    //         _openid: 11
    //       }).remove()
    //   }
    //   catch (e) {
    //     console.error(e)
    //   }
    // }

  
    // db.collection('user_info_a').doc("c0a3987b5ce4ee2c034d528b2a1e4c39").remove({
    //   success: res => {
    //     wx.showToast({
    //       title: '删除成功',
    //     })
    //     this.setData({
    //       counterId: '',
    //       count: null,
    //     })
    //   },
    //   fail: err => {
    //     wx.showToast({
    //       icon: 'none',
    //       title: '删除失败',
    //     })
    //     console.error('[数据库] [删除记录] 失败：', err)
    //   }
    // })
   
  },
  bindChange: function(e) {
    var val = e.detail.value
    // console.log(e)
    //判断滑动的是第几个column
    //若省份column做了滑动则定位到地级市和区县第一位
    if (index[0] != val[0]) {
      val[1] = 0;
      val[2] = 0;
      getCityArr(val[0], this); //获取地级市数据
      getCountyInfo(val[0], val[1], this); //获取区县数据
    } else { //若省份column未做滑动，地级市做了滑动则定位区县第一位
      if (index[1] != val[1]) {
        val[2] = 0;
        getCountyInfo(val[0], val[1], this); //获取区县数据
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
  translate: function(e) {

    var query = wx.createSelectorQuery()
    query.select('#userarea').boundingClientRect(function(res) {
      console.log(res);
    })
    query.selectViewport().scrollOffset(function(res) {
      console.log(res);
    })
    query.exec(function(res) {
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
    if (this.data.areavalue == undefined) {
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
  onReachBottom: function() {
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

  formSubmit: function(e) {

    var that = this;

    if (e.detail.value.username.length == 0) {

      wx.showToast({

        title: '请输入姓名',

        icon: 'none',

        duration: 1500

      })

      setTimeout(function() {

        wx.hideToast()

      }, 2000)

    } else if (e.detail.value.usernumber.length != 11) {

      wx.showToast({

        title: '请输入11位手机号码',

        icon: 'none',

        duration: 1500

      })

      setTimeout(function() {

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
        // return false

      } else if (str.test(phoneNumber)) {
        db.collection('user_info_a').where({
          // _openid: this.data.openid,
          usernumber: e.detail.value.usernumber,
        }).get({
          success: res => {
            console.log('[数据库] [查询记录] 成功: ', res);
            this.setData({
              resData: res.data[0].usernumber
            })
          },
          fail: err => {
            wx.showToast({
              icon: 'none',
              title: '查询记录失败'
            })
            console.error('[数据库] [查询记录] 失败：', err)
          },
          complete: res => {
            console.log("执行我")
            // for (var i = 0; i <= that.data.resData.length; i++) {
          //  console.log(that.data.resData+"这是")
          
            if (e.detail.value.usernumber == that.data.resData) {
              // console.log(999)
              console.log("执行我手机号重复")
              wx.showToast({
                title: '手机号重复无法提交',
                icon: 'none'
              })
              that.setData({
                resData:[],
              })
              // console.log(e.detail.value.useradress
              //   .length);
            }
           
            // else if (e.detail.value.userarea
            // .length == 0){
            // wx.showToast({

            // title: '请选择您所在的地区',

            // icon: 'none',

            // duration: 1500

            // })

            // setTimeout(function () {

            // wx.hideToast()

            // }, 2000)
            // } 
            else if (e.detail.value.useradress
              .length == 0) {
         
              wx.showToast({

                title: '请填写详细的地址',

                icon: 'none',

                duration: 1500

              })
              console.log("执行我地址为空")
              setTimeout(function () {

                wx.hideToast()

              }, 2000)

            } 
            else if (e.detail.value.useradress
              .length < 5) {

              wx.showToast({

                title: '建议：详细地址不能少于5个字',

                icon: 'none',

                duration: 1500

              })

              setTimeout(function () {

                wx.hideToast()

              }, 2000)

            } else {
          
              that.setData({
                numberFlag: false
              })
              console.log("开关打开")
                console.log('触发事件正在提交数据')
                setTimeout(() => {

                  db.collection("user_info_a").add({
                    data: {
                      username: e.detail.value.username,
                      useradress: e.detail.value.useradress,
                      usernumber: e.detail.value.usernumber,
                      product:"chj",
                      day: date.getFullYear() + "年" + (date.getMonth() + 1) + "月" + date.getDate() + "日",
                      timer: date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate() + "  " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()
                    }
                  }).then(res => {
                    console.log("添加至數據庫成功", res)

                  }).catch(res => {
                    console.log("添加失敗", res)

                  })
                  wx.navigateTo({
                    url: '../succeed/succeed'
                  })
                }, 1000);

                wx.showToast({

                  title: '提交成功', //这里打印出登录成功

                  icon: 'success',

                  duration: 1000,

                });
                that.setData({
                  numberFlag: true
                })
              
            }
            }

          
        });


      }
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
  })
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
    citys[0] = {
      name: ''
    };
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
    countys[0] = {
      name: ''
    };
  }
  that.setData({
    county: "",
    countys: countys,
    value: [column0, column1, 0]
  })
}