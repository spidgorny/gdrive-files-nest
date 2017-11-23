
export class Profiler {

	/**
	 * For profiling
	 */
	startTime: number;

	private profileName: string;

	profile(name: string) {
		this.profileName = name;
		// console.log(name);
		this.startTime = new Date().getTime();
	}

	profileEnd() {
		const diff = new Date().getTime() - this.startTime;
		console.log(this.profileName, '+', diff, 'ms');
	}

}
