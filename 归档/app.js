//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    
    
     
    //wx.clearStorageSync();
    let that = this;
    // 登录
    

      wx.login({
        success: res => {

          var appid = 'wx14b66dadd382b11f'; //填写微信小程序appid  
          var secret = '10fc80d0ac60c254245bec8837baf722'; //填写微信小程序secret 
          console.log(res.code+'获取到code');
          var rurl = "https://api.weixin.qq.com/sns/jscode2session?appid=" + appid + "&secret=" + secret+"&js_code="+res.code+"&grant_type=authorization_code";
          wx.request({
            url: require('config').openIdUrl,
            data:{
              code:res.code
            },
            success: function (result) {
              console.log(JSON.stringify(result) + '根据code后台返回数据');
              that.globalData.uOpenid = result.data.data.openid;
               
              wx.getUserInfo({
                success: res => {
                  // 可以将 res 发送给后台解码出 unionId
                   
                  that.globalData.userInfo = res.userInfo;
                  // console.log('1111' + that.globalData.uOpenid);
                  that.globalData.userInfo.openid = that.globalData.uOpenid;
                  wx.request({//创建用户
                    url: require('config').userAdd,
                    method: 'POST',
                    data: that.globalData.userInfo,
                    success: function (result) {

                      wx.setStorageSync('openid', that.globalData.uOpenid);
                      wx.setStorageSync('realUserInfo', JSON.stringify(that.globalData.userInfo));


                    }

                  })



                   
                  // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                  // 所以此处加入 callback 以防止这种情况
                  if (this.userInfoReadyCallback) {
                    this.userInfoReadyCallback(res)
                  }

                }
              })

            }
          })

          // this.globalData.loginRes = res;
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
        }
      })

    

      

    
    
     
    
  },
  route:function(){
    //console.log('aaa');
  },
  onShow:function(){
    let that = this;
     
    // 获取用户信息
    wx.getSetting({
      success: res => {
        
          
        if (res.authSetting['scope.userLocation'] == false || res.authSetting['scope.userInfo'] == false){
         // if (!res.authSetting['scope.userLocation'] || !res.authSetting['scope.userInfo']) {
            this.globalData.authStates = false;
           // this.authTips();

         // } else {
         //   this.globalData.authStates = true;
         // }
        }else{
          this.globalData.authStates = true;
        }
        


      }
    })


  },
  authTips:function(){

        wx.showModal({
          title: '温馨提醒',
          content: '需要获取您的地理位置和用户信息后才能使用小程序',
          success: function (res) {
            if (res.confirm) {
              wx.openSetting({
                success: (res) => {
                  res.authSetting = {
                    "scope.userInfo": true,
                    "scope.userLocation": true
                  }

                }
              })

            } else if (res.cancel) {

            }
          }
        })

        

  },
  globalData: {
    userInfo: null,
    authStates:null,
    uOpenid:null,
    realUserInfo:null
  }
})