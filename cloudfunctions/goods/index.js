// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: "remax-yun-8gfmfl7b4ebb2253"
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
    case ("getGoodsById"): {
      return getGoodsById(event)
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
    const promise = goods.skip(i * MAX_LIMIT).limit(MAX_LIMIT).orderBy('createDate', 'desc').get()
    tasks.push(promise)
  }
  // 等待所有
  return (await Promise.all(tasks)).reduce((acc, cur) => {
    return {
      data: acc.data.concat(cur.data),
      message: acc.errMsg,
    }
  })
}

//获取单条明细数据
async function getGoodsById(event) {
  const promise = goods.doc(event.id).get()
  console.log(promise);
  return (await promise
    .then(res => {
      return {
        data: res.data
      }
    })
    .catch(err => {
      return {
        data: [],
        message: "获取商品明细失败！"
      }
    }))

  // return await new Promise(() => {
  //   goods.doc(event.id).get().then(r => {
  //     res({
  //       data: r.data
  //     })
  //   })
  // })
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