Component({
	data: {
		selected: -1,
		color: "#272727",
		selectedColor: "#F73737",
		list: [{
				"pagePath": "/pages/tabbar/ican",
				"iconPath": "/static/image/ic_main_main_normal.png",
				"selectedIconPath": "/static/image/ic_main_main_focus.png",
				"text": "首页"
			}, {
				"pagePath": "/pages/tabbar/contacts",
				"iconPath": "/static/image/icon_main_find_normal.png",
				"selectedIconPath": "/static/image/icon_main_find_focus.png",
				"text": "服务"
			},
			{
				"pagePath": "/pages/tabbar/square",
				"iconPath": "/static/image/ic_main_square_normal.png",
				"selectedIconPath": "/static/image/ic_main_square_focus.png",
				"text": "需求大厅"
			},
			{
				"pagePath": "/pages/tabbar/find",
				"iconPath": "/static/image/ic_main_so_normal.png",
				"selectedIconPath": "/static/image/ic_main_so_focus.png",
				"text": "圈子"
			},
			{
				"pagePath": "/pages/tabbar/my",
				"iconPath": "/static/image/ic_main_mine_normal.png",
				"selectedIconPath": "/static/image/ic_main_mine_focus.png",
				"text": "我的"
			}
		]
	},
	attached() {},
	methods: {
		switchTab(e) {
			const data = e.currentTarget.dataset
			// console.log(data.index)
			const url = data.path
			wx.switchTab({
				url
			})
			// 这里注释掉
			// this.setData({
			//   selected: data.index,
			// })
		}
	}
	
})
