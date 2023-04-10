<template>
  <div>
    <el-table border style="width: 100%" :data="records">
      <el-table-column type="index" label="序号" align="center" width="80" />
      <el-table-column label="名称" prop="skuName" />
      <el-table-column label="描述" prop="skuDesc" />
      <el-table-column label="默认图片" width="110" style="width: 80px;height: 80px;">
        <template slot-scope="{row,$index}">
          <el-image :src="row.skuDefaultImg" />
        </template>
      </el-table-column>
      <el-table-column label="重量(KG)" prop="weight" />
      <el-table-column label="价格(元)" width="80" prop="price" />
      <el-table-column label="操作">
        <template slot-scope="{row,$index}">
          <el-button v-if="row.isSale == 0" type="success" icon="el-icon-sort-down" size="mini" title="下架" @click="cancel(row)" />
          <el-button v-else type="success" icon="el-icon-sort-up" size="mini" title="上架" @click="sale(row)" />
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="$message('正在开发中')" />
          <el-button type="info" icon="el-icon-info" size="mini" @click="getSkuInfo(row)" />
          <el-button type="danger" icon="el-icon-delete" size="mini" />
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器      -->
    <el-pagination
      style="text-align: center"
      :total="total"
      :current-page="page"
      :page-sizes="[3, 5, 10]"
      :page-size="limit"
      layout="prev, pager, next, jumper, ->, sizes, total"
      @current-change="getSkuList"
      @size-change="handleSizeChange"
    />
    <!-- 抽屉 -->
    <el-drawer :visible.sync="show" :show-close="false" size="50%">
      <el-row>
        <el-col :span="5">名称</el-col>
        <el-col :span="16">{{ skuInfo.skuName }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">描述</el-col>
        <el-col :span="16">{{ skuInfo.skuDesc }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">价格</el-col>
        <el-col :span="16">{{ skuInfo.price }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">平台属性</el-col>
        <el-col :span="16">
          <template>
            <el-tag v-for="(attr,index) in skuInfo.skuAttrValueList" :key="attr.id" type="success">{{ attr.attrId }}-{{ attr.valueId }}</el-tag>
          </template>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">商品图片</el-col>
        <el-col :span="16">
          <el-carousel height="150px">
            <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.id">
              <img :src="item.imgUrl">
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: 'Sku',
  data() {
    return {
      page: 1, // 代表当前页
      limit: 5, // 代表当前页面有几条数据
      records: [], // 存储SKU列表数据
      total: 0, // 存储分页器一共展示的数据
      skuInfo: {}, // 存储sku信息
      show: false
    }
  },
  mounted() {
    this.getSkuList()
  },
  methods: {
    async getSkuList(pages = 1) {
      this.page = pages
      const { page, limit } = this
      const result = await this.$API.sku.reqSkuList(page, limit)
      if (result.code === 200) {
        this.total = result.data.total
        this.records = result.data.records
      }
    },
    handleSizeChange(limit) {
      this.limit = limit
      this.getSkuList()
    },
    // 上架
    async sale(row) {
      const result = await this.$API.sku.reqSale(row.id)
      if (result.code === 200) {
        row.isSale = 0
        this.$message({
          type: 'success',
          message: '上架成功'
        })
      }
    },
    // 下架
    async cancel(row) {
      const result = await this.$API.sku.reqCancel(row.id)
      if (result.code === 200) {
        row.isSale = 1
        this.$message({
          type: 'success',
          message: '下架成功'
        })
      }
    },
    async getSkuInfo(sku) {
      this.show = true
      const result = await this.$API.sku.reqSkuById(sku.id)
      if (result.code === 200) {
        this.skuInfo = result.data
      }
    }
  }
}
</script>

<style scoped>
 .el-row .el-col-5 {
  font-size: 18px;
  text-align: right;
 }
 .el-col {
  margin: 10px;
 }
 .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 150px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
     background-color: #99a9bf;
  }
  .el-carousel__item:nth-child(2n+1) {
     background-color: #d3dce6;
  }
  >>>.el-carousel__button{
    width: 10px;
    height: 10px;
    background: red;
    border-radius: 50%;
  }
</style>
