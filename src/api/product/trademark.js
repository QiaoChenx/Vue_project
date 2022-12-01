import request from '@/utils/request'
export const reqBaseTrademark = (page, limit) => request({
    url: `/admin/product/baseTrademark/${page}/${limit}`,
    method: 'get'
})

export const reqSaveOrUpdateTrademark = (trademark) => {
    if (trademark.id) {
        return request({
            url: '/admin/product/baseTrademark/update',
            data: trademark,
            method: 'put'
        })
    } else {
        return request({
            url: '/admin/product/baseTrademark/save',
            data: trademark,
            method: 'post'
        })
    }
}

export const reqRemoveTrademark = (id) => request({
    url: `/admin/product/baseTrademark/remove/${id}`,
    method: 'delete'
})