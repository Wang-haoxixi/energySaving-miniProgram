<template>
	<view class="container">
		<view class="containerWrap" id="containerWrap">
			<view class="search">
				<image v-if="oss" :src="oss+'icon_search_gray.png'"></image>
				<input maxlength="500" placeholder="搜索" placeholder-class="inputDefault" @input="search" v-model="searchText"></input>
			</view>
			<view class="color_303031 bold flexRow count">
				<view class="">
					共有{{$isEmpty(num)?'0': num}}位成员
				</view>
				<image v-if="isAdmin==2 || isAdmin==1 && oss" :src="oss+'icon_add.png'" @tap="invited()"></image>
			</view>
		</view>
		<scroll-view scroll-y="true" :style="{height:scrollHeight + 'px'}">
			<view class="flexRowStart showList" @click="goMemberInfo(item)" v-for="(item,index) of showList" :key="index">
				<image lazy-load="true" class="avatarImg" :src="imageError(item.avatar,$oss)" mode="aspectFill"></image>
				<view class="contentWrap">
					<view class="flexRowStart memberInfo">
						<view class="color_303031 realName">
							{{$isEmpty(item.realName)?'':item.realName}}
						</view>
						<view v-if="item.isAdmin==2" class="admingMark">
							负责人
						</view>
						<view v-if="item.isAdmin==1" class="managerMark">
							知事
						</view>
					</view>
					<view class="color_919397 singleEllipsis company">
						{{getCompanyStation(item.company,item.station)}}
					</view>
				</view>
				<view class="showImg" @tap.stop="manageMember(item)" v-if="item.showImg">
					<image v-if="oss" :src="oss+'icon_status_edit.png'"></image>
				</view>
			</view>
			<image class="emptyImg" v-if="!showList.length>0 && oss" :src="oss+'pic_noMessage.png'" mode="aspectFit"></image>
			<view class="bottom-safe" style="height: 112rpx;"></view>
		</scroll-view>
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
				memberList: [],
				showList: [],
				searchText: '',
				isAdmin: '',
				userId: '',
				orgId: '',
				scrollHeight: 0,
				oss: '',
				num:''
			}
		},
		onLoad(options) {
			const {
				orgId,
				isAdmin
			} = options;
			this.oss = this.$oss
			this.orgId = orgId
			this.isAdmin = isAdmin
			this.userId = uni.getStorageSync('userinfo').user_id
			this.reloadPage(this.orgId)
			uni.createSelectorQuery()
				.in(this)
				.select('#containerWrap')
				.boundingClientRect()
				.exec(ret => {
					// console.log(ret)
					let height = uni.getSystemInfoSync().windowHeight;
					// console.log(height)
					height = height - ret[0].height
					this.scrollHeight = height
					// console.log(this.scrollHeight)
				});
		},
		methods: {
			manageMember(item) {
				let that = this
				if (item.userId == that.userId) {
					uni.showActionSheet({
						itemList: ['退出组织'],
						success: function(res) {
							if (res.tapIndex == 0) {
								that.$http.get('admin/org/sign/out/' + that.orgId).then(res => {
									// console.log(res)
									if (res.data.code == 0) {
										uni.showToast({
											title: "退出成功",
											icon: "none",
											duration: 1000,
											success: () => {
												setTimeout(() => {
													that.reloadPage(that.orgId)
												}, 1000)
											}
										})
									}
								})
							} else if (res.cancel) {
								return false
							}
						}
					})
				}
				if (item.isAdmin == 0 && item.userId != that.userId) {
					uni.showActionSheet({
						itemList: ['移除成员', '设为知事'],
						success: function(res) {
							// console.log(res)
							if (res.tapIndex == 0) {
								that.$http.get('admin/org/fire', {
									params: {
										orgId: that.orgId,
										userId: item.userId
									}
								}).then(res => {
									// console.log(res)
									if (res.data.code == 0) {
										that.$http.get('admin/org/fire', {
											params: {
												orgId: that.orgId,
												userId: item.userId
											}
										}).then(res => {
											// console.log(res)
											if (res.data.code == 0) {
												uni.showToast({
													title: "移除成员成功",
													icon: "none",
													duration: 1000,
													success: () => {
														setTimeout(() => {
															that.reloadPage(that.orgId)
														}, 1000)
													}
												})
											}
										})
									}
								})
							} else if (res.tapIndex == 1) {
								that.$http.get('admin/app/set/admin', {
									params: {
										orgId: that.orgId,
										userId: item.userId
									}
								}).then(res => {
									// console.log(res)
									if (res.data.code == 0) {
										uni.showToast({
											title: "设置知事成功",
											icon: "none",
											duration: 1000,
											success: () => {
												setTimeout(() => {
													that.reloadPage(that.orgId)
												}, 1000)
											}
										})
									}
								})
							}
						},
					})
				}
				if (item.isAdmin == 1 && item.userId != that.userId) {
					uni.showActionSheet({
						itemList: ['取消知事'],
						success: function(res) {
							if (res.tapIndex == 0) {
								that.$http.get('admin/app/unset/admin/', {
									params: {
										orgId: that.orgId,
										userId: item.userId
									}
								}).then(res => {
									// console.log(res)
									if (res.data.code == 0) {
										uni.showToast({
											title: "成功取消该成员知事身份",
											icon: "none",
											duration: 1000,
											success: () => {
												setTimeout(() => {
													that.reloadPage(that.orgId)
												}, 1000)
											}
										})
									}
								})
							} else if (res.cancel) {
								return false
							}
						}
					})
				}
			},
			getCompanyStation,
			imageError,
			goMemberInfo(item) {
				uni.navigateTo({
					url: `/pages/find/cannerCard/cannerCard?id=${item.userId}`
				})
			},
			search() {
				this.showList = this.memberList.filter(item => {
					return item.realName.includes(this.searchText)
				})
			},
			reloadPage(orgId) {
				this.$http.get('admin/app/user/page', {
					params: {
						orgId: orgId,
						size: 10000,
					}
				}).then(res => {
					console.log(res)
					// console.log(res.data.data.result.records)
					this.num = res.data.data.result.total
					this.memberList = res.data.data.result.records
					this.memberList.forEach(item => {
						item.avatar = imageError(item.avatar, this.oss)
					})
					this.showList = this.memberList.map(item => {
						return {
							...item,
							showImg: false
						}
					})
					if (this.isAdmin == 0) {
						this.showList.forEach(item => {
							if (item.userId == this.userId) {
								item.showImg = true
							}
						})
					}
					if (this.isAdmin == 1) {
						this.showList.forEach(item => {
							if (item.userId == this.userId) {
								item.showImg = true
							}
							if (item.isAdmin == 0) {
								item.showImg = true
							}
						})
					}
					if (this.isAdmin == 2) {
						this.showList.forEach(item => {
							if (item.isAdmin != 2) {
								item.showImg = true
							}
						})
					}
				})
			},
			invited() {
				uni.navigateTo({
					url: `/pages/contacts/soWorkbench/soInfo/soMoreInfo/memberManagement/addMembers/addMembers?id=${this.orgId}`
				})
			}
		}
	}
</script>

<style lang="scss">
	.container {
		padding: 0 32rpx;

		.containerWrap {
			.search {
				margin: 18rpx 0;
				padding: 18rpx 32rpx;
				border-radius: 60rpx;
				background-color: #F5f7f8;
				display: flex;
				flex-direction: row;
				align-items: center;

				image {
					height: 32rpx;
					width: 32rpx;
				}
			}

			.count {
				padding: 24rpx 0;
				font-size: 32rpx;

				image {
					width: 44rpx;
					height: 44rpx;
				}
			}
		}

		.showList {
			padding: 24rpx 0;
			position: relative;

			.avatarImg {
				width: 76rpx;
				height: 76rpx;
				border-radius: 50%;
				margin-right: 24rpx;
			}

			.contentWrap {
				flex: 1;

				.memberInfo {
					margin-bottom: 10rpx;

					.realName {
						font-size: 28rpx;
						margin-right: 20rpx;
					}

					.admingMark {
						font-size: 20rpx;
						line-height: 28rpx;
						text-align: center;
						background: linear-gradient(90deg, #FF825C 0%, #FF3636 100%);
						border-radius: 4rpx;
						width: 76rpx;
						height: 28rpx;
						color: #FFFFFF;
					}

					.managerMark {
						font-size: 20rpx;
						width: 76rpx;
						height: 28rpx;
						background-color:#57DBB1;
						color: #FFFFFF;
						border-radius: 4rpx;
						line-height: 28rpx;
						text-align: center;
					}
				}

				.company {
					font-size: 22rpx;
				}
			}

			.showImg {
				image {
					position: absolute;
					top: 0;
					left: 630rpx;
					width: 44rpx;
					height: 44rpx;
				}
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
