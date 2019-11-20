// pages/login/login.js
const app = getApp()
Page({
  data: {
    disabled:false,
    username:'',
    password:'',
    usernameinput:false,
    passwordinput:false,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  usernameinput: function (e) {
    this.setData({ username: e.detail.value });
    this.setData({ usernameinput: true });
    if (this.data.usernameinput == true && this.data.passwordinput == true) {
      this.setData({ disabled: false });
    }
  },
  passwordinput: function (e) {
    this.setData({ password: e.detail.value });
    this.setData({ passwordinput: true });
    if (this.data.usernameinput == true && this.data.passworddinput == true) {
      this.setData({ disabled: false });
    }
  },
  formSubmit: function (e) {

    console.log(e);
    wx.showLoading({ title: '登录中...', })
    this.setData({ disabled: true });
    wx.request({
      url: "http://45.40.201.185:8080/WHU/forward",
      data: {
        "url":"https://seat.lib.whu.edu.cn:8443/rest/auth?username=2017302290020&password=111111"
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res);
        if (res.statusCode == 200) {
          if (res.data.error == true) {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000
            })
          } else {
            wx.setStorageSync('student', res.data.data);
            wx.showToast({
              title: res.data.msg,
              icon: 'success',
              duration: 2000
            })
            setTimeout(function(){
              wx.switchTab({
                url: '../index/index',
              })
            },2000)
          }
        }else{
          wx.showToast({
            title: '服务器出现错误',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },

  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../index/index'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})