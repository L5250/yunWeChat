const app = getApp()
Page({
  data: {
    goodsData: [],
  },
  onLoad: function () {
    let data = []
    for (let i = 0; i < 100; i++) {
      data.push({
        id: i,
        name: i % 2 == 1 ? "namenamenamenamenamenamenamenamenamenamenamenamenamenamenamenamenamename:" + i : i,
        price: i * Math.floor(Math.random() * 10),
        amount: i * Math.floor(Math.random() * 10),
      })
    }
    console.log(data);
    this.setData({
      goodsData: data
    })

    // 获取数据
    // wx.cloud.callFunction({
    //   name: "goods",
    //   data: {
    //     action: "getData"
    //   }
    // }).then(res => {
    //   console.log(res);
    //   this.setData({
    //     goodsData: res.result.data
    //   })
    // }).catch(err => {
    //   console.log(err);
    // })
  },

  goDetail: (e) => {
    console.log(e);
    wx.navigateTo({
      url: `../detail/detail?id=${e.currentTarget.dataset["id"]}`
    })
  }
})