import CustomPage from '../../base/CustomPage'

CustomPage({
  data: {
    basicData: [{
        name: "新增商品",
        url: "addGoods",
        icon: "add",
        type: "field",
        color: "#f40"
      },
      {
        name: "商品维护",
        url: "goodsSetting",
        icon: "setting",
        type: "outline",
        color: "#f40"
      },
      {
        name: "新增活动",
        url: "addStar",
        icon: "star",
        type: "outline",
        color: "#f40"
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