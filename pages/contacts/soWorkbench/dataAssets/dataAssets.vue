 <template>
 	<view>
 		<view class="top">
 			<view class="so">
 				{{$isEmpty(data.soName)?'':data.soName}}
 			</view>
 			<view class="assets">
 				今日数据资产估值 : {{$isEmpty(data.soAssetsWorth)?'0':data.soAssetsWorth}}元
 			</view>
 			<view class="average">
 				平台均值为{{$isEmpty(data.soAssetsAverage)?'0':data.soAssetsAverage}}元，已超过{{$isEmpty(data.soStepPercent)?'0':data.soStepPercent}}%的组织！
 			</view>
 		</view>
 		<view class="title">
 			<image :src="$ossUrl('icon_assets_trend.png')" class="title-icon" mode=""></image>
 			<view class="title-content">
 				数据资产分布
 			</view>
 			<view class="title-other" @tap='rule'>
 				规则
 			</view>
 		</view>
 		<view class="qiun-charts" style="height: 750rpx;">
 			<view v-if="$isEmpty(PieData)" class="pieEmpty">
 				暂无统计图
 			</view>
 			<canvas v-else canvas-id="canvasPie" id="canvasPie" class="charts" style="height: 750rpx;"></canvas>
 		</view>
 		<view class="title">
 			<image :src="$ossUrl('icon_assets_trend.png')" class="title-icon" mode=""></image>
 			<view class="title-content">
 				数据资产趋势
 			</view>
 		</view>
 		<view class="qiun-charts">
 			<canvas canvas-id="canvasArea" id="canvasArea" class="charts" @touchstart="touchArea"></canvas>
 		</view>
 		<view class="bottom-safe" style="height: 112rpx;">
 
 		</view>
		<cover-view class="btn">
			<cover-view class="button nextBtn" @tap="addNotice">
				账户管理
			</cover-view>
		</cover-view>
 	</view>
 </template>
 
 <script>
 	import uCharts from '@/common/u-charts.min.js';
 	var _self;
 	var canvaPie = null;
 	var canvaArea = null;
 	export default {
 		comments: {
 			uCharts
 		},
 		data() {
 			return {
 				data: '',
 				PieData: '',
 				add: 0,
 				cWidth: '',
 				cHeight: '',
 				pixelRatio: 1,
 				serverData: '',
				isAdmin:''
 			};
 		},
 		methods: {
			addNotice(){
				uni.navigateTo({
					url:`/pages/contacts/soWorkbench/dataAssets/manageAssets/manageAssets?orgId=${this.data.orgId}&isAdmin=${this.isAdmin}`
				})
			},
 			toJSON() {
 
 			},
 			rule() {
 				uni.navigateTo({
 					url: '/pages/contacts/soWorkbench/dataAssets/assetsRule/assetsRule'
 				})
 			},
 			toPercent(point) {
 				var str = Number(point * 100).toFixed(2);
 				str += "%";
 				return str;
 			},
 			getYearWeek(date) {
 				// date = formatTimebytype(date, 'yyyy-MM-dd'); //将日期转换成yyyy-mm-dd格式
 				date = new Date(date);
 				var date2 = new Date(date.getFullYear(), 0, 1);
 				var day1 = date.getDay();
 				if (day1 == 0) day1 = 7;
 				var day2 = date2.getDay();
 				if (day2 == 0) day2 = 7;
 				let d = Math.round((date.getTime() - date2.getTime() + (day2 - day1) * (24 * 60 * 60 * 1000)) / 86400000);
 				return Math.ceil(d / 7) + 1;
 			},
 			getServerData() {
 				let Pie = {
 					"series": [{
 						"name": "材料",
 						"data": this.data.soMaterialScoreWorth
 					}, {
 						"name": "任务",
 						"data": this.data.soTaskScoreWorth
 					}, {
 						"name": "纪要",
 						"data": this.data.soMeetingScoreWorth
 					}, {
 						"name": "报表",
 						"data": this.data.soReportScoreWorth
 					}, {
 						"name": "问卷",
 						"data": this.data.soQuestionnaireScoreWorth
 					}, {
 						"name": "活动",
 						"data": this.data.soActivityScoreWorth
 					}, {
 						"name": "产品",
 						"data": this.data.soProductScoreWorth
 					}]
 				}
 				Pie.series = Pie.series.filter(item => item.data > 0);
 				this.PieData = Pie.series;
 				let xwhole = []
 				this.data.xwhole.forEach((item, index) => {
 					item = '第' + this.getYearWeek(item) + '周'
 					xwhole.push(item);
 				})
 				let Area = {
 					categories: xwhole.reverse(),
 					series: [{
 						name: '数据资产',
 						data: this.data.ywhole.reverse(),
 						color: '#F74437'
 					}]
 				}
 				_self.showPie("canvasPie", Pie);
 				_self.showArea("canvasArea", Area);
 			},
 			showPie(canvasId, chartData) {
 				canvaPie = new uCharts({
 					$this: _self,
 					canvasId: canvasId,
 					type: 'rose',
 					fontSize: 11,
 					legend: {
 						show: true,
 						itemGap: '20',
 						lineHeight: 20
 					},
 					background: '#FFFFFF',
 					pixelRatio: _self.pixelRatio,
 					series: chartData.series,
 					animation: true,
 					width: _self.cWidth * _self.pixelRatio,
 					height: _self.cHeight * _self.pixelRatio * 1.5,
 					dataLabel: true,
 					extra: {
 						rose: {
 							type: 'radius',
 							minRadius: 50,
 							activeOpacity: 0.5,
 							offsetAngle: 0,
 							labelWidth: _self.cWidth / 10
 						},
 					},
 				});
 			},
 			touchPie(e) {
 				canvaPie.showToolTip(e, {
 					format: function(item) {
 						return item.name + ':' + item.data
 					}
 				});
 			},
 			showArea(canvasId, chartData) {
 				canvaArea = new uCharts({
 					$this: _self,
 					canvasId: canvasId,
 					type: 'area',
 					fontSize: 11,
 					legend: {
 						show: false
 					},
 					dataLabel: false,
 					dataPointShape: true,
 					background: '#FFFFFF',
 					pixelRatio: _self.pixelRatio,
 					categories: chartData.categories,
 					series: chartData.series,
 					animation: true,
 					padding: [15, 20, 4, 15],
 					xAxis: {
 						type: 'grid',
 						gridColor: '#CCCCCC',
 						gridType: 'dash',
 						disableGrid: true,
 						dashLength: 8,
 						boundaryGap: 'justify'
 					},
 					yAxis: {
 						gridType: 'dash',
 						gridColor: '#CCCCCC',
 						dashLength: 8,
 						splitNumber: 5,
 						disableGrid: true,
 						min: 0,
 					},
 					width: _self.cWidth * _self.pixelRatio,
 					height: _self.cHeight * _self.pixelRatio,
 					extra: {
 						area: {
 							type: 'curve',
 							opacity: 0.1,
 							addLine: true,
 							width: 1
 						}
 					}
 				});
 
 			},
 			touchArea(e) {
 				canvaArea.showToolTip(e, {
 					format: function(item, category) {
 						return item.data + '元'
 					}
 				});
 			}
 		},
 		onLoad(options) {
 			_self = this;
			this.isAdmin =options.isAdmin
			console.log(this.isAdmin)
 			this.cWidth = uni.upx2px(750);
 			this.cHeight = uni.upx2px(500);
 			this.$http.get('dms/assets_analyse/get_whole_so', {
 				params: {
 					id: options.orgId
 				}
 			}).then(res => {
 				this.data = res.data.data;
 				this.add = this.data.soMaterialScoreWorth + this.data.soTaskScoreWorth + this.data.soMeetingScoreWorth + this.data
 					.soReportScoreWorth + this.data.soProductScoreWorth + this.data.soQuestionnaireScoreWorth + this.data.soActivityScoreWorth
 				this.getServerData();
 			});
 		}
 	}
 </script>
 
 <style lang="scss">
 	// page {
 	// 	width: 750upx;
 	// 	overflow-x: hidden;
 	// }
	.btn {
		width: 100%;
		background-color: #FFFFFF;
		z-index: 999;
		position: fixed;
		bottom: 0rpx;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
	
		.nextBtn {
			width: 686rpx;
			margin: 24rpx 32rpx
		}
	}
	.bottom-safe {
		/* iphonex 等安全区设置，底部安全区适配 */
		/* #ifndef APP-NVUE */
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		/* #endif */
	}
 	.pieEmpty {
 		line-height: 750rpx;
 		text-align: center;
 		font-size: 28rpx;
 		color: #666769;
 	}
 
 	.qiun-padding {
 		padding: 2%;
 		width: 96%;
 	}
 
 	.qiun-wrap {
 		display: flex;
 		flex-wrap: wrap;
 	}
 
 	.qiun-rows {
 		display: flex;
 		flex-direction: row !important;
 	}
 
 	.qiun-columns {
 		display: flex;
 		flex-direction: column !important;
 	}
 
 	.qiun-common-mt {
 		margin-top: 10upx;
 	}
 
 	.qiun-bg-white {
 		background: #FFFFFF;
 	}
 
 	.qiun-title-bar {
 		width: 96%;
 		padding: 10upx 2%;
 		flex-wrap: nowrap;
 	}
 
 	.qiun-title-dot-light {
 		border-left: 10upx solid #0ea391;
 		padding-left: 10upx;
 		font-size: 32upx;
 		color: #000000
 	}
 
 	/* 通用样式 */
 	.qiun-charts {
 		width: 750upx;
 		height: 500upx;
 		background-color: #FFFFFF;
 	}
 
 	.charts {
 		width: 750upx;
 		height: 500upx;
 		background-color: #FFFFFF;
 	}
 
 	.title {
 		margin: 32rpx;
 		display: flex;
 		align-items: center;
 
 		.title-icon {
 			width: 44rpx;
 			height: 44rpx;
 		}
 
 		.title-content {
 			margin-left: 10rpx;
 			font-weight: bold;
 			color: #000000;
 			font-size: 32rpx;
 			line-height: 44rpx;
 			flex: 1;
 		}
 
 		.title-other {
 			color: #F74437;
 			font-size: 28rpx;
 			line-height: 40rpx;
 		}
 	}
 
 	.distributed {
 		margin: 32rpx;
 		color: #666769;
 		font-size: 22rpx;
 		line-height: 32rpx;
 		display: flex;
 		flex-wrap: wrap;
 
 		.item {
 			margin-bottom: 30rpx;
 			width: 167.5rpx;
 			display: flex;
 			flex-direction: column;
 			align-items: center;
 		}
 
 		.name {
 			color: #666769;
 			font-size: 22rpx;
 			line-height: 32rpx;
 		}
 
 		.num {
 			color: #666769;
 			font-size: 22rpx;
 			line-height: 32rpx;
 		}
 	}
 
 	.top {
 		margin: 32rpx 0 0 32rpx;
 		width: 686rpx;
 		height: 272rpx;
 		background-image: url('https://woneng-oss.oss-cn-hangzhou.aliyuncs.com/wxapp/bg_dataAssets.png');
 		background-size: 100% 100%;
 		background-repeat: no-repeat;
 		display: flex;
 		flex-direction: column;
 		justify-content: center;
 		align-items: center;
 
 		.so {
 			font-weight: bold;
 			font-size: 36rpx;
 			line-height: 50rpx;
 			color: #FFFFFF;
 		}
 
 		.assets {
 			margin-top: 20rpx;
 			color: #FFFFFF;
 			padding: 10rpx 35rpx;
 			font-size: 28rpx;
 			line-height: 40rpx;
 			border: 2rpx solid #FFFFFF;
 			border-radius: 60rpx;
 		}
 
 		.average {
 			margin-top: 30rpx;
 			color: #FFFFFF;
 			font-size: 28rpx;
 			line-height: 40rpx;
 		}
 	}
 </style>
