<template>
	<view class="container" @tap="hide">
		<view class="containerWrap">
			<view class="titleWrap flexRow" id="contentWrap" style="justify-content: flex-end;position: relative;">
				<view class="flexRow" style="height: 100%;">
					<view class="flexColumn" :class="[{ active: isRecommend }, { unactive: !isRecommend }]" @tap="recommend">
						<view>
							社区
						</view>
						<view class="active_line"></view>
					</view>
					<!-- <view class="flexColumn" :class="[{ active: isAttention }, { unactive: !isAttention }]" @tap="attention">
						<view>
							消息
						</view>
						<view class="active_line"></view>
					</view> -->
					<view class="flexColumn" :class="[{ active: isInfluencer }, { unactive: !isInfluencer }]" @tap="influencer">
						<view>
							通讯录
						</view>
						<view class="active_line"></view>
					</view>
				</view>
				<image :src="$ossUrl('find_add.png')" mode="" style="width: 56rpx;height: 56rpx;margin-left: 134rpx;" @tap.stop="maskShow"></image>
			</view>
			<swiper @change="swiperChange" class="contentSwiper" observer observerParents :current-item-id="item_id" ref="swiper"
			 :style="{height:swiperHeight + 'px'}">
				<swiper-item item-id="0" class="firstContentSwiper">
					<view id="title" class="firstContentSwiperTitle">
						<view class="swiper-item">
							<scroll-view scroll-x="true" style="white-space: nowrap;" scroll-with-animation :scroll-left="navScrollLeft">
								<view class="" style="width: 32rpx;height:32rpx;display: inline-block;" id="labelA">
									
								</view>
								<view class="scrollX_item" id="" :class="[{ item_active: allActive }, { item_unactive: !allActive }]" @tap="all">
									关注
								</view>
								<view class="scrollX_item" id="labelB" :class="[{ item_active: articleActive }, { item_unactive: !articleActive }]" @tap="article">
									推荐
								</view>
								<view class="scrollX_item" id="labelC" :class="[{ item_active: activityActive }, { item_unactive: !activityActive }]" @tap="activity">
									文章
								</view>
								<view class="scrollX_item" id="labelD" :class="[{ item_active: SOActive }, { item_unactive: !SOActive }]" @tap="SO">
									活动
								</view>
								<view class="scrollX_item" id="labelE" :class="[{ item_active: quesActive }, { item_unactive: !quesActive }]" @tap="quse">
									问卷
								</view>
								<view class="scrollX_item" id="labelF" :class="[{ item_active: projectActive }, { item_unactive: !projectActive }]" @tap="project">
									组织
								</view>
								<view class="scrollX_item" id="labelG" :class="[{ item_active: rednessActive }, { item_unactive: !rednessActive }]" @tap="redness">
									达人
								</view>
							</scroll-view>
						</view>
					</view>
					<view class="" style="width: 100%;height: 16rpx;background-color: #F5F7F8;" id="line">
						
					</view>
					<swiper @change="recommendSwiperChange" class="recommendSwiper" observer observerParents :current="item_recommend_id"
					 ref="swiper" :style="{height:scrollHeight + 'px'}">
						<swiper-item item_recommend_id="0" class="secondContentSwiper">
							<scroll-view class="secondContentScroll" :scroll-top="30" scroll-y="true" @scrolltolower="more" @refresherrefresh="pulldown"
							 refresher-enabled="true" :refresher-triggered="pulldownStatus" :scroll-into-view="toView">
								<view class="secondContentScrollContent">
									<view class="title" id="A">
										TA也在用组件宝
									</view>
									<scroll-view class="scrollAttention" scroll-x="true">
										<view class="" style="margin-left:32rpx;">
											<view class="scrollAttentionList" v-for="(item,index) in attentionList" :key="index" @tap.stop="goCannerCard(item)">
												<view class="flexColumn">
													<image lazy-load="true" :src="imageError(item.avatar,$oss)" mode="aspectFill" class="avatarImg"></image>
													<view class="attentionName bold">
														<view class="name singleEllipsis">{{ $isEmpty(item.realName)?'':item.realName }}</view>
													</view>
													<view class="attentionCompany">
														<view class="company singleEllipsis">{{getCompanyStation(item.company,item.station)}}</view>
													</view>
													<view class="center">
														<view v-if="item.isFollowed==0" class="attention" @tap.stop="attentionCanner(item,index)">+关注</view>
														<view class="attentioned" v-else @tap.stop="attentionCanner(item,index)">
															已关注
														</view>
													</view>
												</view>
											</view>
										</view>
									</scroll-view>
									<thoughtsList :talk="talk" @cannerThought="goCannerCard" :moreStatus="moreStatus" @thoughtsComment="commentsOpen"></thoughtsList>
								</view>
							</scroll-view>
						</swiper-item>
						<swiper-item item_recommend_id="1">
							<view class="swiper-item">
								<scroll-view scroll-y="true" class="firstRecommendScroll" :style="{height:scrollHeight + 'px'}" @scrolltolower="thoughtsMore"
								 @refresherrefresh="allPulldown" refresher-enabled="true" :refresher-triggered="allPulldownStatus">
									<!-- <banner slotNumber="app_first_page" :isFresh="saveToken" :customStyle="{width:'686rpx',margin:'0 32rpx'}"></banner> -->
									<banner slotNumber="energy_mini_community_banner" :isFresh="saveToken" :customStyle="{width:'686rpx',margin:'0 32rpx'}"></banner>
									<view class="logoImg" style="margin-top: 16rpx;">
										行业达人
									</view>
									<scroll-view scroll-x="true" class="celebrityScroll">
										<view class="" style="margin-left: 40rpx;">
											<view class="celebrityList" v-for="(item,index) of allCelebrityList" :key="index" @tap.stop="goCannerCard(item)">
												<view class="celebrityListAvatar">
													<image lazy-load="true" :src="imageError(item.avatar,$oss)" class="avatarImg" style="width: 120rpx;height: 120rpx;"></image>
													<view class="flexRowStart" style="margin-top: 10rpx;justify-content: center;">
														<view class="color_666769 singleEllipsis celebrityName">{{$isEmpty(item.realName)?'':item.realName}}</view>
														<!-- <image class="levelImg" v-if="item.redness==1 && oss" :src="oss+'icon_ican_newLevelOne.png'"></image>
														<image class="levelImg" v-if="item.redness==2 && oss" :src="oss+'icon_ican_newLevelTwo.png'"></image>
														<image class="levelImg" v-if="item.redness==3 && oss" :src="oss+'icon_ican_newLevelThree.png'"></image>
														<image class="levelImg" v-if="item.redness==4 && oss" :src="oss+'icon_ican_newLevelFour.png'"></image>
														<image class="levelImg" v-if="item.redness==5 && oss" :src="oss+'icon_ican_newLevelFive.png'"></image> -->
													</view>
												</view>
											</view>
										</view>
									</scroll-view>
									<thoughtsList :talk="allThoughtsInfo" @cannerThought="goCannerCard" :moreStatus="thoughtsStatus"
									 @thoughtsComment="commentsOpen"></thoughtsList>
								</scroll-view>
							</view>
						</swiper-item>
						<swiper-item item_recommend_id="2">
							<view class="" style="background-color: #f5f7f8;padding: 0 24rpx;">
								<articleList :articleInfo="articleInfo" :scrollHeight="scrollHeight"></articleList>
							</view>
						</swiper-item>
						<swiper-item item_recommend_id="3">
							<view class="" style="background-color: #f5f7f8;padding: 0 24rpx;">
								<activityList :acticityInfo="acticityInfo" :scrollHeight="scrollHeight"></activityList>
							</view>
						</swiper-item>
						<swiper-item item_recommend_id="4">
							<view class="" style="background-color: #f5f7f8;padding: 0 24rpx;">
								<questionnaires :qusetionnaireInfo="qusetionnaireInfo" :scrollHeight="scrollHeight"></questionnaires>
							</view>
						</swiper-item>
						<swiper-item item_recommend_id="5">
							<view class="" style="background-color: #f5f7f8;">
								<recommondSo :soInfo="soInfo" :scrollHeight="scrollHeight" @recommondSocommentsOpen="commentsOpen"></recommondSo>
							</view>
						</swiper-item>
						<swiper-item item_recommend_id="6" @touchstart="recommendStart" @touchend="recommendEnd">
							<view class="" style="background-color: #f5f7f8;">
								<rednessList :celebrityInfo="celebrityInfo" :scrollHeight="scrollHeight" @attentionRedness="attentionCanner"
								 @cannerRedness="goCannerCard"></rednessList>
							</view>
						</swiper-item>
					</swiper>
				</swiper-item>
				<swiper-item item-id="1" class="thirdContentSwiper">
					<view class="thirdContentSwiperTitle">
						<view class="swiper-item" style="width: 100%;height: 100%;">
							<view class="flexRow" id="title" style="padding: 32rpx;">
								<view class="scrollX_item"  style="margin-right: 0px;" :class="[{ item_active: friendStatus }, { item_unactive: !friendStatus }]" @tap="showFriend">
									好友
								</view>
								<view class="scrollX_item"  style="margin-right: 0px;" :class="[{ item_active: soStatus }, { item_unactive: !soStatus }]" @tap="showSO">
									组织
								</view>
								<view class="scrollX_item"  style="margin-right: 0px;" :class="[{ item_active: remindStatus }, { item_unactive: !remindStatus }]" @tap="showRemind">
									提醒
								</view>
								<view class="scrollX_item" style="margin-right: 0px;" :class="[{ item_active: pengdingStatus }, { item_unactive: !pengdingStatus }]" @tap="showPending">
									待处理
								</view>
							</view>
						</view>
						<view class="flexRowStart search" id="search" v-show="item_contact_id==0 || item_contact_id==1">
							<image class="searchContactImg" v-if="oss" :src="oss + 'icon_search_gray.png'" style="margin-right: 10rpx;"></image>
							<input maxlength="500" placeholder="搜索" placeholder-class="inputDefault" @input="search" v-model="searchText"></input>
						</view>
						<swiper @change="swiperContactChange" class="" style="padding:0 32rpx;" :current="item_contact_id" ref="swiper" :style="{height:item_contact_id<=1? `${swiperContactHeight}px`:`${otherSwiperContactHeight}px`}">
							<swiper-item item_contact_id="0" @touchstart="rednessStart" @touchend="rednessEnd">
								<view class="swiper-item">
									<uni-indexed-list :options="showFriendList" @refresh="refreshList" :listPulldownStatus="friendListStatus" :showRefreshStatus="showRefreshStatus"/>
									<image class="emptyImg" v-if="!showFriendList.length>0 && oss" :src="oss+'pic_energy_default_wuhaoyou.png'" mode="aspectFit"></image>
								</view>
							</swiper-item>
							<swiper-item item_contact_id="1">
								<view class="swiper-item">
									<uni-indexed-list :options="showList" :topList="topShowList"  @refresh="refreshSoList" :listPulldownStatus="soListStatus" :showRefreshStatus="showRefreshStatus"/>
									<image class="emptyImg" v-if="!showList.length>0 && oss" :src="oss+'pic_energy_default_wuso.png'" mode="aspectFit"></image>
								</view>
							</swiper-item>
							<swiper-item item_contact_id="2">
								<view class="swiper-item">
									<scroll-view scroll-y="true" :style="{height:otherSwiperContactHeight + 'px'}" @scrolltolower="getMore" 
									@refresherrefresh="remindPulldown" refresher-enabled="true" :refresher-triggered="remindPulldownStatus">
										<remindList :list="remindinfo"></remindList>
										<image class="emptyImg" v-if="!remindinfo.records.length>0 && oss" :src="oss+'pic_energy_default_wuxinxi.png'" mode="aspectFit"></image>
										<uni-load-more :status="remindMore" v-if="remindinfo.records.length>0"></uni-load-more>
									</scroll-view>
								</view>
							</swiper-item>
							<swiper-item item_contact_id="3">
								<view class="swiper-item">
									<scroll-view scroll-y="true" :style="{height:otherSwiperContactHeight + 'px'}" 
									@refresherrefresh="pendPulldown" refresher-enabled="true" :refresher-triggered="pendPulldownStatus">
										<pendingList :list="pengdingList" @delete="deleteList"></pendingList>
										<image class="emptyImg" v-if="!pengdingList.length>0 && oss" :src="oss+'pic_energy_default_wuxinxi.png'" mode="aspectFit"></image>
									</scroll-view>
								</view>
							</swiper-item>
						</swiper>
					</view>
				</swiper-item>
			</swiper>
		</view>
		<view class="mask" v-show="maskStatus" :style="{height:systemInfo.windowHeight + 'px'}" @tap="maskStatus=false">
			
		</view>
		<view v-show="maskStatus" class="flexColumn" style="z-index: 999; width: 318rpx;height: 420rpx; background: url('https://woneng-oss.oss-cn-hangzhou.aliyuncs.com/wxapp/moduleStore/find_actionMenu_bg.png') no-repeat;background-size: 100% 100%;position: absolute;top: 82rpx;right: 0;">
			<view class="" style="padding: 0 32rpx;" @tap.stop="scanCode">
				<!-- <view class="flexRowStart" style="margin-top: 10rpx; padding: 32rpx 0;width: 254rpx;border-bottom: 1px solid #ECEEF050;">
					<image :src="$ossUrl('find_scan.png')" mode="" style="width: 40rpx;height: 40rpx;margin-left: 16rpx;"></image>
					<view class="color_303031" style="margin-left: 16rpx;font-size: 30rpx;line-height: 42rpx;">
						扫一扫
					</view>
				</view> -->
			</view>
			<view class="" style="padding: 0 32rpx;" @tap.stop="addFriend">
				<view class="flexRowStart" style="padding: 32rpx 0;width: 254rpx;border-bottom: 1px solid #ECEEF050;">
					<image :src="$ossUrl('find_addFriend.png')" mode="" style="width: 40rpx;height: 40rpx;margin-left: 16rpx;"></image>
					<view class="color_303031" style="margin-left: 16rpx;font-size: 30rpx;line-height: 42rpx;">
						加好友
					</view>
				</view>
			</view>
			<view class="" style="padding: 0 32rpx;" @tap.stop="addSO">
				<view class="flexRowStart"  style="padding: 32rpx 0;width: 254rpx;border-bottom: 1px solid #ECEEF050;">
					<image :src="$ossUrl('find_addSo.png')" mode="" style="width: 40rpx;height: 40rpx;margin-left: 16rpx;"></image>
					<view class="color_303031" style="margin-left: 16rpx;font-size: 30rpx;line-height: 42rpx;">
						创建组织
					</view>
				</view>
			</view>
			<view class="" style="padding: 0 32rpx;" @tap.stop="addThoughts">
				<view class="flexRowStart"  style="padding: 32rpx 0;width: 254rpx;border-bottom: 1px solid #ECEEF050;">
					<image :src="$ossUrl('find_addThought.png')" mode="" style="width: 40rpx;height: 40rpx;margin-left: 16rpx;"></image>
					<view class="color_303031" style="margin-left: 16rpx;font-size: 30rpx;line-height: 42rpx;">
						发布动态
					</view>
				</view>
			</view>
			<view class="" style="padding: 0 32rpx;" @tap.stop="publishService">
				<view class="flexRowStart"  style="padding: 32rpx 0;width: 254rpx;border-bottom: 1px solid #ECEEF050;">
					<image :src="$ossUrl('find_publishService.png')" mode="" style="width: 40rpx;height: 40rpx;margin-left: 16rpx;"></image>
					<view class="color_303031" style="margin-left: 16rpx;font-size: 30rpx;line-height: 42rpx;">
						发布服务
					</view>
				</view>
			</view>
		</view>
		<uni-popup ref="popup" type="bottom" @change="changeStatus">
			<view class="popup_input">
				<textarea :placeholder="placeholder" placeholder-class="inputDefault" v-model="input" fixed="true" adjust-position="true"
				 show-confirm-bar="false" cursor-spacing="80"></textarea>
				<view v-if="input.length>0" class="color_F74437" style="margin-left: 20rpx;" @tap="sendInput">发送</view>
				<view v-else style="margin-left: 20rpx;color: #F7443780;">发送</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import {
		getCompanyStation,
		previewImage,
		imageError,
		soImageError,
		isEmpty
	} from '@/common/utils.js';
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import banner from '@/components/banner/banner.vue'
	import uniIndexedList from '@/components/uni-indexed-list/uni-indexed-list.vue';
	export default {
		components: {
			uniPopup,
			banner,
			uniIndexedList
		},
		data() {
			return {
				toView: '',
				userId: '',
				bannerList: [],
				isRecommend: true,
				isAttention: false,
				isInfluencer: false,
				allActive: false,
				articleActive: true,
				activityActive: false,
				SOActive: false,
				quesActive:false,
				projectActive: false,
				celebrityActive: true,
				recommendSoActive: false,
				rednessActive:false,
				oss: '',
				item_id: 0,
				item_recommend_id: 1,
				item_redness_id: 0,
				attentionList: [],
				talk: {},
				moreStatus: 'more',
				celebrityInfo: {},
				soInfo: {},
				allCelebrityList: [],
				allThoughtsInfo: {},
				thoughtsStatus: 'more',
				articleInfo: {},
				acticityInfo: {},
				qusetionnaireInfo:{},
				productInfo: {},
				orgId: '',
				actionStatus: false,
				thoughtsId: '',
				scrollHeight: '',
				swiperHeight: '',
				recommendXstart: '',
				recommendXend: '',
				rednessXstart: '',
				rednessXend: '',
				input: '',
				placeholder: '请输入申请理由',
				inputType: '',
				// menuButton: {},
				pulldownStatus: false,
				allPulldownStatus: false,
				freshStatus: false,
				saveToken: '',
				soStatus: false,
				friendStatus: true,
				remindStatus: false,
				remindPulldownStatus:false,
				pengdingStatus: false,
				pendPulldownStatus:false,
				item_contact_id: 0,
				swiperContactHeight:'',
				otherSwiperContactHeight:'',
				soList: [],
				showList: [],
				friendList: [],
				showFriendList: [],
				remindinfo: {},
				pengdingList: [],
				searchText:'',
				maskStatus:false,
				systemInfo:'',
				topList:[],
				topShowList:[],
				topStatus:false,
				navScrollLeft:0,
				// label宽度
				navItemWidth:0,
				//label间隙宽度
				navItemGapWidth:0,
				screenWidth: uni.getSystemInfoSync().screenWidth, // 屏幕宽,
				activeBarLeft:0,
				remindMore:'more',
				friendListStatus:false,
				soListStatus:false,
				showRefreshStatus:true
			};
		},
		async onLoad() {
			//确保小程序onLaunch事件里的异步事件完成后，在调用页面的onload
			await this.$onLaunched;
			this.oss = this.$oss
			// this.menuButton = uni.getMenuButtonBoundingClientRect();
			// console.log(this.menuButton)
			uni.$on('fresh', (data) => {
				this.freshStatus = data
			})
			this.$http.get('admin/follow/recommend').then(res => {
				if (res.data.code == 0) {
					this.attentionList = res.data.data;
					this.attentionList.forEach(item => {
						item.avatar = imageError(item.avatar, this.oss)
					})
				} else {
					this.attentionList = []
				}
			});
			this.$http.get('admin/user/redness_hall',{
				params:{
					userName:''
				}
			}).then(res => {
				// console.log(res)
				if (res.data.code == 0) {
					this.celebrityInfo = res.data.data
					this.celebrityInfo.records.forEach(item => {
						item.avatar = imageError(item.avatar, this.oss)
					})
				} else {
					this.celebrityInfo = {}
				}
			})
			this.$http.get('admin/org/first_recommend').then(res => {
				// console.log(res)
				if (res.data.code == 0) {
					this.soInfo = res.data.data
					this.soInfo.records.forEach(item => {
						item.avatar = soImageError(item.avatar, this.oss)
					});
				} else {
					this.soInfo = {}
				}
			})
			this.$http.get('dms/thoughts/last_week/mighty_one').then(res => {
				// console.log(res)
				if (res.data.code == 0) {
					this.allCelebrityList = res.data.data
					this.allCelebrityList.forEach(item => {
						item.avatar = imageError(item.avatar, this.oss)
					})
				} else {
					this.allCelebrityList = []
				}
			})
			this.$http.get('dms/material/page',{
				params:{
					materialType:1
				}
			}).then(res => {
				// console.log(res)
				if (res.data.code == 0) {
					this.articleInfo = res.data.data
					this.articleInfo.records.forEach(item => {
						item.avatar = imageError(item.avatar, this.oss)
					})
				} else {
					this.articleInfo = {}
				}
			})
			this.$http.get('dms/app/product/shop_page', {
				params: {
					type: 0,
					orderField: "score",
					orderType: "desc"
				}
			}).then(res => {
				// console.log(res)
				if (res.data.code == 0) {
					this.productInfo = res.data.data
					this.productInfo.records.forEach(item => {
						item.imageUrl = imageError(item.imageUrl, this.oss)
					});
				} else {
					this.productInfo = {}
				}
			})
			this.$http.get('qms/conference_publish/activitie_page', {
				params: {
					status: ''
				}
			}).then(res => {
				// console.log(res)
				if (res.data.code == 0) {
					this.acticityInfo = res.data.data
				} else {
					this.acticityInfo = {}
				}
			})
			this.$http.get('qms/questionnaire/factory_page').then(res => {
				// console.log(res)
				this.qusetionnaireInfo = res.data.data
				this.qusetionnaireInfo.records.forEach(item => {
					if (item.startTime && item.endTime) {
						item.startTime = item.startTime.split(' ')[0]
						item.endTime = item.endTime.split(' ')[0]
					}
				})
			})
			this.saveToken = uni.getStorageSync('token')
			if (uni.getStorageSync('token')) {
				this.$http.get('dms/thoughts/follow_page', {
					params: {
						current: 1,
						size: 20,
					}
				}).then(res => {
					// console.log(res)
					if (res.data.code == 0) {
						this.talk = res.data.data;
						this.talk.records.forEach(item => {
							item.createTime = item.createTime.substring(0, item.createTime.length - 3)
							item.avatar = imageError(item.avatar, this.oss)
						});
						if (this.talk.current == this.talk.pages) {
							this.moreStatus = 'noMore';
						} else if (this.talk.pages == 0) {
							this.moreStatus = 'noMore';
						}
					} else {
						this.talk = {},
							this.moreStatus = 'noMore';
					}
				});
			} else {
				this.talk = {},
					this.moreStatus = 'noMore';
			}
			this.$http.get('dms/thoughts/hit_page').then(res => {
				// console.log(res)
				if (res.data.code == 0) {
					this.allThoughtsInfo = res.data.data
					this.allThoughtsInfo.records.forEach(item => {
						item.createTime = item.createTime.substring(0, item.createTime.length - 3)
						item.avatar = imageError(item.avatar, this.oss)
					});
					if (this.allThoughtsInfo.current == this.allThoughtsInfo.pages) {
						this.thoughtsStatus = 'noMore';
					} else if (this.allThoughtsInfo.pages == 0) {
						this.thoughtsStatus = 'noMore';
					}
				} else {
					this.allThoughtsInfo = {};
					this.thoughtsStatus = 'noMore';
				}
			})
			this.searchText = ''
			let pinyin = require('js-pinyin');
			let that = this;
			let soList = [];
			that.soList = [];
			let firstList = [];
			if (!isEmpty(uni.getStorageSync('token'))) {
				that.$http.get('admin/app/user/had/list').then(res => {
					let data = res.data.data;
					that.topList = data.filter(item=>{
						return item.isTop==1
					})
					that.topShowList=that.topList
					data.forEach(item => {
						//遍历数组,拿到名称
						let name = item.name;
						//取全部数据的首字母
						let fristName = pinyin.getCamelChars(name).substring(0, 1).toUpperCase();
						if (fristName < 'A' || fristName > 'Z') {
							fristName = '#';
						}
						//给原json添加首字母键值对
						item.letter = fristName;
						//放入新数组
						soList.push(item);
						firstList.push(fristName);
						// console.log(soList)
					});
					firstList.sort();
					for (var i = 0; i < firstList.length; i++) {
						if (firstList[i] == firstList[i + 1]) {
							firstList.splice(i, 1);
							i--;
						}
					}
					//根据首字母键值对给原数据按首字母分类
					firstList.forEach(item => {
						let dataList = [];
						soList.forEach((item2, index) => {
							if (item == item2.letter) {
								//手动排除图片出错
								item2.avatar = soImageError(item2.avatar, that.oss)
								// console.log(item2.avatar)
								dataList.push(item2);
								//从待选数组中删除 提高效率
								// soList.splice(index, 1);
							}
						});
						that.soList.push({
							letter: item,
							dataList: dataList
						});
					});
					that.showList = that.soList;
					// console.log(this.showList)
				});
			}
			let friendList = [];
			that.friendList = [];
			let secondList = [];
			if (!isEmpty(uni.getStorageSync('token'))) {
				that.$http.get('admin/friend/list').then(res => {
					let data = res.data.data;
					data.forEach(item => {
						//遍历数组,拿到名称
						let name = item.realName;
						//取全部数据的首字母
						let fristName = pinyin.getCamelChars(name).substring(0, 1).toUpperCase();
						if (fristName < 'A' || fristName > 'Z') {
							fristName = '#';
						}
						//给原json添加首字母键值对
						item.letter = fristName;
						//放入新数组
						friendList.push(item);
						secondList.push(fristName);
						// console.log(soList)
					});
					secondList.sort();
					for (var i = 0; i < secondList.length; i++) {
						if (secondList[i] == secondList[i + 1]) {
							secondList.splice(i, 1);
							i--;
						}
					}
					//根据首字母键值对给原数据按首字母分类
					secondList.forEach(item => {
						let dataList = [];
						friendList.forEach((item2, index) => {
							if (item == item2.letter) {
								//手动排除图片出错
								item2.avatar = imageError(item2.avatar, that.oss)
								dataList.push(item2);
								//从待选数组中删除 提高效率
								// soList.splice(index, 1);
							}
						});
						that.friendList.push({
							letter: item,
							dataList: dataList
						});
					});
					that.showFriendList = that.friendList;
					// console.log(this.showList)
				});
			}
			if (!isEmpty(uni.getStorageSync('token'))) {
				that.$http.get('ims/app/sys_msg/deal/list').then(res => {
					// console.log(res)
					that.pengdingList = res.data.data
					that.pengdingList.forEach(item => {
						item.senderAvatar = soImageError(item.senderAvatar, that.oss)
					})
				})
				that.$http.get('ims/app/sys_msg/page', {
					params: {
						id: 10035
					}
				}).then(res => {
					// console.log(res)
					that.remindinfo = res.data.data
					that.remindinfo.records.forEach(item => {
						item.time = item.time.substring(0, item.time.length - 3)
						item.senderAvatar = soImageError(item.senderAvatar, that.oss)
					})
					if (!that.remindinfo.current < that.remindinfo.pages) {
						that.remindMore = 'noMore';
					}
				})
			} else {
				that.remindMore = 'noMore';
			}
		},
		async onShow() {
			await this.$onLaunched;
			this.userId = uni.getStorageSync('userinfo').user_id;
			this.systemInfo = uni.getSystemInfoSync();
			setTimeout(() => {
				uni.createSelectorQuery()
					.in(this)
					.select('#title')
					.boundingClientRect()
					.select('#contentWrap')
					.boundingClientRect()
					.select('#line')
					.boundingClientRect()
					.select('#labelB')
					.boundingClientRect()
					.select('#labelA')
					.boundingClientRect()
					.exec(ret => {
						// console.log(ret)
						let height = uni.getSystemInfoSync().windowHeight;
						// console.log(height)
						this.swiperHeight = height - ret[1].height - 100 / 750 * wx.getSystemInfoSync().windowWidth;
						this.scrollHeight = height - ret[0].height- ret[1].height- ret[2].height - 100 / 750 * wx.getSystemInfoSync().windowWidth;
						this.navItemWidth = ret[3].width
						this.navItemGapWidth = ret[4].width
						
					});
					uni.createSelectorQuery()
						.in(this)
						.select('#title')
						.boundingClientRect()
						.select('#search')
						.boundingClientRect()
						.select('#contentWrap')
						.boundingClientRect()
						.exec(ret => {
							// console.log(ret)
							let height = uni.getSystemInfoSync().windowHeight;
							// console.log(height)
							// console.log(height)
							this.swiperContactHeight = height - ret[1].height - ret[0].height- ret[2].height - 140 / 750 * wx.getSystemInfoSync().windowWidth;
							this.otherSwiperContactHeight = height - ret[0].height- ret[2].height - 140 / 750 * wx.getSystemInfoSync().windowWidth;
						});
			}, 300)
			const page = this.$mp.page
			if (typeof page.getTabBar === 'function' &&
				page.getTabBar()) {
				page.getTabBar().setData({
					selected: 3
				})
			}
			if (this.saveToken != uni.getStorageSync('token')) {
				this.saveToken = uni.getStorageSync('token')
				let pinyin = require('js-pinyin');
				let that = this;
				let soList = [];
				that.soList = [];
				let firstList = [];
				if (!isEmpty(uni.getStorageSync('token'))) {
					that.$http.get('admin/app/user/had/list').then(res => {
						let data = res.data.data;
						that.topList = data.filter(item=>{
							return item.isTop==1
						})
						that.topShowList=that.topList
						data.forEach(item => {
							//遍历数组,拿到名称
							let name = item.name;
							//取全部数据的首字母
							let fristName = pinyin.getCamelChars(name).substring(0, 1).toUpperCase();
							if (fristName < 'A' || fristName > 'Z') {
								fristName = '#';
							}
							//给原json添加首字母键值对
							item.letter = fristName;
							//放入新数组
							soList.push(item);
							firstList.push(fristName);
							// console.log(soList)
						});
						firstList.sort();
						for (var i = 0; i < firstList.length; i++) {
							if (firstList[i] == firstList[i + 1]) {
								firstList.splice(i, 1);
								i--;
							}
						}
						//根据首字母键值对给原数据按首字母分类
						firstList.forEach(item => {
							let dataList = [];
							soList.forEach((item2, index) => {
								if (item == item2.letter) {
									//手动排除图片出错
									item2.avatar = soImageError(item2.avatar, that.oss)
									// console.log(item2.avatar)
									dataList.push(item2);
									//从待选数组中删除 提高效率
									// soList.splice(index, 1);
								}
							});
							that.soList.push({
								letter: item,
								dataList: dataList
							});
						});
						that.showList = that.soList;
						// console.log(this.showList)
					});
				}
				let friendList = [];
				that.friendList = [];
				let secondList = [];
				if (!isEmpty(uni.getStorageSync('token'))) {
					that.$http.get('admin/friend/list').then(res => {
						let data = res.data.data;
						data.forEach(item => {
							//遍历数组,拿到名称
							let name = item.realName;
							//取全部数据的首字母
							let fristName = pinyin.getCamelChars(name).substring(0, 1).toUpperCase();
							if (fristName < 'A' || fristName > 'Z') {
								fristName = '#';
							}
							//给原json添加首字母键值对
							item.letter = fristName;
							//放入新数组
							friendList.push(item);
							secondList.push(fristName);
							// console.log(soList)
						});
						secondList.sort();
						for (var i = 0; i < secondList.length; i++) {
							if (secondList[i] == secondList[i + 1]) {
								secondList.splice(i, 1);
								i--;
							}
						}
						//根据首字母键值对给原数据按首字母分类
						secondList.forEach(item => {
							let dataList = [];
							friendList.forEach((item2, index) => {
								if (item == item2.letter) {
									//手动排除图片出错
									item2.avatar = imageError(item2.avatar, that.oss)
									dataList.push(item2);
									//从待选数组中删除 提高效率
									// soList.splice(index, 1);
								}
							});
							that.friendList.push({
								letter: item,
								dataList: dataList
							});
						});
						that.showFriendList = that.friendList;
						// console.log(this.showList)
					});
				}
				if (!isEmpty(uni.getStorageSync('token'))) {
					that.$http.get('ims/app/sys_msg/deal/list').then(res => {
						// console.log(res)
						that.pengdingList = res.data.data
						that.pengdingList.forEach(item => {
							item.senderAvatar = soImageError(item.senderAvatar, that.oss)
						})
					})
					that.$http.get('ims/app/sys_msg/page', {
						params: {
							id: 10035
						}
					}).then(res => {
						// console.log(res)
						that.remindinfo = res.data.data
						that.remindinfo.records.forEach(item => {
							item.time = item.time.substring(0, item.time.length - 3)
							item.senderAvatar = soImageError(item.senderAvatar, that.oss)
						})
						if (!that.remindinfo.current < that.remindinfo.pages) {
							that.remindMore = 'noMore';
						}
					})
				} else {
					that.remindMore = 'noMore';
				}
				this.$http.get('cms/info_ad/2/list?slotNumber=app_first_page').then(res => {
					if (res.data.code == 0) {
						this.bannerList = res.data.data
					} else {
						this.bannerList = []
					}
				})
				this.$http.get('dms/thoughts/last_week/mighty_one').then(res => {
					// console.log(res)
					if (res.data.code == 0) {
						this.allCelebrityList = res.data.data
						this.allCelebrityList.forEach(item => {
							item.avatar = imageError(item.avatar, this.oss)
						});
					} else {
						this.allCelebrityList = []
					}
				})
				this.$http.get('dms/material/page',{
					params:{
						materialType:1
					}
				}).then(res => {
					// console.log(res)
					if (res.data.code == 0) {
						this.articleInfo = res.data.data
						this.articleInfo.records.forEach(item => {
							item.avatar = imageError(item.avatar, this.oss)
						})
					} else {
						this.articleInfo = {}
					}
				})
				this.$http.get('dms/app/product/shop_page', {
					params: {
						type: 0,
						orderField: "score",
						orderType: "desc"
					}
				}).then(res => {
					// console.log(res)
					if (res.data.code == 0) {
						this.productInfo = res.data.data
						this.productInfo.records.forEach(item => {
							item.imageUrl = imageError(item.imageUrl, this.oss)
						});
					} else {
						this.productInfo = {}
					}
				})
				this.$http.get('qms/conference_publish/activitie_page', {
					params: {
						status: ''
					}
				}).then(res => {
					// console.log(res)
					if (res.data.code == 0) {
						this.acticityInfo = res.data.data
					} else {
						this.acticityInfo = {}
					}
				})
				this.$http.get('qms/questionnaire/factory_page').then(res => {
					// console.log(res)
					this.qusetionnaireInfo = res.data.data
					this.qusetionnaireInfo.records.forEach(item => {
						if (item.startTime && item.endTime) {
							item.startTime = item.startTime.split(' ')[0]
							item.endTime = item.endTime.split(' ')[0]
						}
					})
				})
				this.$http.get('admin/user/redness_hall',{
					params:{
						userName:''
					}
				}).then(res => {
					// console.log(res)
					if (res.data.code == 0) {
						this.celebrityInfo = res.data.data
						this.celebrityInfo.records.forEach(item => {
							item.avatar = imageError(item.avatar, this.oss)
						})
					} else {
						this.celebrityInfo = {}
					}
				})
				this.$http.get('admin/org/first_recommend').then(res => {
					// console.log(res)
					if (res.data.code == 0) {
						this.soInfo = res.data.data
						this.soInfo.records.forEach(item => {
							item.avatar = soImageError(item.avatar, this.oss)
						});
					} else {
						this.soInfo = {}
					}
				})
				this.$http.get('admin/follow/recommend').then(res => {
					if (res.data.code == 0) {
						this.attentionList = res.data.data;
						this.attentionList.forEach(item => {
							item.avatar = imageError(item.avatar, this.oss)
						})
					} else {
						this.attentionList = []
					}
				});
				if (uni.getStorageSync('token')) {
					this.$http.get('dms/thoughts/follow_page', {
						params: {
							current: 1,
							size: 20,
						}
					}).then(res => {
						// console.log(res)
						if (res.data.code == 0) {
							this.talk = res.data.data;
							this.talk.records.forEach(item => {
								item.createTime = item.createTime.substring(0, item.createTime.length - 3)
								item.avatar = imageError(item.avatar, this.oss)
							});
							if (this.talk.current == this.talk.pages) {
								this.moreStatus = 'noMore';
							} else if (this.talk.pages == 0) {
								this.moreStatus = 'noMore';
							}
						} else {
							this.talk = {},
								this.moreStatus = 'noMore';
						}
					});
				} else {
					this.talk = {},
						this.moreStatus = 'noMore';
				}
				this.$http.get('dms/thoughts/hit_page').then(res => {
					// console.log(res)
					if (res.data.code == 0) {
						this.allThoughtsInfo = res.data.data
						this.allThoughtsInfo.records.forEach(item => {
							item.createTime = item.createTime.substring(0, item.createTime.length - 3)
							item.avatar = imageError(item.avatar, this.oss)
						});
						if (!this.allThoughtsInfo.current < this.allThoughtsInfo.pages) {
							this.thoughtsStatus = 'noMore';
						}
					} else {
						this.allThoughtsInfo = {},
							this.thoughtsStatus = 'noMore';
					}
				})
			}
			if (this.freshStatus == true) {
				this.$http.get('dms/thoughts/follow_page', {
					params: {
						current: 1,
						size: 20,
					}
				}).then(res => {
					// console.log(res)
					if (res.data.code == 0) {
						this.talk = res.data.data;
						this.talk.records.forEach(item => {
							item.createTime = item.createTime.substring(0, item.createTime.length - 3)
							item.avatar = imageError(item.avatar, this.oss)
						});
						if (this.talk.current == this.talk.pages) {
							this.moreStatus = 'noMore';
						} else if (this.talk.pages == 0) {
							this.moreStatus = 'noMore';
						}
						this.freshStatus = false
					} else {
						this.talk = {},
							this.moreStatus = 'noMore';
						this.freshStatus = false
					}
				});
			}
		},
		onShareAppMessage(res) {
			if (res.from === 'button') { // 来自页面内分享按钮
				// console.log(res.target)
			}
			return {
				title: '我能，和你一起成功',
				path: '/pages/tabbar/ican'
			}
		},
		onShareTimeline(res) {
			if (res.from === 'button') { // 来自页面内分享按钮
				// console.log(res.target)
			}
			return {
				title: '我能，和你一起成功',
			}
		},
		onUnload() {
			uni.$off()
			this.maskStatus=false
		},
		onHide() {
			this.maskStatus=false
		},
		methods: {
			isEmpty,
			imageError,
			soImageError,
			refreshList(){
				let pinyin = require('js-pinyin');
				let that = this;
				let friendList = [];
				that.friendList = [];
				let secondList = [];
					that.$http.get('admin/friend/list').then(res => {
						let data = res.data.data;
						data.forEach(item => {
							//遍历数组,拿到名称
							let name = item.realName;
							//取全部数据的首字母
							let fristName = pinyin.getCamelChars(name).substring(0, 1).toUpperCase();
							if (fristName < 'A' || fristName > 'Z') {
								fristName = '#';
							}
							//给原json添加首字母键值对
							item.letter = fristName;
							//放入新数组
							friendList.push(item);
							secondList.push(fristName);
							// console.log(soList)
						});
						secondList.sort();
						for (var i = 0; i < secondList.length; i++) {
							if (secondList[i] == secondList[i + 1]) {
								secondList.splice(i, 1);
								i--;
							}
						}
						//根据首字母键值对给原数据按首字母分类
						secondList.forEach(item => {
							let dataList = [];
							friendList.forEach((item2, index) => {
								if (item == item2.letter) {
									//手动排除图片出错
									item2.avatar = imageError(item2.avatar, that.oss)
									dataList.push(item2);
									//从待选数组中删除 提高效率
									// soList.splice(index, 1);
								}
							});
							that.friendList.push({
								letter: item,
								dataList: dataList
							});
						});
						that.showFriendList = that.friendList;
						// console.log(this.showList)
						//变动传值，子组件监听到后关闭刷新状态
						this.friendListStatus=!this.friendListStatus
					});
			},
			refreshSoList(){
				let pinyin = require('js-pinyin');
				let that = this;
				let soList = [];
				that.soList = [];
				let firstList = [];
					that.$http.get('admin/app/user/had/list').then(res => {
						let data = res.data.data;
						that.topList = data.filter(item=>{
							return item.isTop==1
						})
						that.topShowList=that.topList
						data.forEach(item => {
							//遍历数组,拿到名称
							let name = item.name;
							//取全部数据的首字母
							let fristName = pinyin.getCamelChars(name).substring(0, 1).toUpperCase();
							if (fristName < 'A' || fristName > 'Z') {
								fristName = '#';
							}
							//给原json添加首字母键值对
							item.letter = fristName;
							//放入新数组
							soList.push(item);
							firstList.push(fristName);
							// console.log(soList)
						});
						firstList.sort();
						for (var i = 0; i < firstList.length; i++) {
							if (firstList[i] == firstList[i + 1]) {
								firstList.splice(i, 1);
								i--;
							}
						}
						//根据首字母键值对给原数据按首字母分类
						firstList.forEach(item => {
							let dataList = [];
							soList.forEach((item2, index) => {
								if (item == item2.letter) {
									//手动排除图片出错
									item2.avatar = soImageError(item2.avatar, that.oss)
									// console.log(item2.avatar)
									dataList.push(item2);
									//从待选数组中删除 提高效率
									// soList.splice(index, 1);
								}
							});
							that.soList.push({
								letter: item,
								dataList: dataList
							});
						});
						that.showList = that.soList;
						// console.log(this.showList)
						//变动传值，子组件监听到后关闭刷新状态
						this.soListStatus=!this.soListStatus
					});
			},
			remindPulldown(){
				this.remindPulldownStatus = true
				if(!this.$isEmpty(uni.getStorageSync('token'))){
					this.$http.get('ims/app/sys_msg/page', {
						params: {
							id: 10035
						}
					}).then(res => {
						// console.log(res)
						this.remindinfo = res.data.data
						this.remindinfo.records.forEach(item => {
							item.time = item.time.substring(0, item.time.length - 3)
							item.senderAvatar = soImageError(item.senderAvatar, this.oss)
						})
						if (!this.remindinfo.current < this.remindinfo.pages) {
							this.remindMore = 'noMore';
						}
						this.remindPulldownStatus = false
					})
				}else{
					setTimeout(() => {
						this.remindPulldownStatus = false
					}, 1000)
				}
			},
			pendPulldown(){
				this.pendPulldownStatus = true
				if(!this.$isEmpty(uni.getStorageSync('token'))){
					this.$http.get('ims/app/sys_msg/deal/list').then(res => {
						// console.log(res)
						this.pengdingList = res.data.data
						this.pengdingList.forEach(item => {
							item.senderAvatar = soImageError(item.senderAvatar, this.oss)
						})
						this.pendPulldownStatus = false
					})
				}else{
					setTimeout(() => {
						this.pendPulldownStatus = false
					}, 1000)
				}
			},
			deleteList(index) {
				this.pengdingList.splice(index, 1)
			},
			addSO(){
				uni.navigateTo({
					url:'/pages/find/addSo/addSo'
				})
			},
			publishService(){
				uni.navigateTo({
					url:'/pages/ican/publishService/publishService'
				})
			},
			addThoughts(){
				uni.navigateTo({
					url:'/pages/find/attention/addThoughts/addThoughts'
				})
			},
			scanCode(){
				uni.scanCode({
					success: (res) => {
						// console.log(res)
						// console.log(res.result.split('?')[1].split('&')[0].split('=')[1])
						if(res.result.split('?')[1].split('&')[0].split('=')[1] == 'canerShare'){
							// console.log(res.result.split('?')[1].split('&')[1].split('=')[1])
							let id = res.result.split('?')[1].split('&')[1].split('=')[1] 
							uni.navigateTo({
								url:'/pages/find/cannerCard/cannerCard?id='+ id
							})
						}else if(res.result.split('?')[1].split('&')[0].split('=')[1] == 'soShare'){
							let orgId = res.result.split('?')[1].split('&')[1].split('=')[1]
							uni.navigateTo({
								url:'/pages/find/soCard/soCard?id='+ orgId
							})
						}else if(res.result.split('?')[1].split('&')[0].split('=')[1] == 'taskShare'){
							let id = res.result.split('?')[1].split('&')[1].split('=')[1]
							uni.navigateTo({
								url:'/pages/ican/taskDetail/taskDetail?taskId='+ id
							})
						}
					}
				})
			},
			addFriend(){
				uni.navigateTo({
					url:'/pages/find/addFriend/addFriend'
				})
			},
			maskShow(){
				this.maskStatus=true
			},
			getMore() {
				let that = this;
				if (that.remindinfo.current < that.remindinfo.pages) {
					that.remindMore = 'loading';
					that.$http.get('ims/app/sys_msg/page', {
						params: {
							current: that.remindinfo.current + 1,
							id: 10035
						}
					}).then(res => {
						that.remindinfo.current = res.data.data.current;
						res.data.data.records.forEach(item => {
							item.time = item.time.substring(0, item.time.length - 3)
							item.senderAvatar = soImageError(item.senderAvatar, that.oss)
						})
						that.remindinfo.records = that.remindinfo.records.concat(res.data.data.records);
						that.remindMore = 'more';
					});
				} else {
					that.remindMore = 'noMore';
				}
			},
			swiperContactChange(e) {
				this.searchText = ''
				if (e.detail.current == 0) {
					this.showFriend();
					this.showFriendList = this.friendList
				} else if (e.detail.current == 1) {
					this.showSO();
					this.showList = this.soList
				} else if (e.detail.current == 2) {
					this.showRemind()
					this.showList = this.soList
				} else if (e.detail.current == 3) {
					this.showPending()
					this.showList = this.soList
				}
			},
			showFriend() {
				this.item_contact_id = 0
				this.soStatus = false
				this.friendStatus = true
				this.remindStatus = false
				this.pengdingStatus = false
			},
			showSO() {
				this.item_contact_id = 1
				this.soStatus = true
				this.friendStatus = false
				this.remindStatus = false
				this.pengdingStatus = false
			},
			showRemind() {
				this.item_contact_id = 2
				this.soStatus = false
				this.friendStatus = false
				this.remindStatus = true
				this.pengdingStatus = false
			},
			showPending() {
				this.item_contact_id = 3
				this.soStatus = false
				this.friendStatus = false
				this.remindStatus = false
				this.pengdingStatus = true
			},
			allPulldown() {
				this.allPulldownStatus = true
				this.$http.get('dms/thoughts/hit_page').then(res => {
					// console.log(res)
					if (res.data.code == 0) {
						this.allThoughtsInfo = res.data.data
						this.allThoughtsInfo.records.forEach(item => {
							item.createTime = item.createTime.substring(0, item.createTime.length - 3)
							item.avatar = imageError(item.avatar, this.oss)
						});
						if (this.allThoughtsInfo.current == this.allThoughtsInfo.pages) {
							this.thoughtsStatus = 'noMore';
						} else if (this.allThoughtsInfo.pages == 0) {
							this.thoughtsStatus = 'noMore';
						}
					} else {
						this.allThoughtsInfo.records = []
						this.thoughtsStatus = 'noMore';
					}
					this.allPulldownStatus = false
				})
			},
			pulldown() {
				this.pulldownStatus = true
				if (uni.getStorageSync('token')) {
					this.$http.get('dms/thoughts/follow_page', {
						params: {
							current: 1,
							size: 20,
						}
					}).then(res => {
						// console.log(res)
						if (res.data.code == 0) {
							this.talk = res.data.data;
							this.talk.records.forEach(item => {
								item.createTime = item.createTime.substring(0, item.createTime.length - 3)
								item.avatar = imageError(item.avatar, this.oss)
							});
							if (this.talk.current == this.talk.pages) {
								this.moreStatus = 'noMore';
							} else if (this.talk.pages == 0) {
								this.moreStatus = 'noMore';
							}
						} else {
							this.talk.records = []
							this.moreStatus = 'noMore';
						}
						this.pulldownStatus = false
					});
				} else {
					this.talk.records = []
					this.moreStatus = 'noMore';
					setTimeout(() => {
						this.pulldownStatus = false
					}, 1000)
				}
			},
			more() {
				let that = this;
				if (that.talk.current < that.talk.pages) {
					that.moreStatus = 'loading';
					that.$http.get('dms/thoughts/follow_page', {
						params: {
							current: that.talk.current + 1
						}
					}).then(res => {
						that.talk.current = res.data.data.current;
						res.data.data.records.forEach(item => {
							item.avatar = imageError(item.avatar, that.oss)
						});
						that.talk.records = that.talk.records.concat(res.data.data.records);
						that.moreStatus = 'more';
					});
				} else {
					that.moreStatus = 'noMore';
				}
			},
			thoughtsMore() {
				let that = this;
				if (that.allThoughtsInfo.current < that.allThoughtsInfo.pages) {
					that.thoughtsStatus = 'loading';
					that.$http.get('dms/thoughts/hit_page', {
						params: {
							current: that.allThoughtsInfo.current + 1
						}
					}).then(res => {
						that.allThoughtsInfo.current = res.data.data.current;
						res.data.data.records.forEach(item => {
							item.avatar = imageError(item.avatar, that.oss)
						});
						that.allThoughtsInfo.records = that.allThoughtsInfo.records.concat(res.data.data.records);
						that.thoughtsStatus = 'more';
					});
				} else {
					that.thoughtsStatus = 'noMore';
				}
			},
			swiperChange(e) {
				if (e.detail.current == 0) {
					this.recommend();
				} else if (e.detail.current == 1) {
					this.influencer();
				}
			},
			recommendSwiperChange(e) {
				// console.log(e)
				if (e.detail.current == 0) {
					this.all();
				} else if (e.detail.current == 1) {
					this.article();
				} else if (e.detail.current == 2) {
					this.activity();
				} else if (e.detail.current == 3) {
					this.SO();
				}else if(e.detail.current == 4){
					this.quse();
				} else if (e.detail.current == 5) {
					this.project();
				} else if (e.detail.current == 6) {
					this.redness()
				}
				//将要点击的label距左侧距离
				this.activeBarLeft = this.navItemWidth * (e.detail.current+1)+this.navItemGapWidth*(e.detail.current+2)
				//剩余距离不够一个滑块以及一个间隙时，就开始偏移
				if (this.activeBarLeft > (this.screenWidth - this.navItemWidth-this.navItemGapWidth)) {
					//+this.navItemGapWidth代表多便宜一个间隙的距离，this.navScrollLeft得是一个变动的值，否则滑动会失效
					this.navScrollLeft = this.activeBarLeft - (this.screenWidth - this.navItemWidth)+this.navItemGapWidth
				}else{
					//向右滑点击到推荐时，直接归零
					this.navScrollLeft=0
				}
			},
			recommendStart(e) {
				this.recommendXstart = e.changedTouches[0].clientX;
			},
			recommendEnd(e) {
				this.recommendXend = e.changedTouches[0].clientX
				const subX = this.recommendXstart - this.recommendXend
				if (subX > 50) {
					this.item_id = 1
				}
			},
			rednessStart(e) {
				this.rednessXstart = e.changedTouches[0].clientX;
			},
			rednessEnd(e) {
				this.rednessXend = e.changedTouches[0].clientX
				const subX = this.rednessXstart - this.rednessXend
				if (subX < -50) {
					this.item_id = 0
				}
			},
			rednessSwiperChange(e) {
				if (e.detail.current == 0) {
					this.celebrity();
				} else if (e.detail.current == 1) {
					this.recommendSo();
				}
			},
			celebrity() {
				this.celebrityActive = true,
					this.recommendSoActive = false
				this.item_redness_id = 0
			},
			recommendSo() {
				this.celebrityActive = false,
					this.recommendSoActive = true
				this.item_redness_id = 1
			},
			recommend() {
				this.isRecommend = true,
					// this.isAttention = false,
					this.isInfluencer = false,
					this.item_id = 0;
			},
			// attention() {
			// 	this.isRecommend = false,
			// 		this.isAttention = true,
			// 		this.isInfluencer = false,
			// 		this.item_id = 1;
			// },
			influencer() {
				this.isRecommend = false,
					// this.isAttention = false,
					this.isInfluencer = true,
					this.item_id = 1;
			},
			all() {
				this.allActive = true,
					this.articleActive = false,
					this.activityActive = false,
					this.SOActive = false,
					this.projectActive = false,
					this.rednessActive=false,
					this.quesActive=false,
					this.item_recommend_id = 0
			},
			article() {
				this.allActive = false,
					this.articleActive = true,
					this.activityActive = false,
					this.SOActive = false,
					this.projectActive = false,
					this.rednessActive=false,
					this.quesActive=false,
					this.item_recommend_id = 1
			},
			activity() {
				this.allActive = false,
					this.articleActive = false,
					this.activityActive = true,
					this.SOActive = false,
					this.projectActive = false,
					this.rednessActive=false,
					this.quesActive=false,
					this.item_recommend_id = 2
			},
			SO() {
				this.allActive = false,
					this.articleActive = false,
					this.activityActive = false,
					this.SOActive = true,
					this.projectActive = false,
					this.rednessActive=false,
					this.quesActive=false,
					this.item_recommend_id = 3
			},
			quse(){
				this.allActive = false,
					this.articleActive = false,
					this.activityActive = false,
					this.SOActive = false,
					this.quesActive=true,
					this.projectActive = false,
					this.rednessActive=false
					this.item_recommend_id = 4
			},
			project() {
				this.allActive = false,
					this.articleActive = false,
					this.activityActive = false,
					this.SOActive = false,
					this.rednessActive=false
					this.projectActive = true,
					this.quesActive=false,
					this.item_recommend_id = 5
			},
			redness() {
				this.allActive = false,
					this.articleActive = false,
					this.activityActive = false,
					this.SOActive = false,
					this.projectActive = false,
					this.rednessActive=true,
					this.quesActive=false,
					this.item_recommend_id = 6
			},
			goCannerCard(item) {
				uni.navigateTo({
					url: `/pages/find/cannerCard/cannerCard?id=${item.userId}`
				})
			},
			attentionCanner(item, index) {
				if (item.isFollowed == 0) {
					this.$http.post('admin/follow/user', {
						userId: this.userId,
						followId: item.userId,
						sign: 0,
						type: 1
					}).then(res => {
						// console.log(res)
						if (res.data.code == 0) {
							item.isFollowed = 1
							if (this.item_recommend_id == 0) {
								this.attentionList.splice(index, 1);
								if (this.attentionList.length == 0) {
									this.$http.get('admin/follow/recommend').then(res => {
										this.attentionList = res.data.data;
										this.attentionList.forEach(item => {
											item.avatar = imageError(item.avatar, this.oss)
										});
									});
								}
							}
						} else {
							uni.showToast({
								title: `${res.data.message}`,
								icon: "none",
								duration: 1000
							})
						}
					})
				} else {
					this.$http.post('admin/follow/user', {
						userId: this.userId,
						followId: item.userId,
						sign: 1,
						type: 1
					}).then(res => {
						// console.log(res)
						if (res.data.code == 0) {
							item.isFollowed = 0
						} else {
							uni.showToast({
								title: `${res.data.message}`,
								icon: "none",
								duration: 1000
							})
						}
					})
				}
			},
			commentsOpen(type, item) {
				if (type == 'apply') {
					this.placeholder = '请输入申请理由';
					this.orgId = item.orgId
				} else if (type == 'share') {
					this.placeholder = '请输入分享内容';
					this.thoughtsId = item.thoughtsId
				}
				this.inputType = type;
				this.$refs.popup.open()
			},
			sendInput() {
				let that = this
				if (that.inputType == 'apply') {
					that.$http.post('admin/org/apply', {
						orgId: that.orgId,
						message: that.input
					}).then(res => {
						// console.log(res)
						if (res.data.code == 0) {
							uni.showToast({
								title: '申请成功',
								icon: "success",
								duration: 1000,
								success: () => {
									setTimeout(() => {
										that.input = ''
										that.$refs.popup.close()
									}, 1000)
								}
							})
						} else {
							uni.showToast({
								title: `${res.data.message}`,
								icon: "none",
								duration: 1000,
								success: () => {
									setTimeout(() => {
										that.input = ''
										that.$refs.popup.close()
									}, 1000)
								}
							})
						}
					})
				} else if (that.inputType == 'share') {
					that.$http.post('dms/thoughts/create', {
						content: that.input,
						transmitId: that.thoughtsId,
						status: 0
					}).then(res => {
						that.$refs.popup.close();
						that.input = ''
						if (res.data.code == 1) {
							uni.showToast({
								icon: 'none',
								title: res.data.message
							})
						} else {
							uni.showToast({
								title: "分享成功",
								icon: "success",
								duration: 1000,
								success() {
									setTimeout(() => {
										that.item_id = 1
										that.refresh()
									}, 1000)
									that.toView = ''
								}
							});
						}
					});
				}
			},
			refresh() {
				this.$http.get('dms/thoughts/follow_page', {
					params: {
						current: 1,
						size: 20,
					}
				}).then(res => {
					// console.log(res)
					this.talk = res.data.data;
					this.talk.records.forEach(item => {
						item.avatar = imageError(item.avatar, this.oss)
					});
					if (this.talk.current == this.talk.pages) {
						this.moreStatus = 'noMore';
					} else if (this.talk.pages == 0) {
						this.moreStatus = 'noMore';
					}
					this.toView = 'A'
				});
			},
			actionShow() {
				this.actionStatus = true
			},
			hide() {
				this.actionStatus = false
				this.maskStatus=false
			},
			goPubDynamic() {
				uni.navigateTo({
					url: "/pages/find/attention/addThoughts/addThoughts"
				})
			},
			goSearch() {
				uni.navigateTo({
					url: "/pages/find/search/search"
				})
			},
			search() {
				if (this.item_contact_id == 1) {
					this.showList = [];
					this.soList.forEach(res => {
						let item = [];
						item = res.dataList.filter(item => item.name.indexOf(this.searchText) > -1);
						if (item.length > 0) this.showList.push({
							dataList: item,
							letter: res.letter
						});
					});
					if(!this.$isEmpty(this.searchText)){
						this.topShowList=[]
					}else{
						this.topShowList=this.topList
					}
				} else if (this.item_contact_id == 0) {
					this.showFriendList = [];
					this.friendList.forEach(res => {
						let item = [];
						item = res.dataList.filter(item => item.realName.indexOf(this.searchText) > -1);
						if (item.length > 0) this.showFriendList.push({
							dataList: item,
							letter: res.letter
						});
					});
				}
			},
			changeStatus(e) {
				this.input = ''
			},
			getCompanyStation,
			previewImage,
		}
	};
</script>
<style lang="scss">
	.mask{
		background: rgba(0,0,0,.5);
		width: 100%;
		height: 300px;
		position: absolute;
		top: 0px;
		z-index: 50;
	}
	.scrollX_item{
		display: inline-block;
		padding: 14rpx 40rpx;
		line-height: 40rpx;
		text-align: center;
		border-radius: 92rpx;
		margin-right: 32rpx;
	}
	page {
		margin-bottom: 100rpx;
	}
.search {
			margin: 0px 32rpx;
			margin-bottom: 16rpx;
			padding: 18rpx 32rpx;
			border-radius: 60rpx;
			background-color: #F5f7f8;

			.searchContactImg {
				height: 32rpx;
				width: 32rpx;
			}
		}

	.warpTitleInput {
		padding-left: 66rpx;
		margin-left: 20rpx;
		width: 146rpx;
		height: 54rpx;
		background: rgba(255, 255, 255, .3);
		border-radius: 13px;
	}

	.searchImg {
		top: 16rpx;
		left: 44rpx;
	}

	.attachContent {
		margin-top: 30rpx;

		.wrapAttach {
			margin: 0 40rpx;
			padding: 34rpx 40rpx 30rpx 30rpx;
			border-radius: 30rpx;

			.attachImg {
				width: 76rpx;
				height: 76rpx;
			}

			.attachInfo {
				flex: 1;
				min-width: 0;
				margin-left: 20rpx;
				font-size: 28rpx;
				line-height: 40rpx;

				.attachTitle {
					margin-top: 10rpx;
					font-size: 24rpx;
					line-height: 34rpx;
				}
			}
		}
	}

	.container {

		position: relative;
		.containerWrap {
			display: flex;
			// .titleImg{
			// 	position: fixed; 
			// 	width: 100%;
			// 	height: 148rpx;
			// 	z-index: 66;
			// }
			.titleWrap {
				//IOS端图片过大可以滑动,切小后安卓端差了2rpx,固加上688+32+32=752
				width: 100%;
				// position: fixed;
				// top: 148rpx; 
				padding: 0 24rpx;
				position: sticky;
				top: 0px;
				background-color: #FFFFFF;
				z-index: 49;

				.titleBtn {
					height: 100%;
					position: relative;
				}

				.titleActions {

					// position: fixed;
					// top: 90rpx;
					// right: 40rpx;
					image {
						width: 170rpx;
						height: 175rpx;
					}

					.wrapActions {
						font-size: 28rpx;
						line-height: 40rpx;

						// position: absolute;
						// top: 34rpx;
						// left: 28rpx;
						.splitLine {
							height: 0.3rpx;
							background-color: #E3E4E5;
							width: 112rpx;
							margin: 20rpx 0rpx;
						}
					}
				}
			}
		}

		.contentSwiper {
			width: 100%;
			border-radius: 30rpx 30rpx 0 0;
			background-color: #FFFFFF;
			position: fixed;
			top: 88rpx;
			// position: absolute;
			// top: 282rpx;
			// left: 0rpx;
			.firstContentSwiper {
				.firstContentSwiperTitle {
					padding:32rpx 0rpx;
					// top: 124rpx; 
				}

				.recommendSwiper {
					width: 100%;

						.firstRecommendScroll {

							// position: relative;
							// top: 220rpx;
							.bannerSwiper {
								height: 270rpx;
								padding-top: 30rpx;
								margin-bottom: 50rpx;

								.swiper-item {
									padding: 0 40rpx;
									border-radius: 30rpx;

									.poster {
										vertical-align: top;
										width: 670rpx;
										height: 270rpx;
										border-radius: 30rpx;
									}
								}
							}

							.logoImg {
								padding: 30rpx 32rpx;
								font-size: 36rpx;
								line-height: 50rpx;
								font-weight: 600;
								color: #272727;
							}

							.celebrityScroll {
								width: 100%;
								height: 170rpx;
								padding: 16rpx 0;
								white-space: nowrap;

								.celebrityList {
									display: inline-block;

									.celebrityListAvatar {
										position: relative;
										margin-right: 30rpx;

										.avatarImg {
											width: 112rpx;
											height: 112rpx;
											border-radius: 50%;
										}
									}

									.celebrityName {
										font-size: 24rpx;
										line-height: 34rpx;
										text-align: center;
										max-width: 92rpx;
									}

									.levelImg {
										width: 30rpx;
										height: 34rpx;
									}
								}
							}
						}
					
				}
			}

			.secondContentSwiper {
				.secondContentScroll {
					width: 100%;
					height: 100%;

					// position: relative;
					// top: 120rpx;
					.secondContentScrollContent {
						.title {
							font-size: 30rpx;
							line-height: 42rpx;
							padding: 32rpx;
							color: #565B5F;
						}

						.scrollAttention {
							white-space: nowrap;
							width: 100%;

							.scrollAttentionList {
								display: inline-block;
								width: 244rpx;
								height: 340rpx;
								border: 2rpx solid #ECEEF0;
								border-radius: 16rpx;
								margin-right: 16rpx;

								.avatarImg {
									margin-bottom: 16rpx;
									margin-top: 32rpx;
									width: 112rpx;
									height: 112rpx;
									border-radius: 50%;
								}

								.attentionName {
									font-size: 28rpx;
									line-height: 40rpx;
									margin-bottom: 8rpx;
									color: #2f2f2f;
									width: 192rpx;
									text-align: center;
								}

								.attentionCompany {
									font-size: 24rpx;
									line-height: 34rpx;
									margin-bottom: 16rpx;
									width: 192rpx;
									color: #9AA1A7;
									text-align: center;
								}

								.attentionBtn {
									padding: 8rpx 12rpx;
									font-size: 24rpx;
									line-height: 34rpx;
									background-color: rgba(247, 68, 55, .1);
									display: inline-block;
									border-radius: 26rpx;
								}
							}
						}
					}
				}
			}

			.thirdContentSwiper {
				.thirdContentSwiperTitle {
					width: 100%;

					.thirdContentSwiperTitleInfo {
						// position: fixed;
						// z-index: 20;
						// top: 124rpx; 
						padding: 20rpx 40rpx;
					}

					.firstRecommendSwiper {
						width: 100%;
						height: 100vh;
					}
				}
			}
		}
	}

	.popup_input {
		padding: 32rpx;
		background-color: #FFFFFF;
		display: flex;
		font-size: 28rpx;
		align-items: flex-end;
	}

	.inputDefault {
		color: #919397;
		// padding: 20rpx;
		line-height: 48rpx;
	}

	textarea {
		flex: 1;
		padding: 20rpx;
		line-height: 48rpx;
		background-color: #F4F5F6;
		color: #666769;
		border-radius: 20rpx;
		height: 184rpx;
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
		// background: linear-gradient(180deg, #FF825C 0%, #FF3636 100%);
		background-color: #46B28B;
		border-radius: 10rpx;
		margin-bottom: 6rpx;
	}

	.addBtn {
		position: fixed;
		bottom: 110rpx;
		right: 6rpx;

		image {
			height: 152rpx;
			width: 152rpx;
		}
	}

	.item_active {
		font-weight: bold;
		// color: #F73737;
		color: #46B28B;
		// background: linear-gradient(89deg, #FFEFEA 0%, #FFD9D9 100%);
		background-color: #DAF0E8;
	}

	.item_unactive {
		color: #272727;
		background-color: #F5F7F8;
	}

	.reply {
		margin-top: 30rpx;
		background-color: #F4F5F6;
		padding: 30rpx 0;
	}

	.center {
		flex: 1;
		display: flex;
		justify-content: center;
		align-items: center;
		.attention {
			font-size: 26rpx;
			line-height: 52rpx;
			color: #FFFFFF;
			width: 140rpx;
			border-radius: 42rpx;
			text-align: center;
			height: 52rpx;
			// background: linear-gradient(90deg, #FF825C 0%, #FF3636 100%);
			background-color: #46B28B;
		}
		.attentioned {
			font-size: 26rpx;
			color: #FFFFFF;
			line-height: 52rpx;
			width: 140rpx;
			background-color: #FFD6D6;
			border-radius: 42rpx;
			text-align: center;
			height: 52rpx;
		}
	}

	// .title {
	// 	padding-top: 40rpx;
	// 	font-size: 28rpx;
	// 	color: #666769;
	// 	line-height: 40rpx;
	// 	margin-left: 40rpx;
	// }

	.recommend {
		margin-top: 40rpx;
		margin-left: 40rpx;
		white-space: nowrap;
		width: 100%;
		// width: 100%;

		.recommend-item {
			display: inline-block;
			margin-right: 30rpx;
			height: 340rpx;
			text-align: center;
			background-color: #F4F5F6;
			border-radius: 30rpx;

			.avatar {
				margin: 30rpx 70rpx 0;
				width: 100rpx;
				height: 100rpx;
				border-radius: 30rpx;
			}

			.name {
				width: 200rpx;
				margin-top: 20rpx;
				color: #303031;
				font-size: 28rpx;
				line-height: 38rpx;
			}

			.company {
				width: 200rpx;
				color: #919397;
				line-height: 28rpx;
				margin-top: 22rpx;
				font-size: 20rpx;
			}

			.attention {
				margin-top: 30rpx;
				font-size: 26rpx;
				line-height: 52rpx;
				color: #FFFFFF;
				width: 140rpx;
				border-radius: 42rpx;
				text-align: center;
				height: 52rpx;
				background: linear-gradient(90deg, #FF825C 0%, #FF3636 100%);
			}
			.attentioned {
				margin-top: 30rpx;
				font-size: 26rpx;
				color: #FFFFFF;
				line-height: 52rpx;
				width: 140rpx;
				background-color: #FFD6D6;
				border-radius: 42rpx;
				text-align: center;
				height: 52rpx;
			}
		}
	}

	.talk {
		.talk-item {
			padding-top: 32rpx;
			border-bottom: 0.3rpx solid #EFF0F1;

			.talk-item-title {
				padding: 0 40rpx;
				display: flex;
				align-items: center;
				margin-bottom: 30rpx;

				.avatar {
					width: 76rpx;
					height: 76rpx;
					border-radius: 20rpx;
				}

				.talk-item-title-text {
					margin-left: 20rpx;

					.talk-item-title-text-name {
						font-size: 28rpx;
						line-height: 28rpx;
					}

					.talk-item-title-text-company {
						font-size: 22rpx;
						line-height: 32rpx;
						// margin-top: 10rpx;
					}

					.name {
						color: #303031;
						font-size: 28rpx;
						line-height: 38rpx;
					}

					.company {
						color: #919397;
						font-size: 22rpx;
						line-height: 32rpx;
					}
				}

			}

			.talk-text {
				padding: 0 40rpx 0 20rpx;
				margin-left: 20rpx;
				font-size: 28rpx;
				line-height: 48rpx;
			}

			.talk-imgs {
				padding-left: 40rpx;
				display: flex;
				flex-direction: row;
				flex-wrap: wrap;

				.talk-img {
					margin-top: 30rpx;
					margin-right: 29rpx;
					width: 204rpx;
					height: 204rpx;
					border-radius: 20rpx;
				}

				.talk-img-single {
					margin-top: 30rpx;
					width: 460rpx;
					height: 616rpx;
					border-radius: 20rpx;
				}
			}

			.talk-end {
				display: flex;
				justify-content: space-between;
				align-items: center;
				font-size: 26rpx;
				color: #565B5F;
				line-height: 36rpx;

				.talk-icon {
					padding: 30rpx 0rpx 40rpx 0rpx;
					height: 44rpx;
					width: 44rpx;
				}

				.talk-end-text {
					margin-left: 10rpx;
					padding: 30rpx 0rpx 40rpx 0rpx;
					font-size: 26rpx;
					line-height: 36rpx;
				}
			}
		}
	}

	.bottom-safe {
		/* iphonex 等安全区设置，底部安全区适配 */
		/* #ifndef APP-NVUE */
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		/* #endif */
	}
</style>
