<template>
	<view class="container">
		<view class="" id="search">
			<view class="flexRowStart search">
				<image class="searchImg" v-if="oss" :src="oss + 'icon_search_gray.png'"></image>
				<input maxlength="500" placeholder="搜索" placeholder-class="inputDefault" @input="search" v-model="searchText"></input>
			</view>
		</view>
		<scroll-view scroll-y="true" :style="{height:`${swiperHeight}px`}" v-if="type==2">
			<view class="">
				<uni-indexed-list :options="showFriendList" :transfer="true" :role="role" :senderId="senderId"/>
				<image class="emptyImg" v-if="!showFriendList.length>0 && oss" :src="oss+'pic_noFriend.png'" mode="aspectFit"></image>
			</view>
		</scroll-view>
		<scroll-view scroll-y="true" :style="{height:`${swiperHeight}px`}"  v-if="type==1">
			<view>
				<uni-indexed-list :options="showList" :transfer="true" :role="role" :senderId="senderId"/>
				<image class="emptyImg" v-if="!showList.length>0 && oss" :src="oss+'pic_noSo.png'" mode="aspectFit"></image>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import {
		isEmpty,
		soImageError,
		imageError
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
				friendList: [],
				showFriendList: [],
				searchText: '',
				item_id: 0,
				swiperHeight: '',
				type: '',
				password:'',
				role:'',
				senderId:''
			};
		},
		onShow() {
			this.password = uni.getStorageSync('user').safePassword
		},
		methods: {
			search() {
				if (this.type == 1) {
					this.showList = [];
					this.soList.forEach(res => {
						let item = [];
						item = res.dataList.filter(item => item.name.indexOf(this.searchText) > -1);
						if (item.length > 0) this.showList.push({
							dataList: item,
							letter: res.letter
						});
					});
				} else if (this.type == 2) {
					this.showFriendList = [];
					this.friendList.forEach(res => {
						let item = [];
						item = res.dataList.filter(item => item.realName.indexOf(this.searchText) > -1);
						if (item.length > 0) this.showFriendList.push({
							dataList: item,
							letter: res.letter
						});
					});
				}
			}
		},
		onLoad(options) {
			this.type = options.type
			this.role= options.role
			this.senderId =options.senderId
			this.oss = this.$oss;
			this.searchText = ''
			let pinyin = require('js-pinyin');
			let that = this;
			if (this.type == 1) {
				uni.setNavigationBarTitle({
					title: "组织列表"
				})
				let soList = [];
				that.soList = [];
				let firstList = [];
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
								item2.avatar = soImageError(item2.avatar, that.oss)
								// console.log(item2.avatar)
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
				})
			} else if (this.type == 2) {
				uni.setNavigationBarTitle({
					title: "我的好友"
				})
				let friendList = [];
				that.friendList = [];
				let secondList = [];
				that.$http.get('admin/friend/list').then(res => {
					let data = res.data.data;
					data.forEach(item => {
						//遍历数组,拿到名称
						let name = item.realName;
						//取全部数据的首字母
						let fristName = pinyin.getCamelChars(name).substring(0, 1).toUpperCase();
						if (fristName < 'A' || fristName > 'Z') {
							fristName = '#';
						}
						//给原json添加首字母键值对
						item.letter = fristName;
						//放入新数组
						friendList.push(item);
						secondList.push(fristName);
						// console.log(soList)
					});
					secondList.sort();
					for (var i = 0; i < secondList.length; i++) {
						if (secondList[i] == secondList[i + 1]) {
							secondList.splice(i, 1);
							i--;
						}
					}
					//根据首字母键值对给原数据按首字母分类
					secondList.forEach(item => {
						let dataList = [];
						friendList.forEach((item2, index) => {
							if (item == item2.letter) {
								//手动排除图片出错
								item2.avatar = imageError(item2.avatar, that.oss)
								dataList.push(item2);
								//从待选数组中删除 提高效率
								// soList.splice(index, 1);
							}
						});
						that.friendList.push({
							letter: item,
							dataList: dataList
						});
					});
					that.showFriendList = that.friendList;
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
					this.swiperHeight = height - ret[0].height
				});
		}
	};
</script>

<style lang="scss">
	.bottom-safe {
		/* iphonex 等安全区设置，底部安全区适配 */
		/* #ifndef APP-NVUE */
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		/* #endif */
	}

	.container {
		padding:0rpx 32rpx;

		.search {
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
