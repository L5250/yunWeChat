Page({
  data: {
    basicData: [
      {
        name: "新增商品",
        url: "addGoods",
        imgUrl: "/images/svg/plus-square.svg"
      },
      {
        name: "新增商品",
        url: "addGoods",
        imgUrl: "/images/svg/plus-square.svg"
      },
      {
        name: "新增商品",
        url: "addGoods",
        imgUrl: "/images/svg/plus-square.svg"
      },
      {
        name: "新增商品",
        url: "addGoods",
        imgUrl: "/images/svg/plus-square.svg"
      },
      {
        name: "新增商品",
        url: "addGoods",
        imgUrl: "/images/svg/plus-square.svg"
      }
    ]
  },

  onLoad: (props) => {
    console.log(props)
    console.log(111)
  },

  addGoods: (e) => {
    console.log(e)
    let query = e.currentTarget.dataset['url']
    console.log(query)
    wx.navigateTo({
      url: `/pages/${query}/${query}`,
    })
  }
})