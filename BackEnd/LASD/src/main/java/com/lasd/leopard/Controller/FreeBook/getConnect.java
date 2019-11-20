package com.lasd.leopard.Controller.FreeBook;
import com.alibaba.fastjson.JSONObject;
import com.fasterxml.jackson.databind.util.JSONPObject;
import com.lasd.leopard.Utils.RequestData;
import com.lasd.leopard.Utils.Tools;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.thymeleaf.util.DateUtils;

import javax.servlet.http.HttpServletRequest;
import java.lang.reflect.Array;
import java.util.*;

@RestController("/WHU")
@RequestMapping("/WHU")
public class getConnect {
    @Autowired
    HttpServletRequest request;
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

    @ResponseBody
    @RequestMapping("/POST")
    String getPost(String url)
    {
        HttpClient client=HttpClients.createDefault();
        HttpPost post=new HttpPost(url);
        try {
            System.out.println(url);
            HttpResponse r=client.execute(post);
            return EntityUtils.toString(r.getEntity());
        }
        catch (Exception e)
        {
            System.out.println(e.getCause());
        }
        return "map";
    }

     @ResponseBody
     @RequestMapping("/getTomorrow")
     ArrayList<String> getTomorrow()
    {
        Calendar p= DateUtils.createToday();
        ArrayList<String> dates=new ArrayList<>();
        dates.add(Tools.getDateString(p));
        p.set(Calendar.HOUR,23);
        p.set(Calendar.MINUTE,59);
        p.set(Calendar.SECOND,59);
        p.add(Calendar.SECOND,1);
        dates.add(Tools.getDateString(p));
        return  dates;
    }
}
