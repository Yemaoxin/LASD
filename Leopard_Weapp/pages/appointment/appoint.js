// pages/appointment/appoint.js
import Notify from '../../dist_diy/notify/notify';
import Dialog from '../../dist_diy/dialog/dialog';
Page({

  /**
   * 页面的初始数据，此页面使用到了大量的数据
   */
  data: {
    buildings : [],
    rooms:[],
    dates:[],
      date:0,                 //0为今天，1为明天。时间选择为今天时，需要查看具体位置，如果是选择明天，默认所有可用
      dateOptions:[{text:"今天",value:0,label1:-1,label2:-1},{text:"明天",value:1,label1:-1,label2:-1}],
    hours:15,
    seats:[{text:"请选择座位",value:0,label1:-1,label2:-1}],         //可用座位列表
      seatId:0,                          //座位Id
    buildings_p:[{text:"信息馆",value:1}],       //用于打印的buildings列表
    rooms_p:[{text:"请选择房间",value:0}],  //用于打印的rooms列表1
    //设置四个组件根据数值决定使用的对像
    value_b: 1,          //默认信息学馆.将用于设置url
    value_r: 0 ,       //默认信息学部的3C创客空间，将用于设置url
      startTime:[{text:"8:00",value:480,label1:-1,label2:-1}],
      endTime:[{text:"8:00",value:480}],
      value_start:480,         //为方便使用默认从8：00开始找
       value_end:480 ,           //将用于设置url，将用于设置url
      show:false,
      receiptId:"0",
      receiptNum:"0",
      receiptStart:"0",
      receiptEnd:"0",
      receiptDate:"0",
      receiptLoc:"0",
      submitTime:0,
      freshTime:0,
      optionsSeatId:0                           //备选位置
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      //生成初始时间列表
      var times = [];
      for (var i = 8; i < 23; i++) {
          var time = i + ":00";
          var item = {text: time, value: i * 60, label1: -1, label2: -1};
          times.push(item);
          time = i + ":30";
          item = {text: time, value: i * 60 + 30, label1: -1, label2: -1};
          times.push(item);
      }
      this.setData({"startTime": times, "endTime": times});
      var that=this;
      wx.request({
          url:"https://www.quickbook11.cn:8080/WHU/getTomorrow",
          success(res) {
            that.setData({"dates":res.data});
          }
      })
  }

  ,

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
      //未获取到图书馆的分布信息
      var token=wx.getStorageSync("token");
      var that=this;
      wx.request({
          url:"https://www.quickbook11.cn:8080/WHU/forward",
          data:{
              "url":"https://seat.lib.whu.edu.cn:8443/rest/v2/free/filters?token="+token
          },
          method:"GET",
          success(res) {
              that.setData({"buildings":res.data.data.buildings,"rooms":res.data.data.rooms});
              var buildings_t=[];
              for(var i=0;i<res.data.data.buildings.length;i++)
              { //按照要求格式设置数据
                  var b_item={text:res.data.data.buildings[i][1],value:res.data.data.buildings[i][0],label2:-1,label1:-1};
                  buildings_t.push(b_item);
              }
              that.setData({"buildings_p":buildings_t});
          }
          //暂时没有添加错误处理和提示
      });
      setTimeout(()=>{
          wx.request({
          url:"https://www.quickbook11.cn:8080/WHU/forward",
          data:{
              "url":"https://seat.lib.whu.edu.cn:8443/rest/v2/room/stats2/1?token="+token
          },
          success(res) {
              var rooms_t=[];
              for(var i=0;i<res.data.data.length;i++)
              {
                  rooms_t.push({text:res.data.data[i].room,value:res.data.data[i].roomId,label2:res.data.data[i].floor,label1:res.data.data[i].free })
              }
              that.setData({"rooms_p":rooms_t});
          }
      })},500);

  },

    //函数：更改预约日期，仅限今天明天
    changeDate:function(res)
    {
        this.setData({"date":res.detail});
        var res={detail:this.data.value_b};      //使用当前场馆实现刷新房间的效果
        //更换日期要引起房间可用数据的刷新
        this.changeBuildings(res);
    },

    //函数：更改场馆
  changeBuildings:function (res) {
    var rooms_p=[];
    var token=wx.getStorageSync("token");
    var that =this;
    this.setData({"value_b":res.detail,"rooms_p":[{text:"请选择房间",value:0}]});
    wx.request({
        url:"https://www.quickbook11.cn:8080/WHU/forward",
        data:{
            "url":"https://seat.lib.whu.edu.cn:8443/rest/v2/room/stats2/"+res.detail+"?token="+token
        },
        success(res) {
            that.setData({"rooms":res.data.data});
            var rooms_t=[];
            var date=that.data.date;
            var obj=new Date();
            var hours=obj.getHours();
            var min=obj.getMinutes();
            for(var i=0;i<res.data.data.length;i++)
            {
                if(date==0)              //选择今天，获取实时的信息,实际上是处理今天22：45前的信息
                {
                    rooms_t.push({
                        text: res.data.data[i].room,
                        value: res.data.data[i].roomId,
                        label2: res.data.data[i].floor,
                        label1: res.data.data[i].free
                    })
                } else                //选择明天，获取总体信息
                {
                    rooms_t.push({
                        text: res.data.data[i].room,
                        value: res.data.data[i].roomId,
                        label2: res.data.data[i].floor,
                        label1: res.data.data[i].totalSeats
                    })
                }
            }
            that.setData({"rooms_p":rooms_t});
        }
    });
  },

    //函数：更改房间
    changeRoom:function (res) {
        this.setData({"value_r":res.detail});
    },


    //函数：更改开始时间
  changeStartTime:function (res) {
         var time_e=this.data.startTime;
         var i=(res.detail-480)/30;
         time_e=time_e.slice(i,time_e.length);
         this.setData({"value_start":res.detail,"endTime":time_e});
  },

    //函数：更改结束时间，同时刷新座位表
    changeEndTime:function (res) {
        this.setData({"seats":[{"text":"请选择座位","value":0,label1:-1,label2:-1}],"value_end":res.detail,seatId:0});
    },

    /**
     * 函数：更改座位
     *
     */
    changeSeat:function (res) {
        setTimeout(()=> {
            this.setData({"seatId":res.detail});
        },500);
    },
    /**
     *  提交座位申请--当没到抢座时间则提交预约，到了时间则直接进行预约
     *  大量的处理逻辑，应该进一步重构
     * */
    submit:function () {
        var thisTime=new Date();
        if(this.data.submitTime!=0&&this.data.submitTime.getMinutes()==thisTime.getMinutes()&&(this.data.submitTime.getSeconds()-thisTime.getSeconds())<10)
        {
                   Notify({
                       type:"primary",
                       message:"10秒内刚提交过一次，请稍微等等，避免被封禁！"
                   })
        }
        else {
            this.data.submitTime=thisTime;
            console.info("提交");
            var account = wx.getStorageSync("account");
            var password = wx.getStorageSync("password");
            var date = this.data.dates[this.data.date];
            var url = "https://seat.lib.whu.edu.cn:8443/rest/v2/freeBook?startTime=" + this.data.value_start + "&t=1&t2=2&endTime=" + this.data.value_end + "&seat=" + this.data.seatId + "&date=" + date;
            var today = new Date();
            var hour = today.getHours();
            var minute = today.getMinutes();
            var token = wx.getStorageSync("token");
            var optionsUrl;
            if(this.data.optionsSeatId!=0) {
                optionsUrl = "https://seat.lib.whu.edu.cn:8443/rest/v2/freeBook?startTime=" + that.data.value_start + "&t=1&t2=2&endTime=" + that.data.value_end + "&seat=" + that.data.optionsSeatId + "&date=" + date;
            }
            else {
                optionsUrl="empty";
            }
            if (this.data.date == 0)                                              //今天可约
            {
                if (hour < 22 || hour == 22 && minute < 45)                //未到明天的抢座时间
                {
                    url = url + "&token=" + token;
                    optionsUrl=optionsUrl+"&token="+token;
                    this.submit_Request(url,optionsUrl);
                } else {             //提示换日期
                    Notify({
                        type: "primary",
                        message: "请注意选择日期，已经到了预约第二天座位的时间"
                    })
                }
            } else               //预约选项选择的明天
            {
                if (hour > 22 || hour == 22 && minute >= 45)         //到了抢课时间
                {
                    url = url + "&token=" + token;
                    optionsUrl=optionsUrl+"&token="+token;
                    this.submit_Request(url,optionsUrl);
                } else                                                                     //没到抢课时间直接设置定时任务
                {
                    wx.request({
                        url: "https://www.quickbook11.cn:8080/FreeBook/Timer",
                        data: {
                            "url": url,
                            "account": account,
                            "password": password,
                            "optionsUrl":optionsUrl
                        },
                        success(res) {
                            //
                            //TODO 添加一条提醒预约任务设置成功
                            //
                            Notify({type: "primary", message: "已提交预约任务"});
                        }
                    });
                }
            }
        }
    },

    /**
     *  从submit中独立出来的提交Request，submit负责复杂的处理逻辑
     *  此处复杂提交
     * */
     submit_Request:function(url,optionsUrl){
         var that=this;
        wx.request({
            url: "https://www.quickbook11.cn:8080/WHU/POST",
            data: {
                "url": url,
            },
            success(res) {
                //
                //TODO 添加一条提醒预约任务设置成功
                //
                if(res.data.data==null||res.data.data.id==null)
                {
                    if(that.data.optionsSeatId!=0) {          //备选抢座
                          wx.request({
                            url: "https://www.quickbook11.cn:8080/WHU/POST",
                            data: {
                                "url": optionsUrl
                            },
                            success(resource) {
                                if(resource.data.data==null||resource.data.data.id==null)
                                {
                                    Notify({
                                        type:"primary",
                                        message:"抢座失败"
                                    })
                                }
                                else{
                                    that.setData({
                                        'receiptId': res.data.data.id,
                                        'receiptNum': res.data.data.receipt,
                                        'receiptStart': res.data.data.begin,
                                        'receiptEnd': res.data.data.end,
                                        'receiptLoc': res.data.data.location,
                                        "receiptDate": res.data.data.onDate
                                    });
                                    setTimeout(() => {
                                        that.setData({'show': true});
                                    }, 50);
                                }
                            }
                        })
                    }
                    else{
                        Notify({
                            type:"primary",
                            message:"抢座失败"
                        })
                    }
                }
                that.setData({
                    'receiptId': res.data.data.id,
                    'receiptNum': res.data.data.receipt,
                    'receiptStart': res.data.data.begin,
                    'receiptEnd': res.data.data.end,
                    'receiptLoc': res.data.data.location,
                    "receiptDate": res.data.data.onDate
                });
                setTimeout(() => {
                    that.setData({'show': true});
                }, 50);
            }
        })
    },


    /**
     * 搜索座位--独立出来的座位搜索和提示
     *
     * */
    searchSeats:function () {
        var date=this.data.dates[this.data.date];
        var startTime=this.data.value_start;
        var endTime=this.data.value_end;
        var token=wx.getStorageSync("token");
        var roomId=this.data.value_r;
        var buildingId=this.data.value_b;
        var that=this;
        //只要是请求的明天，数据会自动更新
        var url="https://seat.lib.whu.edu.cn:8443/rest/v2/searchSeats/"+date+"/"+startTime+"/"+endTime+"?token="+token+"&t=1&t2=2&batch=9999&roomId="+roomId+"&buildingId="+buildingId;
        wx.showLoading({"title":"加载座位中"});
        wx.request({
            url:"https://www.quickbook11.cn:8080/WHU/POST",
            data:{
                "url":url
            },
            method:"GET",
            success(res) {
                var seats=res.data.data.seats;
                var seats_p=[];                               //seats不是一个数组形式的值，而是一个实体对象，需要通过foreach的形式获取键值
                for(var key in seats)
                {
                    var power=-2;
                    var window=-2;
                    if(seats[key].window)
                    {
                        window=-3;
                    }
                    if(seats[key].power)
                    {
                        power=-3;
                    }
                    seats_p.push({"text":seats[key].name,"value":seats[key].id,"label1":power,"label2":window});
                }
                if(seats_p.length==0)
                { Notify({type: 'primary', message: '无可用座位'});
                    seats_p.push({text:"没有可用座位",value:0,label1:-1,label2:-1});
                    that.setData({"seats":seats_p})
                    return;
                }
                else {
                    Notify({type: 'primary', message: '座位加载完成'});
                    seats_p.sort(function (a, b) {
                        return a.text - b.text;                                  //座位从大到小按序排列
                    });
                   that.setData({"seats":seats_p});
                }
                wx.hideLoading();
            }
        });
        setTimeout(()=>{wx.hideLoading()},5000);
      console.info("搜索")
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
     * 当用户没能成功加载出信息可以进行刷新
     */
    onPullDownRefresh: function () {
        var thisTime=new Date();
        if(this.data.freshTime!=0&&this.data.freshTime.getMinutes()==thisTime.getMinutes()&&(thisTime.getSeconds()-this.data.freshTime.getSeconds())<10)
        {
            Notify({
                type:"primary",
                message:"10秒内刚刷新,请稍微等等！"
            });
            wx.stopPullDownRefresh();
        }else {
            this.data.freshTime=thisTime;
            this.onReady();
            Notify({
                type: "primary",
                message: "刷新成功"
            });
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

    },
    /**
     *改变备选位置
     */
    changeOptionsSeat:function (res) {
        setTimeout(()=> {
            this.setData({"optionsSeatId":res.detail});
        },500);
    }

})

