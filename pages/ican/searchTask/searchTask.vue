<template>
	<view class="container">
		<view class="flexRowStart search">
			<image v-if="oss" class="img" :src="oss+'icon_search_gray.png'"></image>
			<input maxlength="500" placeholder="搜索任务" placeholder-class="inputDefault" @input="search" v-model="searchText" focus="true"></input>
		</view>
		<searchTaskList :searchTaskList="searchTaskList" :taskListMoreStatus="taskListMoreStatus"></searchTaskList>	
	</view>
</template>

<script>
	import {
		isEmpty,
		imageError
	} from '@/common/utils.js';
	export default {
		data() {
			return {
				searchText: '',
				searchTaskInfo:{},
				taskListMoreStatus:'',
				searchTaskList: [],
				oss:'',
				orgId:''
			};
		},
		onLoad(options) {
			this.orgId =options.orgId
			this.oss=this.$oss
		},
		onReachBottom() {
			// console.log(666)
			let that = this;
			if (that.searchTaskInfo.current < that.searchTaskInfo.pages) {
				// console.log(6)
				that.taskListMoreStatus = 'loading';
				that.$http.get('qms/cooperation_list/select_page_V1', {
					params: {
						name: that.searchText,
						org:that.orgId,
						current: that.searchTaskInfo.current + 1
					}
				}).then(res => {
					// console.log(res)
					that.searchTaskInfo.current = res.data.data.current;
					// console.log(that.joinCurrent)
					that.searchTaskList = that.searchTaskList.concat(res.data.data.records.map(item=>{
						var index=item.finishTime.lastIndexOf(":");
						item.finishTime=item.finishTime.substring(0, index)
						return {
							...item,
							finishTime:item.finishTime
						}
					}));
					that.taskListMoreStatus = 'more';
				});
			} else {
				// console.log(9)
				that.taskListMoreStatus = 'noMore';
			}
		},
		methods: {
			search() {
				if (this.searchText.length == 0) {
					this.searchTaskInfo = {}
					this.searchTaskList = []
				}else{
					this.$http
						.get('qms/cooperation_list/select_page_V1', {
							params: {
								name: this.searchText,
								org:this.orgId
							}
						})
						.then(res => {
							// console.log(res)
							this.searchTaskInfo=res.data.data
							this.searchTaskList = res.data.data.records.map(item=>{
								var index=item.finishTime.lastIndexOf(":");
								item.avatar = imageError(item.avatar,this.$oss)
								item.finishTime=item.finishTime.substring(0, index)
								return {
									...item,
									finishTime:item.finishTime
								}
							})
							if (this.searchTaskInfo.current == this.searchTaskInfo.pages) {
								this.taskListMoreStatus = 'noMore'
							} else if (this.searchTaskInfo.pages == 0) {
								this.taskListMoreStatus = 'noMore'
						}
					});	
				}
			}
		}
	}
</script>

<style lang="scss">
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
	.container{
		padding: 0 32rpx;
		.search{
			margin: 16rpx 0;
			padding: 18rpx 32rpx;
			border-radius: 60rpx;
			background-color: #F5f7f8;
			.img{
				height: 32rpx;
				width: 32rpx;
			}
		}
	}
</style>
