// pages/appointment/appoint.js
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
       value_end:480            //将用于设置url，将用于设置url
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
          }
      );

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

  },
    //函数：更改预约日期，仅限今天明天
    changeDate:function(res)
    {
        this.setData({"date":res.detail});

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

    //函数：更改座位
    changeSeat:function (res) {
        setTimeout(()=> {
            this.setData({"seatId":res.detail});
        },500);
    },
    submit:function () {
        console.info("提交");
        var account=wx.getStorageSync("account");
        var password=wx.getStorageSync("password");
        var date=this.data.dates[this.data.date];
        var url="https://seat.lib.whu.edu.cn:8443/rest/v2/freeBook?startTime="+this.data.value_start+"&endTime="+this.data.value_end+"&seat="+this.data.seatId+"&date="+date;
        var today=new Date();
        var hour=today.getHours();
        var minute=today.getMinutes();
        var token=wx.getStorageSync("token");
        if(hour>22||hour==22&&minute>=45)     //到了抢课时间
        {
            url=url+"&token="+token;
            wx.request({
                url: "http://localhost:8080/WHU/forward",
                data: {
                    "url": url
                },
                success(res) {
                    //
                    //TODO 添加一条提醒预约任务设置成功
                    //
                    console.info("直接抢座");
                }
            })
        }
        else                                                      //没到抢课时间直接设置定时任务
        {
            wx.request({
                url: "http://localhost:8080/FreeBook/Timer",
                data: {
                    "url": url,
                    "account": account,
                    "password": password
                },
                success(res) {
                    //
                    //TODO 添加一条提醒预约任务设置成功
                    //
                    console.info("成功设置预约任务");
                }
            });
        }
    },
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
                {
                    seats_p.push({text:"没有可用座位",value:0,label1:-1,label2:-1});
                    that.setData({"seats":seats_p})
                    return;
                }
                else {
                    seats_p.sort(function (a, b) {
                        return a.text - b.text;                                  //座位从大到小按序排列
                    });
                   that.setData({"seats":seats_p});
                }
            }
        });
      console.info("搜索")
    }

})

