<template>
  <div class="app-container">
    <div class="block">
      <el-form :inline="true" :model="listQuery" class="demo-form-inline">
        <el-form-item label="分类">
          <el-select v-model="listQuery.category" placeholder="请选择分类" clearable>
            <el-option
              v-for="item in options1"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="餐次">
          <el-select v-model="listQuery.meals" placeholder="请选择餐次" clearable>
            <el-option
              v-for="item in options2"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="success" icon="el-icon-search" @click.native="search">{{ $t('button.search') }}</el-button>
          <el-button type="primary" icon="el-icon-refresh" @click.native="reset">{{ $t('button.reset') }}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="block">
      <el-button type="success" size="mini" icon="el-icon-plus" @click.native="add">新增菜品</el-button>
      <el-button type="primary" size="mini" icon="el-icon-document" @click.native="exportXls">导出</el-button>
    </div>

    <el-table :data="list" v-loading="listLoading" style="width: 100%;margin-bottom: 20px;" border row-key="id">
      <el-table-column label="编号" prop="id" width="80"></el-table-column>
      <el-table-column label="菜品名称" prop="name"></el-table-column>
      <el-table-column label="菜品图片" width="100">
        <template slot-scope="scope">
          <img v-if="scope.row.icon" :src="getImageUrl(scope.row.icon)" style="width: 60px; height: 60px;" >
          <!-- <img :src="scope.row.img" style="width: 60px; height: 60px;" > -->
        </template>
      </el-table-column>
      <el-table-column label="菜品价格" width="120">
        <template slot-scope="scope">
          <span>{{scope.row.price}} 元</span>
        </template>
      </el-table-column>
      <el-table-column label="分类" prop="category" width="100">
        <template slot-scope="scope">
          {{
            (options1.find(item => item.value === scope.row.category) || {}).label
          }}
        </template>
      </el-table-column>
      <el-table-column label="餐次" width="100">
        <template slot-scope="scope">
          {{
            (options2.find(item => item.value === scope.row.meals) || {}).label
          }}
        </template>
      </el-table-column>
      <el-table-column label="库存" prop="inventory" width="100"/>
      <el-table-column label="供应时间" width="220">
        <template slot-scope="scope">
          <span v-if="scope.row.supplyStartDate && scope.row.supplyEndDate">
            {{ scope.row.supplyStartDate }} 至 {{ scope.row.supplyEndDate }}
          </span>
          <span v-else>长期供应</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.isShow ? 'success' : 'info'">
            {{scope.row.isShow ? '已上架' : '已下架'}}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="220">
        <template slot-scope="scope">
          <el-button type="text" size="mini" icon="el-icon-edit" @click="edit(scope.row)">修改</el-button>
          <el-button
            type="text"
            size="mini"
            :icon="scope.row.isShow ? 'el-icon-download' : 'el-icon-upload2'"
            @click="toggleStatus(scope.row)">
            {{scope.row.isShow ? '下架' : '上架'}}
          </el-button>
          <el-button type="text" size="mini" icon="el-icon-delete" @click="remove(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      background
      :current-page.sync="listQuery.page"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="listQuery.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="changeSize"
      @current-change="fetchPage"
      @prev-click="fetchPrev"
      @next-click="fetchNext">
    </el-pagination>

    <el-dialog :title="formTitle" :visible.sync="formVisible" width="600px">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="菜品名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="菜品图片" prop="icon">
          <div class="avatar-uploader">
            <template v-if="form.icon">
              <img :src="iconUrl" class="avatar" />
              <i class="el-icon-close avatar-delete-icon" @click="removeImage"></i>
            </template>
            <template v-else>
              <el-upload
                class="avatar-uploader"
                drag
                :action="uploadUrl"
                :headers="uploadHeaders"
                :show-file-list="false"
                :on-success="handleUploadSuccess"
                :before-upload="handleBeforeUpload">
                <img v-if="form.icon" :src="iconUrl" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </template>
          </div>
        </el-form-item>
        <el-form-item label="菜品价格" prop="price">
          <el-input-number v-model="form.price" :precision="2" :min="0" :step="0.1" controls-position="right"></el-input-number> 元
        </el-form-item>
        <el-form-item label="菜品分类" prop="category">
          <el-select v-model="form.category" placeholder="请选择">
            <el-option
              v-for="item in options1"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="餐次" prop="meals">
          <el-select v-model="form.meals" placeholder="请选择">
            <el-option
              v-for="item in options2"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="库存" prop="inventory">
          <el-input-number v-model="form.inventory" :min="0"></el-input-number>
        </el-form-item>
        <el-form-item label="菜品描述" prop="remark">
          <el-input type="textarea" v-model="form.remark"></el-input>
        </el-form-item>
        <el-form-item label="供应时间" prop="supplyTimeRange">
          <el-date-picker
            v-model="form.supplyTimeRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            style="width: 100%;">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="状态" prop="isShow">
          <el-switch v-model="form.isShow" active-text="上架" inactive-text="下架"></el-switch>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="save">保存</el-button>
          <el-button @click.native="formVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script src="./dish.js"></script>
<style rel="stylesheet/scss" lang="scss" scoped>
/* 样式与原文件相同，可直接复用 */
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.avatar-delete-icon {
  position: absolute;
  top: 6px;
  right: 6px;
  font-size: 20px;
  color: #f56c6c;
  cursor: pointer;
  background: #fff;
  border-radius: 50%;
  padding: 2px;
  box-shadow: 0 0 2px #ccc;
  z-index: 10;
}
.avatar-uploader {
  position: relative;
  width: 178px;
  height: 178px;
}
</style>