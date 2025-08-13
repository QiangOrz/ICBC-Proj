package cn.enilu.flash.api.controller.front.officialsite;

import cn.enilu.flash.api.controller.BaseController;
import cn.enilu.flash.api.controller.dishMgr.OrderController;
import cn.enilu.flash.bean.entity.dishMgr.Order;
import cn.enilu.flash.bean.exception.ApplicationException;
import cn.enilu.flash.bean.vo.front.Rets;
import cn.enilu.flash.service.dishMgr.OrderService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/offcialsite/order")
public class OrdersController extends BaseController {
    private final Logger logger = LoggerFactory.getLogger(OrdersController.class);

    @Autowired
    private OrderService orderService;

    @PostMapping("/save")
    public Object save(@RequestBody Order order) {
        System.out.println("Saving order id: " + order.getId());
        try {
            if (order.getId() == null) {
                System.out.println("Inserting new order: " + order.getIdDish());
                orderService.insert(order);
                orderService.placeOrder(order);
            } else {
                orderService.update(order);
                orderService.placeOrder(order);
            }
            return Rets.success();
        } catch (ApplicationException e) {
            // 捕获业务异常（如库存不足），并返回友好的错误信息给前端
            logger.error("下单失败: ", e);
            return Rets.failure("库存不足，无法下单");
        } catch (Exception e) {
            // 捕获其他未知异常，防止程序崩溃
            logger.error("下单时发生未知错误", e);
            return Rets.failure("下单失败，系统内部错误");
        }
    }
}
