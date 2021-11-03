<template>
	<view>
		<view class="list top-title">
			<view class="list-title">头衔</view>
			<view class="list-text">{{getCompanyStation(data.company, data.station)}}</view>
		</view>
		<view class="list"><view class="list-title">工作经历</view></view>
		<view class="list">
			<view class="list-second-title">单位</view>
			<view class="list-text">{{ data.workExperience[0].company }}</view>
		</view>
		<view class="list">
			<view class="list-second-title">职务</view>
			<view class="list-text">{{ data.workExperience[0].jobs }}</view>
		</view>
		<view class="list top-title">
			<view class="list-second-title">在职时间</view>
			<view class="list-text" v-if="data.workExperience && data.workExperience.length>0">
				<text v-if="data.workExperience[0].starTime!=''">{{ data.workExperience[0].starTime }}</text>
				<text v-if="data.workExperience[0].endTime!='请选择'&& data.workExperience[0].starTime!=''">至</text>
				<text v-if="data.workExperience[0].endTime!='请选择'">{{ data.workExperience[0].endTime }}</text>
			</view>
		</view>
		<view class="list"><view class="list-title">教育经历</view></view>
		<view class="list">
			<view class="list-second-title">学校</view>
			<view class="list-text">{{ data.learningSituation[0].school }}</view>
		</view>
		<view class="list">
			<view class="list-second-title">学历</view>
			<view class="list-text">{{ data.learningSituation[0].education }}</view>
		</view>
		<view class="list top-title">
			<view class="list-second-title">专业</view>
			<view class="list-text">{{ data.learningSituation[0].content }}</view>
		</view>
		<view class="list"><view class="list-title">自我描述</view></view>
		<view class="list remarkList">
			<view class="list-text introduction">{{ $isEmpty(data.introduction)?'':data.introduction }}</view>
		</view>
	</view>
</template>

<script>
import { getCompanyStation} from '@/common/utils.js';
export default {
	data() {
		return {
			data: ''
		};
	},
	methods: {
		getCompanyStation
	},
	onLoad(option) {
		this.$http.get('admin/app/simple/style/' + option.id).then(res => {
			console.log(res.data.data);
			this.data = res.data.data;
		});
	}
};
</script>

<style lang="scss">
.top-title{
	border-bottom: 0.3px #eff0f1 solid;
}
.remarkList{
	padding-top: 24rpx;
	.introduction{
		justify-content: flex-start;
	}
}
.list {
	margin-left: 40rpx;
	margin-right: 24rpx;
	padding-top: 43rpx;
	padding-bottom: 16rpx;
	font-size: 28rpx;
	display: flex;
	align-items: center;
	.list-title {
		color: #303031;
		font-weight: bold;
	}
	.list-second-title{
		margin-right:40rpx;
		color: #303031;
	}
	.list-text {
		flex: 1;
		color: #919397;
		display: flex;
		justify-content: flex-end;
	}
	.list-end {
		margin-right: -16rpx;
		height: 44rpx;
		width: 44rpx;
	}
}
</style>
