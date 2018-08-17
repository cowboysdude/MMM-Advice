/* Magic Mirror
    * Module: MMM-Advice
    *
    * By Cowboysdude
    * 
    */
const NodeHelper = require('node_helper');
const request = require('request');  
const translate = require('google-translate-api');

module.exports = NodeHelper.create({
	  
    start: function() {
    	console.log("Starting module: " + this.name);
    },
    
    getAdvice: function(url) {
		var self = this;
    	request({ 
    	          url: "http://api.adviceslip.com/advice",
    	          method: 'GET' 
    	        }, (error, response, body) => {
            if (!error && response.statusCode === 200) { 
                        var advices = JSON.parse(body);
				translate(advices.slip.advice, {to: self.config.lang }).then(res  => {	
				var advice = res.text;
				  result = {advice};
				self.sendSocketNotification("ADVICE_RESULT", result);	
				});	     
                    }  else { 
					console.log("MMM-Advice " +error);
					}
               });
            }, 
    
    socketNotificationReceived: function(notification, payload) {
        if (notification === 'GET_ADVICE') {
                this.getAdvice(payload);
            }
		if (notification === 'CONFIG') {
            this.config = payload;
        }	
         }  
    });
