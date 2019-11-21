## Leopard  图书馆预约抢座小程序 -- 预约模块

#### 一、需要实现的功能

​     第一轮中需要实现的功能：

1. 获取场馆分布和各个场馆的房间分布

2. 根据用户选择的场馆、房间，获取所有房间的此刻可用位置数目和具体的可用座位列表
3. 获取每个座位的具体信息：座位号、有无电源、有无窗户等
4. 即时抢座预约座位
5. 获取第二天的所有可用座位数目和具体列表
6. 提供定时抢座功能
7. 相关的提示功能

#### 二、使用的抓包Request介绍

​	使用到的抓包request主要是：

1.  获取图书馆的场馆、房间的总体分布情况

   ```https://seat.lib.whu.edu.cn:8443/rest/v2/free/filters&token=CQZE5BWJFM11125527```

2. 获取每个场馆的具体信息：如所有房间地现在可用座位数目、房间的楼层

​      ```https://seat.lib.whu.edu.cn:8443/rest/v2/room/stats2/1?token=CQZE5BWJFM11125527```

3.  根据时间信息筛选可用座位```https://seat.lib.whu.edu.cn:8443/rest/v2/searchSeats/2019-11-12/570/1320```

4. 预约某个位置```http://seat.lib.whu.edu.cn/rest/v2/startTimesForSeat/2508/2019-11-12?token=J8PM1O4QZN11122226```

5. 另外使用到了：

   由服务器后端提供的转发（get和post）、时间日期计算、预约和定时等接口

#### 三、使用的页面变量介绍

```
buildings : [],          //场馆列表，实际有四个
rooms:[],                //房间列表，上百个
dates:[],                //日期，今天明天，格式为yyyy-mm-dd。明天的具体日期计算由后端提供
  date:0,                 //0为今天，1为明天。时间选择为今天时，需要查看具体位置，如果是选择明天，默认所有可用
  dateOptions:[{text:"今天",value:0,label1:-1,label2:-1},{text:"明天",value:1,label1:-1,label2:-1}],                //要符合dropmenu-item的参数设定
hours:15,
seats:[{text:"请选择座位",value:0,label1:-1,label2:-1}],         //可用座位列表
  seatId:0,                          //座位Id
buildings_p:[{text:"信息馆",value:1}],       //用于打印的buildings列表
rooms_p:[{text:"请选择房间",value:0}],  //用于打印的rooms列表1
//设置四个组件根据数值决定使用的对像
value_b: 1,                      //默认信息学馆.将用于设置url
value_r: 0 ,                     //默认信息学部的3C创客空间，将用于设置url
  startTime:[{text:"8:00",value:480,label1:-1,label2:-1}],
  endTime:[{text:"8:00",value:480}],
  value_start:480,             //为方便使用默认从8：00开始找
   value_end:480 ,             //将用于设置url，将用于设置url
  show:false,                  //以下为预约凭证
  receiptId:"0",          
  receiptNum:"0",
  receiptStart:"0",
  receiptEnd:"0",
  receiptDate:"0",
  receiptLoc:"0"
```

#### 四、特别需要提及的实现操作

1. 通过服务器转发，绕开微信小程序的Referer头信息

   成功避开防盗链的干扰，获取信息：包括图书馆的场馆分布、房间分布、座位分布、和座位的实时使用情况

   服务器包含了GET转发和POST转发

2. 定时预约任务由服务器完成

3. 通过用户选择日期、场馆、房间、开始时间、结束时间来筛选出可用的座位。同时提示关于有无电源、有无窗户信息

4. **改造Vant-Weapp的几个组件库，实现了原组件未实现的displayTitle和options刷新问题实现了信息的实时同步**

#### 五、现在实现的功能和存在的问题

   已经实现的功能：

1. 获取场馆分布和各个场馆的房间分布

2. 根据用户选择的场馆、房间，获取所有房间的此刻可用位置数目和具体的可用座位列表
3. 获取每个座位的具体信息：座位号、有无电源、有无窗户等
4. 即时抢座预约座位
5. 获取第二天的所有可用座位数目和具体列表
6. 提供定时抢座功能
7. 相关的提示功能



存在的问题和之后解决的方向：

1. 频繁请求时会造成图书馆的网站对ip和学号进行封禁
2. 没有实现当已有预约请求时做出提示，或者让用户进行选择保持旧有预约还是使用新的请求
3. 数据略有卡顿
4. 定时任务提交后，未记录保存在本地。
5. 预约如果失败应该提供备选项

#### 六、界面截图

![img](file:///C:\Users\叶十一\AppData\Roaming\Tencent\Users\1648428830\QQ\WinTemp\RichOle\@4P9B{H{6BTKW1CAJ61NUG0.png)



