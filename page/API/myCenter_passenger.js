// page/API/myCenter_passenger.js
 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    myinfoList: [],
    myQuery: {
      page: 0,
      size: 10,
      openid: '',
      doneFinish:false
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      'myQuery.openid': wx.getStorageSync('openid')
    })
    this.getInfo()
  },
  getInfo: function () {
    let that = this;
    var tempdata = {
      type: 2,
      page: that.data.myQuery.page,
      size: that.data.myQuery.size,
      openid: that.data.myQuery.openid

    }
    wx.request({
      url: require('../../config').findMyResource,
      method: "POST",
      data: tempdata,
      success: function (res) {
        wx.stopPullDownRefresh()
        if(res.data.data){
          that.setData({
            myinfoList: res.data.data,
             
          })
        }
        that.setData({
          
          doneFinish:true
        })
      },
      fail: function ({ errMsg }) {
        console.log('request fail', errMsg)
        self.setData({
          loading: false
        })
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
    this.setData({
      page: 0,
      size: 10,
      myinfoList: []

    })
    this.getInfo();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})