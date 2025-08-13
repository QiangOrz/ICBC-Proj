package cn.enilu.flash.service.dishMgr;

import cn.enilu.flash.bean.entity.dishMgr.Dish;
import cn.enilu.flash.dao.dishMgr.DishRepository;
import cn.enilu.flash.service.BaseService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import javax.persistence.criteria.Predicate;
import org.springframework.transaction.annotation.Transactional;
import java.util.ArrayList;
import java.util.List;

@Service
public class DishService extends BaseService<Dish, Long, DishRepository> {

    // 1. 添加日志记录器
    private static final Logger logger = LoggerFactory.getLogger(DishService.class);

    @Autowired
    private DishRepository dishRepository;

    public Page<Dish> findPage(Pageable pageable, String category, String meals) {
        // 2. 添加关键的调试日志
        logger.info("开始分页查询菜品，接收到的参数 - Category: [{}], Meals: [{}]", category, meals);

        return dishRepository.findAll((Specification<Dish>) (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (StringUtils.hasText(category)) {
                logger.info("应用查询条件: category = {}", category);
                predicates.add(criteriaBuilder.equal(root.get("category"), category));
            }

            if (StringUtils.hasText(meals)) {
                logger.info("应用查询条件: meals = {}", meals);
                predicates.add(criteriaBuilder.equal(root.get("meals"), meals));
            }

            // 3. 只有在有查询条件时才构建 where 子句
            if (!predicates.isEmpty()) {
                return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
            }

            // 如果没有条件，返回 null，JPA会忽略 where 子句
            return null;
        }, pageable);
    }

    public Page<Dish> findPage1(Pageable pageable, String category, String meals, Boolean isShow) {
        // 2. 添加关键的调试日志
        logger.info("开始分页查询菜品，接收到的参数 - Category: [{}], Meals: [{}]", category, meals);

        return dishRepository.findAll((Specification<Dish>) (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (StringUtils.hasText(category)) {
                logger.info("应用查询条件: category = {}", category);
                predicates.add(criteriaBuilder.equal(root.get("category"), category));
            }

            if (StringUtils.hasText(meals)) {
                logger.info("应用查询条件: meals = {}", meals);
                predicates.add(criteriaBuilder.equal(root.get("meals"), meals));
            }

            if (isShow != null) {
                logger.info("应用查询条件: isShow = {}", isShow);
                predicates.add(criteriaBuilder.equal(root.get("isShow"), isShow));
            }

            // 3. 只有在有查询条件时才构建 where 子句
            if (!predicates.isEmpty()) {
                return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
            }

            // 如果没有条件，返回 null，JPA会忽略 where 子句
            return null;
        }, pageable);
    }

    public void toggleStatus(long id, Boolean isShow) {
        logger.info("切换菜品状态，ID: [{}], 是否显示: [{}]", id, isShow);
        Dish dish = get(id);
        if (dish != null) {
            dish.setIsShow(isShow);
            update(dish);
        }
    }

    @Transactional(rollbackFor = Exception.class)
    public void updateDish(Dish dish) {
        if (dish.getInventory() == 0) {
            dish.setIsShow(false);
        }
        super.update(dish);
        logger.info("菜品[{}]库存更新为 {}，显示状态为 {}", dish.getId(), dish.getInventory(), dish.getIsShow());
    }
}