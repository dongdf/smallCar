Page({
  data: {
    personInfo:{}
  },
  onLoad: function (options) {

    if (!getApp().globalData.authStates) {
      getApp().authTips();
      return false;
    }
    this.checkUser();

  },
  onReady(){

    
    
    this.getUserInfo();
    let that = this;
    // that.setData({ 
    //   personInfo: getApp().globalData.userInfo
    // })
    

  },
  checkUser: function (e) {//获取用户信息

    let that = this;
    
        that.setData({
          personInfo: JSON.parse(wx.getStorageSync('realUserInfo'))
        })
         

    
  },
  getUserInfo: function (e) {
    let that = this;
    // wx.request({
    //   url: require('../../config').requestUrl,
    //   data: {
    //     noncestr: Date.now()
    //   },
    //   success: function (result) {
    //     wx.showToast({
    //       title: '请求成功',
    //       icon: 'success',
    //       mask: true,
    //       duration: 2000
    //     })
    //     that.setData({
    //       loading: false
    //     })
    //     console.log('request success', result)
    //   },

    //   fail: function ({ errMsg }) {
    //     console.log('request fail', errMsg)
    //     self.setData({
    //       loading: false
    //     })
    //   }
    // })
    
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
      setTimeout(function(){
        wx.stopPullDownRefresh()
        console.log('加载完成');

      },2000)
  },
  contact:function(){//联系我们

  }
})
