package cn.enilu.flash.bean.entity.dishMgr;

import cn.enilu.flash.bean.entity.BaseEntity;
import lombok.Data;
import org.hibernate.annotations.Table;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.time.LocalDate;
import javax.validation.constraints.NotBlank;


@Entity(name = "t_order")
@Table(appliesTo = "t_order", comment = "点餐订单")
@Data
@EntityListeners(AuditingEntityListener.class)
public class Order extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(columnDefinition = "BIGINT COMMENT '编号'")
//    @NotNull(message = "编号不能为空")
    private Long id;

    @Column(name = "id_dish", columnDefinition = "BIGINT COMMENT '预定的菜品ID'", nullable = false)
    private Long idDish; // 预定的菜品ID

    @Column(name = "order_date", columnDefinition = "DATE COMMENT '下单日期'", nullable = false)
    private LocalDate orderDate; // 预定的送餐日期

    @Column(name = "user_name", columnDefinition = "VARCHAR(64) COMMENT '用户名称'", nullable = false)
    @NotBlank(message = "用户名称不能为空")
    private String user_name; // 菜品ID

    @Column(name = "mobile", columnDefinition = "VARCHAR(64) COMMENT '用户手机号'", nullable = false)
    @NotBlank(message = "用户手机号不能为空")
    private String mobile; // 用户ID

    @Column(name = "address", columnDefinition = "VARCHAR(128) COMMENT '送餐地址'", nullable = false)
    @NotBlank(message = "送餐地址不能为空")
    private String address; // 预定的送餐日期

    @Column(name = "remark", columnDefinition = "VARCHAR(255) COMMENT '餐品备注'")
    private String remark;
}
