/// <reference path="../../all.d.ts"/>
module DeamonApp {
	class DeamonService {
		private method: string | (() => string);
		private params: {} | (() => {});
		private timeoutID: ng.IPromise<void>;
		private isStarted = false;
		private interval = 2000;
		private DoneCB = (resp: IVkResponseSuccess) => true;
		private FailCB = (error: any) => false;

		public static $inject = [
			'$vk',
			'$timeout',
		];

		constructor(private $vk: VkApp.VkService, private $timeout: ng.ITimeoutService) {	}

		setConfig(config: {
			method: string | (() => string),
			params: {} | (() => {}),
			interval?: number,
			DoneCB?: (resp: IVkResponseSuccess) => boolean,
			FailCB?: (error: any) => boolean,
		}) {
			this.method   = config.method   || this.method;
			this.params   = config.params   || this.params;
			this.interval = config.interval || this.interval;
			this.DoneCB   = config.DoneCB   || this.DoneCB;
			this.FailCB   = config.FailCB   || this.FailCB;
			return this;
		}

		start() {
			this.isStarted = true;
			this.sendRequest();
			return this;
		}

		stop() {
			this.isStarted = false;
			this.$timeout.cancel(this.timeoutID);
			return this;
		}

		sendRequest() {
			if (!this.isStarted) return this.stop();
			const method = typeof this.method === 'function' ? this.method() : this.method;
			const params = typeof this.params === 'function' ? this.params() : this.params;

			this.$vk.api(method, params).then((resp: IVkResponseSuccess) => {
				(this.DoneCB(resp)  && this.restart()) || this.stop();
			}, (error: any) => {
				(this.FailCB(error) && this.restart()) || this.stop();
			});

			return this;
		}

		restart() {
			if (!this.isStarted) return this.stop();
			this.timeoutID = this.$timeout(() => {this.sendRequest}, this.interval, false);
		}
	}
}
