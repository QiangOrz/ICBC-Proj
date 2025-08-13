package cn.enilu.flash.api.controller.front.officialsite;

import cn.enilu.flash.api.controller.BaseController;
import cn.enilu.flash.bean.constant.factory.PageFactory;
import cn.enilu.flash.bean.core.BussinessLog;
import cn.enilu.flash.bean.entity.dishMgr.Dish;
import cn.enilu.flash.bean.entity.system.FileInfo;
import cn.enilu.flash.bean.enumeration.Permission;
import cn.enilu.flash.bean.vo.front.Rets;
import cn.enilu.flash.service.cms.ArticleService;
import cn.enilu.flash.service.dishMgr.DishService;
import cn.enilu.flash.service.system.FileService;
import cn.enilu.flash.utils.Maps;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/offcialsite/dish")
public class DishesController {
    private Logger logger = LoggerFactory.getLogger(ArticleController.class);
    @Autowired
    private DishService dishService;

    @GetMapping(value = "/list1")
    public Object list1(@RequestParam(value = "page", defaultValue = "1") int page,
                        @RequestParam(value = "size", defaultValue = "10") int size,
                        @RequestParam(value = "category", required = false) String category,
                        @RequestParam(value = "meals", required = false) String meals,
                        // 新增一个参数来控制是否只查询上架商品
                        @RequestParam(value = "isShow", required = true) Boolean isShow) {
        System.out.println("Listing order dishes with category: " + category + ", meals: " + meals + ", isShow: " + isShow);
        PageRequest pageable = PageRequest.of(page - 1, size);
        // 将 isShow 参数传递给 service 层进行处理
        Page<Dish> dishPage = dishService.findPage1(pageable, category, meals, isShow);
        return Rets.success(dishPage);
    }
}
