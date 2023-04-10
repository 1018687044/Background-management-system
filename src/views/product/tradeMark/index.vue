<template>
  <div>
    <!-- 按钮 -->
    <el-button type="primary" icon="el-icon-plus" style="margin: 10px 0" @click="showDialog">添加</el-button>
    <!-- 表格组件
    data:表格组件展示的数据----数据类型array
    border：给表格添加边框
    column属性
    label：显示标题
    width：对应列的宽度
    align：对齐方式
    注意：el-table中的数据是一列一列展示的
   -->
    <el-table :data="list" style="width: 100%" border>
      <el-table-column prop="prop" type="index" label="序号" width="width" align="center" />
      <el-table-column prop="tmName" label="品牌名称" width="width" align="center" />
      <el-table-column prop="logoUrl" label="品牌logo" width="width" align="center">
        <template slot-scope="{ row, $index }">
          <img :src="row.logoUrl" style="width: 180px;height: 100px;">
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width" align="center">
        <template slot-scope="{ row, $index }">
          <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateTradeMark(row)">修改</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteTradeMark(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器
    current-page:当前页
    total：分页器一共需要展示多少条数据
    page-size：代表每页需要展示的数据条数
    page-sizes：代表可以色泽每一页展示展示多少条数据
    layout：设置分页器布局
    page-count：按钮的数量
    -->
    <el-pagination
      style="margin-top: 20px;text-align: center;"
      :total="total"
      :current-page="page"
      :page-size="limit"
      :page-sizes="[3, 5, 10]"
      :page-count="7"
      layout="prev, pager, next, jumper,->,sizes, total"
      @current-change="getPageList"
      @size-change="handleSizeChange"
    />
    <!--
      对话框
      :visible.sync:控制对话框显示与隐藏用的
      form组件提供了表单验证的功能，只需要通过 rules属性传入约定的规则，并将form-item的prop属性设置为需校验字段名即可
    -->
    <el-dialog :title="tmForm.id ? '修改品牌' : '添加品牌'" :visible.sync="dialogFormVisible">
      <!-- from表单 :model属性，这个属性的作用是，把表单的数据收集到那个对象身上，将来表单验证，也需要这个属性 -->
      <el-form ref="ruleForm" style="width:80%" :model="tmForm" :rules="rules">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input v-model="tmForm.tmName" autocomplete="off" />
        </el-form-item>

        <!-- 用户头像上传 -->
        <el-form-item label="品牌名称" label-width="100px" prop="logoUrl">
          <!-- 这里搜集数据不能用v-model 因为不是表单元素
          action:设置图片上传的地址
          -->
          <el-upload
            class="avatar-uploader"
            action="/api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件,且不超过500kb</div>
          </el-upload>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTradeMark">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: 'Trademark',
  data() {
    // 自定义校验规则
    var validateTmName = (rule, value, callback) => {
      // 自定义校验规则
      if (value.length < 2 || value.length > 10) {
        callback(new Error('品牌名称2-10位'))
      } else {
        callback()
      }
    }
    return {
      // 代表分页器第几页
      page: 1,
      // 当前页展示数据条数
      limit: 3,
      // 总共数据条数
      total: 0,
      // 列表展示的数据
      list: [],
      // 对话框显示与隐藏控制的属性
      dialogFormVisible: false,
      // 上传图片使用的属性
      tmForm: {
        tmName: '',
        logoUrl: '',
        id: ''
      },
      // 表单验证规则
      rules: {
        // 品牌名称的验证规则
        // required:必须要校验字段（前面的五角星有关系） message提示信息 trigger：用户行为设置（事件的设置：blur失去焦点、change发生变化 ）
        tmName: [
          { required: true, message: '请输入品牌名称', trigger: 'blur' },
          // 自定义规则
          { validator: validateTmName, trigger: 'change' }
        ],
        // 品牌的logo验证规则
        logoUrl: [
          { required: true, message: '请选择品牌图片' }
        ]
      }
    }
  },
  // 组件挂载完毕发请求
  mounted() {
    // 获取列表数据
    this.getPageList()
  },
  methods: {
    // 获取品牌列表
    async getPageList(pager = 1) {
      this.page = pager
      const { page, limit } = this
      const result = await this.$API.trademark.reqTradeMarkList(page, limit)
      if (result.code === 200) {
        // 展示数据的总条数
        this.total = result.data.total
        // 列表展示的数据
        this.list = result.data.records
      }
    },
    // 当分页器莫一页需要展示数据的条数发生变化时候会触发
    handleSizeChange(limit) {
      // 整理参数
      this.limit = limit
      this.getPageList()
    },
    // 点击添加品牌的按钮
    showDialog() {
      this.tmForm = { tmName: '', logoUrl: '' }
      this.dialogFormVisible = true
    },
    // 修改某一个品牌
    updateTradeMark(row) {
      // 显示对话框
      this.dialogFormVisible = true
      // row就是当前用户中的信息
      // 将已有的品牌信息赋值给tmFrom进行展示
      this.tmForm = { ...row }
    },
    // 图片上传成功
    handleAvatarSuccess(res, file) {
      // res：图片上传成功后返回的数据
      // file：上传成功之后服务器返回前端的数据
      this.tmForm.logoUrl = res.data
    },
    // 图片上传之前 判断你的图片是不是jpg大小有没有超过2m
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    // 添加按钮（添加品牌/修改品牌）
    addOrUpdateTradeMark() {
      // 当所有的字段验证通过后再执行
      this.$refs.ruleForm.validate(async(success) => {
        if (success) {
          this.dialogFormVisible = false
          // 发请求(添加品牌|修改品牌)
          const result = await this.$API.trademark.reqAddOrUpdateTradeMark(this.tmForm)
          if (result.code === 200) {
            // 弹出个信息
            this.$message({
              type: 'success',
              message: this.tmForm.id ? '修改品牌成功' : '添加品牌成功'
            })
            this.getPageList(this.tmForm.id ? this.page : 1)
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 删除品牌操作
    deleteTradeMark(row) {
    // 弹框
      this.$confirm(`你确定要删除${row.tmName}吗`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        // 用户点击确定按钮的时候触发
        // 向服务器发请求
        const result = await this.$API.trademark.reqDeleteTradeMark(row.id)
        if (result.code === 200) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getPageList(this.list.length > 1 ? this.page : this.page - 1)
        }
      }).catch(() => {
        // 用户点击取消按钮的时候触发
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}

</script>

<style>
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
</style>
