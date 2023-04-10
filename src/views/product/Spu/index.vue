<template>
  <div>
    <el-card style="margin: 20px 0;">
      <!-- 三级联动组件 -->
      <CategorySelect :show="scene!=0" @getcategoryid="getCategoryId" />
    </el-card>
    <el-card>
      <!-- 底部这里有三部分进行切换 -->
      <div v-show="scene == 0">
        <!-- 展示spu列表的结构 -->
        <el-button type="primary" icon="el-icon-plus" :disabled="!category3Id" @click="addSpu">添加spu</el-button>
        <el-table border style="width: 100%" :data="records">
          <el-table-column type="index" label="序号" align="center" width="80" />
          <el-table-column label="spu名称" prop="spuName" />
          <el-table-column label="spu描述" prop="description" />
          <el-table-column label="spu操作">
            <template slot-scope="{row,$index}">
              <HintButton type="success" icon="el-icon-plus" size="mini" title="添加Sku" @click="addSku(row)" />
              <HintButton type="warning" icon="el-icon-edit" size="mini" title="修改Spu" @click="updateSpu(row)" />
              <HintButton type="info" icon="el-icon-info" size="mini" title="查看当前Spu全部Sku列表" @click="handler(row)" />
              <el-popconfirm title="这是一段内容确定删除吗？" @onConfirm="deleteSpu(row)">
                <HintButton slot="reference" type="danger" icon="el-icon-delete" size="mini" title="删除Spu" />
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          style="text-align: center"
          :total="total"
          :current-page="page"
          :page-size="limit"
          :page-sizes="[3,5,10]"
          layout="prev, pager, next, jumper, ->, sizes, total"
          @current-change="getSpuList"
          @size-change="handleSizeChange"
        />
      </div>
      <SpuForm v-show="scene == 1" ref="spu" @changeScene="changeScene" />
      <SkuForm v-show="scene == 2" ref="sku" @changeScenes="changeScenes" />

      <el-dialog :title="`${spu.spuName}的列表`" :visible.sync="dialogTableVisible" :before-close="close">
        <el-table v-loading="loading" :data="skuList" border style="width: 100%;">
          <el-table-column label="名称" prop="skuName" />
          <el-table-column label="价格" prop="price" />
          <el-table-column label="重量" prop="weight" />
          <el-table-column label="默认图片">
            <template slot-scope="{ row, $index }">
              <el-image :src="row.skuDefaultImg" style="width: 100px;height: 100px;" />
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import SpuForm from './SpuForm'
import SkuForm from './SkuForm'
import { done } from 'nprogress'
export default {
  name: 'Spu',
  components: {
    SkuForm,
    SpuForm
  },
  data() {
    return {
      // 三级联动各级id
      category1Id: '',
      category2Id: '',
      category3Id: '',
      // 控制三级联动的可操作性
      show: true,
      page: 1, // 分页器当前在第几页
      limit: 3, // 每一页需要展示多少条数据
      records: [], // spu列表数据
      total: 0, // 分页器一共需要展示数据的条数
      scene: 0, // 0代表展示spu列表 1添加|修改spu 2添加sku
      dialogTableVisible: false, // 控制对话框的显示与隐藏
      spu: {},
      skuList: [], // 存储的是sku列表的数据
      loading: true
    }
  },
  methods: {
    // 三级联动的自定义事件，可以把子组件的响应id传给父组件
    getCategoryId({ categoryId, level }) {
      if (level === 1) {
        this.category1Id = categoryId
        this.category2Id = ''
        this.category3Id = ''
      } else if (level === 2) {
        this.category2Id = categoryId
        this.category3Id = ''
      } else if (level === 3) {
        this.category3Id = categoryId
        // 获取spu列表数据进行展示
        this.getSpuList()
      }
    },
    // 获取spu列表数据的方法
    async getSpuList(pages = 1) {
      this.page = pages
      const { page, limit, category3Id } = this
      const result = await this.$API.spu.reqSpuList(page, limit, category3Id)
      if (result.code === 200) {
        this.total = result.data.total
        this.records = result.data.records
      }
    },
    // 当分页器的某一个条数的发生变化的回调
    handleSizeChange(limit) {
      this.limit = limit
      this.getSpuList()
    },
    // 添加spu按钮的回调
    addSpu() {
      this.scene = 1
      this.$refs.spu.addSpuData(this.category3Id)
    },
    // 修改某一个spu
    updateSpu(row) {
      this.scene = 1
      // 获取子组件的SpuForm
      this.$refs.spu.initSpuData(row)
    },
    // spuform自定义事件回调
    changeScene({ scene, flag }) {
      this.scene = scene
      if (flag === '添加') {
        this.getSpuList(this.page)
      } else {
        this.getSpuList()
      }
    },
    // 删除spu的操作
    async deleteSpu(row) {
      const result = await this.$API.spu.reqDeleteSpu(row.id)
      if (result.code === 200) {
        this.$message({ type: 'success', message: '删除成功' })
      }
      this.getSpuList(this.records.length > 1 ? this.page : this.page - 1)
    },
    // 添加sku按钮的回调
    addSku(row) {
      this.scene = 2
      // 父组件调用子组件的方法
      this.$refs.sku.getData(this.category1Id, this.category2Id, row)
    },
    // SkuForm通知子组件修改场景
    changeScenes(scene) {
      this.scene = scene
    },
    // 查看sku列表的的数据
    async handler(spu) {
      this.dialogTableVisible = true
      this.spu = spu
      const result = await this.$API.spu.reqSkuList(spu.id)
      if (result.code === 200) this.skuList = result.data
      this.loading = false
    },
    // 关闭对话框的回调
    close(done) {
      this.loading = true
      this.skuList = []
      done()
    }
  }
}
</script>

<style>
</style>
