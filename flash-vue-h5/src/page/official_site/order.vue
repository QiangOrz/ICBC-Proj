<template>
  <div>
    <x-header :left-options="{backText: ''}">点餐</x-header>

    <div class="filter-bar">
      <selector title="菜品分类" :options="options1" v-model="listQuery.category" @on-change="handleFilterChange"></selector>
      <selector title="餐次" :options="options2" v-model="listQuery.meals" @on-change="handleFilterChange"></selector>
    </div>

    <div class="dish-list">
      <div v-for="dish in list" :key="dish.id" class="dish-item card-shadow">
        <div class="dish-img-container">
          <img :src="getImageUrl(dish.icon)" class="dish-img"/>
        </div>
        <div class="dish-info">
          <p class="dish-name">{{ dish.name }}</p>
          <p class="dish-inventory">库存: {{ dish.inventory }}</p>
          <p class="dish-price">¥{{ dish.price }}</p>
        </div>
        <div class="dish-actions">
          <x-button v-if="dish.inventory > 0" mini type="primary" @click.native="showDishPopup(dish)">下单</x-button>
          <x-button v-else mini type="default" disabled>已售罄</x-button>
        </div>
      </div>
       <load-more v-if="listLoading" tip="正在加载"></load-more>
      <div v-if="!list.length && !listLoading" class="no-data">暂无菜品</div>
    </div>

    <div v-transfer-dom>
      <popup v-model="dishPopupVisible" height="80%">
        <div class="popup-container" v-if="selectedDish">
          <img :src="getImageUrl(selectedDish.icon)" class="popup-img"/>
          <h2 class="popup-title">{{ selectedDish.name }}</h2>
          <p class="popup-price">¥{{ selectedDish.price }}</p>
          <p class="popup-remark">{{ selectedDish.remark || '暂无描述' }}</p>
          
          <group title="订单详情">
            <cell title="菜品类别" :value="getCategoryLabel(selectedDish.category)"></cell>
            <cell title="供应餐次" :value="getMealsLabel(selectedDish.meals)"></cell>
            <datetime
              v-model="orderForm.orderDate"
              :min-date="selectedDish.supplyStartDate"
              :max-date="selectedDish.supplyEndDate"
              title="选择下单日期"
              placeholder="请选择"
              confirm-text="确定"
              cancel-text="取消">
            </datetime>
          </group>
          
          <div class="popup-actions">
            <x-button type="primary" @click.native="goToUserInfoStep">确定</x-button>
            <x-button @click.native="dishPopupVisible = false">取消</x-button>
          </div>
        </div>
      </popup>

      <popup v-model="userInfoPopupVisible" height="80%">
        <div class="popup-container">
          <h2 class="popup-title">填写订单信息</h2>
          <group>
            <x-input title="姓名" placeholder="请输入您的姓名" v-model="orderForm.user_name" required></x-input>
            <x-input title="电话" placeholder="请输入您的联系电话" v-model="orderForm.mobile" keyboard="number" is-type="china-mobile" required></x-input>
            <x-input title="地址" placeholder="请输入您的收餐地址" v-model="orderForm.address" required></x-input>
            <x-textarea title="备注" placeholder="选填，如口味要求等" :max="100" v-model="orderForm.remark"></x-textarea>
          </group>
          <div class="popup-actions">
            <x-button type="primary" @click.native="submitOrder">确认下单</x-button>
            <x-button @click.native="userInfoPopupVisible = false">返回</x-button>
          </div>
        </div>
      </popup>
    </div>
  </div>
</template>

<script src="./order.js"></script>

<style lang="less" scoped>
.filter-bar { display: flex; background: #fff; border-bottom: 1px solid #f0f0f0; }
.dish-list { padding: 10px; }
.dish-item { display: flex; align-items: center; background: #fff; padding: 10px; margin-bottom: 10px; border-radius: 5px; }
.card-shadow { box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1); }
.dish-img-container { width: 80px; height: 80px; margin-right: 10px; flex-shrink: 0; }
.dish-img { width: 100%; height: 100%; border-radius: 5px; object-fit: cover; }
.dish-inventory { font-size: 12px; color: #999; margin: 0; }
.dish-info { flex: 1; display: flex; flex-direction: column; justify-content: space-around; height: 80px; }
.dish-name { font-size: 16px; font-weight: bold; margin: 0; }
.dish-price { font-size: 16px; color: #ff5252; font-weight: bold; margin: 0; }
.dish-actions { margin-left: 10px; }
.no-data { text-align: center; color: #999; padding: 20px; }
.popup-container { text-align: center; }
.popup-img { width: 150px; height: 150px; border-radius: 8px; object-fit: cover; margin-top: 15px; }
.popup-title { font-size: 20px; }
.popup-remark { font-size: 14px; color: #888; padding: 0 15px; margin-bottom: 10px; }
.popup-price { font-size: 18px; color: #ff5252; margin-bottom: 15px; }
.popup-actions { padding: 20px 15px; }
.vux-x-input.weui-cell, .vux-x-textarea.weui-cell { text-align: left; }
</style>