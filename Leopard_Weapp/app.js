//app.js
App({
  onLaunch: function () {
    // =========     onLaunch  获取缓存的数据，若本地无缓存   =========
   //  无缓存将page转移到登录页(index)
    // 有缓存将跳转至首页(state)
    var logs = wx.getStorageSync('logs') || []
    var account=wx.getStorageSync('account')||"2017301200273"           //学校图书馆的学号
    var password=wx.getStorageSync('password')||"227114"         //图书馆登录的密码


    /**
     * TODO 仅做测试是使用
     * */
    wx.setStorageSync("account",account);
    wx.setStorageSync("password",password);

    // 展示本地存储能力
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })

    //在其他launch逻辑结束后
    if(account==""||password=="")
    {
       wx.redirectTo({
         url:"pages/index/index"
       });
    }      

    
  },
  globalData: {
    //使用存储设置的token能够实现全局共享
    userInfo: null
  }
})