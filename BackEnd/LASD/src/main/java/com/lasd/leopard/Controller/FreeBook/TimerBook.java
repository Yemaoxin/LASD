package com.lasd.leopard.Controller.FreeBook;

import com.lasd.leopard.Utils.TimerBookRun;
import com.lasd.leopard.Utils.Tools;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.scheduling.support.CronTrigger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.thymeleaf.util.DateUtils;

import java.util.Calendar;

/**
 * created by ye11 2019/11/19
 * 定时预约器
 * */
@Controller
@RequestMapping("/FreeBook")
public class TimerBook {

    /**
     * 设置定时任务
     * 定时向武大服务器发起请求
     * 考虑时间因素可以设置定时在22：45：01
     * */

    @Autowired
    private ThreadPoolTaskScheduler threadPoolTaskScheduler;
    @ResponseBody
    @RequestMapping("/Timer")
    public String Timer(String url,String account,String password)
    {
          Calendar today = DateUtils.createToday();
          //表达式中星期不做设定，设定好秒、分、时、日期、月份、年
        String cron="0 45 22 "+today.get(Calendar.DATE)+" "+(today.get(Calendar.MONTH)+1)+" ? "+today.get(Calendar.YEAR);
        TimerBookRun run=new TimerBookRun(url,account,password);
        CronTrigger triger=new CronTrigger(cron);
        threadPoolTaskScheduler.schedule(run,triger);
        System.out.println("设置定时任务");
        return "OK";
    }
}
