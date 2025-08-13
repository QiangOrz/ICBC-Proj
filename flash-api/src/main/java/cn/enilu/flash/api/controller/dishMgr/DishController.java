// flash-api/src/main/java/cn/enilu/flash/api/controller/dishMgr/DishController.java
package cn.enilu.flash.api.controller.dishMgr;

import cn.enilu.flash.api.controller.BaseController;
import cn.enilu.flash.bean.constant.factory.PageFactory;
import cn.enilu.flash.bean.core.BussinessLog;
import cn.enilu.flash.bean.entity.dishMgr.Dish;
import cn.enilu.flash.bean.entity.system.FileInfo;
import cn.enilu.flash.bean.enumeration.Permission;
import cn.enilu.flash.bean.vo.front.Rets;
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

import javax.servlet.http.HttpServletRequest;
import java.util.List;

@RestController
@RequestMapping("/dish")
public class DishController extends BaseController {

    private Logger logger = LoggerFactory.getLogger(DishController.class);

    @Autowired
    private DishService dishService;

    @Autowired
    private FileService fileService;

    @Autowired
    private HttpServletRequest request;

    private String getApiUrl() {
        return request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort();
    }

    @GetMapping(value = "/list")
//    @RequiresPermissions(value = {Permission.DISH})
    public Object list(@RequestParam(value = "page", defaultValue = "1") int page,
                       @RequestParam(value = "size", defaultValue = "10") int size,
                       @RequestParam(value = "category", required = false) String category,
                       @RequestParam(value = "meals", required = false) String meals) {
        System.out.println("Listing dishes with category: " + category + ", meals: " + meals);
        PageRequest pageable = PageRequest.of(page - 1, size);
        Page<Dish> dishPage = dishService.findPage(pageable, category, meals);
        return Rets.success(dishPage);
    }

    // 在 DishController.java 的 list 方法中
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

    @PostMapping(value = "/save")
    @BussinessLog(value = "新增/编辑菜品", key = "name")
    public Object save(@RequestBody Dish dish) {
        System.out.println("dish id is: " + dish.getId());
        if (dish.getId() == null) {
            System.out.println("Inserting new dish: " + dish.getName());
            dishService.insert(dish);
            dishService.updateDish(dish);
        } else {
            dishService.update(dish);
            dishService.updateDish(dish);
        }
        return Rets.success();
    }

    @DeleteMapping
    @BussinessLog(value = "删除菜品", key = "id")
    public Object delete(@RequestParam Long id) {
        System.out.println("Deleting dish with ID: " + id);
        dishService.delete(id);
        return Rets.success();
    }

    @PostMapping("/toggleStatus")
    @BussinessLog(value = "上/下架菜品", key = "id")
    public Object toggleStatus(@RequestParam Long id, @RequestParam Boolean isShow) {
        System.out.println("Toggling status for dish ID: " + id + ", isShow: " + isShow);
        dishService.toggleStatus(id, isShow);
        return Rets.success();
    }

    @GetMapping(value = "/export")
    @RequiresPermissions(value = {Permission.CFG})
    public Object export(@RequestParam(value = "category", required = false) String category,
                         @RequestParam(value = "meals", required = false) String meals) {
        // 导出全部数据
        System.out.println("Exporting dishes with category: " + category + ", meals: " + meals);
        PageRequest pageable = PageRequest.of(0, Integer.MAX_VALUE);
        Page<Dish> dishPage = dishService.findPage(pageable, category, meals);
        List<Dish> list = dishPage.getContent();
        FileInfo fileInfo = fileService.createExcel("templates/dish_templates.xlsx", "菜品信息.xlsx", Maps.newHashMap("list", list));

        System.out.println("文件信息为"+fileInfo.getId());

        return Rets.success(fileInfo);
    }
}