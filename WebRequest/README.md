### Leopard 图书馆预约系统抓包分析





#### 一、登录图书馆



只需要**模拟登录链接并请求**即可，不需要提交表单，不需要处理验证码。

例: https://seat.lib.whu.edu.cn:8443/rest/auth?username= **2017301200273** &password=**111111**

因为url的设置中''**?**""前为路径,？后为参数设置,&用于表示参数的并列.

小程序端要求用户输入的内容有

账号(对应在url中参数为username)

密码(对应在url中参数为password)

将内容放入对应的加黑部位即可

登录时候**时效性的，要求每次打开小程序都应该触发登录一次获取下面说的token。**

当然对于**初始登录界面而言不需要每次都出来。**

Request: https://seat.lib.whu.edu.cn:8443/rest/auth?username=账号&password=密码

Response:**非常重要的是：**每次登录请求会返回一个**token令牌**，后续的每次操作必须使用令牌。

所以每次登录都必须保存刷新token令牌。

token如下：

```
{"status":"success",**"data":{"token":"SYGD4XO6QX11120840"}**,"code":"0","message":""}
```







#### 二、查看当前用户信息

**强调必须将token放在请求的header中**

请求链接：https://seat.lib.whu.edu.cn:8443/rest/v2/free/filters

1.**请求头header：token：K093FE4A5W11121807（例子）**

2.**token放在**参数中，经多次验证放在参数中也可行。即请求链接为：https://seat.lib.whu.edu.cn:8443/rest/v2/free/filters?  **token=SYGD4XO6QX11120840**              (实际无空格)

**推荐使用第二种。**

没有token是无法通过的。

获得的json文件

```
{
	"status": "success",
	"data": {
		"id": 138911,                                         //用户的id，这个应该是一个比较特殊的暂时没看出来用处
		"enabled": true,                 
		"name": "叶茂鑫",                                 // 用户名
		"username": "2017301200273",       //学号
		"username2": null,
		"status": "NORMAL",                 
		"lastLogin": "2019-11-12T14:29:42.000",                 
		"checkedIn": false,
		"reservationStatus": null,
		"lastIn": null,
		"lastOut": null,
		"lastInBuildingId": null,
		"lastInBuildingName": null,
		"violationCount": 7                           //违约次数，早退违约、迟到违约等。
	},
	"message": "",
	"code": "0"
}
```



上述的基本信息，根据需要自己决定使用的内容。

#### 三、获取历史预约使用情况

1.history信息

首页使用的当前状态就是history列表的第一个项目。

Request:https://seat.lib.whu.edu.cn:8443/rest/v2/history/1/50?token=SYGD4XO6QX11120840

history后的1代表第一页，一般就只提供这么多，直接用此链接请求即可

注意要使用**token**，见第二部分。

Response：仅为部分的例子

```
{
"status": "success",
"data": {
	"reservations": [{
		"id": 7970240,              //ID是一个后端的每个请求的订单的号，无视即可
		"date": "2019-11-7",       //该次预约的时间
		"begin": "14:00",           //开始的时间
		"end": "21:30",         //结束的时间
		"awayBegin": null,         //中途离开的开始时间
		"awayEnd": null,
		"loc": "信息馆1层西区3C创客空间012号",
		"stat": "CANCEL"          //使用情况，“CANCEL”是取消，“COMPLETE”是完成，“MISS”是失约，“STOP”是                     //提前终止
	}, {
		"id": 7959262,
		"date": "2019-11-6",
		"begin": "20:00",
		"end": "22:30",
		"awayBegin": "22:30",
		"awayEnd": null,
		"loc": "信息馆1层西区3C创客空间025号",
		"stat": "COMPLETE"
	}, {
		"id": 7955180,
		"date": "2019-11-6",
		"begin": "14:30",
		"end": "22:30",
		"awayBegin": null,
		"awayEnd": null,
		"loc": "信息馆1层西区3C创客空间025号",
		"stat": "CANCEL"
	}, {
		"id": 7940162,
		"date": "2019-11-5",
		"begin": "14:30",
		"end": "18:30",
		"awayBegin": "17:27",
		"awayEnd": null,
		"loc": "信息馆1层西区3C创客空间020号",
		"stat": "STOP"
	}, {
		"id": 7933092,
		"date": "2019-11-4",
		"begin": "14:50",
		"end": "17:30",
		"awayBegin": null,
		"awayEnd": null,
		"loc": "信息馆1层西区3C创客空间018号",
		"stat": "COMPLETE"
	}, {
		"id": 7927616,
		"date": "2019-11-4",
		"begin": "14:30",
		"end": "22:30",
		"awayBegin": null,
		"awayEnd": null,
		"loc": "信息馆1层西区3C创客空间017号",
		"stat": "CANCEL"
	}, {
		"id": 7927636,
		"date": "2019-11-4",
		"begin": "14:00",
		"end": "17:30",
		"awayBegin": null,
		"awayEnd": null,
		"loc": "信息馆1层西区3C创客空间018号",
		"stat": "MISS"
	}, {
		"id": 7921646,
		"date": "2019-11-3",
		"begin": "18:30",
		"end": "22:30",
		"awayBegin": "22:08",
		"awayEnd": null,
		"loc": "信息馆1层西区3C创客空间017号",
		"stat": "COMPLETE"
	}]
},
"message": "",
"code": "0"
}
```



2. 如果要**查看当前座位预约信息**也有一个独立的链接可以调用

   所以首页的直接调用此处即可。

  Request：http://seat.lib.whu.edu.cn/rest/v2/user/  **reservations?token=CQZE5BWJFM11125527**

参数：token

 Response：

```
{
"status": "success",
"data": [{
	"id": 8046397,              //忽略
	"receipt": "0006-397-2", 
	"onDate": "2019-11-12",      //日期
	"seatId": 2511,       
	"status": "RESERVE",           //RESERVE预约成功保留中，INUSE使用中等等
	"location": "信息馆1层西区3C创客空间，座位号012",       //地点
	"begin": "20:00",                   //开始时间
	"end": "22:30",                 //结束时间
	"actualBegin": null,
	"awayBegin": null,
	"awayEnd": null,
	"userEnded": false,
	"message": "请在 11月12日19点45分 至 20点35分 之间前往场馆签到"     //签到信息
}],
"message": "",
"code": "0"
}
```



3. **取消当前座位预约**

Request：http://seat.lib.whu.edu.cn/rest/v2/cancel/  **8046397**  ?token=CQZE5BWJFM11125527

加黑部分就是该座位预约信息的订单号即id，详见2的数据中的**id**(为了突出而使用了空格，实际不可以有空格)

#### 四、预约座位

Request：https://seat.lib.whu.edu.cn:8443/rest/v2/free/filters&token=CQZE5BWJFM11125527

**强调使用token**

1.获取座位信息总体信息

使用该信息规划页面。让用户进行选择

```
"status": "success",
	"data": {
		"buildings": [                     //此处是场馆列表  
			[1, "信息馆", 5],            //1 代表编号 ，信息馆是名称，5代表信息馆有五层楼
			[2, "工学分馆", 5],
			[3, "医学分馆", 5],
			[4, "总馆", 6]
		],
		"rooms": [                         //房间号，所有场馆放在一起，所有的场馆的场地都在一起
			[4, "3C创客空间", 1, 1],           //4 是房间号，3C创客空间是房间名，第一个1代表属于场馆编号1（信息馆），第二个1是代表第几层，3C创客空间在信息馆一楼。验证正确，其他的可以一一验证完。
			[6, "西自然科学区", 1, 2],
			[7, "东自然科学区", 1, 2],
			[8, "西社会科学区", 1, 3],
			[9, "西图书阅览区", 1, 4],
			[10, "东社会科学区", 1, 3],
			[11, "东图书阅览区", 1, 4],
			[12, "自主学习区", 1, 3],
			[13, "3C创客电子阅读", 1, 1],
			[14, "3C创客双屏电脑", 1, 1],
			[15, "创新学习苹果区", 1, 1],
			[16, "创新学习云桌面", 1, 1],
			[19, "201自科图书区", 2, 2],
			[20, "204教学参考区", 3, 2],
			[21, "302中文科技B区", 3, 3],
			[23, "305科技期刊区", 3, 3],
			[24, "402中文文科区", 3, 4],
			[26, "502外文区", 3, 5],
			[27, "506医学人文区", 3, 5],
			[29, "2楼走廊", 2, 2],
			[30, "205电阅PC区", 2, 2],
			[31, "205电阅笔记本区", 2, 2],
			[32, "301东自科借阅区", 2, 3],
			[33, "305中自科借阅区", 2, 3],
			[34, "401东自科借阅区", 2, 4],
			[35, "405中期刊阅览区", 2, 4],
			[37, "501东外文借阅区", 2, 5],
			[38, "505中自科借阅区", 2, 5],
			[39, "A1座位区", 4, 1],
			[51, "A2借阅区", 4, 2],
			[52, "A3", 4, 3],
			[60, "A4", 4, 4],
			[61, "A5", 4, 5],
			[62, "A1沙发区", 4, 1],
			[63, "A1电子阅览室", 4, 1],
			[68, "205电阅云桌面区", 2, 2],
			[76, "A1手提电脑区", 4, 1],
			[77, "B2(现场选座)", 4, 2],
			[78, "B3(现场选座)", 4, 3],
			[84, "E2 报刊阅览区", 4, 2],
			[85, "E3 学位论文阅览区", 4, 3],
			[86, "E4 港台文献阅览区", 4, 4],
			[87, "E5 地方文献阅览区", 4, 5],
			[88, "E6 影印文献（古籍/民国）阅览区", 4, 6],
			[89, "E2大厅", 4, 2],
			[90, "创新学习讨论区", 1, 1],
			[91, "E1信息共享空间", 4, 1],
			[93, "103空间双屏云桌面区", 2, 1],
			[94, "B2自习区(原C1自习区）", 4, 1],
			[95, "B4(现场选座)", 4, 4],
			[96, "C1(现场选座)", 4, 1],
			[97, "C2(现场选座)", 4, 2],
			[98, "C3(现场选座)", 4, 3],
			[99, "C4(现场选座)", 4, 4],
			[100, "一楼中部走廊", 2, 1],
			[101, "103支点空间", 2, 1],
			[102, "A2多媒体双屏电脑区", 4, 2],
			[103, "A2多媒体苹果电脑区", 4, 2],
			[104, "A2多媒体视频工作站区", 4, 2],
			[107, "B1", 4, 1]
		],
		"hours": 15,
		"dates": ["2019-11-12"]
	},
	"message": "",
	"code": "0"
	}
```



2. 获取**具体每个馆信息**

   在用户选取场馆后刷新该场馆所有房间的信息，最重要的是可用座位有多少

   Request：https://seat.lib.whu.edu.cn:8443/rest/v2/room/stats2/ **1**?token=CQZE5BWJFM11125527

   **参数说明：加黑1代表信息馆，可以更换为2 3 4，token参数不可以少**

  Response：可以获得其中的所有楼层的所有房间的具体信息。

   所有座位信息只代表当前此刻的信息，想根据时间来看必须看 3

```
{
"status": "success",
"data": [{
	"roomId": 14,                    //房间id，是全校通用的统一编码，不是独立的编码
	"room": "3C创客双屏电脑",          //房间名
	"floor": 1,                           //楼层
	"maxHour": -1,             //最大限制时间，-1代表不限时，部分有限时
	"reserved": 0,              //被预约使用的座位有多少个
	"inUse": 18,                 //正在使用的
	"away": 0,                   //暂时离开的
	"totalSeats": 20,           //所有总共的位置数目，**比较重要**
	"free": 2                        //当前可使用座位数目
}, {
	"roomId": 13,
	"room": "3C创客电子阅读",
	"floor": 1,
	"maxHour": -1,
	"reserved": 0,
	"inUse": 18,
	"away": 0,
	"totalSeats": 20,
	"free": 1                     
}, {
	"roomId": 4,
	"room": "3C创客空间",
	"floor": 1,
	"maxHour": -1,
	"reserved": 4,
	"inUse": 57,
	"away": 0,
	"totalSeats": 110, 
	"free": 49
}, {
	"roomId": 16,
	"room": "创新学习云桌面",
	"floor": 1,
	"maxHour": -1,
	"reserved": 3,
	"inUse": 39,
	"away": 0,
	"totalSeats": 42,
	"free": 0
}, {
	"roomId": 15,
	"room": "创新学习苹果区",
	"floor": 1,
	"maxHour": -1,
	"reserved": 0,
	"inUse": 11,
	"away": 0,
	"totalSeats": 12,
	"free": 1
}, {
	"roomId": 90,
	"room": "创新学习讨论区",
	"floor": 1,
	"maxHour": -1,
	"reserved": 2,
	"inUse": 23,
	"away": 0,
	"totalSeats": 76,
	"free": 51
}, {
	"roomId": 7,
	"room": "东自然科学区",
	"floor": 2,
	"maxHour": -1,
	"reserved": 4,
	"inUse": 83,
	"away": 0,
	"totalSeats": 92,
	"free": 5
}, {
	"roomId": 6,
	"room": "西自然科学区",
	"floor": 2,
	"maxHour": -1,
	"reserved": 4,
	"inUse": 85,
	"away": 0,
	"totalSeats": 92,
	"free": 3
}, {
	"roomId": 10,
	"room": "东社会科学区",
	"floor": 3,
	"maxHour": -1,
	"reserved": 3,
	"inUse": 74,
	"away": 1,
	"totalSeats": 84,
	"free": 5
}, {
	"roomId": 12,
	"room": "自主学习区",
	"floor": 3,
	"maxHour": -1,
	"reserved": 7,
	"inUse": 165,
	"away": 1,
	"totalSeats": 188,
	"free": 13
}, {
	"roomId": 8,
	"room": "西社会科学区",
	"floor": 3,
	"maxHour": -1,
	"reserved": 4,
	"inUse": 80,
	"away": 2,
	"totalSeats": 88,
	"free": 2
}, {
	"roomId": 11,
	"room": "东图书阅览区",
	"floor": 4,
	"maxHour": -1,
	"reserved": 2,
	"inUse": 68,
	"away": 0,
	"totalSeats": 80,
	"free": 10
}, {
	"roomId": 9,
	"room": "西图书阅览区",
	"floor": 4,
	"maxHour": -1,
	"reserved": 2,
	"inUse": 75,
	"away": 1,
	"totalSeats": 88,
	"free": 8
}],
"message": "",
"code": "0"
}
```



3. 使用**时间信息**进行座位筛选可用座位

   要求提供开始时间、结束时间（要求半小时为间隔）

   Request：https://seat.lib.whu.edu.cn:8443/rest/v2/searchSeats/  **2019-11-12/570/1320**  
   
   method:**POST**,必须使用POST，因此服务器端也必须更改为POST方式不能用get请求  
   
   data参数：token=CQZE5BWJFM11125527&**t**=1&**roomId**=15&**buildingId**=1&**batch**=9999&**page**=1&**t2**=2

​        后面三个数据2019-11-12代表日期，570代表从0点开始到用户输入的开始时间的分钟数(30的倍数)

**加黑参数：日期，开始时间（分钟数 30倍数），结束时间（分钟数 30倍数）**，token

​       1320代表用户输入的结束时间对应的从0时开始的分钟数。（结束时间不可以超过22：30）

​       必须严格按照此要求进行请求，另外一定要添加**token**

​      另外如果是**今天查看明天的座位情况**，所有位置都会出来，但是显示的状态是此刻的状态

​      也就是如果想看所有座位则请求时间换成第二天的即可。

​      Response：

```
//截取的部分
{
"data": {
	"seats": {
		"8020": {             //key值暂时没有摸清
			"id": 2691,       //id也有些没摸清
			"name": "027",    //name代表符合要求时间的可用座位号
			"type": "seat",   
			"status": "FREE",  //当前状态free可用
			"window": false,   //是否有窗
			"power": false,    //是否有电源
			"computer": false,  //是否有电脑
			"local": false
		},
		"8004": {
			"id": 2675,
			"name": "051",
			"type": "seat",
			"status": "FREE",
			"window": false,
			"power": false,
			"computer": false,
			"local": false
		},
		"13006": {
			"id": 2837,
			"name": "063",
			"type": "seat",
			"status": "FREE",
			"window": false,
			"power": false,
			"computer": false,
			"local": false
		},
		"12006": {
			"id": 2805,
			"name": "064",
			"type": "seat",
			"status": "FREE",
			"window": false,
			"power": false,
			"computer": false,
			"local": false
		}
	"page": 1,
	"hasMore": false
},
"message": null,
"status": true
}
```

4. 查看某个房间号的所有位置信息，不加时间的情况

 

需要说明的是，图书馆的这些网址api均是提供给微信公众号武大图书馆的座位预约使用的。

所以查看某个房间所有座位信息，是跟微信公众号里的一样，该api返回一个矩阵，便于微信公众号使用。

**该矩阵是一个稀疏矩阵。导致如果我们按每个座位来处理花时间，暂时不推荐。**

Request: http://seat.lib.whu.edu.cn/rest/v2/room/layoutByDate/ **4**/**2019-11-12**?token=CQZE5BWJFM11125527

**加黑参数：房间id，日期，token。**

response：仅为一小部分，实际上好几万个元素，不列出了

```
{
"status": "success",
"data": {
	"id": 4,
	"name": "3C创客空间",
	"cols": 34,
	"rows": 22,
	"layout": {
		"0": {
			"type": "empty"
		},
		"1": {
			"type": "empty"
		},
		"2": {
			"type": "empty"
		},
		"3": {
			"type": "empty"
		},
		"4": {
			"type": "empty
```



5. **预约某个位置**

​      5.1 获取可用开始时间

​     Request：http://seat.lib.whu.edu.cn/rest/v2/startTimesForSeat/ **2508**/**2019-11-12**?token=J8PM1O4QZN11122226

   **加黑参数：座位的id  ，日期**  ，**token**

   Response：返回的数据

```
{
"status": "success",
"data": {
	"startTimes": [{            //可用时间列表
		"id": "now",
		"value": "现在"
	}, {
		"id": "1110",          //id号实际是从零时开始的分钟数
		"value": "18:30"   //具体时间
	}, {
		"id": "1140",
		"value": "19:00"
	}, {
		"id": "1170",
		"value": "19:30"
	}, {
		"id": "1200",
		"value": "20:00"
	}, {
		"id": "1230",
		"value": "20:30"
	}, {
		"id": "1260",
		"value": "21:00"
	}, {
		"id": "1290",
		"value": "21:30"
	}, {
		"id": "1320",
		"value": "22:00"
	}]
},
"message": "",
"code": "0"
}
```



5.2  选择结束时间（会根据开始时间的不同进行刷新）

Request:  http://seat.lib.whu.edu.cn/rest/v2/endTimesForSeat/ **2778**/**2019-11-12**/**1200**?token=J8PM1O4QZN11122226

**参数：座位id，日期，开始时间id（对应分钟数）**，**token**

条目换成**endTimes**了

```
{
"status": "success",
"data": {
	**"endTimes"**: [{
		"id": "1140",
		"value": "19:00"
	}, {
		"id": "1170",
		"value": "19:30"
	}, {
		"id": "1200",
		"value": "20:00"
	}, {
		"id": "1230",
		"value": "20:30"
	}, {
		"id": "1260",
		"value": "21:00"
	}, {
		"id": "1290",
		"value": "21:30"
	}, {
		"id": "1320",
		"value": "22:00"
	}, {
		"id": "1350",
		"value": "22:30"
	}]
},
"message": "",
"code": "0"
}
```



5.3 预约(自由预约)

Request:  http://seat.lib.whu.edu.cn/rest/v2/freeBook?    **token=J8PM1O4QZN11122226**&**startTime=1110**&**endTime=1320**&**seat=2778**&**date=2019-11-12**

参数：token，开始时间、结束时间、日期

返回该预约单的信息。

```
{
"status": "success",
"data": {
	"id": 8048269,               //预约单号
	"receipt": "0006-269-2",
	"onDate": "2019 年 11 月 12 日",
	"begin": "18 : 44",
	"end": "22 : 00",
	"location": "信息馆1层西区3C创客空间，座位号071",
	"checkedIn": false
},
"message": "",
"code": "0"
}
```
#### 五、解决小程序Referer Header的防盗链限制

由于微信小程序、QQ小程序等小程序中，request请求头的Referer是 默认微信/qq指定的内容，导致在访问图书馆服务器的时候，无法通过。

解决思路：通过自己服务器转发链接内容。

自己服务器不做解析，直接将内容转发回小程序。

具体解决方案：
1. 编写抓包文件说明的url，按照访问图书馆的服务器来书写拼接url
2. 通过小程序的wx.request向我的服务器45.40.201.185发起请求
3. 接收请求的网络地址为http://45.40.201.185:8080/WHU/forward(暂时未提供https证书服务)
4. 由于url为参数时可能包含“&”导致链接参数提取缺失，所以url应通过post方式作为数据发送到上述端口
5. 例子：
```
wx.request({
 url:"http://45.40.201.185:8080/WHU/forward",
 data:{
   "url":"https://seat.lib.whu.edu.cn:8443/rest/auth?username=2017301200273&password=111111"
 },
 success(res):{
 //此处还应该有相应的处理逻辑，暂时通用只打印
 console.info(res);
 }
})
```
6. 强调data里面的参数名必须是加引号的"url"，服务器只解析此参数

#### 六、快速预约

图书馆有提供快速自动选座，暂时不以实现。
