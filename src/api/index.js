// 将四个模块的请求的接口函数统一暴露
import * as trademark from './product/tradeMark'
import * as sku from './product/sku'
import * as attr from './product/attr'
import * as spu from './product/spu'
import permission from './acl/permission'
import * as user from './acl/user'
import role from './acl/role'
export default {
  trademark,
  sku,
  attr,
  spu,
  permission,
  user,
  role
}
