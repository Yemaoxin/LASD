# LASD

#### Large Application Software Design（大型应用软件设计课程设计）

### 1. 选题：基于Springboot的后台抢座小程序

##### 1.1 选题背景

针对于校园生活中的实际需求，对于校内图书馆预约座位问题，许多人使用抢座软件进行抢座，造成正常进行座位预约的同学难以约到合适的座位。

为了能够有效抢座，同时改善现今现有抢座软件的问题：诸如限制于电脑端和手机端的问题，必须保持进程一直存在。

手机端造成很大的干扰，如果退出，将造成软件定时停止，无法正常预约问题。

##### 1.2 解决方案

将相应的处理任务放置到服务器端进行，手机端发出请求，由服务器进行计时处理。

前端：基于微信小程序（原生+组件库）

后端：SpringBoot

数据库：Mysql

##### 1.3开发方式：敏捷开发

在短短几周内，通过不断的迭代和处理，完善整个软件系统。

### 2. 协同开发简单规范

##### 2.1独立子文件夹

每个人按照自己负责的模块，在相应的文件夹下建立自己的子文件夹，不可更改他人文件夹。

例如：需要设置login登录模块

- 在Controller下建立自己的独立文件夹LoginControllers。

  **文件夹单词首字母大写，遵守驼峰规则。**

- 仅在自己文件夹内部改动

##### 2.2 注释清晰

无用注释请删除

##### 2.3 当需要修改applications.properties等全局文件时，须向全体说明



### 3.SpringBoot开发

​         这个可以实际项目实战的例子。会的同学就直接用就好了

​         项目构建基于gradle

​         各自构建自己的Controller路由。

### 4.微信小程序开发

##### 4.1 开发参考

   基于原生微信小程序，不使用Wepy等框架，节省学习成本。

   参看微信小程序官网<https://developers.weixin.qq.com/miniprogram/dev/framework/>

   有遇到大问题时，参看对应的指南即可，或者在群里问。

##### 4.2使用组件

 基于IView-Weapp、Vants-Weapp这两种组件库，实际只需要把一个个组件添加好，界面不难。

主要是js异步通信后端的问题。

参考界面组件:<https://youzan.github.io/vant-weapp/#/intro>

<https://weapp.iviewui.com/docs/guide/start>

