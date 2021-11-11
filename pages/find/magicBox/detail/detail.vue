<template>
	<view style="background-color: #FFFFFF;">
		<!-- <view class="firstContent" id="title">
			<view class="titleWrap flexRow" style="justify-content: center;">
				<view class="flexColumn" :class="[{ active: detailsStatus }, { unactive: !detailsStatus }]" @tap="toDetails">
					<view class="">
						商品
					</view>
					<view class="active_line"></view>
				</view>
				<view class="flexColumn" :class="[{ active: commentStatus }, { unactive: !commentStatus }]" @tap="toComments">
					<view class="">
						评论
					</view>
					<view class="active_line"></view>
				</view>
				<view class="flexColumn" :class="[{ active: recommendStatus }, { unactive: !recommendStatus }]" @tap="toRecommend">
					<view class="">
						推荐
					</view>
					<view class="active_line"></view>
				</view>
			</view>
		</view> -->
		<scroll-view scroll-y="true" :style="{height:scrollHeight+'px'}" :scroll-top="scrollTop">
			<view class="detail" id="A">
				<view class="detail_info flexRowStart">
					<image class="poster" :src="data.imageUrl"></image>
					<view class="detail_info_wrap flexColumnStart" style="justify-content: space-between;">
						<view class="detail_info_wrap_name">
							{{$isEmpty(data.name)?'':data.name}}
						</view>
						<view class="detail_info_wrap_money">
							<view v-if="data.isFree==1">免费</view>
							<!-- <view v-if="data.isFree==0">{{$isEmpty(data.price)?'':data.price+'贝'}}<text v-if="data.cash>0">
								<text v-if="data.cash&&data.price">/</text>{{$isEmpty(data.cash)?'':data.cash+'元'}}</text>
							</view> -->
							<view v-if="data.isFree==0" class="">
								{{getMoney(data)}}
							</view>
						</view>
					</view>
				</view>
				<view class="detail_num flexRow">
					<view class="detail_num_item flexColumn">
						<view class="detail_num_item_title">{{$isEmpty(data.score)?'暂无':data.score.toFixed(1)}}</view>
						<view class="detail_num_item_text">评分</view>
					</view>
					<view class="detail_num_item flexColumn">
						<view class="detail_num_item_title">{{$isEmpty(data.followCount)?0:data.followCount}}</view>
						<view class="detail_num_item_text">收藏</view>
					</view>
					<view class="detail_num_item flexColumn">
						<view class="detail_num_item_title">{{$isEmpty(data.viewTimes)?0:data.viewTimes}}</view>
						<view class="detail_num_item_text">浏览</view>
					</view>
					<view class="detail_num_item flexColumn">
						<button class="shareBtn" open-type="share">
							<image :src="$ossUrl('serviceDetail_share.png')" mode="" style="width: 40rpx;height: 40rpx;"></image>
							<view class="detail_num_item_text">分享</view>
						</button>
					</view>
					<!-- <view class="detail_num_item flexColumn">
						<image :src="$ossUrl('serviceDetail_free.png')" mode="" style="width: 40rpx;height: 40rpx;"></image>
						<view class="detail_num_item_text">试用</view>
					</view> -->
				</view>
				<view class="detail_img" v-if="data.images && data.images.length>0">
					<scroll-view scroll-x style="white-space: nowrap;">
						<view class="" style="width: 32rpx;height:384rpx;background-color: #FFFFFF;display: inline-block;">
						</view>
						<view v-for="(item,index) of data.images" :key="index" :style="{width:[data.images.length>1?'658rpx':'686rpx']}" class="detail_img_item">
							<image :src="item" mode="" style="width: 100%;height: 100%;" @tap.stop="previewImage(data.images,index)"></image>
						</view>
					</scroll-view>
				</view>
				<view class="detail_label flexRowStart" v-if="data.tagKeywords && data.tagKeywords.length>0">
					<view v-for="(item,index) of data.tagKeywords" :key="index" class="detail_label_item singleEllipsis">
						{{$isEmpty(item)?'':item}}
					</view>
				</view>
			</view>
			<view class="" style="background-color: #f5f7f8;height: 16rpx;width: 100%;"  id="line">
				
			</view>
			<view class="intro" id="B">
				<view class="soIntro flexRow" @tap="goSoCard(data.orgId)">
					<view class="soIntroWrap flexRowStart">
						<image :src="data.orgImg" mode="" style="width: 92rpx;height: 92rpx;border-radius: 50%; margin-right: 24rpx;"></image>
						<view class="soIntroWrap_name">
							<view class="singleEllipsis">
								{{$isEmpty(data.orgName)?'':data.orgName}}
							</view>
							<view class="soIntroWrap_name_text">
								发布组织
							</view>
						</view>
					</view>
					<image :src="$ossUrl('home_arrowright.png')" mode="" style="width: 14rpx;height: 40rpx;"></image>
				</view>
				<view class="introDetail">
					<view class="introDetail_title">
						简介
					</view>
					<view class="">
						<view class="introDetail_info" id="introDetail_info" v-if="introHeight<106">
							{{$isEmpty(data.description)?'暂无简介':data.description}}
						</view>
						<view class="" v-else>
							<view class="introDetail_info_more" id="introDetail_info" :style="{height:(detailStatus?'100%':'212rpx')}">
								{{$isEmpty(data.description)?'暂无简介':data.description}}
							</view>
							<view class="flexRow" @tap="detailStatus=true" style="justify-content: center;font-size: 24rpx;line-height: 34rpx;color: #2B579F;" v-if="detailStatus==false">
								展开详情
							</view>
							<view class="flexRow" @tap="detailStatus=false" style="justify-content: center;font-size: 24rpx;line-height: 34rpx;color: #2B579F;" v-else>
								收起详情
							</view>
						</view>
					</view>
				</view>
				<view class="intro_relation" v-if="data.relations && data.relations.length>0">
					<view class="intro_relation_title flexRow">
						<view>关联产品</view>
						<view class="intro_relation_title_more flexRowStart" v-if="data.relations.length>3" @tap="checkMore">
							<view class="" style="margin-right: 16rpx;">
								更多
							</view>
							<image :src="$ossUrl('home_arrowright.png')" mode="" style="width: 14rpx;height: 40rpx;"></image>
						</view>
					</view>
					<view class="flexRowStart intro_relation_item" v-for="(item,index) of data.relations" :key="index" @tap="gomagicBox(item.id)">
						<image style="width: 140rpx;height: 140rpx;margin-right: 24rpx;border-radius: 8rpx;" :src="item.imageUrl" mode=""></image>
						<view class="intro_relation_item_info flexColumnStart">
							<view class="intro_relation_item_info_name">
								{{$isEmpty(item.name)?'':item.name}}
							</view>
							<view class="intro_relation_item_info_label flexRowStart">
								<view class="intro_relation_item_info_label_item" v-for="(item2,index2) of item.tagKeywords" :key="index2">
									{{$isEmpty(item2)?'':item2}}
								</view>
							</view>
							<view class="flexRow intro_relation_item_info_money">
								<view class="intro_relation_item_info_money_wrap">
									<view v-if="item.isFree==1">免费</view>
									<view v-if="item.isFree==0">{{$isEmpty(item.price)?'':item.price+'贝'}}<text v-if="item.cash>0">
										<text v-if="item.cash&&item.price">/</text>{{$isEmpty(item.cash)?'':item.cash+'元'}}</text>
									</view>
								</view>
								<view class="flexRowStart">
									<image :src="$ossUrl('home_star.png')" mode="" style="width: 26rpx;height: 26rpx;"></image>
									<view class="" style="margin-left: 10rpx;font-size: 24rpx;line-height: 40rpx;color: #9AA1A7;">
										{{$isEmpty(item.score)?'暂无评分':item.score.toFixed(1)}}分
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="" style="background-color: #f5f7f8;height: 16rpx;width: 100%;"  id="line">
				
			</view>
			<view class="comment" id="C">
				<view class="comment_title flexRow">
					<view>评价</view>
					<!-- <view class="color_2F80FF center" @tap="goComment">发布评论<image v-if="oss" class="edit-img" :src="oss+'icon_edit_blue.png'"></image>
					</view> -->
					<view class="comment_title_more flexRowStart" v-if="comment.records.length>3" @tap="checkCommentMore">
						<view class="">
							全部评论
						</view>
						<image :src="$ossUrl('home_arrowright.png')" mode="" style="width: 14rpx;height: 40rpx;margin-left: 16rpx;"></image>
					</view>
				</view>
				<view class="comment_all flexRow">
					<view class="comment_all_info flexRowStart">
						<view class="" style="font-size: 58rpx;line-height: 56rpx;color: #F73737;font-weight: bold;margin-right: 16rpx;">
							{{$isEmpty(data.score)?'暂无':data.score.toFixed(1)}}
						</view>
						<view class="flexColumnStart" style="height: 100%;">
							<view class="" style="margin-bottom: 4rpx;">
								累计{{$isEmpty(comment.total)?'0':comment.total}}个评分
							</view>
							<uni-rate margin="2" size="16" disabled="true" :value="data.score"></uni-rate>
						</view>
					</view>
					<!-- <view class="color_2F80FF center" @tap="goComment">发布评论<image v-if="oss" class="edit-img" :src="oss+'icon_edit_blue.png'"></image>
					</view> -->
					<view class="comment_all_publish flexRowStart" @tap="goComment">
						<view class="">
							发表评论
						</view>
						<image v-if="oss" class="edit-img" :src="oss+'icon_edit_blue.png'" style="width: 32rpx;height: 32rpx;margin-left: 8rpx;"></image>
					</view>
				</view>
				<view class="" v-if="comment.records && comment.records.length>0">
					<view class="commentList" v-for="(item,index) in comment.records" :key="index" v-if="index<3">
						<view class="commentList_item flexRow">
							<view class="commentList_item_wrap flexRowStart">
								<image :src="item.userImg" mode="" class="commentList_item_item_avatar"></image>
								<view class="flexColumnStart">
									<view class="commentList_item_item_name">
										{{$isEmpty(item.commentator)?'':item.commentator}}
									</view>
									<view class="">
										<uni-rate margin="2" size="24" disabled="true" :value="item.rank"></uni-rate>
									</view>
								</view>
							</view>
							<view class="commentList_item_time">{{$isEmpty(item.updateTime)?'':item.updateTime.split(' ')[0]}}</view>
						</view>
						<view class="comment-content">
							{{$isEmpty(item.content)?'':item.content}}
						</view>
					</view>
				</view>				
			</view>
		<!-- 	<view class="" style="background-color: #f5f7f8;height: 16rpx;width: 100%;" id="line">
				
			</view> -->
		<!-- 	<view class="recommend" id="D">
				<view class="recommend_relation_title flexRow">
					<view>推荐</view>
				</view>
				<view class="">
					<view class="flexRowStart recommend_relation_item" v-for="(item,index) of data.recommends" :key="index" @tap="gomagicBox(item.id)">
							<image style="width: 140rpx;height: 140rpx;margin-right: 24rpx;border-radius: 8rpx;" :src="item.imageUrl" mode=""></image>
							<view class="recommend_relation_item_info flexColumnStart">
								<view class="recommend_relation_item_info_name">
									{{item.name}}
								</view>
								<view class="recommend_relation_item_info_label flexRowStart">
									<view class="recommend_relation_item_info_label_item" v-for="(item2,index2) of item.tagKeywords" :key="index2">
										{{item2}}
									</view>
								</view>
								<view class="flexRow recommend_relation_item_info_money">
									<view class="recommend_relation_item_info_money_wrap">
										<view v-if="item.isFree==1">免费</view>
										<view v-if="item.isFree==0">{{$isEmpty(item.price)?'':item.price+'贝'}}<text v-if="item.cash>0">
											<text v-if="item.cash&&item.price">/</text>{{$isEmpty(item.cash)?'':item.cash+'元'}}</text>
										</view>
									</view>
									<view class="flexRowStart">
										<image :src="$ossUrl('home_star.png')" mode="" style="width: 26rpx;height: 26rpx;"></image>
										<view class="" style="margin-left: 10rpx;font-size: 24rpx;line-height: 40rpx;color: #9AA1A7;">
											{{$isEmpty(item.score)?'暂无评分':item.score}}
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="" style="background-color: #f5f7f8;height: 16rpx;width: 100%;" id="line">
					
				</view> -->
		</scroll-view>
		<view class="bottom" id="btn">
			<view class="bottom-item" v-if="data.certificationStatus==2 && userId != data.createBy">
				<!-- <button class="button" open-type="share">
					分享
				</button> -->
				<view class="flexColumn" style="height:92rpx;justify-content: space-between;margin-right: 82rpx;margin-left: 50rpx;" @tap="attentionMagicBox">
					<image v-if="data.collect==false" :src="$ossUrl('materialDetail_collect.png')" mode="" style="width: 44rpx;height: 44rpx;"></image>
					<image v-else :src="$ossUrl('home_star.png')" mode="" style="width: 44rpx;height: 44rpx;"></image>
					<view class="" style="color: #272727;font-size: 26rpx;line-height: 36rpx;">
						收藏
					</view>
				</view>
				<view @tap="buy" class="payBtn">购买</view>
			</view>
			<view class="bottom-item" v-if="data.certificationStatus==1 &&userId == data.createBy">
				<view @tap="cancelAudit" class="payBtn">取消审核</view>
			</view>
			<view class="bottom-item" v-if="data.certificationStatus==2 && userId == data.createBy">
				<view @tap="soldOut" class="payBtn">下架</view>
			</view>
			<view class="bottom-item" v-if="(data.certificationStatus==0 || data.certificationStatus==3) && userId == data.createBy">
				<view @tap="edit" class="payBtn" style="margin-right: 24rpx;">编辑</view>
				<view @tap="submit" class="payBtn">提交</view>
			</view>
		</view>
		<uni-popup ref="cancelAuditDialog" type="center">
			<view class="popDialog">
				<view class="color_666769 message">
					是否确定取消审核
				</view>
				<view class="flexRow">
					<view class="button noRepeat" @tap="cancel">
						取消
					</view>
					<view class="button repeatNow" @tap="confirm">
						确定
					</view>
				</view>
			</view>
		</uni-popup>
		<uni-popup ref="submitAuditDialog" type="center">
			<view class="popDialog">
				<view class="color_666769 message">
					是否确定提交审核
				</view>
				<view class="flexRow">
					<view class="button noRepeat" @tap="cancelSubmit">
						取消
					</view>
					<view class="button repeatNow" @tap="confirmSubmit">
						确定
					</view>
				</view>
			</view>
		</uni-popup>
		<uni-popup ref="soldOutDialog" type="center">
			<view class="popDialog">
				<view class="color_666769 message">
					是否确定下架
				</view>
				<view class="flexRow">
					<view class="button noRepeat" @tap="cancelSoldOut">
						取消
					</view>
					<view class="button repeatNow" @tap="confirmSoldOut">
						确定
					</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import {
		isEmpty,
		gomagicBox,
		previewImage,
		goSoCard
	} from '@/common/utils.js'
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	export default {
		data() {
			return {
				data:{},
				oss:'',
				id:'',
				userId:'',
				status:'',
				versionTime:'',
				detailsStatus:true,
				commentStatus:false,
				recommendStatus:false,
				scrollHeight:'',
				toView:'',
				scrollTop:0,
				comment:{
					records:[]
				},
				moreStatus:'more',
				firstScroll:0,
				firstHeight:0,
				secondScroll:0,
				secondHeight:0,
				thirdScroll:0,
				thirdHeight:0,
				introHeight:0,
				detailStatus:false,
			};
		},
		methods: {
			isEmpty,
			gomagicBox,
			previewImage,
			goSoCard,
			cancel(){
				this.$refs.cancelAuditDialog.close()
			},
			confirm(){
				this.$http.post('dms/product/user_certify',{
					id:this.data.id,
					status:0
				}).then(res=>{
					// console.log(res)
					if(res.data.code ==0){
						this.data.certificationStatus=0
					}
					this.$refs.cancelAuditDialog.close()
				})
			},
			cancelAudit(){
				this.$refs.cancelAuditDialog.open()
			},
			cancelSubmit(){
				this.$refs.submitAuditDialog.close()
			},
			confirmSubmit(){
				this.$http.post('dms/product/user_certify',{
					id:this.data.id,
					status:1
				}).then(res=>{
					// console.log(res)
					if(res.data.code ==0){
						this.data.certificationStatus=1
					}
					this.$refs.submitAuditDialog.close()
				})
			},
			submit(){
				this.$refs.submitAuditDialog.open()
			},
			cancelSoldOut(){
				this.$refs.soldOutDialog.close()
			},
			confirmSoldOut(){
				this.$http.post('dms/product/user_certify',{
					id:this.data.id,
					status:0
				}).then(res=>{
					// console.log(res)
					if(res.data.code ==0){
						this.data.certificationStatus=0
					}
					this.$refs.soldOutDialog.close()
				})
			},
			soldOut(){
				this.$refs.soldOutDialog.open()
			},
			edit(){
				uni.navigateTo({
					url:`/pages/ican/publishService/publishService?id=${this.data.id}`
				})
			},
			checkMore(){
				uni.navigateTo({
					url:'/pages/find/relationServiceList/relationServiceList?id=' + this.id
				})
			},
			checkCommentMore(){
				uni.navigateTo({
					url:'/pages/find/commentServiceList/commentServiceList?id=' + this.id + '&type=' +this.data.type
				})
			},
			attentionMagicBox() {
				if (this.data.collect == false) {
					this.$http.post('dms/collection/create', {
						targetId: this.data.id,
						type: 6,
					}).then(res => {
						this.data.collect = true;
						this.data.followCount++;
					})
				} else {
					this.$http.post('dms/collection/app/delete', {
						targetIds: [this.data.id],
						type: 6,
					}).then(res => {
						if (res.data.code == 0) {
							this.data.collect = false;
							this.data.followCount--;
						}
					})
				}
			},
			toDetails(){
				// this.detailsStatus=true
				// this.commentStatus=false
				// this.recommendStatus=false
				// this.scrollTop=0
			},
			toComments(){
				// if(this.secondHeight + this.thirdHeight< this.scrollHeight/2){
				// 	//DC高之和小于AB高度，则直接触底
				// 	// this.toView = 'C'
				// 	this.scrollTop=this.scrollHeight
				// }else{
				// 	this.detailsStatus=false
				// 	this.commentStatus=true
				// 	this.recommendStatus=false
				// 	// this.toView = 'C'
				// 	this.scrollTop=this.secondScroll-this.scrollHeight/2+1
				// }
			},
			toRecommend(){
				// if(this.secondHeight + this.thirdHeight> this.scrollHeight/2 && this.thirdHeight<this.scrollHeight/2){
				// 	//DC高之和大于滚动高度，D高不大于C，则直接触底，状态为C的状态
				// 	this.scrollTop= this.secondScroll +this.scrollHeight/2
				// 	this.detailsStatus=false
				// 	this.commentStatus=true
				// 	this.recommendStatus=false
				// }
				// else if(this.secondHeight + this.thirdHeight<this.scrollHeight/2){
				// 	//DC高之和小于AB高度，则直接触底
				// 	this.scrollTop=this.scrollHeight
				// }
				// else{
				// 	this.detailsStatus=false
				// 	this.commentStatus=false
				// 	this.recommendStatus=true
				// 	this.scrollTop= this.thirdScroll-this.scrollHeight/2+1
				// 	// console.log(this.scrollTop)
				// }
			},
			goComment() {
				uni.navigateTo({
					url: '../comment/comment?targetId=' + this.data.id + '&type=' + this.data.type
				})
			},
			buy() {
				uni.navigateTo({
					url: '../order/order?id=' + this.data.id + '&type=' + this.data.type
				})
			},
			changeStatus(e){
				let distance = e.detail.scrollTop+this.scrollHeight/2
				// console.log(e)
				this.scrollTop=e.detail.scrollTop
				// console.log(distance)
				if(distance>0 && distance<this.secondScroll){
					this.detailsStatus = true
					this.commentStatus=false
					this.recommendStatus=false
				}else if(distance<this.thirdScroll && distance>this.secondScroll){
					this.detailsStatus = false
					this.commentStatus=true
					this.recommendStatus=false
				}else if (distance>this.thirdScroll){
					this.detailsStatus = false
					this.commentStatus=false
					this.recommendStatus=true
				}
			},
			getMoney(ticket) {
				if (ticket.price != 0 && ticket.cash==0) {
					return `${ticket.price}贝`;
				} else if (ticket.cash!=0&& ticket.price == 0) {
					return `${ticket.cash}元`;
				} else if (ticket.cash != 0 && ticket.price != 0) {
					return `${ticket.price}贝/${ticket.cash}元`;
				}else{
					return `0`;
				}
			},
		},
		onLoad(options) {
			this.oss = this.$oss
			this.userId = uni.getStorageSync('userinfo').user_id
			// console.log(this.userId)
			this.id = options.id;
		},
		onShareAppMessage(res) {
			this.$http.post('admin/mark/save', {
				section: 'products', //板块
				relationId: this.id,
				// #ifdef  MP-WEIXIN
				markSource: 'wechat', //留痕来源
				// #endif
				// #ifdef  MP-QQ
				markSource: 'qq',
				// #endif
				markTarget: 'wechat', //留痕目标
				markType: 'share', //留痕类型
				remark: '',
			}).then(res => {
				console.log(res)
			});
			if (res.from === 'button') { // 来自页面内分享按钮
				console.log(res.target)
			}
			return {
				title: this.data.name,
				path: '/pages/find/magicBox/detail/detail?id=' + this.id
			}
		},
		onShareTimeline(res) {
			this.$http.post('admin/mark/save', {
				section: 'products', //板块
				relationId: this.id,
				// #ifdef  MP-WEIXIN
				markSource: 'wechat', //留痕来源
				// #endif
				// #ifdef  MP-QQ
				markSource: 'qq',
				// #endif
				markTarget: 'moments', //留痕目标
				markType: 'share', //留痕类型
				remark: '',
			}).then(res => {
				console.log(res)
			});
			if (res.from === 'button') { // 来自页面内分享按钮
				console.log(res.target)
			}
			return {
				title: this.data.name,
				imageUrl: this.data.imageUrl
			}
		},
		onShow() {
				this.$http.get('dms/app/shop', {
					params: {
						id: this.id
					}
				}).then(res => {
					this.data = res.data.data;
					this.status = this.data.isFollowed
					if (!this.$isEmpty(this.data.versionTime)) {
						this.versionTime = this.data.versionTime.substring(0, 10)
					}
					this.$http.get('dms/shop_comment/comment_page', {
						params: {
							targetId: this.data.id,
							type: this.data.type,
							current: 1
						}
					}).then(res => {
						this.comment = res.data.data;
						if (!this.comment.current < this.comment.pages) {
							this.moreStatus = 'noMore';
						}
						// this.$nextTick(()=>{
						// 	uni.createSelectorQuery()
						// 		.in(this)
						// 		.select('#A')
						// 		.boundingClientRect()
						// 		.select('#C')
						// 		.boundingClientRect()
						// 		.select('#D')
						// 		.boundingClientRect()
						// 		.select('#title')
						// 		.boundingClientRect()
						// 		.select('#B')
						// 		.boundingClientRect()
						// 		.select('#line')
						// 		.boundingClientRect()
						// 		.exec(ret => {
						// 			console.log(ret)
						// 			console.log(height)
						// 			this.firstScroll = ret[0].top - ret[3].height
						// 			this.firstHeight = ret[0].height+ret[4].height+ret[5].height*2
						// 			console.log(this.firstHeight)
						// 			this.secondScroll = ret[1].top- ret[3].height
						// 			this.secondHeight = ret[1].height+ret[5].height
						// 			console.log(this.secondHeight)
						// 			this.thirdScroll = ret[2].top- ret[3].height
						// 			this.thirdHeight = ret[2].height+ret[5].height
						// 			console.log(this.thirdHeight)
						// 		});
						// })
					})
					this.$nextTick(()=>{
						uni.createSelectorQuery()
							.in(this)
							.select('#btn')
							.boundingClientRect()
							.select('#introDetail_info')
							.boundingClientRect()
							.exec(ret => {
								// console.log(ret)
								let height = uni.getSystemInfoSync().windowHeight;
								this.introHeight=ret[1].height
								this.scrollHeight = height - ret[0].height
							});
					})
				});
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
	.shareBtn{
		padding: 0;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		background-color: #FFFFFF;
	}
	.detail{
		padding: 32rpx 0px;
		background-color: #FFFFFF;
		.detail_info{
			padding: 0 32rpx;
			margin-bottom: 32rpx;
			.poster{
				width: 140rpx;
				height: 140rpx;
				border-radius: 8rpx;
				margin-right: 32rpx;
			}
			.detail_info_wrap{
				flex: 1;
				height: 140rpx;
				.detail_info_wrap_name{
					font-size: 30rpx;
					line-height: 42rpx;
					color: #272727;
					font-weight: bold;
				}
				.detail_info_wrap_money{
					color: #F73737;
					line-height: 40rpx;
					font-size: 28rpx;
				}
			}
		}
		.detail_num{
			padding: 16rpx 24rpx;
			margin: 0px 32rpx;
			justify-content: space-between;
			.detail_num_item{
				.detail_num_item_title{
					color: #272727;
					font-weight: bold;
					font-size: 34rpx;
					line-height: 40rpx;
				}
				.detail_num_item_text{
					color: #9AA1A7;
					font-size: 24rpx;
					line-height: 34rpx;
					margin-top: 8rpx;
				}
			}
		}
		.detail_img{
			margin-top: 32rpx;
			.detail_img_item{
				display: inline-block;
				height: 384rpx;
				border-radius: 16rpx;
				margin-right: 16rpx;
				overflow: hidden;
			}
		}
		.detail_label{
			padding: 0 32rpx;
			margin-top: 24rpx;
			.detail_label_item{
				max-width: 176rpx;
				padding: 6rpx 12rpx;
				border-radius: 4rpx;
				background-color: #F5F7F8;
				color: #565B5F;
				font-size: 22rpx;
				line-height: 32rpx;
				margin-right: 8rpx;
			}
		}
	}
	.intro{
		padding: 32rpx;
		background-color: #FFFFFF;
		.soIntro{
			justify-content: space-between;
			margin-bottom: 32rpx;
			.soIntroWrap{
				flex: 1;
				min-width: 0;
				.soIntroWrap_name{
					flex: 1;
					color: #272727;
					font-size: 30rpx;
					line-height: 40rpx;
					font-weight: bold;
					.soIntroWrap_name_text{
						margin-top: 16rpx;
						font-size: 24rpx;
						line-height: 44rpx;
						color: #9AA1A7;
						font-weight: normal;
					}
				}
			}
		}
		.introDetail{
			.introDetail_title{
				padding: 32rpx 0px;
				font-size: 32rpx;
				line-height: 44rpx;
				font-weight: bold;
				color: #272727;
			}
			.introDetail_info{
				color: #565B5F;
				font-size: 26rpx;
				line-height: 44rpx;
				// margin-bottom: 16rpx;
				// max-height: 212rpx;
			}
			.introDetail_info_more{
				color: #565B5F;
				font-size: 26rpx;
				line-height: 44rpx;
				margin-bottom: 32rpx;
				overflow: hidden;
				// height: 216rpx;
			}
		}
		.intro_relation{
			.intro_relation_title{
				padding: 32rpx 0px;
				font-size: 32rpx;
				line-height: 44rpx;
				font-weight: bold;
				color: #272727;
				.intro_relation_title_more{
					font-size: 28rpx;
					line-height: 40rpx;
					color: #9AA1A7;
					font-weight: normal;
				}
			}
			.intro_relation_item{
				padding: 32rpx 0;
				.intro_relation_item_info{
					flex: 1;
					.intro_relation_item_info_name{
						color: #272727;
						font-size: 30rpx;
						line-height: 42rpx;
						font-weight: bold;
						margin-bottom: 16rpx;
					}
					.intro_relation_item_info_label{
						margin-bottom: 16rpx;
						.intro_relation_item_info_label_item{
							padding: 6rpx 12rpx;
							background-color: #f5f7f8;
							border-radius: 4rpx;
							font-size: 22rpx;
							line-height: 32rpx;
							color: #565B5F;
							margin-right: 8rpx;
						}
					}
					.intro_relation_item_info_money{
						width: 100%;
						.intro_relation_item_info_money_wrap{
							flex: 1;
							color: #F73737;
							line-height: 40rpx;
							font-size: 28rpx;
						}
					}
				}
			}
		}
	}
	.comment{
		padding: 0px 32rpx;
		background-color: #FFFFFF;
		.comment_title{
			padding: 32rpx 0;
			font-size: 32rpx;
			line-height: 44rpx;
			font-weight: bold;
			color: #272727;
			.comment_title_more{
				font-weight: normal;
				color: #9AA1A7;
				font-size: 28rpx;
				line-height: 40rpx;
			}
		}
		.comment_all{
			padding-bottom: 40rpx;
			.comment_all_info{
				height: 82rpx;
			}
			.comment_all_publish{
				color: #2B579F;
				font-size: 28rpx;
				line-height: 40rpx;
			}
		}
		.commentList{
			padding: 24rpx 0;
			.commentList_item{
				margin-bottom: 32rpx;
				.commentList_item_wrap{
					flex: 1;
					.commentList_item_item_avatar{
						width: 64rpx;
						height: 64rpx;
						border-radius: 50%;
						margin-right: 24rpx;
					}
					.commentList_item_item_name{
						font-size: 22rpx;
						line-height: 32rpx;
						color: #272727;
						margin-bottom: 8rpx;
					}
				}
				.commentList_item_time{
					color: #999999;
					font-size: 22rpx;
					line-height: 32rpx;
				}
			}
			.comment-content{
				color: #272727;
				font-size: 28rpx;
				line-height: 42rpx;
			}
		}
	}
	.recommend{
		padding: 0px 32rpx;
		background-color: #FFFFFF;
		.recommend_relation_title{
			padding: 32rpx 0px;
			font-size: 32rpx;
			line-height: 44rpx;
			font-weight: bold;
			color: #272727;
			.recommend_relation_title_more{
				font-size: 28rpx;
				line-height: 40rpx;
				color: #9AA1A7;
				font-weight: normal;
			}
		}
		.recommend_relation_item{
			padding: 32rpx 0;
			.recommend_relation_item_info{
				flex: 1;
				.recommend_relation_item_info_name{
					color: #272727;
					font-size: 30rpx;
					line-height: 42rpx;
					font-weight: bold;
					margin-bottom: 16rpx;
				}
				.recommend_relation_item_info_label{
					margin-bottom: 16rpx;
					.recommend_relation_item_info_label_item{
						padding: 6rpx 12rpx;
						background-color: #f5f7f8;
						border-radius: 4rpx;
						font-size: 22rpx;
						line-height: 32rpx;
						color: #565B5F;
						margin-right: 8rpx;
					}
				}
				.recommend_relation_item_info_money{
					width: 100%;
					.recommend_relation_item_info_money_wrap{
						flex: 1;
						color: #F73737;
						line-height: 40rpx;
						font-size: 28rpx;
					}
				}
			}
		}
	}
	.firstContent{
		padding-top:32rpx ;
		background-color: #FFFFFF;
		.titleWrap{
			
		}
	}
	page{
		background-color: #f5f7f8;
	}
	.bottom-safe {
		/* iphonex 等安全区设置，底部安全区适配 */
		/* #ifndef APP-NVUE */
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		/* #endif */
	}

	.bottom {
		width: 750rpx;
		position: fixed;
		bottom: 0rpx;
		background-color: #FFFFFF;
		/* iphonex 等安全区设置，底部安全区适配 */
		/* #ifndef APP-NVUE */
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		box-shadow: 0px -4rpx 6rpx rgba(174, 191, 211, 0.13);

		/* #endif */
		.bottom-item {
			display: flex;
			margin: 24rpx 32rpx 32rpx;
		}
	}

	.active {
		width: 160rpx;
		height: 88rpx;
		font-size: 36rpx;
		line-height: 76rpx;
		font-weight: bold;
		color: #272727;
		text-align: center;
	}
	
	.unactive {
		width: 160rpx;
		height: 88rpx;
		font-size: 32rpx;
		line-height: 88rpx;
		color: #565B5F;
		text-align: center;
	}
	
	.active_line{
		width: 20rpx;
		height: 6rpx;
		background: linear-gradient(180deg, #FF825C 0%, #FF3636 100%);
		border-radius: 10rpx;
		margin-bottom: 6rpx;
	}
	
	// ::v-deep .button {
	// 	color: #FFFFFF;
	// 	width: 200rpx;
	// 	background-color: #FFFFFF;
	// 	margin-right: 32rpx;
	// 	border: 2rpx solid #F74437;
	// 	height: 92rpx;
	// 	font-size: 30rpx;
	// 	line-height: 88rpx;
	// 	border-radius: 64rpx;
	// 	font-weight: normal;
	// }
	.payBtn{
		flex: 1;
		height: 92rpx;
		line-height: 92rpx;
		font-size: 30rpx;
		text-align: center;
		background: linear-gradient(90deg, #FF825C 0%, #FF3636 100%);
		border-radius: 64rpx;
		color: #FFFFFF;
	}
</style>
