
var util = require('../../util/util.js')
var formatLocation = util.formatLocation

Page({
  data: {
    list: [
      {
        id: 'view',
        name: '视图容器',
        open: false,
        pages: ['view', 'scroll-view', 'swiper']
      }, {
        id: 'content',
        name: '基础内容',
        open: false,
        pages: ['text', 'icon', 'progress']
      }, {
        id: 'form',
        name: '表单组件',
        open: false,
        pages: ['button', 'checkbox', 'form', 'input', 'label', 'picker', 'radio', 'slider', 'switch', 'textarea']
      }, {
        id: 'nav',
        name: '导航',
        open: false,
        pages: ['navigator']
      }, {
        id: 'media',
        name: '媒体组件',
        open: false,
        pages: ['image', 'audio', 'video']
      }, {
        id: 'map',
        name: '地图',
        pages: ['map']
      }, {
        id: 'canvas',
        name: '画布',
        pages: ['canvas']
      }
    ],
    myLocationInfo:'',
    myLocationLngLat:{},
    filterDay:[],
    chooseDay:'',
    isHideLoadMore:false,

    startLocationAddress: '',//出发地
    startLngLat: '',//出发坐标
    endLocationAdress: '',//目的地
    endLngLat: '',//目的坐标

    searchQuery:{
      date:'2017-12-24',
      startInfo: {},
      endInfo: {},
      current:0,
      size:10,
      type:1
    },
    resultList:[],
    pullSign:false,
    showAddTips:false,
    doneFinish:false

  },
  onLoad: function (options) {

    

  },
  onReady(){
    
   // wx.startPullDownRefresh();
    let that = this;
    //setTimeout(function(){
       // wx.stopPullDownRefresh();
   // },2000)
    this.animation = wx.createAnimation();


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
    tempDateArray.unshift({ name: '全部', value: ''});

    this.setData({
      filterDay: tempDateArray,
      chooseDay: tempDateArray[0].value,
      'searchQuery.date': tempDateArray[0].value
    })
    this.searchResult();

  },
  onShow: function () {
    
    // Do something when page show.
  },
  kindToggle: function (e) {
    var id = e.currentTarget.id, list = this.data.list;
    for (var i = 0, len = list.length; i < len; ++i) {
      if (list[i].id == id) {
        list[i].open = !list[i].open
      } else {
        list[i].open = false
      }
    }
    this.setData({
      list: list
    });
  },
  
  onPullDownRefresh: function () {//上拉刷新
    
    let that = this;
    if (!that.data.pullSign) {return false;}
    that.setData({
      'searchQuery.current':0,
      resultList:[]
    })
    
    
     
    var tempdata = {

      goLng: that.data.searchQuery.startInfo.longitude,//出发经度
      goLat: that.data.searchQuery.startInfo.latitude,//出发纬度
      toLng: that.data.searchQuery.endInfo.longitude,//目的经度
      toLat: that.data.searchQuery.endInfo.latitude,//目的纬度
      type: that.data.searchQuery.type,
      size: that.data.searchQuery.size,
      page: that.data.searchQuery.current,
      goDate: that.data.searchQuery.date,//出发日期

    }

     
    wx.request({
      url: require('../../config').search,
      method: 'POST',
      data: tempdata,
      success: function (res) {
        that.setData({
          resultList: res.data.data,
          pullSign: true,
        })
        console.log(that.data.resultList)
        wx.stopPullDownRefresh();
      }
    })
    
  },
  onReachBottom:function(e){
    console.log('找车主到底了');
    this.setData({
      isHideLoadMore:true
    });
    this.pullDownSearch();
    
  },
  showSearch: function () {

    this.animation.right('0').step()
    this.setData({ animation: this.animation.export() })
    
  },
  hideSearch: function () {
    this.animation.right('-88%').step()
    this.setData({ animation: this.animation.export() })

  },
  searchAdr: function(){
    console.log('search....')
  },
  choseLocation:function(){//选择位置
     
      var that = this
      wx.chooseLocation({
        success: function (res) {
          console.log(res)
          that.setData({
            hasLocation: true,
            myLocationLngLat: formatLocation(res.longitude, res.latitude),
            myLocationInfo: res.address
          })
           
        }
      })
     
  },
  chooseStartLocation: function () {//选择出发
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
          pullSign: false,
          'searchQuery.startInfo': res
        })
        that.searchResult();
        console.log(res);
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
          pullSign: false,
          'searchQuery.endInfo':res,
        })
        that.searchResult();
      }
    })
  },
  changePoint: function (e) {
    let that = this;


    let tempStartInfo = that.data.startInfo;
    let tempEndInfo = that.data.endInfo;
     

    //console.log(startTempAdress)

    that.setData({
       
      startInfo: tempEndInfo,
      endInfo: tempStartInfo,
      pullSign: false,
      'searchQuery.current':0,
      resultList: []
    })

    this.searchResult()

  },
  searchResult:function(){//查询车辆
    let that = this;

    if (that.data.pullSign) { return false; }


    wx.startPullDownRefresh();
    that.setData({
      resultList:[]
    })
    var tempdata={
      
      goLng: that.data.searchQuery.startInfo.longitude,//出发经度
      goLat: that.data.searchQuery.startInfo.latitude,//出发纬度
         
      toLng: that.data.searchQuery.endInfo.longitude,//目的经度
      toLat: that.data.searchQuery.endInfo.latitude,//目的纬度
      type: that.data.searchQuery.type,
      size: that.data.searchQuery.size,
      page: that.data.searchQuery.current,
      goDate: that.data.searchQuery.date,//出发日期
     
    }
    
    
    
    wx.request({
      url: require('../../config').search,
      method: 'POST',
      data: tempdata,
      success: function (res) {
        if(res.data.data){
          that.setData({
            resultList: res.data.data,
             


          })
        }
        that.setData({
          
          pullSign:true,
          doneFinish:true
          
           
        })

        // 提示
        //console.log(that.data.searchQuery.current == 0);
        if (that.data.searchQuery.startInfo.longitude && that.data.searchQuery.endInfo.longitude && that.data.searchQuery.current == 0) {
          if (res.data.data[0].gojl > 20000 || res.data.data[0].tojl>20000){
            that.setData({
              showAddTips:true
            })
          }else{
            that.setData({
              showAddTips: false
            })
          }
        }else{
          that.setData({
            showAddTips: false
          })
        }
        // 提示
        console.log(that.data.resultList)
        wx.stopPullDownRefresh();
      }
    })
  },
  pullDownSearch:function(e){//下拉刷新
    let that = this;
    var tempPage = that.data.searchQuery.current;
    tempPage++;
    that.setData({
      'searchQuery.current': tempPage
    })
    var tempdata = {
      goLng: that.data.searchQuery.startInfo.longitude,//出发经度
      goLat: that.data.searchQuery.startInfo.latitude,//出发纬度
      type: that.data.searchQuery.type,
      toLng: that.data.searchQuery.endInfo.longitude,//目的经度
      toLat: that.data.searchQuery.endInfo.latitude,//目的纬度

      size: that.data.searchQuery.size,
      page: tempPage,
      goDate: that.data.searchQuery.date,//出发日期

    }

    wx.request({
      url: require('../../config').search,
      method: 'POST',
      data: tempdata,
      success: function (res) {

        that.setData({
            isHideLoadMore: false
        });
        if(res.data.data.length!=0){

          var temp = that.data.resultList.concat(res.data.data);

          that.setData({
            resultList: temp
          })

        }else{
          console.log('没有了')
        }
        
        
        
        console.log(that.data.resultList)
        wx.stopPullDownRefresh();
      }
    })

  },
  bindClick: function (e){
    console.log(e);
    // wx.navigateTo({
    //   url: '',
    // })

    if (e.target.dataset.index == 'tel') {
      wx.makePhoneCall({
        phoneNumber: e.target.dataset.tel //仅为示例，并非真实的电话号码
      })
    } else {
      wx.navigateTo({
        url: '/page/adrinfo?id=' + e.currentTarget.dataset.obj.id,
      })
    }


  },
  selectDay:function(e){
    this.setData({
      chooseDay: e.currentTarget.dataset.obj.value,
      'searchQuery.date': e.currentTarget.dataset.obj.value,
      resultList:[],
      pullSign: false
    })
     
    this.searchResult();
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
      title: '来，这里找人、找车，尽管点开，还能生成个性海报，不好用算我输',
      path: '/page/component/index',
      success: function (res) {
        // 转发成功
        console.log('ok');
      },
      fail: function (res) {
        // 转发失败
      }
    }

  },
  scrollInfo:function(e){
    console.log('aaaaa');
  }
  

})

