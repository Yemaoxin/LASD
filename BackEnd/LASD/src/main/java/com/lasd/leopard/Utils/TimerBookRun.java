package com.lasd.leopard.Utils;

import com.alibaba.fastjson.JSONObject;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;

/**
 * 用于任务线程池的Runnable类
 *
 * */
public class TimerBookRun implements Runnable {

    String url;                 //需要提供url参数,不包含token，省的还要处理
    String account;
    String password;          //由于token的有效性和时效性，必须由服务器自行获取token
    public TimerBookRun(String url, String account, String password)
    {
        this.url=url;
        this.password=password;
        this.account=account;
    }
    @Override
    public void run() {
        //定时任务的具体执行内容
        HttpClient client= HttpClients.createDefault();
        String getTokenUrl="https://seat.lib.whu.edu.cn:8443/rest/auth?username=2017301200273&password=227114";
        HttpGet getToken=new HttpGet(getTokenUrl);
        try {
            HttpResponse getTokenResponse=client.execute(getToken);
            String entity= EntityUtils.toString(getTokenResponse.getEntity());
            JSONObject object=JSONObject.parseObject(entity);
            String token=JSONObject.parseObject(object.get("data").toString()).getString("token");
            String FreeBookUrl=url+"&token="+token;
            HttpGet FreeBook=new HttpGet(FreeBookUrl);
            client.execute(FreeBook);
            //TODO   后期迭代需要添加如邮箱提醒或者微信服务提醒
        }
        catch (Exception e)
        {
            //
            //TODO 后期需要做错误处理，包括约不到座位的抢临近座等机制
            //
            System.out.println("Error ，get seat failed");
        }
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getAccount() {
        return account;
    }

    public void setAccount(String account) {
        this.account = account;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }
}
