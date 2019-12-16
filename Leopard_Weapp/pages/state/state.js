// pages/state/state.js
import Notify from '../../dist_diy/notify/notify';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 帐号信息
    account: wx.getStorageSync('account'),
    // token警告框是否可见
    token_alert_visible: false,
    // 注销框是否可见
    logout_visible: false,
    // 取消预约框是否可见
    cancel_visible: false,
    // 签到信息
    checkedIn: "",
    // 用户名
    name: "",
    // 预约场所和地点
    locations: "",
    // 日期信息
    onDate: "",
    // 时间段信息
    period: "",
    // 座位id
    seatId: "",
    // 预约返回的信息，对用户不可见
    reser_data: null,
    freshTime: "0",
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
   * 若确定则回到首页
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
    var token = wx.getStorageSync("token");
    var that = this;
    // 若无预约信息
    if (this.data.locations == "暂无预约" || this.data.locations == "") {
      wx.showToast({
        title: '目前没有预约',
        icon: 'none',
        duration: 2000
      });
    } else {
      // 如果该座位正在使用中
      if (this.data.checkedIn == "已签到") {
        wx.showToast({
          title: '预约正在使用中',
          icon: 'none',
          duration: 2000
        });
      }
      else {
        // 取消当前预约
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
            // 成功则刷新当前页面信息
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
    // 若当前没有正在使用的座位
    if (this.data.checkedIn == "未签到" || this.data.checkedIn == "") {
      wx.showToast({
        title: '暂无正在使用的预约！',
        icon: 'none',
        duration: 2000
      });
    } else {
      // 发送结束使用的请求
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
   * 当用户信息发生变化时，
   * 如取消预约，结束使用，或者预约了座位，
   * 则调用此函数更新页面信息
   */
  refreshPage() {
    var that = this;
    var token = wx.getStorageSync("token");
    // 请求当前用户信息
    wx.request({
      url: "https://www.quickbook11.cn:8080/WHU/forward",
      data: {
        "url": "https://seat.lib.whu.edu.cn:8443/rest/v2/user?token=" + token,
      },
      method: 'GET',
      success: function (message) {
        that.setData({ reser_data: message.data, name: message.data.data.name, account: message.data.data.username });
        if (message.data.data.checkedIn == false) {
          setTimeout(() => { that.setData({ checkedIn: "未签到" }); }, 200);
        } else {
          setTimeout(() => { that.setData({ checkedIn: "已签到" }); }, 200);
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
    this.data.freshTime = new Date();
    //能来到此处即说明已经有帐号了
    var account = wx.getStorageSync("account");
    var password = wx.getStorageSync("password");
    var that = this;
    //在此处获取token
    wx.request({
      url: "https://www.quickbook11.cn:8080/WHU/forward",
      data: {
        "url": "https://seat.lib.whu.edu.cn:8443/rest/auth?username=" + account + "&password=" + password
      },
      method: "GET",
      success(res) {
        wx.setStorageSync("token", res.data.data.token);      //保存token
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
   * 生命周期函数--监听页面显示,当页面从其他地方刷新过来，也会触发刷新
   */
  onShow: function () {
    wx.showLoading({
      title: "刷新中"
    });
    this.refreshPage();
    this.data.freshTime = new Date();
    setTimeout(() => { wx.hideLoading(); }, 500);
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
   * @detail 此处的刷新，很有可能成为一个频繁触发的封号点，必须要做出限制
   */
  onPullDownRefresh: function () {
    var thisTime = new Date();
    if (thisTime.getMinutes() == this.data.freshTime.getMinutes() && ((thisTime.getSeconds() - this.data.freshTime.getSeconds()) < 10))          //如果时间的分钟数一样
    {
      wx.stopPullDownRefresh();
      //限制一分钟内最多刷新6次
      Notify({
        type: "primary",
        message: "10秒内刚刷新过，请稍微等等！"
      });
      return;
    } else {
      this.data.freshTime = thisTime;
      wx.showLoading({
        title: "刷新中"
      });
      this.refreshPage();
      setTimeout(() => { wx.hideLoading(); }, 500);
      wx.stopPullDownRefresh();
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