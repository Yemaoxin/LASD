### Leopard 图书馆预约抢座小程序--登录模块
#### 一、需要实现的功能
1 登陆界面  
2 接受输入信息  
小程序端要求用户输入的内容有    
账号（对应在url中的参数为username）   
密码（对应在url中的参数为password）   
3 验证用户信息   
只需要模拟登陆链接并请求即可，不需要提交表单，不需要处理验证码。       
例：https://seat.lib.whu.edu.cn:8443/rest/auth?username&password   
因为url设置中“?”前为路径，“?”后为参数设置，“&”用于表示参数的并列.     
4 登录是有时效性的    
每次打开小程序都应该触发登陆一次，获取token。   
Request: https://seat.lib.whu.edu.cn:8443/rest/auth?username=账号&password=密码   
Response:非常重要的是：每次登录请求会返回一个token令牌，后续的每次操作必须使用令牌。   
所以每次登录都必须保存刷新token令牌。   
token如下：  
```
    {"status":"success",**"data":{"token":"SYGD4XO6QX11120840"}**,"code":"0","message":""}
```
#### 二、出现时机
1 第一次使用小程序，尚未有登录记录时  
2 登录验证信息过期，需重新登陆时  
3 欲切换账号，点击了注销账号时
#### 三、使用的页面变量介绍

```
    account:''              //学号  
    password:'',            //密码
```

#### 四、现在实现的功能和存在的问题 
实现的功能：   
已具备登录功能    
存在问题：   
整体UI不够统一   
#### 五、界面截图
![登陆界面截图](https://ftp.bmp.ovh/imgs/2019/11/835f7ef715e192ae.jpg)
