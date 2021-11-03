<template>
	<view>
		<view class="container">
			<radio-group>
				<view class="title">
					<label class="flexRow" style="margin-bottom: 20rpx;" @tap="noAllocation">
						<view class="color_303031 bold">
							不设置奖励
						</view>
						<radio :checked="checkStatus==1" :disabled="changeStatus" />
					</label>
					<view class="color_919397 message">
						该任务不需要分配奖励
					</view>
				</view>
				<view class="title">
					<label class="flexRow" style="margin-bottom: 20rpx;" @tap="manualAllocation">
						<view class="flexRowStart">
							<view class="color_303031 bold">
								手动分配
							</view>
							<view class="color_2F80FF questionMark" @tap.stop="showManualMessage">
								?
							</view>
						</view>
						<radio :checked="checkStatus==2" :disabled="changeStatus" />
					</label>
					<view class="color_919397 message">
						自定义奖励金额，我的奖励我做主
					</view>
				</view>
				<view class="title">
					<label class="flexRow" style="margin-bottom: 20rpx;" @tap="autoAllocation">
						<view class="flexRowStart">
							<view class="color_303031 bold">
								自动分配
							</view>
							<view class="color_2F80FF questionMark" @tap.stop="showAntoMessage">
								?
							</view>
						</view>
						<radio :checked="checkStatus==3" :disabled="changeStatus" />
					</label>
					<view class="color_919397 message">
						平均奖励给所有完成任务的成员
					</view>
				</view>
				<view class="flexRow wrapAverage" v-show="autoShow">
					<view class="flexRowStart">
						<image v-if="oss" :src="oss+'icon_redRight.png'" class="redRightImg"></image>
						<view class="color_303031 bold">
							平均分配
						</view>
					</view>
					<view class="flexRowStart">
						<input type="number" :placeholder="'当前可用'+balanceValue+'贝'" :disabled="changeStatus" v-model="autoAllocationValue"
						 :focus="autoShow" placeholder-style="color:#BABEC0;" style="text-align: right;color:#919397;" @input="checkValue"
						 maxlength="6" />
						<view class="color_303031 bold" style="margin-left: 10rpx;">
							贝
						</view>
					</view>
				</view>
			</radio-group>
		</view>
		<view class="btn">
			<view class="button send" @tap="submitWays">
				确定
			</view>
		</view>
		<uni-popup ref="allocationDialog" type="center">
			<view class="popDialog">
				<view class="color_666769 message">
					您已了解手动分配规则
				</view>
				<view class="flexRow">
					<view class="button noRepeat" @tap="goMessage">
						去了解
					</view>
					<view class="button repeatNow" @tap="confirmAllocation">
						确定
					</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				autoShow: false,
				autoAllocationValue: '',
				noAllocationStatus: true,
				manualAllocationStauts: false,
				autoAllocationStatus: false,
				data: '',
				checkStatus: 1,
				changeStatus: false,
				balanceValue: 0,
				oss: ''
			}
		},
		onLoad(options) {
			this.oss = this.$oss
			const {
				checkStatus,
				autoAllocationValue
			} = options
			this.checkStatus = checkStatus
			this.$http.get('fms/account/balance').then(res => {
				// console.log(res)
				this.balanceValue = res.data.data
			})
			if (uni.getStorageSync('editTask') && uni.getStorageSync('editTask').allocationType != 0) {
				this.changeStatus = true
			}
			if (this.checkStatus == 3) {
				this.autoShow = true
				this.autoAllocationStatus = true
				this.manualAllocationStauts = false
				this.noAllocationStatus = false
				this.autoAllocationValue = autoAllocationValue.replace('平均分配', '').replace('贝', '')
				// console.log(this.autoAllocationValue)
			} else if (this.checkStatus == 2) {
				this.autoAllocationStatus = false
				this.manualAllocationStauts = true
				this.noAllocationStatus = false
			} else if (this.checkStatus == 1) {
				this.autoAllocationStatus = false
				this.manualAllocationStauts = false
				this.noAllocationStatus = true
			}
		},
		methods: {
			goMessage() {
				this.$refs.allocationDialog.close()
				if (this.manualAllocationStauts == true) {
					uni.navigateTo({
						url: "/pages/ican/taskDetail/manualAssignmentRule/manualAssignmentRule"
					})
				} else {
					uni.navigateTo({
						url: "/pages/ican/taskDetail/automaticAllocationRule/automaticAllocationRule"
					})
				}
			},
			checkValue(e) {
				// console.log(parseInt(e.detail.value))
				let num = parseInt(e.detail.value)
				if (num >= 100000) {
					this.autoAllocationValue = 100000
				}
			},
			autoAllocation() {
				if (this.changeStatus != true) {
					this.autoShow = true
					this.noAllocationStatus = false
					this.manualAllocationStauts = false
					this.autoAllocationStatus = true
				}
			},
			manualAllocation() {
				if (this.changeStatus != true) {
					this.autoShow = false
					this.noAllocationStatus = false
					this.manualAllocationStauts = true
					this.autoAllocationStatus = false
					this.autoAllocationValue = ''
				}
			},
			noAllocation() {
				if (this.changeStatus != true) {
					this.autoShow = false
					this.noAllocationStatus = true
					this.manualAllocationStauts = false
					this.autoAllocationStatus = false
					this.autoAllocationValue = ''
				}
			},
			showManualMessage() {
				uni.navigateTo({
					url: "/pages/ican/taskDetail/manualAssignmentRule/manualAssignmentRule"
				})
			},
			showAntoMessage() {
				uni.navigateTo({
					url: "/pages/ican/taskDetail/automaticAllocationRule/automaticAllocationRule"
				})
			},
			submitWays() {
				if (uni.getStorageSync('taskStatus') == false && this.manualAllocationStauts == true) {
					this.$refs.allocationDialog.open()
				} else {
					if (this.noAllocationStatus == true) {
						this.data = '不设置奖励'
						console.log(this.data)
						uni.$emit('allocation', this.data)
						uni.navigateBack({
							delta: 1
						});
					} else if (this.manualAllocationStauts == true) {
						this.data = '手动奖励'
						console.log(this.data)
						uni.$emit('allocation', this.data)
						uni.navigateBack({
							delta: 1
						});
					} else if (this.autoAllocationStatus == true) {
						if (this.autoAllocationValue == '' || this.autoAllocationValue == 0) {
							uni.showToast({
								title: "分配宝贝不能为空",
								icon: 'none',
								duration: 1000
							})
						} else if (uni.getStorageSync('taskStatus') == false && this.autoAllocationStatus == true) {
							this.$refs.allocationDialog.open()
						} else {
							this.data = `平均分配${this.autoAllocationValue}贝`
							console.log(this.data)
							uni.$emit('allocation', this.data)
							uni.navigateBack({
								delta: 1
							});
						}
					}
				}
			},
			confirmAllocation() {
				this.$refs.allocationDialog.close()
				uni.setStorageSync('taskStatus',true)
				if (this.manualAllocationStauts == true) {
					this.data = '手动奖励'
					console.log(this.data)
					uni.$emit('allocation', this.data)
					uni.navigateBack({
						delta: 1
					});
				} else if (this.autoAllocationStatus == true) {
					this.data = `平均分配${this.autoAllocationValue}贝`
					console.log(this.data)
					uni.$emit('allocation', this.data)
					uni.navigateBack({
						delta: 1
					});
				}
			}
		}
	}
</script>

<style lang="scss">
	.popDialog {
		width: 590rpx;
		padding: 32rpx 32rpx 48rpx;
		background-color: #FFFFFF;

		.message {
			font-size: 36rpx;
			line-height: 52rpx;
			margin: 48rpx;
			text-align: center;
		}

		.noRepeat {
			flex: 1;
			background: #F5f7f8;
			color: #565B5F;
			margin-right: 30rpx;
		}

		.repeatNow {
			flex: 1;
		}
	}

	.redRightImg {
		width: 32rpx;
		height: 32rpx;
		margin-right: 20rpx;
	}

	.wrapAverage {
		padding: 34rpx 30rpx;
		border-radius: 20rpx;
		background-color: #F4F5F6;
		font-size: 28rpx;
		line-height: 40rpx;
	}

	.questionMark {
		width: 26rpx;
		height: 26rpx;
		border: 2rpx solid #2F80FF;
		margin-left: 14rpx;
		border-radius: 50%;
		font-size: 24rpx;
		line-height: 24rpx;
		text-align: center;
	}

	.title {
		font-size: 28rpx;
		line-height: 40rpx;
		margin-bottom: 60rpx;
	}

	.message {
		font-size: 24rpx;
		line-height: 34rpx;
	}

	.container {
		padding: 40rpx;
	}

	radio {
		transform: scale(0.7)
	}

	.btn {
		position: fixed;
		bottom: 0rpx;
		background-color: #FFFFFF;
		width: 100%;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);

		.send {
			width: 686rpx;
			margin: 24rpx 32rpx
		}
	}
</style>
