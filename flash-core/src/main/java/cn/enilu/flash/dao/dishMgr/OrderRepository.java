package cn.enilu.flash.dao.dishMgr;

import cn.enilu.flash.bean.entity.dishMgr.Order;
import cn.enilu.flash.dao.BaseRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;
import java.util.Map;

public interface OrderRepository extends BaseRepository<Order, Long>, JpaSpecificationExecutor<Order> {

    /**
     * 统计订单数据，用于图表展示
     * @param beginDate 开始日期
     * @param endDate 结束日期
     * @param meals 餐次
     * @param idDish 菜品ID
     * @return 包含日期、菜品ID、菜品名称和订单数量的Map列表
     */
    @Query(value = "SELECT " +
            "  DATE(o.order_date) AS orderDate, " +
            "  o.id_dish AS idDish, " +
            "  d.name AS dishName, " +
            "  COUNT(o.id) AS count " +
            "FROM " +
            "  t_order o " +
            "JOIN " +
            "  t_dish d ON o.id_dish = d.id " +
            "WHERE " +
            "  DATE(o.order_date) >= :beginDate AND DATE(o.order_date) <= :endDate " +
            "  AND ( :meals IS NULL OR :meals = '' OR d.meals = :meals ) " +
            "  AND ( :idDish IS NULL OR o.id_dish = :idDish ) " +
            "GROUP BY " +
            "  DATE(o.order_date), o.id_dish, d.name " +
            "ORDER BY " +
            "  orderDate ASC", nativeQuery = true)
    List<Map<String, Object>> getOrderStats(@Param("beginDate") String beginDate,
                                            @Param("endDate") String endDate,
                                            @Param("meals") String meals,
                                            @Param("idDish") Long idDish);
}
