// pages/state/state.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    account: wx.getStorageSync('account'),
    token_alert_visible: false,
    logout_visible: false,
    cancel_visible: false,
    checkedIn: "",
    name: "",
    locations: "",
    onDate: "",
    period: "",
    seatId: "",
    reser_data: null,
    actions1: [
      {
        name: '取消'
      },
      {
        name: '确定',
        color: '#ed3f14',
        loading: false
      }
    ]
  },

  /**
   * 未从存储中获取到token
   * 回到首页
   */
  token_alert_handle() {
    this.setData({ token_alert_visible: false });
    wx.reLaunch({
      url: '/pages/index/index',
    });
  },

  /**
   * 注销
   */
  logOut() {
    this.setData({ logout_visible: true });
  },

  /**
   * 处理注销弹出框
   */
  handleClick1({ detail }) {
    this.setData({
      logout_visible: false
    });
    if (detail.index === 0) {
    } else {
      wx.reLaunch({
        url: '/pages/index/index',
      });
    }
  },

  /**
   * 取消预约
   */
  cancelReserve() {
    var token=wx.getStorageSync("token");
    var that = this;
    if (this.data.locations == "暂无预约" || this.data.locations == "") {
      wx.showToast({
        title: '目前没有预约',
        icon: 'none',
        duration: 2000
      });
    } else {
      if (this.data.checkedIn == "已签到") {
        wx.showToast({
          title: '预约正在使用中',
          icon: 'none',
          duration: 2000
        });
      }
      else {
        wx.request({
          url: "https://www.quickbook11.cn:8080/WHU/forward",
          data: {
            // "url": "https://seat.lib.whu.edu.cn:8443/rest/v2/user?token="+that.data.token,
            "url": "https://seat.lib.whu.edu.cn:8443/rest/v2/cancel/" + that.data.seatId + "?token=" + token,
          },
          success: function (message) {
            wx.showToast({
              title: '成功取消预约',
              icon: 'success',
              duration: 2000
            });
            that.refreshPage();
          },
        });
      }
    }
  },

  /**
   * 结束使用 
   */
  stopUsing() {
    var that = this;
    if (this.data.checkedIn == "未签到" || this.data.checkedIn == "") {
      wx.showToast({
        title: '暂无正在使用的预约！',
        icon: 'none',
        duration: 2000
      });
    } else {
      wx.request({
        url: "https://www.quickbook11.cn:8080/WHU/forward",
        data: {
          "url": "https://seat.lib.whu.edu.cn:8443/rest/v2/stop?token=" + that.data.token
        },
        success: function (message) {
          wx.showToast({
            title: '成功结束使用',
            icon: 'success',
            duration: 2000
          });
          that.refreshPage();
        },
        fail: function (message) {
          console.log(message);
        }
      })
    }
  },

  /**
   * 更新当前页面的信息
   */
  refreshPage() {
    var that = this;
    var token=wx.getStorageSync("token");
    // 请求当前用户信息
    wx.request({
      url: "https://www.quickbook11.cn:8080/WHU/forward",
      data: {
        "url": "https://seat.lib.whu.edu.cn:8443/rest/v2/user?token=" + token,
      },
      method: 'GET',
      success: function (message) {
        that.setData({ reser_data: message.data,name: message.data.data.name ,account: message.data.data.username });
        if (message.data.data.checkedIn == false) {
          setTimeout(()=>{that.setData({ checkedIn: "未签到" });},200);
        } else {
          setTimeout(()=>{that.setData({ checkedIn: "已签到" });},200);
        }
      },
      fail: function (message) {
        console.log(message);
      }
    });

    // 请求当前用户的预约信息
    wx.request({
      url: "https://www.quickbook11.cn:8080/WHU/forward",
      data: {
        // "url": "https://seat.lib.whu.edu.cn:8443/rest/v2/user/reservations?token="+that.data.token,
        "url": "https://seat.lib.whu.edu.cn:8443/rest/v2/user/reservations?token=" + token,
      },
      method: 'GET',
      success: function (message) {
        if (message.data.data == null) {
          that.setData({ locations: "暂无预约", onDate: "暂无日期信息", period: "暂无时间信息" });
        } else {
          that.setData({
            locations: message.data.data[0].location,
            onDate: message.data.data[0].onDate,
            period: message.data.data[0].begin + "-" + message.data.data[0].end,
            seatId: message.data.data[0].id
          });
        };
      },
      fail: function (message) {
        console.log(message);
      }
    });
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //能来到此处即说明已经有帐号了
    var account=wx.getStorageSync("account");
    var password=wx.getStorageSync("password");
    var that=this;
    //在此处获取token
    wx.request({
      url:"https://www.quickbook11.cn:8080/WHU/forward",
      data:{
        "url":"https://seat.lib.whu.edu.cn:8443/rest/auth?username="+account+"&password="+password
      },
      method:"GET",
      success(res) {
        wx.setStorageSync("token",res.data.data.token);      //保存token
        that.refreshPage();             //页面刷新
      }
    });
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
    this.refreshPage();
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