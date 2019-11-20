package com.lasd.leopard.Utils;

import org.thymeleaf.util.DateUtils;

import java.util.Calendar;

public class Tools {
    public static String getDateString(Calendar p)
    {
        return p.get(Calendar.YEAR)+"-"+(p.get(Calendar.MONTH)+1)+"-"+p.get(Calendar.DATE);
    }
    public static Calendar getTomorrowDay()
    {
        Calendar p = DateUtils.createToday();
        p.set(Calendar.HOUR,23);
        p.set(Calendar.MINUTE,59);
        p.set(Calendar.SECOND,59);
        p.add(Calendar.SECOND,1);
        return  p;
    }
}
