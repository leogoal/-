const WXAPI = require('../../wxapi/main')
const CONFIG = require('../../config.js')
const app = getApp()

Page({
  data: {
    swiperCurrent: 0, //当前banner所在位置
    bannerList: [],
    shopSubList: [],
    goodsRecommend: [], // 推荐商品
  },

  onShow(){
    const _this = this
    WXAPI.banners().then(function (res) {
      if (res.code === 0) {
        _this.setData({
          bannerList: res.data
        })
      }
    })
    WXAPI.shopSubList().then(res => {
      if (res.code === 0) {
        _this.setData({
          shopSubList: res.data
        })
      }
    })
    WXAPI.goods({
      recommendStatus: 1
    }).then(res => {
      if (res.code === 0) {
        _this.setData({
          goodsRecommend: res.data
        })
      }
    })
  },

  swiperchange: function(e) { // banner滚动事件
    this.setData({
      swiperCurrent: e.detail.current
    })
  },

  toDetailsTap: function(e) {
    wx.navigateTo({
      url: "/pages/goods-details/index?id=" + e.currentTarget.dataset.id
    })
  },

  onLoad: function(e) {
    wx.setNavigationBarTitle({
      title: wx.getStorageSync('mallName')
    })
  },

  goMap(e){ // 打开地图
    const id = e.currentTarget.dataset.id
    const item = this.data.shopSubList.find(ele => {
      return ele.id == id
    })
    wx.openLocation({
      latitude: item.latitude,
      longitude: item.longitude,
      name: item.name,
      address: item.address
    })
  },
  
  callPhone(e){
    const tel = e.currentTarget.dataset.tel
    wx.makePhoneCall({
      phoneNumber: tel
    })
  }
})