import Notify from '../../dist_diy/notify/notify';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    violate: 0,
    username:"",
    userid:0,
    lastlogin:"",
    reservationstatus:"",
    location1:"",
    location2: "",
    location3: "",
    location4: "",
    location5: "",
    freshTime:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.freshTime=new Date();
    this.getdata();
    wx.showLoading({
      title: '加载中',
    });

    setTimeout(function () {
      wx.hideLoading()
    }, 500)

  },
  getdata: function () {
    var that = this;
    var token=wx.getStorageSync("token");
    wx.request({
      url: "https://www.quickbook11.cn:8080/WHU/forward",
      data: {
        // "url": "https://seat.lib.whu.edu.cn:8443/rest/v2/user?token=FQIRRP6U5F11191953"
        "url": "https://seat.lib.whu.edu.cn:8443/rest/v2/user?token="+token

      },
      method: 'GET',
      success: function (res) {
        var obj = JSON.stringify(res)
        that.setData({
          // newsList: res.data.result,
          violate: res.data.data.violationCount,
          username:res.data.data.name,
          userid:res.data.data.username,
          lastlogin:res.data.data.lastLogin,
          reservationstatus:res.data.data.reservationStatus
        })
      },

      fail: function (err) {
           
      }
    })
    wx.request({
      url: "https://www.quickbook11.cn:8080/WHU/forward",
      data: {
        // "url": "https://seat.lib.whu.edu.cn:8443/rest/v2/history/1/50?token=FQIRRP6U5F11191953"
        "url": "https://seat.lib.whu.edu.cn:8443/rest/v2/history/1/50?token="+token

      },
      method: 'GET',
      success: function (res) {
        var obj = JSON.stringify(res)
        that.setData({
          location1:res.data.data.reservations[0].loc,
          location2: res.data.data.reservations[1].loc
        })
      },
        fail: function (err) {

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
    this.data.freshTime=new Date();
    this.getdata();
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
   * @detail  频繁的刷新会导致服务器检测到数据异常，会被封禁一天
   *   必须限制刷新次数
   */
  onPullDownRefresh: function () {
    var thisTime=new Date();
   if(thisTime.getMinutes()==this.data.freshTime.getMinutes()&&(thisTime.getSeconds()-this.data.freshTime.getSeconds()<10))
   {
       wx.stopPullDownRefresh();
       Notify({
         type:"primary",
         message:"10秒内刚刷新过，请稍微等等！"
       })
     return ;
   }
   else
   {
     this.data.freshTime=thisTime;
     wx.showLoading({
       title:"刷新中"
     });
     this.getdata();
     setTimeout(()=>{
       wx.hideLoading();
     },500);
   }
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
