export const host = "http://192.168.0.106:8000"

function resultHanlder(resolve, reject) {
  return function handler(res) {
    let data = res.data
    if (data.result.code === "success") {
      resolve(data.result.data)
    } else {
      reject({
        type: "EAPI",
        code: data.result.code,
        error: data.result.error,
        message: data.result.message
      })
    }
  }
}

export function doGet(url, query) {
  return new Promise((res, rej) => {
    wx.request({
      url,
      dataType: "json",
      data: query,
      method: "GET",
      success: resultHanlder(res, rej),
      fail: () => rej("ENETWORK")
    })
  })
}

function postLike(url,method,data){
  return new Promise((res, rej) => {
    wx.request({
      url,
      datType: "json",
      header: {
        'content-type': 'application/json'
      },
      data,
      method,
      success: resultHanlder(res, rej),
      fail: () => rej("ENETWORK")
    })
  })
}

export function doPost(url, data) {
  return postLike(url,"POST",data)
}

export function doPut(url, data) {
  return postLike(url,"PUT",data)
}

export function doDelete(url,data){
  return postLike(url,"DELETE",data)
}

export function doPostWith(ulr, data, appId) {

}