package com.lasd.leopard;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SpringBootWebSecurityConfiguration;

/**
 * <p>文件注解</p>
 * SpringBoot启动类
 * 此处暂时不做修改
 * 一般情况下不修改
 * 导出不需要的安全类，简化流程
 * */
@SpringBootApplication(exclude = {SpringBootWebSecurityConfiguration.class})
public class LeopardApplication {

    public static void main(String[] args) {
        SpringApplication.run(LeopardApplication.class, args);
    }

}
