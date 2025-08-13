package cn.enilu.flash.dao.dishMgr;

import cn.enilu.flash.bean.entity.dishMgr.Dish;
import cn.enilu.flash.dao.BaseRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

/**
 * Created  on 2018/3/21 0021.
 *
 * @author enilu
 */
public interface DishRepository extends BaseRepository<Dish, Long>, JpaSpecificationExecutor<Dish> {

    List<Dish> findAllByOrderByIdAsc();
}
