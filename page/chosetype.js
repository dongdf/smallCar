// page/chosetype.js
var util = require('../util/util.js')
var formatLocation = util.formatLocation
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tripsType:0,
    startLocationAddress:'',
    startLngLat:'',
    endLocationAdress:'',
    endLngLat:'',
    startInfo:{},
    endInfo:{},
    quanziList:[],
    showLoading:true,
    noticeList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      showLoading:true
    })
    if(options.id){
      console.log(options.id)
      this.setData({
        tripsType:options.id
      })
    }
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let that = this;
   // that.checkState();
    wx.request({
      url: require('../config').notice,
      data: {},
      success: function (res) {
         
           
          that.setData({
            noticeList: res.data.data
          })
          console.log(that.data.noticeList);
         
      }
    })
    
    
     
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      showLoading: false
    })
    this.hotQuanzi();
  },
  hotQuanzi:function(){
    var tempdata = {
      kw:'',
      size:3
    }
    let that = this;
    wx.request({
      url: require('../config').quanziSearch,
      method: 'POST',
      data: tempdata,
      success: function (res) {
        if (res.data.info == 'ok') {
          that.setData({
            quanziList:res.data.data
          })
        }
      }
    })


  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    let that = this;
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '来，这里找人、找车，尽管点开，还能生成个性海报，不好用算我输',
      path: '/page/chosetype',
      success: function (res) {
        // 转发成功
        console.log('ok');
      },
      fail: function (res) {
        // 转发失败
      }
    }

  },
  changeTab:function(e){
    console.log(e);
    this.setData({
      tripsType: e.currentTarget.dataset.index
    })
  },
  reportPassenger:function(e){

  },
  reportCar:function(e){

  },
  checkState:function(e){
    
  },
  chooseStartLocation: function () {//选择出发
    
    if (!getApp().globalData.authStates){
      getApp().authTips();
      return false;
    }
    var that = this
    wx.chooseLocation({
      success: function (res) {
        console.log(res)
        that.setData({
          hasLocation: true,
          startInfo:res
        })
      }
    })
  },
  chooseEndLocation: function () {//选择终点
    if (!getApp().globalData.authStates) {
      getApp().authTips();
      return false;
    }
    
    var that = this
    wx.chooseLocation({
      success: function (res) {
        console.log(res)
        that.setData({
          hasLocation: true,
          endInfo:res
        })
      }
    })
  },
  changePoint: function(e){
    let that = this;
    

    let tempStartInfo = that.data.startInfo;
    let tempEndInfo = that.data.endInfo;
     

    //console.log(startTempAdress)
    
    that.setData({
      
      startInfo: tempEndInfo,
      endInfo: tempStartInfo

      
    })


    console.log(that.data.endLocationAddress)
    console.log(that.data.startLocationAddress)
    

     

  },
  reportPassenger:function(e){//发布人找车
    let that = this;
    wx.navigateTo({
      url: '/page/addpassenger?startinfo=' + JSON.stringify(that.data.startInfo) +'&endinfo='+ JSON.stringify(that.data.endInfo),
    })
  },
  reportCar: function (e) {//发布车找人
    let that = this;
    wx.navigateTo({
      url: '/page/addcar?startinfo=' + JSON.stringify(that.data.startInfo) + '&endinfo=' + JSON.stringify(that.data.endInfo),
    })
  },
  quicklauch:function(e){
    
    if (e.currentTarget.dataset.index == 0){
      wx.reLaunch({
      url: 'component/index',
       })
    }else{
      wx.reLaunch({
        url: 'findpassenger',
      })
    }
    
  }


})