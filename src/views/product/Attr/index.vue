<template>
  <div>
    <el-card style="margin: 20px 0;">
      <CategorySelect :show="!isShowTable" @getcategoryid="getCategoryId" />
    </el-card>
    <el-card>
      <div v-show="isShowTable">
        <el-button type="primary" icon="el-icon-plus" :disabled="!category3Id" @click="addAttr">添加属性</el-button>
        <!-- 表格：展示平台属性 -->
        <el-table :data="attrList" style="width: 100%;" border>
          <el-table-column type="index" label="序号" width="80" align="center" />
          <el-table-column label="属性名称" width="150" align="center" prop="attrName" />
          <el-table-column label="属性值列表" width="width">
            <template slot-scope="{row,$index}">
              <el-tag v-for="(attrValue,index) in row.attrValueList" :key="attrValue.id" type="success" style="margin: 0 10px">
                {{ attrValue.valueName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150" align="center">
            <template slot-scope="{row,$index}">
              <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateAttr(row)" />
              <el-button type="danger" icon="el-icon-delete" size="mini" />
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 添加属性|修改属性的结果 -->
      <div v-show="!isShowTable">
        <el-form ref="form" :inline="true" label-width="80px" :model="attrInfo">
          <el-form-item label="属性名">
            <el-input v-model="attrInfo.attrName" placeholder="请输入属性名" />
          </el-form-item>
        </el-form>
        <el-button type="primary" icon="el-icon-plus" :disabled="!attrInfo.attrName" @click="addAttrValue">添加属性值</el-button>
        <el-button @click="isShowTable=true">取消</el-button>
        <el-table border style="margin: 20px 0;" :data="attrInfo.attrValueList">
          <el-table-column label="序号" type="index" align="center" />
          <el-table-column label="属性值名称">
            <template slot-scope="{row, $index}">
              <!-- 这里的结构需要用到span和input来回切换 -->
              <el-input v-if="row.flag" :ref="$index" v-model="row.valueName" placeholder="请输入属性值名称" size="mini" @blur="toLook(row)" @keyup.native.enter="toLook(row)" />
              <span v-else style="display: block;" @click="toEdit(row,$index)">{{ row.valueName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{row, $index}">
              <!-- 气泡确认框 -->
              <el-popconfirm :title="`确定删除${row.valueName}`" @onConfirm="deleteAttrValue($index)">
                <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini" />
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" :disabled="attrInfo.attrValueList.length <1" @click="addOrupdateAttr">保存</el-button>
        <el-button @click="isShowTable=true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
// 按需引入lodash当中的的深拷贝
import cloneDeep from 'lodash/cloneDeep'
export default {
  name: 'Arrt',
  data() {
    return {
      category1Id: '',
      category2Id: '',
      category3Id: '',
      // 接收平台属性字段
      attrList: [],
      // 这个属性是控制table的显示与隐藏的
      isShowTable: true,
      // 用于（收集/修改）新增属性
      attrInfo: {
        attrName: '', // 属性名
        attrValueList: [ // 属性名中的属性值，因为个属性所以用数组
        ],
        categoryId: 0, // category3Id
        categoryLevel: 0 // 区分几级id
      }
    }
  },
  methods: {
    // 自定义事件的回调
    getCategoryId({ categoryId, level }) {
      if (level === 1) {
        // 区分三级分类响应的id，以及父组件进行存储
        this.category1Id = categoryId
        this.category2Id = ''
        this.category3Id = ''
      } else if (level === 2) {
        this.category2Id = categoryId
        this.category3Id = ''
      } else if (level === 3) {
        // 代表三级分类的id有了
        this.category3Id = categoryId
        // 发送请求获取品牌属性
        this.getAttrList()
      }
    },
    // 获取平台属性的数据
    // 当用户确定三级分类的数据的时候可以向服务器发请求获取平台属性进行展示
    async getAttrList() {
      const { category1Id, category2Id, category3Id } = this
      const result = await this.$API.attr.reqAttrList(category1Id, category2Id, category3Id)
      if (result.code === 200) {
        this.attrList = result.data
      }
    },
    // 添加属性值的回调
    addAttrValue() {
      this.attrInfo.attrValueList.push({
        attrId: this.attrInfo.id, // 属性名的id
        valueName: '', // 属性值
        flag: true
      })
      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus()
      })
    },
    // 添加属性按钮回调
    addAttr() {
      // 隐藏table
      this.isShowTable = false
      // 清空attrInfo
      this.attrInfo = {
        attrName: '', // 属性名
        attrValueList: [], // 属性名中的属性值，因为个属性所以用数组
        categoryId: this.category3Id, // category3Id
        categoryLevel: 0 // 区分几级id
      }
    },
    // 修改某一个属性
    updateAttr(row) {
      this.isShowTable = false
      this.attrInfo = cloneDeep(row)
      this.attrInfo.attrValueList.forEach((item) => {
        this.$set(item, 'flag', false)
      })
    },
    // 失去焦点的事件---切换查看魔王展示span
    toLook(row) {
      if (row.valueName.trim() === '') {
        this.$message({ type: 'warning', message: '请你输入一个正常的属性值' })
        return
      }
      const isRepat = this.attrInfo.attrValueList.some(element => {
        if (element !== row) {
          return element.valueName === row.valueName
        }
      })
      if (isRepat) {
        this.$message({ type: 'warning', message: '你输入的值已存在' })
        return
      }
      row.flag = false
    },
    // 点击span标签变为编辑模式
    toEdit(row, index) {
      row.flag = true
      this.$nextTick(() => {
        this.$refs[index].focus()
      })
    },
    // 气泡确认框的确认事件回调
    deleteAttrValue(index) {
      this.attrInfo.attrValueList.splice(index, 1)
    },
    // 保存按钮进行添加属性或者修改属性的操作
    async addOrupdateAttr() {
      // 过滤掉属性值不是空的
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter((item) => {
        if (item.valueName !== '') {
          delete item.flag
          return true
        }
      })
      try {
        await this.$API.attr.reqAddOrupdateAttr(this.attrInfo)
        this.isShowTable = true
        this.$message({ type: 'success', message: '保存成功 ' })
        // 保存成功后需要再次获取平台属性进行展示
        this.getAttrList()
      } catch (error) {
        this.$message({ type: 'error', message: '没有权限' })
      }
    }
  }
}
</script>

<style>
</style>
