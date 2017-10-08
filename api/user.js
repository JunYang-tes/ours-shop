import {
    host,
    doGet,
    doPost,
    doDelete,
    doPut
} from "./index"

export function login(code, userInfo) {
    return doPost(`${host}/rest/user/wechat`, {
        code,
        userInfo
    })
}
export function getUserInfo(id) {
    return doGet(`${host}/rest/user/?id=${id}`)
}
export function updateUserAddress(id, address) {
    return doPut(`${host}/rest/user/${id}`, {
        address

    })
}
export function getShoppingCart(userId){
    return doGet(`${host}/rest/cart?userId=${userId}`)
}
export function deleteItemInCart(userId,itemId){
    return doDelete(`${host}/rest/cart`,{
        userId,
        itemId
    })
}
export function addToCart(userId,itemId,count=1){
    return doPut(`${host}/rest/cart`,{
        userId,
        itemId,
        count
    })
}
/**
 * 
 * @param {[{itemId:String,count:Number}]} items 
 */
export function makeOrder(userId,items){
    return doPost(`${host}/rest/order`,{
        userId,
        items
    })
}

export function getOrders(userId,type){
    return doGet(`${host}/rest/order?userId=${userId}&type=${type}`)
}

export function cancelOrder(orderId){
    return doDelete(`${host}/rest/order?orderId=${orderId}`)
}