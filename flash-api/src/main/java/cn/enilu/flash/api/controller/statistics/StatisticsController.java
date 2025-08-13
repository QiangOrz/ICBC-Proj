package cn.enilu.flash.api.controller.statistics;

import cn.enilu.flash.bean.vo.front.Rets;
import cn.enilu.flash.service.statistics.StatisticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/statistics")
public class StatisticsController {

    @Autowired
    private StatisticsService statisticsService;

    @GetMapping("/orderStats")
    public Object getOrderStats(
            @RequestParam String beginDate,
            @RequestParam String endDate,
            @RequestParam(required = false) String meals,
            @RequestParam(required = false) Long idDish) {

        Map<String, Object> chartData = statisticsService.getOrderChartData(beginDate, endDate, meals, idDish);
        return Rets.success(chartData);
    }
}
