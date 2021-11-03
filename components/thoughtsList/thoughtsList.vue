<template>
	<view>
		<view class="talk">
			<view class="talk-item" v-for="(item,index) in talk.records" :key="index" @tap="goThoughtsDetails(item)">
				<view class="talk-item-title flexRowStart">
					<image lazy-load="true" class="avatarImg" style="width: 64rpx;height: 64rpx;" :src="item.avatar" mode="aspectFill" @tap.stop="goCannerCard(item)"></image>
					<view class="talk-item-title-text">
						<view class="name color_303031 bold talk-item-title-text-name">{{ $isEmpty(item.userName)?'':item.userName }}</view>
						<view class="color_BABEC0" style="font-size: 24rpx;line-height: 34rpx;margin-top: 10rpx;">{{$isEmpty(item.createTime)?'':item.createTime}}</view>
					</view>
				</view>
				<view class="talk-text quadraEllipsis color_303031">
					{{ $isEmpty(item.content)?'':item.content }}
				</view>
				<view v-if="item.images.length == 1" class="talk-imgs">
					<image mode="aspectFill" class="talk-img-single" lazy-load="true" :src="item.images[0]" @tap.stop="previewImage(item.images,0)"></image>
				</view>
				<view v-else class="talk-imgs">
					<image lazy-load="true" mode="aspectFill" class="talk-img" :src="item2" v-for="(item2,index2) in item.images" :key="index2"
					 @tap.stop="previewImage(item.images,index2)"></image>
				</view>
				<view class="attachContent" v-if="item.attach" @tap.stop="goRelationDetails(item)">
					<view class="flexRowStart wrapAttach" style="background-color: #F4F5F6;">
						<image class="attachImg" v-if="item.attach.type== 'material' && oss" :src="oss+'icon_icanThought_material.png'"></image>
						<image class="attachImg" v-else-if="item.attach.type== 'activity' && oss" :src="oss+'icon_icanThought_activity.png'"></image>
						<image class="attachImg" v-else-if="item.attach.type=='task' && oss" :src="oss+'icon_thoughtsRelation_task.png'"></image>
						<image class="attachImg" v-else-if="item.attach.type=='questionnaire' && oss" :src="oss+'icon_icanThought_questionnaire.png'"></image>
						<image class="attachImg" v-else-if="item.attach.type =='products'|| item.attach.type == 'program' && oss" :src="oss+'icon_icanThought_magicBox.png'"></image>
						<view class="attachInfo">
							<view class="color_303031 bold" v-if="item.attach.type== 'material'">
								材料
							</view>
							<view class="color_303031 bold" v-else-if="item.attach.type== 'activity'">
								活动
							</view>
							<view class="color_303031 bold" v-else-if="item.attach.type=='task'">
								任务
							</view>
							<view class="color_303031 bold" v-else-if="item.attach.type=='questionnaire'">
								问卷
							</view>
							<view class="color_303031 bold" v-else-if="item.attach.type =='products'|| item.attach.type == 'program' ">
								魔方
							</view>
							<view class="singleEllipsis color_666769 attachTitle">
								{{item.attach.title}}
							</view>
						</view>
					</view>
				</view>
				<view class="reply" v-if="!$isEmpty(item.transmittedThoughts)">
					<!-- <view class="talk-item-title">
						<image class="avatar" :src="item.transmittedThoughts.avatar"></image>
						<view class="talk-item-title-text">
							<view class="name">{{ item.transmittedThoughts.userName}}</view>
						</view>
					</view> -->
					<view class="talk-text quadraEllipsis" v-if="item.transmittedThoughts.content">
						<text @tap.stop="goCannerCard(item.transmittedThoughts)" class="color_2F80FF" style="margin-right: 20rpx;">{{item.transmittedThoughts.userName}}:</text>
						{{item.transmittedThoughts.content}}
					</view>
					<view v-if="item.transmittedThoughts.images.length == 1" class="talk-imgs">
						<image lazy-load="true" mode="aspectFill" class="talk-img-single" :src="item.transmittedThoughts.images[0]" @tap.stop="previewImage(item.transmittedThoughts.images,0)"></image>
					</view>
					<view v-else class="talk-imgs">
						<image lazy-load="true" mode="aspectFill" class="talk-img" :src="item2" v-for="(item2,index2) in item.transmittedThoughts.images"
						 :key="index2" @tap.stop="previewImage(item.transmittedThoughts.images,index2)"></image>
					</view>
					<view class="attachContent" v-if="item.transmittedThoughts.attach" @tap.stop="goThoughtsDetails(item.transmittedThoughts)">
						<view class="flexRowStart wrapAttach" style="background-color: #FFFFFF">
							<image class="attachImg" v-if="item.transmittedThoughts.attach.type== 'material' && oss" :src="oss+'icon_icanThought_material.png'"></image>
							<image class="attachImg" v-else-if="item.transmittedThoughts.attach.type== 'activity' && oss" :src="oss+'icon_icanThought_activity.png'"></image>
							<image class="attachImg" v-else-if="item.transmittedThoughts.attach.type=='task' && oss" :src="oss+'icon_thoughtsRelation_task.png'"></image>
							<image class="attachImg" v-else-if="item.transmittedThoughts.attach.type=='questionnaire' && oss" :src="oss+'icon_icanThought_questionnaire.png'"></image>
							<image class="attachImg" v-else-if="item.transmittedThoughts.attach.type =='products'|| item.attach.type == 'program' && oss" :src="oss+'icon_icanThought_magicBox.png'"></image>
							<view class="attachInfo">
								<view class="color_303031 bold" v-if="item.transmittedThoughts.attach.type== 'material'">
									材料
								</view>
								<view class="color_303031 bold" v-else-if="item.transmittedThoughts.attach.type== 'activity'">
									活动
								</view>
								<view class="color_303031 bold" v-else-if="item.transmittedThoughts.attach.type=='task'">
									任务
								</view>
								<view class="color_303031 bold" v-else-if="item.transmittedThoughts.attach.type=='questionnaire'">
									问卷
								</view>
								<view class="color_303031 bold" v-else-if="item.transmittedThoughts.attach.type =='products' || item.attach.type == 'program'">
									魔方
								</view>
								<view class="singleEllipsis color_666769 attachTitle">
									{{item.transmittedThoughts.attach.title}}
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="talk-end">
					<view class="center" v-if="$isEmpty(item.transmittedThoughts)" @tap.stop="commentsOpen('share',item)">
						<image v-if="oss" class="talk-icon" :src="oss+'thought_share.png'"></image>
						<view class="talk-end-text color_666769">{{ $isEmpty(item.transmittedTimes)?'0':item.transmittedTimes}}</view>
					</view>
					<view class="center">
						<image v-if="oss" class="talk-icon" :src="oss+'thought_comment.png'"></image>
						<view class="talk-end-text color_666769">{{ $isEmpty(item.commentNum)?'0':item.commentNum}}</view>
					</view>
					<view class="center" @tap.stop="addThumbsUp(item)">
						<image v-if="oss && item.praiseStatus == 1" class="talk-icon" :src="oss+'thought_praise.png'"></image>
						<image v-else-if="oss" class="talk-icon" :src="oss+'thought_unPraise.png'"></image>
						<view class="talk-end-text color_666769">{{ $isEmpty(item.thumbsUpCount)?0:item.thumbsUpCount}}</view>
					</view>
				</view>
			</view>
		</view>
		<image v-if="!talk.records.length>0 && oss" :src="oss+'pic_noMessage.png'" mode="aspectFit" style="width: 100%;"></image>
		<uni-load-more :status="moreStatus" v-if="talk.records.length>0"></uni-load-more>
		<view class="bottom-safe" style=""></view>
	</view>
</template>

<script>
	import {
		previewImage
	} from '@/common/utils.js';
	export default {
		props:{
			talk:Object,
			moreStatus:String
		},
		data() {
			return {
				oss:''
			};
		},
		onReady() {
			this.oss=this.$oss
		},
		methods:{
			commentsOpen(type,item){
				this.$emit('thoughtsComment',type,item)
			},
			goThoughtsDetails(item) {
				uni.navigateTo({
					url: `/pages/find/attention/detail/detail?id=${item.thoughtsId}`
				})
			},
			goCannerCard(item){
				this.$emit('cannerThought',item)
			},
			addThumbsUp(item) {
				this.$http.get('dms/app/add_thumbs_up/' + item.thoughtsId).then(res => {
					if (res.data.data == true) {
						if (item.praiseStatus == 0) {
							item.praiseStatus = 1;
							item.thumbsUpCount++
						} else if (item.praiseStatus == 1) {
							item.praiseStatus = 0;
							item.thumbsUpCount--
						}
					}
				});
			},
			goRelationDetails(item) {
				if (item.attach.type == 'activity') {
					uni.navigateTo({
						url: `/pages/contacts/soWorkbench/soInfo/soActivity/soActivityDetails/soActivityDetails?id=${item.attach.relationId}`
					})
				} else if (item.attach.type == 'questionnaire') {
					uni.navigateTo({
						url: `/pages/contacts/soWorkbench/soInfo/soQuestionnaire/questionnaireDetails/questionnaireDetails?id=${item.attach.relationId}`
					})
				} else if (item.attach.type == 'material') {
					uni.navigateTo({
						url: `/pages/contacts/soWorkbench/soInfo/soMaterial/materialKind/materialDetails/materialDetails?id=${item.attach.relationId}`
					})
				} else if (item.attach.type == 'products'|| item.attach.type == 'program') {
					uni.navigateTo({
						url: `/pages/find/magicBox/detail/detail?id=${item.attach.relationId}`
					})
				} else if (item.attach.type == 'task') {
					uni.navigateTo({
						url: `/pages/ican/taskDetail/taskDetail?taskId=${item.attach.relationId}`
					})
				}
			},
			previewImage
		}
	}
</script>

<style lang="scss">
	.avatarImg{
		width: 92rpx;
		height: 92rpx;
		border-radius: 50%;
	}
</style>
