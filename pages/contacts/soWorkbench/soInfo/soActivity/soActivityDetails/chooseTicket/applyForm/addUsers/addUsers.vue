<template>
	<view class="container">
		<view class="containerWrap">
			<view class="content">
				<view class="userContent">
					<view class="color_666769">
						联系人信息
					</view>
					<view class="" v-for="(item,index) of userInfo" :key="index">
						<view class="flexRow userInfoItem" v-if="item.type == 'input'">
							<view class="color_303031" style="margin-right: 20rpx;">
								{{$isEmpty(item.label)?'':item.label}}<text style="margin-left: 10rpx;" v-if="item.must == true" class="color_F74437">*</text>
							</view>
							<input style="flex: 1;min-width: 0;" class="color_919397 singleEllipsis" v-model="item.value" :placeholder="item.placeholder"
							 placeholder-style="color:#BABEC0;" @blur.stop="checkForm(item)" />
						</view>
						<view class="userInfoItem" v-if="item.type =='textarea'">
							<view class="color_303031" style="margin-right: 20rpx;margin-bottom: 28rpx;">
								{{$isEmpty(item.label)?'':item.label}}<text style="margin-left: 10rpx;" v-if="item.must == true" class="color_F74437">*</text>
							</view>
							<textarea class="color_919397" v-model="item.value" :placeholder="item.placeholder" placeholder-style="color:#BABEC0;"
							 style="width: 100%;" @blur.stop="checkForm(item)"></textarea>
						</view>
						<view class="" v-if="item.type == 'radio'" style="padding-top: 48rpx;">
							<view class="color_303031" style="margin-right: 20rpx;">
								{{$isEmpty(item.label)?'':item.label}}<text style="margin-left: 10rpx;" v-if="item.must == true" class="color_F74437">*</text>
							</view>
							<radio-group name="">
								<label @tap.stop="checkForm(item,item2)" class="flexRowStart" v-for="(item2,index2) of item.optionsList" :key="index2"
								 style="margin-top: 40rpx;">
									<radio :checked="item2.select" color="#46B28B" />
									<view class="color_666769">
										{{$isEmpty(item2.label)?'':item2.label}}
									</view>
								</label>
							</radio-group>
						</view>
						<view class="" v-if="item.type == 'checkbox'" style="padding-top: 48rpx;">
							<view class="color_303031" style="margin-right: 20rpx;">
								{{$isEmpty(item.label)?'':item.label}}<text style="margin-left: 10rpx;" v-if="item.must == true" class="color_F74437">*</text>
							</view>
							<checkbox-group name="">
								<label @tap.stop="checkForm(item,item2)" class="flexRowStart" v-for="(item2,index2) of item.optionsList" :key="index2"
								 style="margin-top: 40rpx;">
									<checkbox :checked="item2.select" />
									<view class=" color_666769">
										{{$isEmpty(item2.label)?'':item2.label}}
									</view>
								</label>
							</checkbox-group>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="bottom-safe" style="height: 112rpx;"></view>
		<view class="btn">
			<view class="button submitOrder" @tap.stop="submitForm">
				保存
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				id: '',
				userInfo: [],
				submitList: []
			};
		},
		onLoad(options) {
			// console.log(JSON.parse(options.userInfo))
			this.submitList = uni.getStorageSync('submitList')
			const {
				activityId,
				userInfo
			} = options
			this.id = activityId
			if (!(this.$isEmpty(userInfo))) {
				this.userInfo = JSON.parse(userInfo)
				// console.log(this.userInfo)
				this.userInfo = this.userInfo.map(item => {
					return {
						...item,
						status: true
					}
				})
			} else {
				this.$http.get('qms/conference_config/get_form_config', {
					params: {
						activityId: this.id,
						setDefault: false
					}
				}).then(res => {
					// console.log(res)
					this.userInfo = res.data.data.map(item => {
						return {
							//加一个状态值，做最后提交的表单判断
							...item,
							status: false
						}
					})
				})
			}
		},
		methods: {
			submitForm() {
				let status = this.userInfo.some(item => {
					if (item.must == true) {
						return item.status == false
					}
				})
				console.log(status)
				if (status == true) {
					this.userInfo.some(item => {
						if (item.must == true && item.status == false) {
							uni.showToast({
								title: `请完善${item.label}`,
								icon: 'none'
							})
							return true
						}
					})
				} else {
					this.userInfo.some((item, index) => {
						// 邮箱没填只填了手机号
						if (item.label == '手机号' && item.status == true) {
							let myreg = /^1[3,4,5,7,8,9][0-9]{9}$/;
							// console.log(myreg.test(item.value))
							if (myreg.test(item.value) == false) {
								uni.showToast({
									title: '手机号格式错误',
									icon: 'none'
								})
								return true
							} else {
								let emailStatus = this.userInfo.some(item=>{
									return item.label == '邮箱'
								})
								this.userInfo.some(item => {
									if ((item.label == '邮箱' && item.value == '') || emailStatus==false) {
										console.log(2)
										uni.$emit('data', this.userInfo)
										uni.navigateBack({
											delta: 1,
										})
										return true
									}
								})
							}
						} else if (item.label == '邮箱' && item.value != '') {//填了邮箱
							let str = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/
							if (str.test(item.value) == false) {
								uni.showToast({
									title: '邮箱格式错误',
									icon: 'none'
								})
								return true
								// item.status = false
							} else {
								// console.log('邮箱检测通过')
								uni.$emit('data', this.userInfo)
								uni.navigateBack({
									delta: 1,
								})
							}
						}
					})
				}

			},
			checkForm(item, item_item) {
				if (item.type == 'input' && item.must == true) {
					if (item.value != '') {
						item.status = true
					} else {
						item.status = false
					}
				} else if (item.type == 'textarea' && item.must == true) {
					if (item.value == '') {
						item.status = false
					} else {
						item.status = true
					}
				} else if (item.type == 'radio') {
					item.optionsList.forEach(item2 => {
						item2.select = false
					})
					item_item.select = true
					if (item.must == true) {
						item.status = item.optionsList.some(item2 => {
							return item2.select = true
						})
					}
				} else if (item.type == 'checkbox') {
					item_item.select = !item_item.select
					if (item.must == true) {
						item.status = item.optionsList.some(item2 => {
							return item2.select = true
						})
					}
				} else {
					item.status = true
				}
			}
		}
	}
</script>

<style lang="scss">
	.userInfoItem{
		border-bottom: 2rpx solid #EFF0F1;
		padding-top: 48rpx;
		padding-bottom: 26rpx;
	}
	.userContent{
		font-size: 28rpx;
		line-height: 40rpx;
		padding-top: 40rpx;
	}
	.container {
		height: 100%;

		.containerWrap {
			padding: 0 32rpx;

			.content {
				.info {
					padding: 44rpx 0 24rpx 0;

					.title {
						font-size: 28rpx;
						line-height: 40rpx;

						.txt {
							padding-left: 10rpx;
						}
					}

					textarea {
						width: 100%;
						font-size: 28rpx;
						line-height: 40rpx;
						margin-top: 36rpx;
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

			.submitOrder {
				width: 686rpx;
				margin: 24rpx 32rpx
			}
		}
	}

	input {
		flex: 1;
		text-align: right;
		font-size: 28rpx;
		line-height: 40rpx;
	}

	.line {
		height: 0.3rpx;
		border-radius: 20rpx;
		background-color: #EFF0F1;
		width: 670rpx;
	}

	radio {
		transform: scale(0.7)
	}

	checkbox {
		transform: scale(0.7)
	}

	.bottom-safe {
		/* iphonex 等安全区设置，底部安全区适配 */
		/* #ifndef APP-NVUE */
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		/* #endif */
	}
</style>
