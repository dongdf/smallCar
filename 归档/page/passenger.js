// page/passenger.js
var util = require('../util/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
    reInfo: {},
    ztime:'',
    productIng: true
},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getReInfo(options.id)
  },
  getReInfo(tid) {
    let that = this;

    wx.request({//发布
      url: require('../config').findResource,
      
      data: {
        id: tid
      },
      success: function (res) {
        that.setData({
          reInfo: res.data.data,
          'ztime': util.formatTime(res.data.data.addtime, 'M/D h:m')

        })
      },
      fail: function ({ errMsg }) {
        console.log('request fail', errMsg)

      }
    })
  },
  calltelphone: function () {//拨号
    let that = this;
    wx.makePhoneCall({
      phoneNumber: that.data.reInfo.phone  //仅为示例，并非真实的电话号码
    })
  },
  daohang: function () {
    let that = this;
    wx.showActionSheet({
      itemList: ['去起点', '去终点'],
      success: function (e) {
        if (e.tapIndex == 0) {
          wx.openLocation({//打开地图
            longitude: parseFloat(that.data.reInfo.goLng),
            latitude: parseFloat(that.data.reInfo.goLat),
            name: that.data.reInfo.goName,
            address: that.data.reInfo.goAddress
          })
        } else {

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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
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
      title: '万能的朋友，我要找车，求转发！助力我的行程【' + that.data.reInfo.goName + ' → ' + that.data.reInfo.toName+'】',
      path: '/page/passenger?id=' + that.data.reInfo.id,
      
      success: function (res) {
        // 转发成功
        console.log('ok');
      },
      fail: function (res) {
        // 转发失败
      }
    }

  
  },
  gotoreport: function () {
    wx.reLaunch({
      url: 'chosetype?id=1'
    })
  },
  makepic: function () {
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
      infoType: '2',
      desc: that.data.reInfo.remark
    }
    this.setData({
      productIng: false
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
          confirmText: '查看',
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