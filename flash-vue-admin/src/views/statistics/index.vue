<template>
  <div class="app-container">
    <!-- 筛选区域 -->
    <div class="filter-container">
      <el-date-picker
        v-model="listQuery.dateRange"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd"
        class="filter-item"
      />
      <el-select v-model="listQuery.meals" placeholder="餐次" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in mealsOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-select
        v-model="listQuery.idDish"
        placeholder="菜品名称"
        clearable
        filterable
        class="filter-item"
        style="width: 200px"
      >
        <el-option v-for="item in dishOptions" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
    </div>

    <!-- 图表容器 -->
    <div ref="chart" v-loading="chartLoading" style="width: 100%; height: 500px; margin-top: 20px;"/>
  </div>
</template>

<script src="./statistics.js"></script>

<style scoped>
.filter-container {
  padding-bottom: 10px;
}
.filter-item {
  margin-right: 10px;
}
</style>
