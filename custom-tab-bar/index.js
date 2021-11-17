Component({
	data: {
		selected: -1,
		color: "#272727",
		// selectedColor: "#F73737",
		selectedColor: "#46B28B",
		list: [{
				"pagePath": "/pages/tabbar/ican",
				"iconPath": "/static/image/icon_energy_tabbar_home.png",
				"selectedIconPath": "/static/image/icon_energy_tabbar_home_selected.png",
				"text": "首页"
			}, {
				"pagePath": "/pages/tabbar/contacts",
				"iconPath": "/static/image/icon_energy_tabbar_serve.png",
				"selectedIconPath": "/static/image/icon_energy_tabbar_serve_selected.png",
				"text": "服务"
			},
			{
				"pagePath": "/pages/tabbar/square",
				"iconPath": "/static/image/icon_energy_tabbar_hall.png",
				"selectedIconPath": "/static/image/icon_energy_tabbar_hall_selected.png",
				"text": "需求大厅"
			},
			{
				"pagePath": "/pages/tabbar/find",
				"iconPath": "/static/image/icon_energy_tabbar_circle.png",
				"selectedIconPath": "/static/image/icon_energy_tabbar_circle_selected.png",
				"text": "圈子"
			},
			{
				"pagePath": "/pages/tabbar/my",
				"iconPath": "/static/image/icon_energy_tabbar_my.png",
				"selectedIconPath": "/static/image/icon_energy_tabbar_my_selected.png",
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
