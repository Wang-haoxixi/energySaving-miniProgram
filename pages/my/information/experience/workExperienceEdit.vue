<template>
	<view>
		<scroll-view scroll-y :style="{height: swiperHeight + 'px'}">
			<view class="item">
				<view class="item-title color_303031">公司</view>
				<view class="item-content">
					<view class="wrap-line flexRow">
						<view class="wrap-line-content">
							<input class="wrap-line-input" v-model="experience.company" placeholder-style="color: #BABEC0" placeholder="请输入" />
						</view>
					</view>
				</view>
			</view>
			<view class="item" @tap="toChoosePosition">
				<view class="item-title color_303031">职位</view>
				<view class="item-content">
					<view class="wrap-line flexRow">
						<view class="wrap-line-content">{{experience.position || '请输入'}}</view>
						<image class="right-icon" :src="$ossUrl('icon_createTask_grayRight.png')"></image>
					</view>
				</view>
			</view>
			<view class="item">
				<view class="item-title color_303031">部门</view>
				<view class="item-content">
					<view class="wrap-line flexRow">
						<view class="wrap-line-content">
							<input class="wrap-line-input" v-model="experience.department" placeholder-style="color: #BABEC0" placeholder="请输入" />
						</view>
					</view>
				</view>
			</view>
			<view class="item">
				<view class="item-title color_303031">在职时间</view>
				<view class="item-content">
					<view class="wrap-line flexRow" style="font-size: 28rpx;">
						<view class="time-selected" @tap="toSelectTime('starTime')">
							<view class="time-show">{{experience.starTime || '开始时间'}}</view>
							<image class="icon-pull-down" :src="$ossUrl('icon_triangle_gray.png')"/>
						</view>
						<view class="bold">至</view>
						<view class="time-selected" @tap="toSelectTime('endTime')">
							<view class="time-show">{{experience.endTime || '结束时间'}}</view>
							<image class="icon-pull-down" :src="$ossUrl('icon_triangle_gray.png')"/>
						</view>
					</view>
				</view>
			</view>
			<view class="item">
				<view class="item-title color_303031">工作描述</view>
				<view class="item-content">
					<view class="wrap-line flexRow">
						<editor id="editor" class="wrap-line-textarea" placeholder="请输入" @input="descChange"></editor> 
					</view>
				</view>
			</view>
		</scroll-view>
		<uni-popup ref="dialog" type="bottom" style="z-index: 999999999">
			<view class="picker" style="z-index: 999999999">
				<view class="picker-button-box flexRow">
					<view class="picker-button" @tap="timeCancel">取消</view>
					<view class="picker-button sure" @tap="timeSelect">确定</view>
				</view>
				<picker-view :value="selectTime" @change="timeChange">

					<picker-view-column>
						<view class="picker-item" v-for="year in yearArrayComputed" :key="year.value">{{year.value != '至今' ? `${year.value}年` : '至今'}}</view>
					</picker-view-column>
					<picker-view-column>
						<view class="picker-item" v-for="month in monthArray" :key="month">{{month}}月</view>
					</picker-view-column>
				</picker-view>
			</view>
		</uni-popup>
		<view class="bottom-button-box safe-bottom">
			<view class="botton-button-list">
				<view class="button" style="width: 100%;" @tap="save">保存</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				swiperHeight: 0,
				timeType: '',
				selectTime: [1, 1],
				experience: {
					starTime: '',
					endTime: '',
					company: '',
					position: '',
					department: '',
					describe: '',
				},
				yearList: [],
				pickerProp: {
					start: '1970-01',
					endTime: '至今'
				},
				yearArrayComputed: []
			};
		},
		onLoad() {
			uni.$on('positionChange',data=>{
				console.log(data)
				this.experience.position = data
			})
			let workExperienceEdit = uni.getStorageSync('workExperienceEdit')
			if (workExperienceEdit) {
				this.experience.starTime = workExperienceEdit.starTime || ''
				this.experience.endTime = workExperienceEdit.endTime || ''
				this.experience.company = workExperienceEdit.company || ''
				this.experience.position = workExperienceEdit.position || ''
				this.experience.department = workExperienceEdit.department || ''
				this.experience.describe = workExperienceEdit.describe || ''
				this.experience.id = workExperienceEdit.id || ''
			}
			uni.createSelectorQuery().select('#editor').context((res) => {
				res.context.insertText({
					text: this.experience.describe
				})
			}).exec()
			uni.createSelectorQuery()
				.select('.bottom-button-box')
				.boundingClientRect(this)
				.exec(ret => {
					let height = uni.getSystemInfoSync().windowHeight;
					this.swiperHeight = height - ret[0].height
				})
		},
		computed: {
			yearArrayToNow() {
				let yearArray = [...this.yearArray]
				yearArray.push({
					value: '至今'
				})
				return yearArray
			},
			yearArray() {
				let list = []
				let startTime = new Date(this.pickerProp.start)
				let startYear = startTime.getFullYear()
				let startMonth = startTime.getMonth() + 1
				let endTime = new Date()
				let endYear = endTime.getFullYear()
				let endMonth = endTime.getMonth() + 1
				if (startYear < endYear) {
					let firstYear = {
						value: startYear,
						children: []
					}
					for (let month = startMonth; month < 13; month++) {
						firstYear.children.push(month)
					}
					list.push(firstYear)

					for (let year = startYear + 1; year < endYear; year++) {
						list.push({
							value: year,
							children: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
						})
					}

					let lastYear = {
						value: endYear,
						children: []
					}
					for (let month = 1; month < endMonth + 1; month++) {
						lastYear.children.push(month)
					}
					list.push(lastYear)
				} else if (startYear == endYear) {
					let lastYear = {
						value: endYear
					}
					for (let month = 1; month < endMonth + 1; month++) {
						lastYear.children.push(month)
					}
					list.push(lastYear)
				}
				return list
			},
			monthArray() {
				if (this.yearArrayComputed.length > 0) {
					return (this.yearArrayComputed[this.selectTime[0]] && this.yearArrayComputed[this.selectTime[0]].children) || []
				} else {
					return null
				}
			}
		},
		methods: {
			descChange (event) {
				this.experience.describe = event.detail.text
			},
			toChoosePosition () {
				//Cross-module
				uni.navigateTo({
					url: '/pages/find/recruit/positionSelection/positionSelection',
					events: {
						positionChange: (position) => {
							this.experience.position = position
						}
					}
				})
			},
			toSelectTime(type) {
				this.timeType = type
				if (type == 'endTime') {
					if (this.experience.endTime != '至今') {
						
					} else {
						
					}
					this.yearArrayComputed = this.yearArrayToNow
				} else {
					this.yearArrayComputed = this.yearArray
				}
				
				let selectYear = this.yearArrayComputed[this.yearArrayComputed.length - 1]
				let children = selectYear.children
				let selectMonth = children ? children.length - 1 : null
				this.$refs.dialog.open()
				setTimeout(() => {
					this.selectTime = [this.yearArrayComputed.length - 1, selectMonth]
				}, 100)
			},
			timeChange(event) {
				let value = event.detail.value
				let monthList = this.yearArrayComputed[value[0]].children
				if (monthList) {
					if (!(value[1] < monthList.length)) {
						value[1] = monthList.length - 1
					}
				} else {
					value[1] = null
				}
				this.selectTime = value
			},
			timeSelect() {
				let year = this.yearArrayComputed[this.selectTime[0]]
				if (year.children) {
					let month = year.children[this.selectTime[1]]
					if (month < 10) {
						month = '0' + month
					}
					this.experience[this.timeType] = `${year.value}-${month}`
				} else {
					this.experience[this.timeType] = year.value
				}
				this.$refs.dialog.close()
			},
			timeCancel() {
				this.$refs.dialog.close()
			},
			save() {
				let lastWord = this.experience.describe.substring(this.experience.describe.length - 1)
				if (lastWord == '\r\n' || lastWord == '\r' || lastWord == '\n') {
					this.experience.describe = this.experience.describe.substring(0, this.experience.describe.length - 1)
				}
				if (this.experience.starTime && this.experience.endTime && this.experience.company && this.experience.position && this.experience.department && this.experience.describe) {
					this.$http.post('admin/app/experience/update', {
						type: 2,
						...this.experience
					}).then(({data}) => {
						if (data.code === 0) {
							const eventChannel = this.getOpenerEventChannel()
							eventChannel.emit('update', data.data)
							uni.navigateBack()
						}
					})
				} else {
					uni.showToast({
						icon: 'none',
						title: '请填写全部内容'
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	.item {
		margin: 0 32rpx;
		padding-top: 32rpx;

		.item-title {
			height: 40rpx;
			line-height: 40rpx;
			font-size: 28rpx;
			font-weight: bold;
		}

		.item-content {
			margin-top: 24rpx;

			.wrap-line {
				min-height: 44rpx;
				padding: 20rpx 0;

				.wrap-line-content {
					height: 40rpx;
					line-height: 40rpx;
					flex: 200rpx 1 1;
					font-size: 28rpx;
					color: #BABEC0;
				}

				.right-icon {
					margin-left: 20rpx;
					margin-right: -14rpx;
					height: 44rpx;
					width: 44rpx;
					flex: 44rpx 0 0;
				}

				.wrap-line-input {
					flex: 200rpx 1 1;
					height: 40rpx;
					line-height: 40rpx;
				}
				.wrap-line-textarea {
					box-sizing: border-box;
					width: 100%;
					padding: 30rpx;
					border-radius: 30rpx;
					line-height: 48rpx;
					min-height: 192rpx;
					color: #666769;
					background-color: #F4F5F6;
				}
				.placeholder-class {
					color: #BABEC0;
					height: 48rpx;
					line-height: 48rpx;
				}
				.time-selected {
					color: #BABEC0;
					font-size: 0;
					height: 40rpx;
					line-height: 40rpx;
					.time-show {
						vertical-align: middle;
						display: inline-block;
						height: 40rpx;
						line-height: 40rpx;
						font-size: 28rpx;
					}
					.icon-pull-down {
						vertical-align: middle;
						margin-left: 10rpx;
						height: 34rpx;
						width: 34rpx;
					}
				}
			}
		}
	}

	.bottom-button-box {
		.botton-button-list {
			padding: 24rpx 32rpx;

			.bottom-button {
				height: 72rpx;
				line-height: 72rpx;
				border-radius: 20rpx;
				background-color: #F74437;
				color: #FFFFFF;
				font-size: 32rpx;
				font-weight: bold;
				text-align: center;
			}
		}
	}

	.picker {
		.picker-button-box {
			height: 88rpx;
			padding: 0 40rpx;
			background-color: #FFFFFF;

			.picker-button {
				height: 88rpx;
				line-height: 88rpx;
				font-size: 28rpx;

				&.sure {
					color: #F74437;
				}
			}
		}

		picker-view {
			width: 100%;
			height: 400rpx;
		}

		.picker-item {
			line-height: 100rpx;
			text-align: center;
		}
	}
</style>
