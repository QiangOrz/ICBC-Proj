<template>
  <div class="app-container">
    <!-- 筛选区域 -->
    <div class="block">
      <el-form :inline="true" :model="listQuery">
        <el-form-item label="菜品分类">
          <el-select v-model="listQuery.category" placeholder="请选择分类" clearable>
            <el-option v-for="item in categoryOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="餐次">
          <el-select v-model="listQuery.meals" placeholder="请选择餐次" clearable>
            <el-option v-for="item in mealsOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="success" icon="el-icon-search" @click="search">搜索</el-button>
          <el-button type="primary" icon="el-icon-refresh" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 菜品表格 -->
    <el-table :data="list" v-loading="listLoading" style="width: 100%" border>
      <el-table-column label="菜品图片" width="120" align="center">
        <template slot-scope="scope">
          <img :src="getImageUrl(scope.row.icon)" style="width: 80px; height: 80px; border-radius: 4px;" />
        </template>
      </el-table-column>
      <el-table-column label="菜品名称" prop="name" />
      <el-table-column label="价格" width="100" align="center">
        <template slot-scope="scope">
          <span>¥{{ scope.row.price }}</span>
        </template>
      </el-table-column>
      <el-table-column label="分类" width="120" align="center">
        <template slot-scope="scope">
          <span>{{ getCategoryLabel(scope.row.category) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="餐次" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ getMealsLabel(scope.row.meals) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="库存" prop="inventory" width="80" align="center" />
      <el-table-column label="操作" width="120" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleOrderClick(scope.row)">下单</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      background
      layout="total, sizes, prev, pager, next, jumper"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="listQuery.size"
      :total="total"
      :current-page.sync="listQuery.page"
      @size-change="(val) => { listQuery.size = val; fetchData(); }"
      @current-change="(val) => { listQuery.page = val; fetchData(); }"/>

    <!-- 下单弹窗 -->
    <el-dialog title="确认订单" :visible.sync="dialogVisible" width="600px">
      <el-steps :active="activeStep" finish-status="success" simple style="margin-bottom: 20px;">
        <el-step title="菜品详情"></el-step>
        <el-step title="填写信息"></el-step>
      </el-steps>

      <!-- 步骤一：菜品详情 -->
      <div v-if="activeStep === 0" class="dish-details">
        <img :src="getImageUrl(selectedDish.icon)" class="dish-image-large" />
        <h3>{{ selectedDish.name }}</h3>
        <p class="price">¥{{ selectedDish.price }}</p>
        <p class="remark">{{ selectedDish.remark || '暂无描述' }}</p>
      </div>

      <!-- 步骤二：填写信息 -->
      <el-form v-if="activeStep === 1" ref="orderForm" :model="orderForm" :rules="orderFormRules" label-width="100px">
        <el-form-item label="下单日期" prop="orderDate">
          <el-date-picker
            v-model="orderForm.orderDate"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
            style="width: 100%;"
          />
        </el-form-item>
        <el-form-item label="您的姓名" prop="user_name">
          <el-input v-model="orderForm.user_name" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="mobile">
          <el-input v-model="orderForm.mobile" placeholder="请输入电话"></el-input>
        </el-form-item>
        <el-form-item label="收餐地址" prop="address">
          <el-input v-model="orderForm.address" placeholder="请输入地址"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model="orderForm.remark" placeholder="选填，如口味要求等"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button v-if="activeStep === 0" type="primary" @click="nextStep">下一步</el-button>
        <el-button v-if="activeStep === 1" type="primary" @click="submitOrder">确认下单</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script src="./order.js"></script>

<style scoped>
.dish-details {
  text-align: center;
}
.dish-image-large {
  width: 200px;
  height: 200px;
  border-radius: 8px;
  object-fit: cover;
  margin-bottom: 16px;
}
.dish-details h3 {
  font-size: 22px;
  margin: 8px 0;
}
.dish-details .price {
  font-size: 20px;
  color: #F56C6C;
  font-weight: bold;
}
.dish-details .remark {
  color: #909399;
  font-size: 14px;
}
</style>
