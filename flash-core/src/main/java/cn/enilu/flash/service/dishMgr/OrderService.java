package cn.enilu.flash.service.dishMgr;

import cn.enilu.flash.bean.entity.dishMgr.Order;
import cn.enilu.flash.bean.entity.dishMgr.Dish;
import cn.enilu.flash.bean.exception.ApplicationException;
import cn.enilu.flash.dao.dishMgr.OrderRepository;
import cn.enilu.flash.service.BaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OrderService extends  BaseService<Order, Long, OrderRepository> {
    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private DishService dishService; // 注入DishService来操作菜品数据

    /**
     * 创建订单并更新菜品库存
     * 使用 @Transactional 注解确保这是一个原子操作（要么全部成功，要么全部回滚）
     * @param order 订单信息
     */
    @Transactional(rollbackFor = Exception.class)
    public void placeOrder(Order order) {
        // 1. 根据订单中的菜品ID查找菜品
        Dish dish = dishService.get(order.getIdDish());

        // 2. 检查菜品是否存在以及库存是否充足
        if (dish == null) {
            // 如果菜品不存在，抛出“数据不存在”异常
            System.out.println("菜品不存在，无法下单");
        }
        if (dish.getInventory() <= 0) {
            // 如果库存不足，抛出业务异常，并附带明确的错误信息
            System.out.println("菜品 '" + dish.getName() + "' 库存不足，无法下单");
        }

        // 3. 扣减库存
        dish.setInventory(dish.getInventory() - 1);
        System.out.println("菜品 '" + dish.getName() + "' 库存扣减, 剩余库存: " + dish.getInventory());

        // 4. 如果库存为0，则自动设置为下架状态
        if (dish.getInventory() == 0) {
            dish.setIsShow(false);
            System.out.println("菜品 '" + dish.getName() + "' 库存为0, 自动下架.");
        }

        // 5. 更新菜品信息到数据库
        dishService.update(dish);

        // 6. 最后，保存订单信息到数据库
        insert(order);
        System.out.println("订单创建成功，订单用户: " + order.getUser_name() + ", 菜品: " + dish.getName());
    }
}
