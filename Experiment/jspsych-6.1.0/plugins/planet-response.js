/**
 * Adapted from jspsych-image-button-response
 * Original author: Josh de Leeuw
 *
 * plugin for displaying a stimulus and getting a mouseclick response (in the indexed order of displayed images)
 *
 * documentation: docs.jspsych.org
 *
 **/

jsPsych.plugins["planet-response"] = (function() {

  var plugin = {};

  jsPsych.pluginAPI.registerPreload('planet-response', 'stimulus', 'image');

  plugin.info = {
    name: 'planet-response',
    description: '',
    parameters: {
      stimulus: {
        type: jsPsych.plugins.parameterType.IMAGE,
          pretty_name: 'Stimulus',
		  array: true,
        default: undefined,
        description: 'The images to be displayed'
      },
      stimulus_alt: {
        type: jsPsych.plugins.parameterType.IMAGE,
          pretty_name: 'Stimulus on Mouse Down',
		  array: true,
        default: null,
        description: 'The images to be displayed when mouse is clicking on it'
      },
      stimulus_height: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Image height',
        default: null,
        description: 'Set the image height in pixels'
      },
      stimulus_width: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Image width',
        default: null,
        description: 'Set the image width in pixels'
      },
		points: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Points',
        default: 0,
        description: 'Points accumulated up to this point'
      },		
		ship_space: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Spacer between stimuli',
        default: 300,
        description: 'Set the space between stimuli in pixels'
      },

      maintain_aspect_ratio: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Maintain aspect ratio',
        default: true,
        description: 'Maintain the aspect ratio after setting width or height'
      },
      // choices: {
      //   type: jsPsych.plugins.parameterType.STRING,
      //   pretty_name: 'Choices',
      //   default: undefined,
      //   array: true,
      //   description: 'The labels for the buttons.'
      // },
      // button_html: {
      //   type: jsPsych.plugins.parameterType.STRING,
      //   pretty_name: 'Button HTML',
      //   default: '<button class="jspsych-btn">%choice%</button>',
      //   array: true,
      //   description: 'The html of the button. Can create own style.'
      // },
      prompt: {
          type: jsPsych.plugins.parameterType.STRING,
          pretty_name: 'Prompt',
          default: ['Planet A','Planet B'],
		  array: true,
          description: 'Any content here will be displayed under the option.'
      },
      // stimulus_duration: {
      //   type: jsPsych.plugins.parameterType.INT,
      //   pretty_name: 'Stimulus duration',
      //   default: null,
      //   description: 'How long to hide the stimulus.'
      // },
      trial_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Trial duration',
        default: null,
        description: 'How long to show the trial.'
      },
      end_trial_wait: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'End Trial Wait Time',
        default: 2000,
        description: 'How long before the trial ends after some final action.'
      },
      // margin_vertical: {
      //   type: jsPsych.plugins.parameterType.STRING,
      //   pretty_name: 'Margin vertical',
      //   default: '0px',
      //   description: 'The vertical margin of the button.'
      // },
      // margin_horizontal: {
      //   type: jsPsych.plugins.parameterType.STRING,
      //   pretty_name: 'Margin horizontal',
      //   default: '8px',
      //   description: 'The horizontal margin of the button.'
      // },
      // response_ends_trial: {
      //   type: jsPsych.plugins.parameterType.BOOL,
      //   pretty_name: 'Response ends trial',
      //   default: true,
      //   description: 'If true, then trial will end when user responds.'
      // },
		signal_time: {
			type: jsPsych.plugins.parameterType.INT,
			pretty_name: 'Signal duration',
			default: 1000,
			description: 'Duration of signal image above chosen planet, in ms.'
		},
		signal_height: {
			type: jsPsych.plugins.parameterType.INT,
			pretty_name: 'Signal height',
			default: 100,
			description: 'Height of signal image.'
		},
		signal_width: {
			type: jsPsych.plugins.parameterType.INT,
			pretty_name: 'Signal duration',
			default: 100,
			description: 'Width of signal image.'
		},
		probability_win: {
			type: jsPsych.plugins.parameterType.FLOAT,
			pretty_name: 'Probability of winning',
			default: [.5,.5],
			array:  true,
			description: 'Probability of winning for each planet'
		},
		rewards: {
			type: jsPsych.plugins.parameterType.INT,
			pretty_name: 'Rewards',
			default: [100,100],
			array: true,
			description: 'Rewards for each planet'
		},
		show_ship: {
			type: jsPsych.plugins.parameterType.BOOL,
			pretty_name: 'Show ships',
			default: false,			
			description: 'Show ships after planet signal response.'
		},
		ship_stimulus: {
			type: jsPsych.plugins.parameterType.IMAGE,
			pretty_name: 'Ship stimuli',			
			default: null,
			array: true,
			description: 'Images for ships--one for each planet.'
		},
		ship_height: {
			type: jsPsych.plugins.parameterType.INT,
			pretty_name: 'Ship height',			
			default: 200,
			description: 'Height of ship.'
		},
		ship_width: {
			type: jsPsych.plugins.parameterType.INT,
			pretty_name: 'Ship width',			
			default: 300,
			description: 'Width of ship.'
		},
		ship_attack_time: {
			type: jsPsych.plugins.parameterType.INT,
			pretty_name: 'Ship Time to Attack',			
			default: 4000,
			description: 'Duration between ship appearance and attack.'
		},
		// ship_timeout: {
		// 	type: jsPsych.plugins.parameterType.INT,
		// 	pretty_name: 'Ship Timeout ',			
		// 	default: 8000,
		// 	description: 'Duration between ship appearance and end of trial.'
		// },
		shield_charging_time: {
			type: jsPsych.plugins.parameterType.INT,
			pretty_name: 'Shield charging duration',			
			default: 1000,
			description: 'Duration of shield charging prompt.'
		},
		probability_shield: {
			type: jsPsych.plugins.parameterType.FLOAT,
			pretty_name: 'Probability of shield',
			default: .5,
			description: 'Probability of shield availability after charging.'
		},
    }
  }
	

	plugin.trial = function(display_element, trial) {
		var html = ''
		html += '<div id="jspsych-image-mouseclick-response-stimulus">' 
		if (Array.isArray(trial.stimulus)){
			for (var i = 0; i < trial.stimulus.length; i ++){
				// Set up space for score, signal, and planet
				html += '<div id="planet-div-' + i + '" style="display:inline-block;"> ';
				html += '<div id="planet-score-box-' + i + '" style="display:block; height:100px; width:100px"></div> ';
				html += '<div id="planet-signal-box-' + i + '" style="display:block; height:100px; width:100px"></div> ';
				//Write img tag
				html += '<img src="'+trial.stimulus[i] + '" ' + 
					'id="jspsych-image-mouseclick-response-stimulus-' + i + '" ' + 
					'style="';
				html += 'display: inline-block;';
				if(trial.stimulus_height !== null){
					html += 'height:'+trial.stimulus_height+'px; '
					if(trial.stimulus_width == null && trial.maintain_aspect_ratio){
						html += 'width: auto; ';
					}
				}
				if(trial.stimulus_width !== null){
					html += 'width:'+trial.stimulus_width+'px; '
					if(trial.stimulus_height == null && trial.maintain_aspect_ratio){
						html += 'height: auto; ';
					}
				}
				html += '"' //End the style property quote
				html += 'data-choice="'+i + '" '
				//Make images undraggable
				html += 'draggable="false" ';
				html +='></img>';
				
				//show prompt if there is one
				if (trial.prompt !== null) {
					html += '<div id="option-prompt-' + i + '">'
					html += trial.prompt[i];
					html += '</div>'
				}
				html +='</div>';
				//Add ship div in between planets
				if (i+1 < trial.stimulus.length){
					html += '<div id="ship-div" style="display:inline-block; ' +
						'vertical-align: top; ' +
						'width:' + trial.ship_space + 'px;">' +
						'<div id="ship-score-box" style="height:100px;"></div>' +
						'<div id="ship-img-box"></div>' +
						'<div id="ship-shield-box"></div>' + 
						'</div>'
				}
			}
		}

		html += '</div>'
		
		display_element.innerHTML = html;

		// start timing
		var start_time = performance.now();

		// store response
		var response = {
			rt: null,
			option: null,
			shield_activated: null,
			gain: 0,
			loss: 0,
		};

		// Go through each choice and implement mouseclick events
		for (var i = 0; i < trial.stimulus.length; i++) {
			var element = display_element.querySelector('#jspsych-image-mouseclick-response-stimulus-' + i)
			var conditionStr = 'response.option==null'
			var styleDef = ['opacity:1;'];
			var styleChange = ['opacity:.5;'];
			var result = after_response;
			cond_click(element,result,conditionStr,styleDef,styleChange)
		}
		
		// General function to add conditional mouseclicks to an element
		function cond_click(element,result,conditionStr,styleDef,styleChanges){
			element.addEventListener('click', function(e){
				var condition = eval(conditionStr) //eval is necessary for the condition to be checked only when event is triggered
				if (condition){
					var ct = e.currentTarget;					//var choice = e.currentTarget.getAttribute('data-choice'); // don't use dataset for jsdom compatibility		  
					result(ct);
				}
			});
			// Also do one for mousedown events
			element.addEventListener('mousedown', function(e){
				var condition = eval(conditionStr)
				if (condition){
					var ct = e.currentTarget
					//var choice = ct.getAttribute('data-choice'); // don't use dataset for jsdom compatibility					
					//mousedown(ct);
					replaceStyle(element,styleChanges)
				}
			});
			element.addEventListener('mouseleave', function(e){
				var condition = eval(conditionStr)
				if (condition){
					var ct = e.currentTarget
					//var choice = ct.getAttribute('data-choice'); // don't use dataset for jsdom compatibility					
					//var stim = trial.stimulus[choice]
					//mouseleave(ct);
					replaceStyle(element,styleDef)

				}
			});		
		}

		//function to handle find and replace in style attribute
		function replaceStyle(element,styleChange){
			for (var i = 0; i<styleChange.length; i++){
				//Make pattern, extract style name and value
				var newPatt = new RegExp('(.*?):(.*?);')
				var styleFull = styleChange[i]
				var styleMatch = styleFull.match(newPatt)
				var styleName = styleMatch[1]
				var styleValue = styleMatch[2]
				var findPatt = new RegExp(';\\s*'+styleName + '\\s*:.*?;')
				var findPattStart = new RegExp('^' + styleName + '\\s*:.*?;')
				//Get current style
				var currStyle = element.getAttribute('style')
				//Add to style changes, check if at the start first
				if (currStyle.search(findPattStart) > 0 ){
					var newStyle = currStyle.replace(findPattStart,styleFull)
				} else if (currStyle.search(findPatt) > 0 ){
					var newStyle = currStyle.replace(findPatt,'; ' + styleFull);
				} else {
					var newStyle = currStyle + styleFull
				}
				element.setAttribute('style',newStyle);
			}			

		}
		// // function to handle transition to/from mousedown	  
		// function mousedown(element,styleChange){
		// 	//Handle mousedown
		// 	for (var i = 0; i<styleChange.length; i++){
		// 		//Get current style
		// 		var currStyle = element.getAttribute('style')
		// 		//Add to style changes
		// 		var newStyle = currStyle + styleChange
		// 		element.setAttribute('style',newStyle);
		// 		//element.src = stim;
		// 	}
		// }
		// function mouseleave(element,styleChange){
		// 	//Handle mouseleave?
		// 	element.style.opacity = 1.0;
		// }
		
		// function to handle responses by the subject
		function after_response(element) {
			var choice = element.getAttribute('data-choice') 
			// measure rt
			var end_time = performance.now();
			var rt = end_time - start_time;
			response.option = choice;
			response.rt_planet = rt;
			
			// after a valid response, the stimulus will have the CSS class 'responded'
			// which can be used to provide visual feedback that a response was recorded
			display_element.querySelector('#jspsych-image-mouseclick-response-stimulus').className += ' responded';
			//Show the signal, wait some time, then end the trial
			proceed_gamble(choice,trial.signal_time);
			
		};
		

		// function to show the signal, run gamble, show outcome
		function proceed_gamble(choice,time){
			//Get planet position
			var planet = display_element.querySelector('#jspsych-image-mouseclick-response-stimulus-' + choice)
			var planetWidth = planet.getBoundingClientRect().width
			var planetX = planet.getBoundingClientRect().x		  
			var signalLeft = planetWidth/2 - trial.signal_width/2
			
			//Display signal image
			document.querySelector('#planet-signal-box-'+choice).innerHTML = '<img src="img/signal.png"' +
				'style="height: 100px; width: 100px; position: relative;' +
				'left:' + signalLeft + 'px;' +
				'">'
			
			//Disable selection of images
			for (var i = 0; i < trial.stimulus.length; i++) {
				display_element.querySelector('#jspsych-image-mouseclick-response-stimulus-' + i).addEventListener('click', function(e){
				});
			}
			
			// Run gamble
			gamble_success = Math.random() < trial.probability_win[choice] //Might want to set this as variable?
			if (gamble_success){
				//Add and display reward
				response.gain = trial.rewards[choice]
				displayScore = trial.rewards[choice]
				scoreColor = 'green'
				
			} else {
				//Display some fail state
				response.gain = 0;
				displayScore = 0;
				scoreColor = 'red'
			}
			trial.points += response.gain
			
			// Wait before showing outcome
			setTimeout(function(){
				display_element.querySelector('#planet-score-box-'+choice).innerHTML = '<div id="scoreDiv">' + displayScore + '</div>'
				var scoreDiv = display_element.querySelector('#scoreDiv')
				scoreDiv.style.fontSize = "50px"
				scoreDiv.style.color = scoreColor
				var scoreDivWidth = scoreDiv.getBoundingClientRect().width
				scoreDiv.style.position = 'relative'
				scoreDiv.style.left = planetWidth/2 - scoreDivWidth/2 + 'px'
				//Proceed to next step (ship or end trial)
				if (trial.show_ship){
					show_ship(choice);
				} else {
					end_trial()
					//setTimeout(end_trial,1000)
				}
			},time)		  
			
		}
		
		// function to show ship
		function show_ship(choice) {
			//Insert img tag into the ship-div

			display_element.querySelector('#ship-img-box').innerHTML = '<img src ="' + trial.ship_stimulus[choice] + '" ' +
				'id="ship-img-' + i + '" ' + 
				'height="' + trial.ship_height +'" ' +
				'width="' + trial.ship_width +'" ' +
				'style="position:relative; top:0px" ' + 
				'draggable="false" ' +
				'> ' +
				'</img>'
			
			var shieldDiv = display_element.querySelector('#ship-shield-box');			
			shieldDiv.innerHTML = 'CHARGING SHIELD';
			shieldDiv.style.fontSize = "25px";
			shieldDiv.style.color = 'blue';
			shieldDiv.style.position = 'relative';
			shieldDiv.style.top = '200px';
			
			setTimeout(function(){
				proceed_shield();
			},trial.shield_charging_time)			

			//Start timer for ship to attack and timeout
			setTimeout(ship_attack,trial.ship_attack_time)
		}
		
		// function to update state of shield
		var shield_start_time = null
		function proceed_shield(){
			var shieldDiv = display_element.querySelector('#ship-shield-box');
			// Run shield gamble
			shield_success = Math.random() < trial.probability_shield
			if (shield_success){
				shieldDiv.innerHTML = '<div>SHIELD AVAILABLE</div>' +
					'<div id="shield-button" style="border-radius:10px; border: 2px solid blue;" draggable="false">' +
					'ACTIVATE! </div>';
				var shieldButton = display_element.querySelector('#shield-button')
				var conditionStr = 'response.shield_activated==null'
				var styleDef = ['background-color: white;','color: blue;'];
				var styleChange = ['background-color: blue;','color: white;'];
				var result = activate_shields;
				cond_click(shieldButton,result,conditionStr,styleDef,styleChange)
				shield_start_time = performance.now();
			} else {
				shieldDiv.innerHTML = '<div>SHIELD UNAVAILABLE</div>' +
					'<div id="shield-button" style="border-radius:10px; border: 2px solid blue; opacity:.5;"> NO SHIELD </div>';

			}			
		}

		function activate_shields(){
			//Log data
			var end_time = performance.now();
			var rt = end_time - shield_start_time;
			response.shield_activated = true;
			response.rt_shield = rt;

			//Modify shieldbutton text
			shieldButton = display_element.querySelector('#shield-button')
			shieldButton.innerHTML = 'ACTIVE'
		}
		// function for ship to attack
		function ship_attack(){
			if (!response.shield_activated && response.option==0){
				// 20% of points
				response.loss = Math.round(trial.points * .2)
				trial.points -= response.loss
				
				// Display and add to points

				var shipDiv = display_element.querySelector('#ship-score-box')
				shipDiv.innerHTML = '<div id="ship-scoreDiv"> -' + response.loss + '</div>'
				var shipWidth = shipDiv.getBoundingClientRect().width

				var scoreDiv = display_element.querySelector('#ship-scoreDiv')
				scoreDiv.style.fontSize = "50px"
				scoreDiv.style.color = 'red'
				
				var scoreDivWidth = scoreDiv.getBoundingClientRect().width
				scoreDiv.style.position = 'relative'				
				scoreDiv.style.left = shipWidth/2 - scoreDivWidth/2 + 'px'

				//Disable button
				response.shield_activated = false;
				var shieldDiv = display_element.querySelector('#ship-shield-box')
				shieldDiv.style.opacity = .5
			}
			//End trial
			end_trial()
		}
		
		// function to end trial when it is time
		function end_trial() {
			setTimeout(function(){
				// kill any remaining setTimeout handlers
				jsPsych.pluginAPI.clearAllTimeouts();
				
				// gather the data to store for the trial
				var trial_data = {
					"stimulus": trial.stimulus,
					"planet_selected": response.option,
					"rt_planet": response.rt_planet,
					"shield_activated": response.shield_activated,
					"rt_shield": response.rt_shield,					
					"points_gained": response.gain,
					"points_lost": response.loss,
					"points_total": trial.points,
					"block_type": trial.data.block_type,
					"block_number": trial.data.block_number,
				};
				
				// clear the display
				display_element.innerHTML = '';
				
				// move on to the next trial
				console.log(trial_data)
				jsPsych.finishTrial(trial_data);
			},trial.end_trial_wait)
		};
		
		
		
		// // hide image if timing is set
		// if (trial.stimulus_duration !== null) {
		// 	jsPsych.pluginAPI.setTimeout(function() {
		// 		display_element.querySelector('#jspsych-image-mouseclick-response-stimulus').style.visibility = 'hidden';
		// 	}, trial.stimulus_duration);
		// }
		
		// end trial if time limit is set
		if (trial.trial_duration !== null) {
			jsPsych.pluginAPI.setTimeout(function() {
				end_trial();
			}, trial.trial_duration);
		}
		
	};
	
	return plugin;
})();
