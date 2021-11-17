<template>
	<view class="container">
		<view class="flexRowStart search" id="search">
			<image class="searchImg" v-if="oss" :src="oss + 'icon_search_gray.png'"></image>
			<input maxlength="500" placeholder="搜索" placeholder-class="inputDefault" @input="search" v-model="searchText"></input>
		</view>
		<view class="" :style="{height:swiperHeight + 'px'}" style="position: relative">
			<uni-indexed-list :options="showList" :status="true" />
			<image class="emptyImg" v-if="!showList.length>0 && oss" :src="oss+'pic_energy_default_wuso.png'" mode="aspectFit"></image>
		</view>
		<view class="addImg" @tap="addThoughts">
			<image class="img" v-if="oss" :src="oss+'icon_energy_hall_fabu_green.png'"></image>
		</view>
	</view>
</template>

<script>
	import {
		isEmpty,
		soImageError
	} from '@/common/utils.js';
	import uniIndexedList from '@/components/uni-indexed-list/uni-indexed-list.vue';
	export default {
		components: {
			uniIndexedList
		},
		data() {
			return {
				oss: '',
				soList: [],
				showList: [],
				searchText: '',
				swiperHeight: ''
			};
		},
		methods: {
			search() {
				this.showList = [];
				this.soList.forEach(res => {
					let item = [];
					item = res.dataList.filter(item => item.name.indexOf(this.searchText) > -1);
					if (item.length > 0) this.showList.push({
						dataList: item,
						letter: res.letter
					});
				});
			},
			addThoughts(){
				uni.navigateTo({
					url:'/pages/find/addSo/addSo'
				})
			}
		},
		onLoad() {
			this.saveToken = uni.getStorageSync('token')
			this.oss = this.$oss;
			this.searchText = ''
			let pinyin = require('js-pinyin');
			let that = this;
			let soList = [];
			that.soList = [];
			let firstList = [];
			if (!isEmpty(uni.getStorageSync('token'))) {
				that.$http.get('admin/app/user/had/list').then(res => {
					let data = res.data.data;
					data.forEach(item => {
						//遍历数组,拿到名称
						let name = item.name;
						//取全部数据的首字母
						let fristName = pinyin.getCamelChars(name).substring(0, 1).toUpperCase();
						if (fristName < 'A' || fristName > 'Z') {
							fristName = '#';
						}
						//给原json添加首字母键值对
						item.letter = fristName;
						//放入新数组
						soList.push(item);
						firstList.push(fristName);
						// console.log(soList)
					});
					firstList.sort();
					for (var i = 0; i < firstList.length; i++) {
						if (firstList[i] == firstList[i + 1]) {
							firstList.splice(i, 1);
							i--;
						}
					}
					//根据首字母键值对给原数据按首字母分类
					firstList.forEach(item => {
						let dataList = [];
						soList.forEach((item2, index) => {
							if (item == item2.letter) {
								//手动排除图片出错
								item2.avatar = soImageError(item2.avatar, this.oss)
								dataList.push(item2);
								//从待选数组中删除 提高效率
								// soList.splice(index, 1);
							}
						});
						that.soList.push({
							letter: item,
							dataList: dataList
						});
					});
					that.showList = that.soList;
					// console.log(this.showList)
				});
			}
			uni.createSelectorQuery()
				.in(this)
				.select('#search')
				.boundingClientRect()
				.exec(ret => {
					// console.log(ret)
					let height = uni.getSystemInfoSync().windowHeight;
					// console.log(height)
					// console.log(height)
					this.swiperHeight = height - ret[0].height - 45
				});
		},

	};
</script>

<style lang="scss">
	.addImg {
		position: fixed;
		bottom: 170rpx;
		right: 6rpx;
	
		.img {
			height: 136rpx;
			width: 136rpx;
		}
	}
	.container {
		padding: 0 32rpx;
		.search {
			// margin-bottom: 40rpx;
			margin: 16rpx 0;
			padding: 18rpx 32rpx;
			border-radius: 60rpx;
			background-color: #F5f7f8;

			.searchImg {
				height: 32rpx;
				width: 32rpx;
			}
		}

		.title {
			margin-bottom: 38rpx;

			.friendImg {
				width: 72rpx;
				height: 72rpx;
			}

			.friend {
				flex: 1;
				font-size: 28rpx;
				padding-left: 20rpx;
			}

			.rightImg {
				width: 44rpx;
				height: 44rpx;
				margin-right: -16rpx;
			}
		}

		.line {
			height: 0.3rpx;
			width: 670rpx;
			border-radius: 20rpx;
			background-color: #EFF0F1;
			margin-bottom: 30rpx;
		}

		.content {
			.allSo {
				line-height: 30rpx;
				font-size: 32rpx;
			}
		}
	}

	.inputDefault {
		font-size: 28rpx;
		color: #919397;
	}

	input {
		flex: 1;
		font-size: 28rpx;
		padding: 0 14rpx;
		color: #666769;
	}
</style>
