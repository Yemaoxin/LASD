package com.lasd.leopard.Utils;

import com.alibaba.fastjson.JSONObject;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
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
    String optionsUrl="";
    public TimerBookRun(String url, String account, String password)
    {
        this.url=url;
        this.password=password;
        this.account=account;
    }
    public TimerBookRun(String url, String account, String password,String optionsUrl) {
        this.url = url;
        this.password = password;
        this.account = account;
        this.optionsUrl = optionsUrl;
    }

    @Override
    public void run() {
            commonBook();
    }

    public void commonBook()
    {
        //定时任务的具体执行内容
        HttpClient client= HttpClients.createDefault();
        String getTokenUrl="https://seat.lib.whu.edu.cn:8443/rest/auth?username="+account+"&password="+password;
        HttpGet getToken=new HttpGet(getTokenUrl);
        try {
            //取回token
            HttpResponse getTokenResponse=client.execute(getToken);
            String entity= EntityUtils.toString(getTokenResponse.getEntity());
            JSONObject object=JSONObject.parseObject(entity);
            String token=JSONObject.parseObject(object.get("data").toString()).getString("token");
            //预约
            String FreeBookUrl=url+"&token="+token;
            HttpPost FreeBook=new HttpPost(FreeBookUrl);
            HttpResponse response=client.execute(FreeBook);
            String optionObject=EntityUtils.toString(response.getEntity());
            JSONObject object1=JSONObject.parseObject(optionObject);
            try {
                String id = JSONObject.parseObject(object1.get("data").toString()).getString("id");
                if (id.length()==0)           //检查是否获取到位置
                {
                    System.out.println("解析错误，实际预约失败");
                    if(optionsUrl.length()!=0)
                    {
                       FreeBookUrl=optionsUrl+"&token="+token;
                       FreeBook=new HttpPost(FreeBookUrl);
                        response=client.execute(FreeBook);
                        optionObject=EntityUtils.toString(response.getEntity());
                        object1=JSONObject.parseObject(optionObject);
                        id = JSONObject.parseObject(object1.get("data").toString()).getString("id");
                        if(id.length()==0)
                        {
                            System.out.println("解析错误，实际预约失败");
                        }
                        else
                        {
                            System.out.println("成功");
                            //TODO 成功后邮件提醒？
                        }
                    }
                }
                else                 //预约成功
                {
                    System.out.println("成功");
                    //TODO 成功后邮件提醒？
                }
            }
            catch (Exception e)
            {
                System.out.println("解析错误，实际预约失败");
            }
            //TODO    失败处理
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

    public String getOptionsUrl() {
        return optionsUrl;
    }

    public void setOptionsUrl(String optionsUrl) {
        this.optionsUrl = optionsUrl;
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
