<template>
	<view class="container">
		<view class="contentWrap">
			<scroll-view v-if="checkedList.length!=0" class="scroll-view_H scrollTitle" scroll-x="true">
				<view class="flexRowStart title">
					<view class="flexColumn checkedList" v-for="(item,index) of checkedList" :key="index">
						<image lazy-load="true" class="avatarImg" :src="item.avatar" mode="aspectFill"></image>
						<view class="color_666769 singleEllipsis realName">
							{{$isEmpty(item.realName)?'':item.realName}}
						</view>
					</view>
				</view>
			</scroll-view>
			<view class="flexRowStart search">
				<image v-if="oss" class="searchImg" :src="oss+'icon_search_gray.png'"></image>
				<input maxlength="500" placeholder="搜索" placeholder-class="inputDefault" @input="search" v-model="searchText"></input>
			</view>
			<view class="flexRow content">
				<view class="flexRowStart contentTitle">
					<view class="color_303031 bold nameTitle">
						参与者 >
					</view>
					<view class="color_919397 name">
						{{$isEmpty(name)?'':name}}
					</view>
				</view>
				<checkbox-group name="" @change="selectAll">
					<label class="flexRow selectAll">
						<view class="flexRowStart" style="">
							<text class="txt">全选</text>
							<checkbox color="#FF6034" :checked="selectAllChecked" />
						</view>
					</label>
				</checkbox-group>
			</view>
			<checkbox-group name="">
				<label class="flexRow soList" v-for="(item,index) of soList" :key="index" @tap="selected(item)">
					<view class="flexRowStart wrapSolist">
						<image lazy-load="true" class="avatarImg" :src="item.avatar" mode="aspectFill"></image>
						<view class="" style="flex: 1;min-width: 0;"> 
							<view class="">
								<text class="color_303031 bold realName">{{$isEmpty(item.realName)?'':item.realName}}</text>
								<text class="color_F74437 remark" v-if="item.isAdmin==2">负责人</text>
								<text class="color_F74437 remark" v-if="item.isAdmin==1">知事</text>
							</view>
							<view class="singleEllipsis" style="flex: 1;">
								<text class="color_919397 company">{{getCompanyStation(item.company,item.station)}}</text>
							</view>
						</view>
					</view>
					<checkbox class="selected" :value="item.userId" color="#FF6034" :checked="item.checked" />
				</label>
			</checkbox-group>
			<image class="emptyImg" v-if="!soList.length>0 && oss" :src="oss+'pic_energy_default_wuxinxi.png'" mode="aspectFit"></image>
			<view class="bottom-safe" style="height: 112rpx;"></view>
		</view>
		<view class="btn">
			<view class="button save" @tap="checkMembers">
				保存
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getCompanyStation,
		imageError
	} from '@/common/utils.js';
	export default {
		data() {
			return {
				name: '',
				searchText: '',
				soList: [],
				list: [],
				selectAllChecked: false,
				checkedList: [],
				oss: ''
			};
		},
		onLoad(options) {
			let userId = uni.getStorageSync('userinfo').user_id
			this.oss = this.$oss
			// console.log(userId)
			// console.log("check",this.checkedList)
			if (!this.$isEmpty(uni.getStorageSync('choose'))) {
				this.checkedList = uni.getStorageSync('choose')
			}
			const {
				orgId,
				name
			} = options
			// console.log(orgId)
			// console.log(name)
			this.name = name
			this.$http.get('admin/app/user/page', {
				params: {
					orgId: orgId,
					size: 10000,
					status: 0
				}
			}).then(res => {
				// console.log(res)
				this.list = res.data.data.result.records.map(item => {
					return {
						...item,
						checked: false
					}
				}).filter(item => {
					return item.userId != userId
				})
				this.soList = this.list
				this.soList.forEach(item => {
					item.avatar = imageError(item.avatar, this.oss)
					this.checkedList.forEach(item2 => {
						if (item.userId == item2.userId) {
							item.checked = true
						}
					})
				})
				if (this.checkedList.length == this.soList.length && this.checkedList != 0) {
					this.selectAllChecked = true
				}
			})
		},
		methods: {
			getCompanyStation,
			checkMembers() {
				// let array = this.soList.filter(item => {
				// 	return item.checked == true
				// })
				let array = this.checkedList
				uni.$emit('choose', {
					array: JSON.stringify(array)
				})
				uni.setStorageSync('choose', array)
				uni.navigateBack({
					delta: 1
				})
			},
			search() {
				this.soList = this.list.filter(item => {
					return item.realName.includes(this.searchText)
				})
			},
			selectAll(e) {
				// console.log(e)
				if (e.detail.value.length == 0) {
					this.soList.forEach(item => {
						item.checked = false
					})
					this.selectAllChecked = false
					// this.checkedList=[]
					if (this.searchText == '') {
						this.checkedList = []
					} else {
						this.checkedList = this.checkedList.filter(item => {
							// console.log(item)
							return item.checked == true
						})
					}
				} else {
					this.soList.forEach(item => {
						item.checked = true
					})
					this.selectAllChecked = true
					// this.checkedList=this.soList
					if (this.searchText == '') {
						this.checkedList = this.soList
					} else {
						this.checkedList = [...this.checkedList, ...this.soList]
						this.checkedList = Array.from(new Set(this.checkedList))
					}
				}

			},
			selected(item) {
				// console.log(item)
				if (item.checked == false) {
					item.checked = true
					this.checkedList.push(item)
				} else {
					item.checked = false
					// console.log(item)
					this.checkedList = this.checkedList.filter(item2 => {
						return item2.userId != item.userId
					})
					console.log(this.checkedList)
				}
				let status = this.soList.every(item => {
					return item.checked == true
				})
				if (status == true) {
					this.selectAllChecked = true
				} else {
					this.selectAllChecked = false
				}
			}
		}
	}
</script>

<style lang="scss">
	.container {
		height: 100%;

		.contentWrap {
			margin:0 32rpx;

			.scrollTitle {
				margin: 32rpx 0;

				.title {
					.checkedList {
						margin-right: 30rpx;

						.avatarImg {
							width: 112rpx;
							height: 112rpx;
							border-radius: 50%;
						}

						.realName {
							font-size: 24rpx;
							line-height: 34rpx;
							margin-top: 10rpx;
							width: 110rpx;
							text-align: center;
						}
					}
				}
			}

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

			.content {
				margin-bottom: 24rpx;

				.contentTitle {
					.nameTitle {
						font-size: 32rpx;
						line-height: 44rpx;
						margin-right: 20rpx;
					}

					.name {
						font-size: 24rpx;
						line-height: 34rpx;
					}
				}

				.selectAll {
					.txt {
						font-size: 28rpx;
						line-height: 40rpx;
						margin-right: 20rpx;
						color: #46B28B;
					}

					checkbox {
						transform: scale(0.7);
						margin-right: -12rpx;
					}
				}
			}

			.soList {
				padding: 24rpx 0;
				border-bottom: 0.3rpx solid #EFF0F1;

				.wrapSolist {
					flex: 1;
					.avatarImg {
						width: 112rpx;
						height: 112rpx;
						margin-right: 24rpx;
						border-radius: 50%;
					}

					.realName {
						font-size: 28rpx;
						line-height: 40rpx;
						margin-right: 24rpx;
					}

					.remark {
						border: 2rpx solid #F74437;
						padding: 2rpx 12rpx;
						font-size: 24rpx;
						border-radius: 20rpx;
					}

					.company {
						font-size: 22rpx;
						line-height: 32rpx;
					}
				}

				.selected {
					transform: scale(0.7);
					margin-right: -12rpx;
				}
			}
		}

		.btn {
			width: 100%;
			background-color: #FFFFFF;
			z-index: 666;
			position: fixed;
			bottom: 0rpx;
			padding-bottom: constant(safe-area-inset-bottom);
			padding-bottom: env(safe-area-inset-bottom);

			.save {
				width: 686rpx;
				margin: 24rpx 32rpx
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

	.bottom-safe {
		/* iphonex 等安全区设置，底部安全区适配 */
		/* #ifndef APP-NVUE */
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		/* #endif */
	}
</style>
