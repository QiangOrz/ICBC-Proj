// flash-core/src/main/java/cn/enilu/flash/bean/entity/menuMgr/Dish.java
package cn.enilu.flash.bean.entity.dishMgr;

import cn.enilu.flash.bean.entity.BaseEntity;
import lombok.Data;
import org.hibernate.annotations.Table;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.math.BigInteger;
import java.time.LocalDate;

@Entity(name = "t_dish")
@Table(appliesTo = "t_dish", comment = "菜品")
@Data
@EntityListeners(AuditingEntityListener.class)
public class Dish extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(columnDefinition = "BIGINT COMMENT '编号'")
//    @NotNull(message = "编号不能为空")
    private Long id;

    @Column(columnDefinition = "VARCHAR(64) COMMENT '菜品名称'", nullable = false)
    @NotBlank(message = "菜品名称不能为空")
    private String name;

    @Column(columnDefinition = "VARCHAR(255) COMMENT '菜品图片ID'")
    private String icon;

    @Column(columnDefinition = "VARCHAR(255) COMMENT '菜品描述'")
    private String remark;

    @Column(columnDefinition = "VARCHAR(64) COMMENT '菜品价格'", nullable = false)
    @NotNull(message = "菜品价格不能为空")
    private String price;

    @Column(columnDefinition = "VARCHAR(64) COMMENT '菜品分类'", nullable = false)
    private String category;

    // 3. 新增供应起始日期字段
    @Column(columnDefinition = "DATE COMMENT '供应起始日期'", nullable = false)
    private LocalDate supplyStartDate;

    // 4. 新增供应截止日期字段
    @Column(columnDefinition = "DATE COMMENT '供应截止日期'", nullable = false)
    private LocalDate supplyEndDate;

    @Column(columnDefinition = "VARCHAR(64) COMMENT '餐次（午餐/晚餐）'", nullable = false)
    private String meals;

    @Column(columnDefinition = "INT COMMENT '库存数量'")
    private Integer inventory;

    @Column(columnDefinition = "TINYINT COMMENT '是否上架'")
    private Boolean isShow = true; // 默认为上架
}