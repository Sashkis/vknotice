/// <reference path="../../all.d.ts"/>
module BgApp {
	class BgApp {
		public static $inject = [
			'storage',
			'deamon',
			'Config',
			'Analytics',
		];

		constructor(
			private storage: StorageApp.StorageService,
			private deamon: DeamonApp.DeamonService,
			private Config: {profilesLimit: number},
			private Analytics: any
		) { }


	}
}
