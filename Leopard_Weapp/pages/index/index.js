// pages/index/index.js
import Notify from '../../dist_diy/notify/notify';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    account:"",
    password:""
  },
  /**
   * 控件反馈函数--监听输入学号栏的输入变化
   */
  setAccount:function(res)
  {
    this.data.account=res.detail.value;
  },
  setPassword:function(res)
  {
       this.data.password=res.detail.value;
  },
  login:function()
  {
    console.info("点击登录")
    if(this.data.account==""||this.data.password=="")
    {
      Notify({ type: 'primary', message: '请正确填写学号密码',duration:1000,selector: '#van-notify' });
      return;
    }
    if(this.data.account.length!=13)
    {
      Notify({ type: 'primary', message: '请正确填写学号密码' });
    }
    //检测是否登录正确，请求一次token，但是不做保留，实际意义不大
    var that=this;
    wx.showLoading({
      title: '加载中',
    })
    //在此处获取token
    wx.request({
      url:"https://www.quickbook11.cn:8080/WHU/forward",
      data:{
        "url":"https://seat.lib.whu.edu.cn:8443/rest/auth?username="+this.data.account+"&password="+this.data.password
      },
      method:"GET",
      success(res) {
        var token=res.data.data.token||"";
        if(token=="")
        {
          Notify({ type: 'primary', message: '请正确填写学号密码' });
        }
        else
        {
          wx.setStorageSync("account",that.data.account);
          wx.setStorageSync("password",that.data.password);
          wx.reLaunch({url:"/pages/state/state"});
        }
      }
    });
    setTimeout(()=>{wx.hideLoading()},1000);

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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