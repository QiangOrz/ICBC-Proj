package cn.enilu.flash.service.statistics;

import cn.enilu.flash.dao.dishMgr.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class StatisticsService {

    @Autowired
    private OrderRepository orderRepository;

    public Map<String, Object> getOrderChartData(String beginDate, String endDate, String meals, Long idDish) {
        // 1. 从数据库获取原始统计数据
        List<Map<String, Object>> stats = orderRepository.getOrderStats(beginDate, endDate, meals, idDish);

        // 2. 如果没有数据，返回空结构
        if (stats.isEmpty()) {
            return Map.of("categories", Collections.emptyList(), "series", Collections.emptyList());
        }

        // 3. 准备日期轴 (X轴)
        List<String> dateCategories = new ArrayList<>();
        LocalDate start = LocalDate.parse(beginDate);
        LocalDate end = LocalDate.parse(endDate);
        for (LocalDate date = start; !date.isAfter(end); date = date.plusDays(1)) {
            dateCategories.add(date.format(DateTimeFormatter.ISO_LOCAL_DATE));
        }

        // 4. 按菜品名称对数据进行分组
        Map<String, List<Map<String, Object>>> groupedByDish = stats.stream()
                .collect(Collectors.groupingBy(stat -> (String) stat.get("dishName")));

        // 5. 构建图表的 series 数据
        List<Map<String, Object>> series = new ArrayList<>();
        for (Map.Entry<String, List<Map<String, Object>>> entry : groupedByDish.entrySet()) {
            String dishName = entry.getKey();
            List<Map<String, Object>> dishStats = entry.getValue();

            Map<String, Integer> dateCountMap = dishStats.stream()
                    .collect(Collectors.toMap(
                            stat -> stat.get("orderDate").toString().split(" ")[0], // 移除时间部分
                            stat -> ((Number) stat.get("count")).intValue()
                    ));

            List<Integer> dataPoints = dateCategories.stream()
                    .map(date -> dateCountMap.getOrDefault(date, 0))
                    .collect(Collectors.toList());

            Map<String, Object> seriesItem = new HashMap<>();
            seriesItem.put("name", dishName);
            seriesItem.put("type", "line");
            seriesItem.put("data", dataPoints);
            series.add(seriesItem);
        }

        // 6. 组装最终结果并返回
        Map<String, Object> result = new HashMap<>();
        result.put("categories", dateCategories); // X轴的日期
        result.put("series", series);       // Y轴的曲线数据
        return result;
    }
}
