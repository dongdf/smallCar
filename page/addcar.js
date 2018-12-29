var util = require('../util/util.js')
var formatLocation = util.formatLocation
Page({
  data: {
    pickerHidden: true,
    chosen: '',
    multiArray: [
      [
        // { name: '12月16日', value: '2017-12-16' },
        // { name: '12月17日', value: '2017-12-17' },
        // { name: '12月18日', value: '2017-12-18' },
        // { name: '12月18日', value: '2017-12-19' },

      ],
      [
        // { name: '0时', value: '00' },
        // { name: '1时', value: '01' },
      ],
      [
        // { name: '0分', value: '00' },
        // { name: '10时', value: '10' },
      ]
    ],
    multiIndex: 0,
    seatList: [
      { name: '空余座位', value: 0 },
      { name: '1座', value: 1 },
      { name: '2座', value: 2 },
      { name: '3座', value: 3 },
      { name: '4座', value: 4 }
    ],
    carList:[
      { name: '请选择车型', value: 0 },
      { name: '轿车', value: 1 },
      { name: 'SUV', value: 2 },
      { name: 'MVP', value: 3 },
      { name: '跑车', value: 4 }
    ],
    index: 0,
    date: '2016-09-01',
    time: '12:01',
    seatidx: 0,
    caridx: 0,

    dateidx: 0,
    timeidx: 0,
    secondidx: 0,
    testText: '我是初始值',
    autoAdress:'',
    reportData:{},
    startLocationAddress: '',//出发地
    startInfo:{},//出发地信息
    endInfo:{},//目的地信息
    startLngLat: '',//出发坐标
    endLocationAdress: '',//目的地
    endLngLat: '',//目的坐标
    carTypeSelect:{},//选择的车型
    carSeatSelect:{},//剩余座位
    reportUser:{},
    selectTime: { mdate:{value:''}},//选中日期时分
    myUser:{},
    issubmit:true,
    cid:''
  },
  onReady:function(){
        //查询用户信息  自动带出手机号及联系人名称
  },
  onLoad: function (options) {
   
    
    console.log(options)

    if (options) {
      this.setData({
        startInfo: JSON.parse(options.startinfo),//出发地
        endInfo: JSON.parse(options.endinfo),//目的地
        cid:options.cid
         
      })
    }
    console.log(JSON.stringify(this.data.startInfo))
    console.log(JSON.stringify(this.data.endInfo))
  

    let afterday = 60;
    let curDate = new Date();
    let _this = this.data;
    // 补充0处理
    String.prototype.addzero = function () {
      var numb = this + '';
      if (numb < 10) {
        numb = '0' + numb;
      }
      return numb;
    }
    // 补充0处理
    var tempDateArray = [];
    for (var i = 0; i < afterday; i++) {
      if (i > 0) {
        curDate.setDate(curDate.getDate() + 1);
      }
      var month = (curDate.getMonth() + 1).toString();
      var year = curDate.getFullYear();
      var day = curDate.getDate().toString();
      //console.log(year + "-" + month.addzero() + '-'+day.addzero());
      tempDateArray.push({ name: month.addzero() + '月' + day.addzero() + '日', value: year + "-" + month.addzero() + '-' + day.addzero() });
    }



    var tempHourArray = [];
    var tempMinArray = [];
    for (var i = 0; i < 60; i++) {
      var tempv = i.toString()
      tempMinArray.push({ name: tempv.addzero() + '分', value: tempv.addzero() });

    }
    for (var i = curDate.getHours() + 1; i < 24; i++) {
      var tempv = i.toString()
      tempHourArray.push({ name: tempv.addzero() + '时', value: tempv.addzero() });
    }

    this.setData({//设置下拉选择
      'multiArray[0]': tempDateArray,
      'multiArray[1]': tempHourArray,
      'multiArray[2]': tempMinArray
    })

    let that = this;
    
     


  },
  onShow:function(e){
    this.checkUser();
  },
  checkUser:function(e){//获取用户信息
    
    let that = this;
    wx.request({//查询用户
      url: require('../config').findUser,
      data: {
        openid: wx.getStorageSync('openid')
      },
      success: function (result) {
        //console.log(result.data.data)
         
        that.setData({
          myUser: result.data.data
        })
        console.log(that.data.myUser)

      },
      fail: function ({ errMsg }) {
        console.log('request fail', errMsg)

      }
    })
   
  },
  bindMultiPickerChange: function (e) {//总体取值
    //console.log('picker发送选择改变，携带值为', e.detail.value)
    var idx = e.detail.value;
    console.log(idx);
    var tempDate={};
    tempDate.mdate = (this.data.multiArray[0])[idx[0] ? idx[0] : 0];
    tempDate.mhour = this.data.multiArray[1][idx[1] ? idx[1]:0];
    tempDate.mmin = this.data.multiArray[2][idx[2] ? idx[2] : 0];
     
    this.setData({
      multiIndex: e.detail.value,
      selectTime: tempDate
    })
    console.log(this.data.selectTime);
  },
  bindMultiPickerColumnChange: function (e) {//单项变化
   // console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var tempHourArray = [];
    if (e.detail.column == 0) {
      if (e.detail.value == 0) {
        let curDate = new Date();
        for (var i = curDate.getHours() + 1; i < 24; i++) {
          var tempv = i.toString()
          tempHourArray.push({ name: tempv.addzero() + '时', value: tempv.addzero() });
        }
        this.setData({//设置下拉选择
          'multiArray[1]': tempHourArray
        })


      } else {

        for (var i = 0; i < 24; i++) {
          var tempv = i.toString()
          tempHourArray.push({ name: tempv.addzero() + '时', value: tempv.addzero() });
        }
        this.setData({//设置下拉选择
          'multiArray[1]': tempHourArray
        })

      }



    }
  },
  
  bindCarChange: function (e) {//车型选择
    console.log(e.detail.value);
    var idx = e.detail.value;
    var tempSelect = this.data.carList[idx];
    this.setData({
      caridx: e.detail.value,
      carTypeSelect: tempSelect
    })
    console.log(this.data.carTypeSelect);

     

  },
  bindAutoAdr: function (e) {
    this.setData({
      autoAdress: e.detail.value
    })
  },
  bindSeatChange: function (e) {//剩余座位
    var idx = e.detail.value;
    var tempSeat = this.data.seatList[idx];
    this.setData({
      seatidx: e.detail.value,
      carSeatSelect: tempSeat
    })
    console.log(this.data.carSeatSelect)
  },
  chooseStartLocation: function () {//选择出发
    var that = this
    wx.chooseLocation({
      success: function (res) {

        console.log(res)
        that.setData({
          hasLocation: true,
          startLngLat: formatLocation(res.longitude, res.latitude),
          startLocationAddress: res.address,
          startInfo:res
        })
        console.log(res);
      }

    })
  },
  chooseEndLocation: function () {//选择终点
    var that = this
    wx.chooseLocation({
      success: function (res) {
        console.log(res)
        that.setData({
          hasLocation: true,
          endLngLat: formatLocation(res.longitude, res.latitude),
          endLocationAdress: res.address,
          endInfo: res
        })
      }
    })
  },
  reportCar: function(e){
      let that = this;
      //userName: "ssd", userPhone: "222222", toAdressDesc: "111"
      if (!that.data.startInfo.address || !that.data.endInfo.address || !that.data.selectTime.mdate.value || !that.data.carSeatSelect.value || !e.detail.value.userName || !e.detail.value.userPhone){
        wx.showToast({
          title: '请完善信息哦',
          image:'../image/tips.png',
          duration: 2000
        })
        return false;
      }

      let reg = /^(((14[0-9]{1})|(13[0-9]{1})|(17[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
      if (!reg.test(e.detail.value.userPhone)) {

        wx.showToast({
          title: '手机号码错误',
          image: '../image/tips.png',
          duration: 2000
        })
        return false;
      }


      var carData = {
        type:1,//添加车辆,
        cid:that.data.cid,
        goAddress: that.data.startInfo.address,//出发具体地点
        goLng: that.data.startInfo.longitude,//出发经度
        goLat: that.data.startInfo.latitude,//出发纬度
        goName: that.data.startInfo.name,//出发地点名称

        toAddress: that.data.endInfo.address, //目的地位置
        toLng: that.data.endInfo.longitude,//目的经度
        toLat: that.data.endInfo.latitude,//目的纬度
        toName: that.data.endInfo.name,//目的名称

        goDate: that.data.selectTime.mdate.value,//出发日期
        goTime: that.data.selectTime.mhour.value +':'+ that.data.selectTime.mmin.value,//出发时分
        carType: that.data.carTypeSelect.name,//车型

        allNum: that.data.carSeatSelect.value,//同行人数/剩余座位
        name: e.detail.value.userName,//姓名
        phone: e.detail.value.userPhone,//电话
        remark: e.detail.value.toAdressDesc,//备注
        openid:wx.getStorageSync('openid')
        


      };

      
      if(that.data.issubmit){

        that.setData({
          issubmit: false
        })

        wx.request({//发布
          url: require('../config').addCar,
          method: 'POST',
          data: carData,
          success: function (result) {
            that.setData({
              issubmit: false
            })
            if (result.data.info === 'ok') {
              wx.showToast({
                title: '发布成功',
                icon: 'success',
                duration: 1000,
                success: function (res) {
                  that.setData({
                    issubmit: true
                  })
                  setTimeout(
                    function () {

                      wx.navigateTo({
                        url: 'adrinfo?id=' + result.data.data,
                        success: function (res) { },
                        fail: function (res) { },
                        complete: function (res) { },
                      })


                    }, 2000)



                }

              })



            }

          },
          fail: function ({ errMsg }) {
            console.log('request fail', errMsg)
          }
        })

      }
      

      
      
  }

})
