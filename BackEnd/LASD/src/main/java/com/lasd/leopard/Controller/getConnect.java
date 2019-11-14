package com.lasd.leopard.Controller;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

@RestController("/WHU")
@RequestMapping("/WHU")
public class getConnect {

    @ResponseBody
    @RequestMapping("/forward")
    String forward(String url)
    {

        try {
            System.out.println(url);
            HttpClient client = HttpClients.createDefault();
            HttpGet get=new HttpGet(url);
            HttpResponse response=client.execute(get);
            System.out.println(response.getStatusLine());
            return EntityUtils.toString(response.getEntity());            //entity无法直接返回成一个httpEntity，应该是字符串解析问题
        }
        catch (Exception e)
        {
              System.out.println("故障");
              System.out.println(e.getCause());
        }
        return null;
    }





}
