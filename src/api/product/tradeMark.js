// 这个模块主要获取的是品牌管理的数据模块
import request from '@/utils/request'
// 获取品牌列表接口
export const reqTradeMarkList = (page, limit) => request({ url: `/admin/product/baseTrademark/${page}/${limit}`, method: 'get' })

export const reqAddOrUpdateTradeMark = (tradeMark) => {
  if (tradeMark.id) {
    // 修改品牌的地址;
    return request({ url: '/admin/product/baseTrademark/update', method: 'put', data: tradeMark })
  } else {
    // 新增品牌
    return request({ url: '/admin/product/baseTrademark/save', method: 'post', data: tradeMark })
  }
}

export const reqDeleteTradeMark = (id) => request({ url: `/admin/product/baseTrademark/remove/${id}`, method: 'delete' })
