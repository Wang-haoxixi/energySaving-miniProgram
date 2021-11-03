<template>
	<view class="">
		<view class="container">
			<view class="containerWrap">
				<view class="flexRowStart search">
					<image v-if="oss" class="searchImg" :src="oss+'icon_search_gray.png'"></image>
					<input maxlength="500" placeholder="搜索" placeholder-class="inputDefault" @input="search" v-model="searchText"></input>
				</view>
				<checkbox-group name="" @change="selected">
					<label class="flexRow soList" v-for="(item,index) of soList" :key="index">
						<view class="flexRowStart content">
							<image class="avatarImg" :src="imageError(item.avatar,$oss)" mode="aspectFill"></image>
							<view class="">
								<view class="">
									<text class="color_303031 bold realName">{{$isEmpty(item.realName)?'':item.realName}}</text>
									<text class="color_F74437 mark" v-if="item.isAdmin==2">负责人</text>
									<text class="color_F74437 mark" v-if="item.isAdmin==1">知事</text>
								</view>
								<view class="">
									<text class="color_919397 company">{{getCompanyStation(item.company,item.station)}}</text>
								</view>
							</view>
						</view>
						<checkbox :value="item.userId" style="transform:scale(0.7);margin-right: -12rpx;" color="#FF6034" :checked="item.checked"
						 :disabled="memberList.includes(item.userId)" />
					</label>
				</checkbox-group>
				<view class="bottom-safe" style="height: 112rpx;"></view>
			</view>
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
				soList: [],
				checkedList: [],
				memberList: [],
				memberInfo: {
					orgId: '',
					userIds: []
				},
				orgId: '',
				oss: '',
				searchText: ''
			};
		},
		onLoad(options) {
			const {
				id
			} = options
			this.oss = this.$oss
			this.orgId = id
			this.$http.get('admin/app/user/page', {
				params: {
					orgId: id,
					size: 10000,
				}
			}).then(({
				data
			}) => {
				if (data.code === 0) {
					let memberList = data.data.result.records
					let idList = []
					for (let i = 0; i < memberList.length; i++) {
						idList.push(memberList[i].userId)
					}
					this.memberList = idList
				}
			}).finally(() => {
				this.$http.get('admin/app/friend/list', {
					params: {
						orgId: id
					}
				}).then(res => {
					// console.log(res)
					this.checkedList = res.data.data
					this.checkedList.forEach(item => {
						item.avatar = imageError(item.avatar, this.oss)
					})
					this.soList = this.checkedList.map(item => {
						return {
							...item,
							checked: false
						}
					})
					// console.log(this.soList)
				})
			})
		},
		methods: {
			getCompanyStation,
			imageError,
			search() {
				this.soList = this.checkedList.filter(item => {
					return item.realName.includes(this.searchText)
				})
			},
			selected(e) {
				this.soList.forEach(item => {
					item.checked = false
				})
				e.detail.value.forEach(res => {
					// console.log(res)
					this.soList.forEach(resp => {
						if (res == resp.userId) {
							// console.log(666)
							resp.checked = true
						}
					})
				})
			},
			checkMembers() {
				let array = this.soList.filter(item => {
					return item.checked == true
				})
				let list = array.map(items => {
					return items.userId
				})
				this.memberInfo.orgId = this.orgId
				this.memberInfo.userIds = list
				// console.log(this.memberInfo)
				if(this.memberInfo.userIds.length<=0){
					uni.showToast({
						title:"邀请人员不能为空",
						icon:"none"
					})
					return false
				}
				this.$http.post('admin/org/batch/invite', {
					orgId:this.orgId,
					userIds:this.memberInfo.userIds
				}).then(res => {
					if (res.data.code == 0) {
						uni.showToast({
							title: "邀请成功",
							icon: "none",
							duration: 1000,
							success: () => {
								setTimeout(() => {
									uni.navigateBack({
										delta: 1
									})
								}, 1000)
							}
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.container {
		height: 100%;

		.containerWrap {
			margin: 0 32rpx;

			.search {
				margin: 16rpx 0;
				padding: 18rpx 32rpx;
				border-radius: 60rpx;
				background-color: #F5f7f8;

				.searchImg {
					height: 32rpx;
					width: 32rpx;
					margin-right: 16rpx;
				}
			}

			.soList {
				padding: 32rpx 0;
				border-bottom: 0.3rpx solid #EFF0F1;

				.content {
					.avatarImg {
						width: 92rpx;
						height: 92rpx;
						margin-right: 24rpx;
						border-radius: 50%;
					}

					.realName {
						font-size: 28rpx;
						line-height: 40rpx;
						margin-right: 20rpx;
					}

					.mark {
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
