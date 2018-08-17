/* Magic Mirror
* Module: MMM-Advice
*
* By cowboysdude
* 
*/

Module.register("MMM-Advice", {

	// Module config defaults.
	defaults: {
		updateInterval: 120*60*1000, // every 2 hours
		animationSpeed: 10,
		initialLoadDelay: 5, // 0 seconds delay
		retryDelay: 1500, 
		maxWidth: "400px",
		fadeSpeed: 1,
		displayTitle: true,
		displayIcon: true,
		showtitle: false,
		title: "Great Advice & Common Sense"
	},

	getStyles: function() {
		return ["MMM-Advice.css"];
	},

	// Define start sequence.
	start: function() {
		Log.info("Starting module: " + this.name);
        this.sendSocketNotification('CONFIG', this.config);
		this.config.lang = this.config.lang || config.language;        
		 // Set locale.
		this.today = "";
		this.advice = {};
		var adive = null;
		this.getAdvice();
		this.scheduleUpdate();
	},

	getDom: function() {

		var advice = this.advice;
		
		var wrapper = document.createElement("div");
		wrapper.className = "wrapper";
		wrapper.style.maxWidth = this.config.maxWidth;
		
		var top = document.createElement("div");
		top.classList.add("content");

		
			var title = document.createElement("span");
			title.classList.add("small", "bright", "title");
			title.innerHTML = (this.config.showtitle !== false) ? "<u>"+this.config.title+"</u>": "";
			top.appendChild(title); 
			  
		var des = document.createElement("p");
		des.classList.add("small", "bright");
		des.innerHTML = advice;
		top.appendChild(des);

		wrapper.appendChild(top);
		return wrapper;
	},

	processAdvice: function(data) {
		this.today = data.Today;
		this.advice = data.advice; 
	},

	scheduleUpdate: function() {
		setInterval(() => {
			this.getAdvice();
		}, this.config.updateInterval);
		this.getAdvice(this.config.initialLoadDelay);
	},

	getAdvice: function() {
		this.sendSocketNotification('GET_ADVICE');
	},

	socketNotificationReceived: function(notification, payload) {
		if (notification === "ADVICE_RESULT") {
			this.processAdvice(payload);
			this.updateDom(this.config.animationSpeed);
		}
		this.updateDom(this.config.initialLoadDelay);
	},

});
