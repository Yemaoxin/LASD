package com.lasd.leopard.Controller.FreeBook;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class testController {

    @RequestMapping("test")
    String getForm()
    {
          return "try";
    }
}
