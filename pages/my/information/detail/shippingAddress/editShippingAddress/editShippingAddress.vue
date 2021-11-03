<template>
	<view>
		<view class="item">
			<view class="item-title">
				收货人
			</view>
			<input v-model="data.consignee" type="text" placeholder="姓名" placeholder-class="inputDefault" class="item-content"
			 maxlength="20" />
		</view>
		<view class="item">
			<view class="item-title">
				联系电话
			</view>
			<input v-model="data.phone" type="text" placeholder="联系电话" placeholder-class="inputDefault" class="item-content"
			 maxlength="11" />
		</view>
		<picker mode="multiSelector" @columnchange="bindMultiPickerColumnChange" :value="multiIndex" :range="multiArray"
		 range-key="name" @change="workPlace">
			<view class="item">
				<view class="item-title">所在地区</view>
				<view class="item-content">
					{{ $isEmpty(data.cityArea)?'请完善':data.cityArea }}
				</view>
				<image class="item-end" :src="$ossUrl('icon_right_gray.png')"></image>
			</view>
		</picker>
		<view class="item">
			<view class="item-title">
				详细地址
			</view>
			<input v-model="data.address" type="text" placeholder-class="inputDefault" placeholder="如道路/门牌号/小区/楼栋号等" class="item-content"
			 maxlength="50" />
		</view>
		<!-- <view class="item">
			<view class="item-title">
				邮编
			</view>
			<input v-model="data.zipCode" type="text" placeholder-class="inputDefault" placeholder="请输入邮编号码" class="item-content"
			 maxlength="6" />
		</view>
		<view class="item">
			<view class="item-title">
				邮箱
			</view>
			<input v-model="data.mail" type="text" placeholder-class="inputDefault" placeholder="请输入邮箱地址" class="item-content"
			 maxlength="50" />
		</view> -->
		<view class="item">
			<view class="item-title">
				设为默认地址
			</view>
			<view class="item-content">

			</view>
			<switch color="#F74437" @change="switchChange" :checked="data.isDefault == 1" style="transform:scale(0.6)" />
		</view>
		<bottom-button>
			<view class="delete button" @tap="deletefunc" v-if="this.del">
				删除
			</view>
			<view class="save button" @tap="add">
				保存
			</view>
		</bottom-button>
	</view>
</template>

<script>
	import bottomButton from '@/components/bottomButton/bottomButton.vue'
	import city from '@/common/city.js'
	export default {
		components: {
			bottomButton
		},
		data() {
			return {
				data: {
					id: 0,
					address: '',
					cityArea: '',
					consignee: '',
					mail: '',
					phone: '',
					zipCode: '',
					isDefault: 1,
				},
				multiArray: [
					city,
					city[0].children,
				],
				multiIndex: [0, 0],
				del: false
			};
		},
		methods: {
			add() {
				let myreg = /^1[3,4,5,7,8,9][0-9]{9}$/;
				if (this.$isEmpty(this.data.consignee)) {
					uni.showToast({
						title: '请输入收货人姓名',
						icon: 'none'
					})
				} else if (this.$isEmpty(this.data.phone)) {
					uni.showToast({
						title: '请输入联系电话',
						icon: 'none'
					})
				} else if (this.data.phone.length != 11 || myreg.test(this.data.phone) == false) {
					uni.showToast({
						title: '请输入正确的电话号码',
						icon: 'none'
					})
				} else if (this.$isEmpty(this.data.cityArea)) {
					uni.showToast({
						title: '请选择所在地区',
						icon: 'none'
					})
				} else if (this.$isEmpty(this.data.address)) {
					uni.showToast({
						title: '请输入详细地址',
						icon: 'none'
					})
				} 
				// else if (this.$isEmpty(this.data.zipCode)) {
				// 	uni.showToast({
				// 		title: '请输入邮编',
				// 		icon: 'none'
				// 	})
				// } else if (this.$isEmpty(this.data.mail)) {
				// 	uni.showToast({
				// 		title: '请输入邮箱',
				// 		icon: 'none'
				// 	})
				// } 
				else {
					let http = '';
					if (this.del == true) {
						http = 'admin/receive_address/update'
					} else if (this.del == false) {
						http = 'admin/receive_address/save'
					}
					this.$http.post(http, this.data).then(res => {
						console.log(res);
						if (res.data.data) {
							uni.showToast({
								title: '保存成功',
								success() {
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
			},
			deletefunc() {
				uni.showModal({
					title: "提示",
					content: "是否确认删除该地址",
					success: function(res) {
						if (res.confirm) {
							console.log('用户点击确定');
							uni.navigateBack();
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				})
			},
			workPlace() {
				this.data.cityArea = this.multiArray[0][this.multiIndex[0]].name + '-' + this.multiArray[1][this.multiIndex[1]].name
			},
			switchChange: function(e) {
				if (e.target.value === true) {
					this.data.isDefault = 1;
				} else {
					this.data.isDefault = 0;
				}
			},
			bindMultiPickerColumnChange: function(e) {
				console.log('修改的列为：' + e.detail.column + '，值为：' + e.detail.value)
				this.multiIndex[e.detail.column] = e.detail.value
				switch (e.detail.column) {
					case 0: //拖动第1列
						this.multiArray[1] = city[this.multiIndex[0]].children
						console.log(this.multiIndex);
						break
				}
				this.$forceUpdate()
			}
		},
		onLoad(option) {
			if (option.type == 'edit') {
				this.del = true;
				this.$http.get('admin/receive_address/' + option.id).then(res => {
					this.data = res.data.data;
				})
			}
		}
	}
</script>

<style lang="scss">
	.inputDefault {
		font-size: 28rpx;
		color: #9aa1a7;
	}

	input {
		flex: 1;
		font-size: 28rpx;
		padding: 0 14rpx;
		color: #565b5f !important;
	}

	.item {
		font-size: 28rpx;
		line-height: 40rpx;
		display: flex;
		align-items: center;
		padding: 44rpx 0 24rpx;
		margin: 0 32rpx;
		border-bottom: 0.3rpx solid #EFF0F1;

		.item-title {
			color: #272727;
			font-weight: bold;
		}

		.item-content {
			color: #565b5f;
			flex: 1;
			margin-left: 80rpx;
			text-align: right;
		}

		.item-end {
			height: 44rpx;
			width: 44rpx;
		}
	}

	.delete {
		flex: 1;
		margin-right: 30rpx;
		background-color: #FFFFFF;
		color: #F74437;
		border: 2rpx solid #F74437;
	}

	.save {
		flex: 2;
	}
</style>
