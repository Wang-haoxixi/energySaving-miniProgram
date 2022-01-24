<script>
	export default {
		onLaunch: function(options) {
			//根据返回的referrerInfo来判断用户来源进行相对应的路由跳转
			console.log('App Launch');
			//查看小程序版本（开发、体验、正式）
			// console.log(__wxConfig.envVersion)
			uni.checkSession({
				success:(res)=> {
					// console.log(res)
					//未过期
				},
				fail:(res)=> {
					//已过期
					uni.removeStorageSync('token')
					// this.$isResolve()
				},
				complete: () => {
					//确保小程序onLaunch事件里的异步事件完成后，在调用页面的onload
					this.$isResolve()
				}
			})
			// console.log(scene.split('_'))
		},
		onShow: function(options) {
			console.log('App Show');
			const scene = decodeURIComponent(options.query.scene);
			if (scene.split('_')[0] == 'activity') {
				uni.navigateTo({
					url: '/pages/contacts/soWorkbench/soInfo/soActivity/soActivityDetails/soActivityDetails?id=' + scene.split(
						'_')[
						1]
				})
			} else if (scene.split('_')[0] == 'questionnaire') {
				uni.navigateTo({
					url: '/pages/contacts/soWorkbench/soInfo/soQuestionnaire/questionnaireDetails/questionnaireDetails?id=' + scene
						.split(
							'_')[
							1]
				})
			} else if (scene.split('_')[0] == 'exam') {
				uni.navigateTo({
					url: '/pages/contacts/soWorkbench/soInfo/soExamination/soExaminationDetails/soExaminationDetails?id=' + scene
						.split(
							'_')[
							1]
				})
			}
		},
		onHide: function() {
			console.log('App Hide');
		}
	};
</script>

<style lang="scss">
	/*每个页面公共颜色 */
	image{
		vertical-align: bottom;
	}
	// 智慧节能宝主体视觉色
	.color_main_4fc975 {
		color: #4fc975 !important;
	}
	
	// 智慧节能宝按钮背景色-可点击
	.bgColor_clickable {
		background-color: #46B28B !important;
	}
	
	// 智慧节能宝按钮背景色-不可点击
	.bgColor_unclickable {
		background-color: #C7E8DC !important;
	}
	
	// 智慧节能宝按钮背景色-透明
	.bgColor_lucency {
		background-color: #ECEEF0 !important;
	}
	
	.color_516B8D {
		color: #516B8D !important;
	}

	.color_919397 {
		color: #9aa1a7 !important;
	}

	.color_2F80FF {
		color: #2B579F !important;
	}

	.color_FFFFFF {
		color: #ffffff !important;
	}

	.color_303031 {
		color: #272727 !important;
	}

	.color_3CD489 {
		color: #57dbb1 !important;
	}

	.color_F74437 {
		color: #F73737 !important;
	}

	.color_F737E3 {
		color: #F737E3 !important;
	}

	.color_BABEC0 {
		color: #bcc4cb !important;
	}

	.color_666769 {
		color: #565b5f !important;
	}

	.color_F4F5F6 {
		color: #f4f5f6 !important;
	}

	.color_E3E4E5 {
		color: #e3e4e5 !important;
	}

	.color_F0F9FF {
		color: #f0f9ff !important;
	}

	.bg_color_000000 {
		background-color: #000000 !important;
	}

	.bg_color_919397 {
		background-color: #9aa1a7 !important;
	}

	.bg_color_2F80FF {
		background-color: #2B579F !important;
	}

	.bg_color_FFFFFF {
		background-color: #ffffff !important;
	}

	.bg_color_303031 {
		background-color: #272727 !important;
	}

	.bg_color_3CD489 {
		background-color: #57dbb1 !important;
	}

	.bg_color_F74437 {
		background-color: #F73737 !important;
	}

	.bg_color_F737E3 {
		background-color: #F737E3 !important;
	}

	.bg_color_F744371A {
		background-color: #f744371A !important;
	}

	.bg_color_F737E31A {
		background-color: #F737E31A !important;
	}

	.bg_color_BABEC0 {
		background-color: #babec0 !important;
	}

	.bg_color_666769 {
		background-color: #666769 !important;
	}

	.bg_color_F4F5F6 {
		background-color: #f5f7f8 !important;
	}

	.bg_color_E3E4E5 {
		background-color: #e3e4e5 !important;
	}

	.bg_color_F0F9FF {
		background-color: #f0f9ff !important;
	}

	.bold {
		font-weight: bold;
	}

	::v-deep .btn::after {
		border: none;
	}

	::v-deep button::after {
		border: none;
	}

	.button {
		display: inline-flex;
		align-items: center;
		// font-weight: bold;
		font-size: 28rpx;
		height: 92rpx;
		justify-content: center;
		// padding: 16rpx 14rpx;
		border-radius: 64rpx;
		line-height: 92rpx;
		text-align: center;
		color: #ffffff;
		// background: linear-gradient(90deg, #FF825C 0%, #FF3636 100%);
		background-color: #46B28B;
	}

	.button:active {
		opacity: 0.7;
	}

	.shareButton {
		font-size: 24rpx;
		padding: 8rpx 20rpx;
		background-color: #FFFFFF;
		color: #F74437;
		line-height: 34rpx;
		border-radius: 25rpx;
		font-weight: bold;
	}

	.flexRow {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.flexRowStart {
		display: flex;
		align-items: center;
		justify-content: flex-start;
	}

	.flexColumn {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.flexColumnStart {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
	}

	.singleEllipsis {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.doubleEllipsis {
		display: block;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.tribleEllipsis {
		display: block;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 3;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.quadraEllipsis {
		display: block;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 4;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.avatar {
		height: 76rpx;
		width: 76rpx;
		border-radius: 20rpx;
	}

	::-webkit-scrollbar {
		display: none;
		width: 0 !important;
		height: 0 !important;
		-webkit-appearance: none;
		background: transparent;
	}

	checkbox .wx-checkbox-input {
		border-radius: 50%;
		/* 圆角 */
		width: 45rpx;
		/* 背景的宽 */
		height: 45rpx;
		/* 背景的高 */
	}

	checkbox .wx-checkbox-input.wx-checkbox-input-checked {
		// border: 2rpx solid #FF6034;
		border: 2rpx solid #46B28B;
		// background: #FF6034;
		background-color: #46B28B;
	}

	checkbox .wx-checkbox-input.wx-checkbox-input-checked::before {
		border-radius: 50%;
		/* 圆角 */
		width: 45rpx;
		/* 选中后对勾大小，不要超过背景的尺寸 */
		height: 45rpx;
		/* 选中后对勾大小，不要超过背景的尺寸 */
		line-height: 45rpx;
		text-align: center;
		font-size: 30rpx;
		/* 对勾大小 30rpx */
		color: #fff;
		/* 对勾颜色 白色 */
		background: transparent;
		transform: translate(-50%, -50%) scale(1);
		-webkit-transform: translate(-50%, -50%) scale(1);
	}

	/*  重写 radio 样式  */
	/* 未选中的 背景样式 */
	radio .wx-radio-input {
		border-radius: 50%;
		/* 圆角 */
		width: 45rpx;
		height: 45rpx;
	}

	/* 选中后的 背景样式 （红色背景 无边框 可根据UI需求自己修改） */
	radio .wx-radio-input.wx-radio-input-checked {
		border: 2rpx solid #46B28B;
		background: #46B28B;
	}

	/* 选中后的 对勾样式 （白色对勾 可根据UI需求自己修改） */
	radio .wx-radio-input.wx-radio-input-checked::before {
		border-radius: 50%;
		/* 圆角 */
		width: 45rpx;
		/* 选中后对勾大小，不要超过背景的尺寸 */
		height: 45rpx;
		/* 选中后对勾大小，不要超过背景的尺寸 */
		line-height: 45rpx;
		text-align: center;
		font-size: 30rpx;
		/* 对勾大小 30rpx */
		color: #fff;
		/* 对勾颜色 白色 */
		background: transparent;
		transform: translate(-50%, -50%) scale(1);
		-webkit-transform: translate(-50%, -50%) scale(1);
	}

	.safe-bottom {
		/* iphonex 等安全区设置，底部安全区适配 */
		/* #ifndef APP-NVUE */
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);

		/* #endif */
	}

	.emptyImg {
		width: 100%;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		margin: auto;
	}
</style>
