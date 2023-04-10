<template>
  <div>
    <el-form label-width="80px">
      <el-form-item label="SPU名称">
        <el-input v-model="spu.spuName" placeholder="SPU的名称" />
      </el-form-item>

      <el-form-item label="品牌">
        <el-select v-model="spu.tmId" placeholder="请选择品牌">
          <el-option v-for="(tm, index) in tradeMarkList" :key="tm.id" :label="tm.tmName" :value="tm.id" />
        </el-select>
      </el-form-item>

      <el-form-item label="SPU描述">
        <el-input v-model="spu.description" type="textarea" rows="4" placeholder="SPU描述" />
      </el-form-item>

      <el-form-item label="SPU图片">
        <!--
        上传图片  list-type:文件列表类型 on-preview:图片预览的时候会触发 on-remove：当删除图片时触发
        file-list:展示照片墙需要的数据（数组里面需要有name，url两个属性）
        on-preview：图片预览功能
        on-remove：删除图片时触发
        on-success:图片上传成功
        -->
        <el-upload
          action="/api/admin/product/fileUpload"
          list-type="picture-card"
          :file-list="spuImageList"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handlerSuccess"
        >
          <i class="el-icon-plus" />
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>

      <el-form-item label="销售属性">

        <el-select v-model="attrIdAndAttrName" :placeholder="`还有${unSelectSaleAttr.length}未选择`">
          <el-option v-for="(unselect, index) in unSelectSaleAttr" :key="unselect.id" :label="unselect.name" :value="`${unselect.id}:${unselect.name}`" />
        </el-select>
        <el-button type="primary" icon="el-icon-plus" :disabled="!attrIdAndAttrName" @click="addSaleAttr">添加销售属性</el-button>
        <!-- 展示的是当前SPU属于自己的销售属性 -->
        <el-table style="width: 100%" border :data="spu.spuSaleAttrList">
          <el-table-column type="index" label="序号" width="80px" align="center" />
          <el-table-column prop="saleAttrName" label="属性名" width="width" />
          <el-table-column prop="" label="属性值名称列表" width="width">
            <template slot-scope="{ row, $index }">
              <!--  " -->
              <!-- el-tag:用户展示已有属性值列表的数据的 -->
              <el-tag v-for="(tag, index) in row.spuSaleAttrValueList" :key="tag.id" closable :disable-transitions="false" @close="row.spuSaleAttrValueList.splice(index, 1)">
                {{ tag.saleAttrValueName }}
              </el-tag>
              <!-- 底下的解构可以当中咱们当年的span与input切换 -->
              <!--  @keyup.enter.native="handleInputConfirm"  -->
              <el-input v-if="row.inputVisible" ref="saveTagInput" v-model="row.inputValue" class="input-new-tag" size="small" @blur="handleInputConfirm(row)" />
              <!-- @click="showInput" -->
              <el-button v-else class="button-new-tag" size="small" @click="addSaleAttrValue(row)">添加</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="spu.spuSaleAttrList.splice($index, 1)" />
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item label="">
        <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
        <el-button type="" @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      attrIdAndAttrName: '',
      // 存储spu信息属性
      spu: {
        // 三级分类的id
        category3Id: 0,
        // 描述
        description: '',
        // 平台的ID
        tmId: undefined,
        // 手机spu图片的信息
        spuImageList: [
        //   {
        //     id: 0,
        //     imgName: 'string',
        //     imgUrl: 'string',
        //     spuId: 0
        //   }
        ],
        // spu名称
        spuName: '',
        // 平台属性与属性值
        spuSaleAttrList: [
          // {
          // baseSaleAttrId: 0,
          // id: 0,
          // saleAttrName: '',
          // spuId: 0,
          // spuSaleAttrValueList: [
          //   {
          //     baseSaleAttrId: 0,
          //     id: 0,
          //     isChecked: '',
          //     saleAttrName: '',
          //     saleAttrValueName: '',
          //     spuId: 0
          //   }
          // ]
          // }
        ]
      },
      tradeMarkList: [], // 存储品牌信息
      spuImageList: [], // 存储spu图片的数据
      saleAttrList: [] // 销售属性列表
    }
  },
  computed: {
    // 平台的销售属性一共有三个 ：颜色 尺寸 版本 ---saleAttrlist
    unSelectSaleAttr() {
      return this.saleAttrList.filter((item) => {
        return this.spu.spuSaleAttrList.every(item1 => {
          return item.name !== item1.saleAttrName
        })
      })
    }
  },
  methods: {
    // 照片墙删除图片时触发
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    // 图片预览回调
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 照片墙上传成功的回调
    handlerSuccess(response, file, fileList) {
      this.spuImageList = fileList
    },
    async initSpuData(spu) {
    //  获取spu信息数据
      const spuResult = await this.$API.spu.reqSpu(spu.id)
      if (spuResult.code === 200) this.spu = spuResult.data
      // 获取品牌信息
      const tradeMarkResult = await this.$API.spu.reqTradeMarkList()
      if (tradeMarkResult.code === 200) this.tradeMarkList = tradeMarkResult.data
      // 获取spu图片的数据
      const spuImageResult = await this.$API.spu.reqSpuImageList(spu.id)
      if (spuImageResult.code === 200) {
        const listArr = spuImageResult.data
        listArr.forEach((item) => {
          item.name = item.imgName
          item.url = item.imgUrl
        })
        this.spuImageList = listArr
      }
      // 获取平台销售属性
      const saleResult = await this.$API.spu.reqBaseSaleAttrList()
      if (saleResult.code === 200) this.saleAttrList = saleResult.data
    },
    // 添加按钮的回调
    addSaleAttrValue(row) {
      this.$set(row, 'inputVisible', true)
      this.$set(row, 'inputValue', '')
      // this.$nextTick(_ => {
      //   this.$refs.saveTagInput.$refs.input.focus()
      // })
    },
    // el-input失去焦点的事件
    handleInputConfirm(row) {
      // 结构出销售属性中收集的数据
      const { baseSaleAttrId, inputValue } = row
      if (inputValue.trim() === '') {
        this.$message({ type: 'warning', message: '属性值不能为空' })
        return
      }
      const result = row.spuSaleAttrValueList.every((item) => {
        return item.saleAttrValueName !== inputValue
      })
      if (!result) {
        this.$message({
          type: 'warning',
          message: '属性值重复了'
        })
        return
      }
      const newSaleAttrValue = { baseSaleAttrId, saleAttrValueName: inputValue }
      row.spuSaleAttrValueList.push(newSaleAttrValue)
      row.inputVisible = false
    },
    // 添加新的销售属性
    addSaleAttr() {
      const [baseSaleAttrId, saleAttrName] = this.attrIdAndAttrName.split(':')
      // 向spuSaleAttrlist属性里面添加新的销售属性
      const newSaleAttr = { baseSaleAttrId, saleAttrName, spuSaleAttrValueList: [] }
      this.spu.spuSaleAttrList.push(newSaleAttr)
      this.attrIdAndAttrName = ''
    },
    // 保存按钮的回调
    async addOrUpdateSpu() {
      // 整理参数:整理照片墙数据
      // 携带参数：携带照片墙的imgUrl和imgName
      this.spu.spuImageList = this.spuImageList.map(item => {
        return {
          imgName: item.name,
          imgUrl: item.response ? item.response.data : item.url
        }
      })
      const result = await this.$API.spu.reqAddOrUpdateSpu(this.spu)
      if (result) this.$message({ type: 'success', message: '保存成功' })
      this.$emit('changeScene', { scene: 0, flag: this.spu.id ? '修改' : '添加' })
      Object.assign(this._data, this.$options.data())
    },
    // 点击添加spu按钮时候的事件回调
    async addSpuData(category3Id) {
      // 添加spu的时候手机三级分类id
      this.spu.category3Id = category3Id
      // 获取品牌信息
      const tradeMarkResult = await this.$API.spu.reqTradeMarkList()
      if (tradeMarkResult.code === 200) this.tradeMarkList = tradeMarkResult.data
      // 获取平台销售属性
      const saleResult = await this.$API.spu.reqBaseSaleAttrList()
      if (saleResult.code === 200) this.saleAttrList = saleResult.data
    },
    // 取消按钮
    cancel() {
      this.$emit('changeScene', { scene: 0, flag: '' })
      // es6中新增方法 Object.assign合并对象 this._data组件实例可以操作data中的响应式数据，this.$options可以获取配置对象
      Object.assign(this._data, this.$options.data())
    }
  }
}
</script>

<style>
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>
