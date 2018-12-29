// page/adrinfo.js
var util = require('../util/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    reInfo: {},
    ztime:'',
    picurl:'',
    haibaoShow:false,
    productIng:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
        if(options){
          this.getDetil(options.id);
        }
  },
  getDetil: function (infoId) {// 获取信息详情
    let that = this;
    wx.request({
      url: require('../config').findResource,
      data: {
        id: infoId
      },
      success: function (res) {
        that.setData({
          reInfo: res.data.data,
          'ztime': util.formatTime(res.data.data.addtime,'M/D h:m')

        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.animation = wx.createAnimation({
      transformOrigin: "50% 50%",
      duration: 50,
      timingFunction: "ease",
      delay: 0
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
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
  onShareAppMessage: function (res) {
    let that = this;
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '万能的朋友，我要找人，求转发！助力我的行程【' + that.data.reInfo.goName + ' → ' + that.data.reInfo.toName +' 】',
      path: '/page/adrinfo?id='+that.data.reInfo.id,
      success: function (res) {
        // 转发成功
        console.log('ok');
      },
      fail: function (res) {
        // 转发失败
      }
    }
  
  },
 
  calltelphone: function () {//拨号
   let that = this;
    wx.makePhoneCall({
      phoneNumber: that.data.reInfo.phone  //仅为示例，并非真实的电话号码
    })
  },
  gotoreport:function(){
    wx.reLaunch({
      url: 'chosetype?id=0'
    })
  },
  daohang:function(){
    let that = this;
    wx.showActionSheet({
      itemList: ['去起点', '去终点'],
      success: function (e) {
        if (e.tapIndex == 0){
          wx.openLocation({//打开地图
            longitude: parseFloat(that.data.reInfo.goLng),
              latitude:  parseFloat(that.data.reInfo.goLat),
            name: that.data.reInfo.goName,
            address: that.data.reInfo.goAddress
          })
        }else{

          wx.openLocation({//打开地图
            longitude: parseFloat(that.data.reInfo.toLng),
            latitude: parseFloat(that.data.reInfo.toLat),
            name: that.data.reInfo.toName,
            address: that.data.reInfo.toAddress
          })
          

        }
        


        
      }
    })

  },
  yueta:function(e){
    
    this.animation.top('0').step();
    this.animation.opacity('100').step();
    this.setData({ animation: this.animation.export() })
  },
  yueclose:function(e){
     
    this.animation.top('100%').step();
    this.animation.opacity('0').step();
    this.setData({ animation: this.animation.export() })
  },
  yueCar:function(e){
    let that = this;
    setTimeout(function(){
          that.animation.top('100%').step();
          that.animation.opacity('0').step();
          that.setData({ animation: that.animation.export() })
          

          wx.showModal({
            
            content: '预约成功',
            confirmText:'查看预约',
            cancelText:'关闭',
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })





    },1000)
    
  },
  makepic:function(){
    let that = this;
    var temp = {
      goName: that.data.reInfo.goName,
      goAddress: that.data.reInfo.goAddress,
      toName: that.data.reInfo.toName,
      toAddress: that.data.reInfo.toAddress,
      goDate: that.data.reInfo.goDate,
      goTime: that.data.reInfo.goTime,
      goUser: that.data.reInfo.name,
      goUserPhone: that.data.reInfo.phone,
      allNum: that.data.reInfo.allNum,
      infoType:'1',
      desc: that.data.reInfo.remark
    }
    this.setData({
      productIng:false
    })
    wx.request({
      url: require('../config').makepic,
      data: temp,
      success: function (res) {
        that.setData({
          productIng: true
        })
        wx.showModal({
          title: '图片已生成',
          content: '长按可以保存图片或发送给朋友',
          confirmText:'查看',
          success: function (rest) {
            
            if (rest.confirm) {
              wx.previewImage({
                urls: res.data.image.split(',')
                // 需要预览的图片http链接  使用split把字符串转数组。不然会报错  
              })
            } else if (rest.cancel) {
               
            }
          }
        })
        
         
      }
    })

  }
})