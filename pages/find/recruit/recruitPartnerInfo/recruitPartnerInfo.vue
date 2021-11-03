<template>
	<view class="container">
		<scroll-view :style="{height: scrollHeight + 'px'}" scroll-y>
			<view class="wrap-line flexRow">
				<view class="wrap-line-title color_303031">合伙人个体</view>
				<view class="wrap-line-content">
					<view class="partner-type" :class="{'choice': form.type === 'so'}" @tap="typeChange('so')">组织</view>
					<view class="partner-type" :class="{'choice': form.type === 'user'}" style="margin-left: 20rpx;" @tap="typeChange('user')">个人</view>
				</view>
			</view>
			<view class="wrap-line flexRow">
				<view class="wrap-line-title color_303031">名称</view>
				<view class="wrap-line-content">
					<input class="partner-name" :maxlength="20" v-model="form.name" />
				</view>
			</view>

			<view class="wrap-line flexRow" @tap="toChooseIndustry">
				<view class="wrap-line-title color_303031" style="margin-right: 30rpx;">行业</view>
				<view class="wrap-line-content" style="flex: 1;">
					<view class="model-choose">
						<view class="model-title color_919397 singleEllipsis">{{form.industry}}</view>
						<image class="right-icon" :src="$ossUrl('icon_createTask_grayRight.png')"></image>
					</view>
				</view>
			</view>

			<view class="wrap-line flexRow" @tap="toChoosePosition">
				<view class="wrap-line-title color_303031">职务</view>
				<view class="wrap-line-content">
					<view class="model-choose">
						<view class="model-title color_919397">{{form.position}}</view>
						<image class="right-icon" :src="$ossUrl('icon_createTask_grayRight.png')"></image>
					</view>
				</view>
			</view>

			<view class="wrap-line flexRow" @tap="toChooseCity">
				<view class="wrap-line-title color_303031">工作城市</view>
				<view class="wrap-line-content">
					<view class="model-choose">
						<view class="model-title color_919397">{{form.city}}</view>
						<image class="right-icon" :src="$ossUrl('icon_createTask_grayRight.png')"></image>
					</view>
				</view>
			</view>
			<view class="wrap-line flexRow">
				<view class="wrap-line-title color_303031">联系方式</view>
				<view class="wrap-line-content">
					<input class="partner-name" :maxlength="20" v-model="form.mobile" />
				</view>
			</view>

			<view class="wrap-line flexRow" style="border-style: none;">
				<view class="wrap-line-title color_303031">能力与优势</view>
				<view class="wrap-line-content">
					<view class="model-choose">
						<image class="right-icon-single" :src="$ossUrl('icon_edit_black.png')" @tap="toEditAbility()"></image>
					</view>
				</view>
			</view>
			<view class="content-area-box">
				<textarea class="content-area" :value="form.ability" disabled auto-height placeholder="请填写能力与优势" />
				</view>
			
			<view class="wrap-line flexRow" style="border-style: none;">
				<view class="wrap-line-title color_303031">具体描述</view>
				<view class="wrap-line-content">
					<view class="model-choose">
						<image class="right-icon-single" :src="$ossUrl('icon_edit_black.png')" @tap="toEditDescribe()"></image>
					</view>
				</view>
			</view>
			<view class="content-area-box">
				<textarea class="content-area" :value="form.describe" disabled auto-height placeholder="请填写具体描述"/>
			</view>
		</scroll-view>
		<view class="bottom-button-box safe-bottom">
			<view class="buttom-button-list flexRow">
				<view class="bottom-button cancel" @tap="cancel">取消</view>
				<view class="bottom-button submit" @tap="submit">确定</view>
			</view>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				recruitId: '',
				form: {
					type: 'user',
					name: '',
					industry: '',
					position: '',
					city: '',
					mobile: '',
					ability: '',
					describe: '',
				},
				cityJson: {},
				scrollHeight: 0,
			};
		},
		onLoad ({recruitId}) {
			this.recruitId = recruitId
			let user = uni.getStorageSync('user') || {}
			this.form.name = user.realName || ''
			this.form.industry = user.industry || ''
			this.form.position = user.position || ''
			this.form.city = user.workPlace || ''
			this.form.mobile = user.mobile || ''
			let ability = user.abilityTag || []
			this.form.ability = ability.join(',')
			uni.$on('industry', data => {
				console.log(data)
				let list = JSON.parse(data)
				this.form.industry =list.join('-')
			})
			uni.$on('positionChange',data=>{
				this.form.position=data
			})
			uni.createSelectorQuery()
			.in(this)
			.select('.bottom-button-box')
			.boundingClientRect()
			.exec(ret => {
				let height = uni.getSystemInfoSync().windowHeight;
				this.scrollHeight = height - ret[0].height;
			});
		},
		methods: {
			typeChange(type) {
				this.form.type = type
			},
			toChooseIndustry () {
				if(this.form.industry!=''){
					uni.navigateTo({
						url: `../industrySelection/industrySelection?titleList=${this.form.industry}&status=false`
					})
				}else{
					uni.navigateTo({
						url: `../industrySelection/industrySelection`
					})
				}
			},
			toChoosePosition () {
				uni.navigateTo({
					url: '../positionSelection/positionSelection'
				})
			},
			toChooseCity () {
				uni.navigateTo({
					url: `../citySelection/citySelection?cityIndex=${this.cityJson.cityIndex}&secondaryCityIndex=${this.cityJson.secondaryCityIndex}`
				})
			},
			cityChange (cityJson) {
				this.cityJson = cityJson
				let city = cityJson.cityName
				if (cityJson.secondaryCityName) {
					city += '-' + cityJson.secondaryCityName
				}
				this.form.city = city
			},
			toEditAbility () {
				uni.navigateTo({
					url: `../abilityEdit/abilityEdit?ability=${this.form.ability}`
				})
			},
			abilityChange (ability) {
				this.form.ability = ability
			},
			toEditDescribe () {
				uni.navigateTo({
					url: `../describeEdit/describeEdit?describe=${this.form.describe}`
				})
			},
			describeChange (describe) {
				this.form.describe = describe
			},
			cancel () {
				uni.navigateBack()
			},
			formValidate () {
				let validate = true
				let title = ''
				if (!this.form.name.trim()) {
					validate = false
					title += title ? '\r\n请填写名称' : '请填写名称'
				}
				if (!this.form.industry.trim()) {
					validate = false
					title += title ? '\r\n请填写行业' : '请填写行业'
				}
				if (!this.form.position.trim()) {
					validate = false
					title += title ? '\r\n请填写职位' : '请填写职位'
				}
				if (!this.form.city.trim()) {
					validate = false
					title += title ? '\r\n请填写工作城市' : '请填写工作城市'
				}
				if (!this.form.mobile.trim()) {
					validate = false
					title += title ? '\r\n请填写联系方式' : '请填写联系方式'
				}
				if (!this.form.ability.trim()) {
					validate = false
					title += title ? '\r\n请填写能力与优势' : '请填写能力与优势'
				}
				if (!this.form.describe.trim()) {
					validate = false
					title += title ? '\r\n请填写具体描述' : '请填写具体描述'
				}
				if (!validate) {
					uni.showToast({
						icon: 'none',
						title
					})
				}
				return validate
			},
			submit () {
				if (this.formValidate()) {
					this.$http.post('dms/recruit_operation/delivery_partner', {
						...this.form,
						recruitId: this.recruitId
					}).then(({data}) => {
						if (data.code === 0) {
							let pages = getCurrentPages()
							let beforePage = pages[pages.length - 2]
							uni.navigateBack({
								success: () => {
									beforePage.$vm.deliverySuccess()
								}
							});
						}
					})
				}
			}
			
		}
	}
</script>

<style lang="scss">
	.container {
		.wrap-line {
			height: 108rpx;
			margin: 0 40rpx;
			border-bottom: 1rpx solid #EFF0F1;

			.wrap-line-title {
				display: inline-block;
				height: 40rpx;
				line-height: 40rpx;
				font-size: 28rpx;
				font-weight: bold;
				white-space: nowrap;
			}

			.wrap-line-content {
				flex: 200rpx 1 1;
				overflow: hidden;
				text-align: right;
				.model-choose {
					width: 100%;
					display: flex;
					justify-content: flex-end;
					align-items: center;
					line-height: 44rpx;
					font-size: 0;
					
					.model-title {
						flex: 200rpx 1 1;
						display: inline-block;
						vertical-align: middle;
						line-height: 40rpx;
						font-size: 28rpx;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
						text-align: right;
					}

					.right-icon-single, .right-icon {
						margin-left: 2rpx;
						vertical-align: middle;
						height: 44rpx;
						width: 44rpx;
						flex: 44rpx 0 0;
					}
					.right-icon {
						margin-right: -16rpx;
					}
				}

				.partner-type {
					display: inline-block;
					padding: 8rpx 20rpx;
					height: 34rpx;
					line-height: 34rpx;
					border-radius: 25rpx;
					background-color: #F4F5F6;
					font-size: 24rpx;
					color: #919397;

					&.choice {
						background-color: #FEECEA;
						color: #F74437;
					}
				}

				.partner-name {
					height: 40rpx;
					line-height: 40rpx;
					text-align: right;
					font-size: 28rpx;
					color: #919397;
				}
			}
		}
		.content-area-box {
			padding: 20rpx 40rpx;
			.content-area {
				width: 100%;
				padding: 20rpx 0;
				border-bottom: 1rpx solid #EFF0F1;
				line-height: 48rpx;
				font-size: 28rpx;
				color: #919397;
			}
		}
		
		.bottom-button-box {
			.buttom-button-list {
				padding: 40rpx;
				.bottom-button {
					height: 72rpx;
					line-height: 72rpx;
					text-align: center;
					border-radius: 20rpx;
					font-weight: bold;
					&:not(:first-child) {
						margin-left: 30rpx;
					}
					&.cancel {
						flex: 204rpx 1 1;
						position: relative;
						background-color: #FFFFFF;
						color: #F74437;
						font-size: 28rpx;
						&::after {
							content: '';
							position: absolute;
							left: 0;
							right: 0;
							top: 0;
							bottom: 0;
							border: 1rpx solid #F74437;
							border-radius: 20rpx;
						}
					}
					&.submit {
						flex: 438rpx 1 1;
						background-color: #F74437;
						color: #FFFFFF;
					}
				}
			}
			
		}
	}
</style>
