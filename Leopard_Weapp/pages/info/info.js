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
    location5: ""

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getdata();
    wx.showLoading({
      title: '加载中',
    })

    setTimeout(function () {
      wx.hideLoading()
    }, 6000)

  },
  getdata: function () {
    var that = this;
    wx.request({
      url: "https://www.quickbook11.cn:8080/WHU/forward",
      data: {
        // "url": "https://seat.lib.whu.edu.cn:8443/rest/v2/user?token=FQIRRP6U5F11191953"
        "url": "https://seat.lib.whu.edu.cn:8443/rest/v2/user?token"+token

      },
      method: 'GET',
      success: function (res) {
        var obj = JSON.stringify(res)
        console.log(res.data)
        console.log(obj)
        that.setData({
          newsList: res.data.result,
          violate: res.data.data.violationCount,
          username:res.data.data.name,
          userid:res.data.data.username,
          lastlogin:res.data.data.lastLogin,
          reservationstatus:res.data.data.reservationStatus
        })
        console.log(that.data.violate)
        console.log(that.data.username)
        console.log(that.data.userid)
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
        console.log(res.data)
        console.log(obj)
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
  onShareAppMessage: function () {

  }
})
