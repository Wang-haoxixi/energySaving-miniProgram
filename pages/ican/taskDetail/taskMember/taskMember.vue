<template>
	<view>
		<view class="container">
			<view class="search">
				<image v-if="oss" class="img" :src="oss+'icon_search_gray.png'"></image>
				<input maxlength="500" placeholder="搜索任务成员" placeholder-class="inputDefault" @input="search" v-model="searchText"></input>
			</view>
			<view class="content">
				<view class="flexRowStart memberList" @click="goMemberInfo(item)" v-for="(item,index) of showList" :key="index">
					<image class="publisherImg" v-if="item.userId==publisher && oss" :src="oss+'icon_task_member_owner.png'" mode="aspectFit"></image>
					<image class="finishedImg" v-else-if="item.state==2 && oss" :src="oss+'icon_task_member_finished.png'" mode="aspectFit"></image>
					<image class="doingImg" v-else-if="oss" :src="oss+'icon_task_member_doing.png'" mode="aspectFit">
						<view class="flexRowStart memberInfo">
							<image class="avatarImg" :src="imageError(item.avatar,$oss)" mode="aspectFill"></image>
							<view class="info">
								<view class="color_303031 userRealName singleEllipsis">
									{{$isEmpty(item.userRealName)?'':item.userRealName}}
								</view>
								<view class="color_919397 singleEllipsis company">
									{{getCompanyStation(item.company,item.station)}}
								</view>
							</view>
						</view>
				</view>
			</view>
			<image class="emptyImg" v-if="!showList.length>0 && oss" :src="oss+'pic_noMessage.png'"></image>
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
				searchText: '',
				list: [],
				showList: [],
				publisher: 0,
				oss: ''
			}
		},
		onLoad(options) {
			// console.log(options)
			const {
				taskId,
				publisher
			} = options
			this.oss = this.$oss
			this.publisher = publisher
			this.getList(taskId)
		},
		methods: {
			imageError,
			getList(taskId) {
				this.$http.get('/qms/cooperation_task/task_user', {
						params: {
							taskId: taskId
						}
					})
					.then(res => {
						// console.log(res)
						this.list = res.data.data
						// this.list.forEach(item => {
						// 	item.avatar = imageError(item.avatar, this.oss)
						// })
						// console.log(this.list)
						this.showList = this.list
						// console.log(this.showList)
						uni.setNavigationBarTitle({
							title: `任务成员(${this.list.length})`
						})
					})
			},
			goMemberInfo(item) {
				uni.navigateTo({
					url: `/pages/find/cannerCard/cannerCard?id=${item.userId}`
				})
			},
			getCompanyStation,
			search() {
				this.showList = this.list.filter(item => {
					return item.userRealName.includes(this.searchText)
				})
			}
		}
	}
</script>

<style lang="scss">
	.container {
		padding:0 32rpx;

		.search {
			padding: 18rpx 32rpx;
			margin: 16rpx 0;
			border-radius: 60rpx;
			background-color: #F5f7f8;
			display: flex;
			flex-direction: row;
			align-items: center;

			.img {
				height: 32rpx;
				width: 32rpx;
			}
		}

		.content {
			.memberList {
				padding: 32rpx 0;
				.publisherImg {
					margin-right: 24rpx;
					width: 32rpx;
					height: 32rpx;
				}

				.finishedImg {
					margin-right: 24rpx;
					width: 32rpx;
					height: 32rpx;
				}

				.doingImg {
					margin-right: 24rpx;
					width: 32rpx;
					height: 32rpx;
				}

				.memberInfo {
					flex: 1;
					.avatarImg {
						border-radius: 50%;
						margin-right: 24rpx;
						width: 76rpx;
						height: 76rpx;
					}

					.info {
						flex: 1;
						min-width: 0;
						height: 76rpx;
						display: flex;
						flex-direction: column;
						align-items: flex-start;
						justify-content: center;

						.userRealName {
							font-size: 28rpx;
							padding-bottom: 16rpx;
							flex: 1;
						}

						.company {
							font-size: 20rpx;
							flex: 1;
						}
					}
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
</style>
