<template>
  <div>
    <el-form label-width="80px">
      <el-form-item label="SKU名称">{{ spu.spuName }}</el-form-item>
      <el-form-item label="SPU名称">
        <el-input v-model="skuInfo.skuName" placeholder="SPU的名称" />
      </el-form-item>

      <el-form-item label="价格(元)">
        <el-input v-model="skuInfo.price" placeholder="价格(元)" type="number" />
      </el-form-item>

      <el-form-item label="重量(千克)">
        <el-input v-model="skuInfo.weight" placeholder="重量(千克)" />
      </el-form-item>

      <el-form-item label="规格描述">
        <el-input v-model="skuInfo.skuDesc" type="textarea" placeholder="规格描述" rows="4" />
      </el-form-item>

      <el-form-item label="平台属性">
        <el-form :inline="true" label-width="80px">

          <el-form-item v-for="(attr,index) in attrInfoList" :key="attr.id" :label="attr.attrName">
            <el-select v-model="attr.attrIdAndValueId" placeholder="请选择">
              <el-option v-for="(attrValue,index) in attr.attrValueList" :key="attrValue.id" :label="attrValue.valueName" :value="`${attr.id}:${attrValue.id}`" />
            </el-select>
          </el-form-item>

        </el-form>
      </el-form-item>

      <el-form-item label="销售属性">
        <el-form :inline="true" label-width="80px">

          <el-form-item v-for="(saleAttr,index) in spuSaleAttrList" :key="saleAttr.id" :label="saleAttr.saleAttrName">
            <el-select v-model="saleAttr.attrIdAndValueId" placeholder="请选择">
              <el-option v-for="(saleAttrValue,index) in saleAttr.spuSaleAttrValueList" :key="saleAttrValue.id" :label="saleAttrValue.saleAttrValueName" :value="`${saleAttr.id}:${saleAttrValue.id}`" />
            </el-select>
          </el-form-item>

        </el-form>
      </el-form-item>

      <el-form-item label="图片列表">
        <el-table border :data="spuImageList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" label="" width="80" />
          <el-table-column label="图片">
            <template slot-scope="{row,$index}">
              <el-image :src="row.imgUrl" style="width: 100px;height: 100px;" />
            </template>
          </el-table-column>
          <el-table-column label="名称" prop="imgName" />
          <el-table-column label="操作" prop="porp">
            <template slot-scope="{row,$index}">
              <el-button v-if="row.isDefault === 0" type="primary" @click="changeDefault(row)">设置默认</el-button>
              <el-button v-else type="">默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item>
        <el-button type="" @click="save">保存</el-button>
        <el-button type="" @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 存储图片信息
      spuImageList: [],
      // 存储销售属性
      spuSaleAttrList: [],
      // 存储平台属性的数据
      attrInfoList: [],
      skuInfo: {
        // 第一类手机的数据：父组件给的
        category3Id: 0,
        spuId: 0,
        tmId: 0,
        // 第二类：需要通过数据双向绑定收集
        price: 0,
        skuName: '',
        weight: '',
        skuDesc: '',
        // 第三类：需要自己书写代码
        skuDefaultImg: '', // 默认图片
        // 收集图片的字段
        skuImageList: [
          {
            id: 0,
            imgName: 'string',
            imgUrl: 'string',
            isDefault: 'string',
            skuId: 0,
            spuImgId: 0
          }
        ],
        // 收集平台属性列表的
        skuAttrValueList: [
          {
            // attrId: 0,
            // attrName: 'string',
            // id: 0,
            // skuId: 0,
            // valueId: 0,
            // valueName: 'string'
          }
        ],
        // 收集销售属性
        skuSaleAttrValueList: [
          // {
          //   id: 0,
          //   saleAttrId: 0,
          //   saleAttrName: 'string',
          //   saleAttrValueId: 0,
          //   saleAttrValueName: 'string',
          //   skuId: 0,
          //   spuId: 0
          // }
        ]
      },
      spu: {},
      imageList: [] // 收集图片字段
    }
  },
  methods: {
    // 获取skmform数据
    async getData(category1Id, category2Id, spu) {
      this.skuInfo.category3Id = spu.category3Id
      this.skuInfo.spuId = spu.id
      this.skuInfo.tmId = spu.tmId
      this.spu = spu
      // console.log(row)
      // 获取图片数据
      const result = await this.$API.spu.reqSpuImageList(spu.id)
      if (result.code === 200) {
        result.data.forEach(item => {
          item.isDefault = 0
        })
        this.spuImageList = result.data
      }
      // 获取销售属性的数据
      const result1 = await this.$API.spu.reqSpuSaleAttrList(spu.id)
      if (result1.code === 200) this.spuSaleAttrList = result1.data
      // 获取平台属性的数据
      const result2 = await this.$API.spu.reqAttrInfoList(category1Id, category2Id, spu.category3Id)
      if (result2.code === 200) this.attrInfoList = result2.data
    },
    // table表格复选框事件
    handleSelectionChange(params) {
      // 获取到用户选中的图片信息数据。但是需要注意，当前收集的数据缺少isDefault字段
      this.imageList = params
    },
    // 排他操作
    changeDefault(row) {
      this.spuImageList.forEach(item =>{
        item.isDefault = 0
      })
      row.isDefault = 1
      this.skuInfo.skuDefaultImg = row.imgUrl
    },
    // 取消回调
    cancel() {
      this.$emit('changeScenes', 0)
      // 清除数据
      Object.assign(this._data, this.$options.data())
    },
    // 保存回调
    async save() {
      const { attrInfoList, skuInfo, spuSaleAttrList, imageList } = this
      // 处理平台属性数据
      skuInfo.skuAttrValueList = attrInfoList.reduce((prev, item) => {
        if (item.attrIdAndValueId) {
          const [attrId, ValueId] = item.attrIdAndValueId.split(':')
          prev.push({ attrId, ValueId })
          // console.log(prev,item)
        }
        return prev
      }, [])
      // 处理销售属性数据
      skuInfo.skuSaleAttrValueList = spuSaleAttrList.reduce((prev, item) => {
        if (item.attrIdAndValueId) {
          const [attrId, ValueId] = item.attrIdAndValueId.split(':')
          prev.push({ attrId, ValueId })
        }
        return prev
      }, [])
      // 处理图片列表数据
      skuInfo.skuImageList = imageList.map(item => {
        return {
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          isDefault: item.isDefault,
          spuImgId: item.id
        }
      })
      const result = await this.$API.spu.reqAddSku(skuInfo)
      if (result.code === 200) {
        this.$message({ type: 'success', message: '保存成功' })
        this.$emit('changeScenes', 0)
      }
    }
  }
}
</script>

<style>
</style>
