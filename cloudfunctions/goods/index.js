// 云函数入口文件
const cloud = require('wx-server-sdk')
const fs = require('fs')
const path = require('path')
cloud.init({
  env: 'remax-yun-8gfmfl7b4ebb2253',
})

const wxContext = cloud.getWXContext()
const db = cloud.database()
const goods = db.collection('goods')
//云函数最大取数100，超过100分批取
const MAX_LIMIT = 100
// 云函数入口函数
exports.main = async (event, context) => {

  switch (event.action) {
    case ("getData"): {
      return getGoods(event)
    }
    case ("add"): {
      return addGoods(event)
    }
    case ("edit"): {
      return editGoods(event)
    }
    case ("delete"): {
      return deleteGoods(event)
    }
    default: {
      return
    }
  }
}
//获取数据
async function getGoods(event) {
  // 先取出集合记录总数
  const countResult = await goods.count()
  const total = countResult.total
  // 计算需分几次取
  const batchTimes = Math.ceil(total / 100)
  // 承载所有读操作的 promise 的数组
  const tasks = []
  for (let i = 0; i < batchTimes; i++) {
    const promise = goods.skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
    tasks.push(promise)
  }
  // 等待所有
  return (await Promise.all(tasks)).reduce((acc, cur) => {
    return {
      data: acc.data.concat(cur.data),
      errMsg: acc.errMsg,
    }
  })
}
//新增
async function addGoods(event) {
  goods.add({
    data: {
      name: event.name,
      doc: event.doc,
      price: event.price,
      amount: event.amount,
      fileList: event.fileList,
      createDate: db.serverDate(),
      editDate: db.serverDate(),
    }
  })

}

//编辑
async function editGoods(event) {
  goods.doc(event.id).update({
    data: {
      name: event.name,
      price: event.price,
      amount: event.amount,
      editDate: db.serverDate(),
    }
  }).then(res => {
    return {
      data: res.data || [],
      state: true,
      message: "编辑成功！"
    }
  })
}

//删除
async function deleteGoods(event) {
  goods.doc(event.id).remove()
    .then(res => {
      return {
        state: true,
        message: "删除成功！"
      }
    })
}