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
      stimulus_mouseover: {
        type: jsPsych.plugins.parameterType.IMAGE,
          pretty_name: 'Stimulus on Mouse Over',
		  array: true,
        default: null,
        description: 'The images to be displayed when mouse is hovering over on it'
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
		show_total_points: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Total Points',
        default: true,
        description: 'Show points accumulated up to this point'
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
        default: 4000,
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
		signal_time_range: {
			type: jsPsych.plugins.parameterType.INT,
			pretty_name: 'Signal duration range',
			array: true,
			default: [2000,4000],
			description: 'Range of duration of signal image above chosen planet, in ms.'
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
		show_ship_delay: {
			type: jsPsych.plugins.parameterType.INT,
			pretty_name: 'Show ship delay',			
			default: 3000,
			description: 'Duration between presentation of planet reward and appearance of ship.'
		},
		ship_attack_time: {
			type: jsPsych.plugins.parameterType.INT,
			pretty_name: 'Ship Time to Attack',			
			default: 4000,
			description: 'Duration between ship appearance and attack.'
		},
		ship_attack_damage: {
			type: jsPsych.plugins.parameterType.FLOAT,
			pretty_name: 'Ship A damage',			
			default: .2,
			description: 'Proportion of total points that an undefended encounter with Ship A removes.'
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
			default: 2000, //2000
			description: 'Duration of shield charging prompt.'
		},
		probability_shield: {
			type: jsPsych.plugins.parameterType.FLOAT,
			pretty_name: 'Probability of shield',
			default: .995,
			description: 'Probability of shield availability after charging.'
		},
		cursor: {
			type: jsPsych.plugins.parameterType.IMAGE,
			pretty_name: 'Cursor images',
			array: true,
			default: ['img/cursor.png','img/cursordark.png'],
			description: '1st Element: default cursor; 2nd Element: mousedown cursor'
    	},
    }
  }
	
	plugin.trial = function(display_element, trial) {
		var html = ''
		html += '<div id="planets">'
		var display_wrapper = document.getElementsByClassName('jspsych-content-wrapper')[0]
		//Some custom styles		
		display_element.style.cursor = "url('" + trial.cursor[0] + "'),pointer"
		display_wrapper.style.backgroundColor = "black"
		display_element.style.color = "green"
		if (Array.isArray(trial.stimulus)){
			for (var i = 0; i < trial.stimulus.length; i ++){
				// Set up space for score, signal, and planet
				html += '<div id="planet-div-' + i + '" style="display:inline-block;"> ';
				html += '<div class="clickid" id="planet-score-box-' + i + '" style="display:block; height:100px; width:100px"></div> ';
				html += '<div class="clickid" id="planet-signal-box-' + i + '" style="display:block; height:100px; width:100px"></div> ';
				//Write img tag
				html += '<img class="clickid" src="'+trial.stimulus[i] + '" ' + 
					'id="planet-' + i + '" ' +
					'moi="' + trial.stimulus_mouseover[i] + '" ' + //mouseover img
					'dei="' + trial.stimulus[i] + '" ' + //default img
					'style="' ;
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
				
				//show prompt if there is one -- this is really just the planet names below the planet
				if (trial.prompt !== null) {
					html += '<div class="clickid" id="planet-prompt-' + i + '">'
					html += trial.prompt[i];
					html += '</div>'
				}
				html +='</div>';
				//Add ship div in between planets
				if (i+1 < trial.stimulus.length){
					html += '<div id="ship-div" style="display:inline-block; ' +
						'vertical-align: top; ' +
						'width:' + trial.ship_space + 'px;">' +
						'<div class="clickid" id="total-score-box" style="height:50px;"></div>' + 
						//'<div id="ship-score-box" style="height:50px;"></div>' +
						'<div id="ship-img-box"></div>' +
						'<div id="ship-shield-box" style="height:200px;"></div>' + 
						'</div>'
				}
			}
		}

		html += '</div>'
		
		//If total score is to be displayed, update div
		function updateScore(points){
			if (trial.show_total_points){
				scoreDiv = display_element.querySelector('#total-score-box')
				//scoreDiv.style.color = 'green'
				scoreDiv.style.fontSize = '30px'
				scoreDiv.innerHTML = 'Total points: ' + points
			}
		}
		//Update status with some message and in some colour
		function updateStatus(msg,color){
			var statusDiv = display_element.querySelector('#ship-status-text')
			statusDiv.innerHTML = msg
			statusDiv.style.color = color
		}
		
		display_element.innerHTML = html;
		
		updateScore(trial.points)
		
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

		//Define mouseclick vars
		var clicks = {
			idx: [],
			rt: [],
			loc: [],
			element:[],
		}
		var clickcnt = 0
		// These functions to log mouseclicks throughout the experiment
		document.addEventListener('mousedown', getPositions)
		document.addEventListener('mouseup', resetCursor)
		// Function to record all mouseclicks
		function getPositions(ev) {
			if (ev == null) {
				ev = window.event
			}
			_mouseX = ev.clientX;
			_mouseY = ev.clientY;
			console.log("X: " + _mouseX + " Y: " + _mouseY)
			log_click([_mouseX,_mouseY])
		}

		function log_click(cursor_loc){
			//Save mouse coords into data structure, along time and with time
			clicks.idx.push(clickcnt)
			clicks.rt.push(performance.now())
			clicks.loc.push(cursor_loc)
			clickcnt ++
			console.log(clicks)
			display_element.style.cursor = "url('" + trial.cursor[1] + "'),pointer" //"url('cursordark.png'),pointer"
		}		

		function resetCursor(){
			display_element.style.cursor = "url('" + trial.cursor[0] + "'),pointer"
		}
		// Go through each choice and implement conditional mouseclick events, also mouseover
		for (var i = 0; i < trial.stimulus.length; i++) {
			var element = display_element.querySelector('#planet-' + i)
			var conditionStr = 'response.option==null'
			var styleDef = ['opacity:1;'];
			var styleChange = ['opacity:.5;'];
			var result = after_response;
			var clickOnMouseDown = true; //activate click immediately on mousedown			
			cond_click(element,result,conditionStr,styleDef,styleChange,clickOnMouseDown)
			//Handle mouseover
			//have to make mouseover imgs global
			stimulus_mouseover = trial.stimulus_mouseover
			element.addEventListener('mouseover', function(e){
				var ct = e.currentTarget
				ct.src = ct.getAttribute('moi')
			});
			element.addEventListener('mouseout', function(e){
				var ct = e.currentTarget
				ct.src = ct.getAttribute('dei')
			});

		}
		
		// General function to add conditional mouseclicks to an element
		function cond_click(element,result,conditionStr,styleDef,styleChanges,clickOnMouseDown){
			// Also do one for mousedown events
			element.addEventListener('mousedown', function(e){
				var condition = eval(conditionStr)
				console.log(condition)
				console.log(response.shield_activated)
				if (condition){
					var ct = e.currentTarget
					replaceStyle(element,styleChanges)
				}
			});
			element.addEventListener('mouseleave', function(e){
				var condition = eval(conditionStr)
				if (condition){
					var ct = e.currentTarget
					replaceStyle(element,styleDef)
				}
			});
			element.addEventListener('mouseup', function(e){
				var condition = true
				if (condition){
					var ct = e.currentTarget
					replaceStyle(element,styleDef)
				}
			});
			if (clickOnMouseDown){
				var eventStr = 'mousedown';
			} else {
				var eventStr = 'click';
			}
			element.addEventListener(eventStr, function(e){
				var condition = eval(conditionStr) //eval is necessary for the condition to be checked only when event is triggered
				if (condition){
					var ct = e.currentTarget;					//var choice = e.currentTarget.getAttribute('data-choice'); // don't use dataset for jsdom compatibility		  
					result(ct);
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
			display_element.querySelector('#planets').className += ' responded';
			//Show the signal, wait some time, then end the trial
			var signal_time_diff = Math.abs(trial.signal_time_range[1] - trial.signal_time_range[0])
			var signal_time = Math.random()*signal_time_diff + trial.signal_time_range[0]
			console.log(signal_time)
			proceed_gamble(choice,signal_time);
			
		};
		

		// function to show the signal, run gamble, show outcome
		function proceed_gamble(choice,time){
			//Get planet position
			var planet = display_element.querySelector('#planet-' + choice)
			var planetWidth = planet.getBoundingClientRect().width
			var planetX = planet.getBoundingClientRect().x		  
			var signalLeft = planetWidth/2 - trial.signal_width/2
			
			//Display signal image and status
			document.querySelector('#planet-signal-box-'+choice).innerHTML = '<img src="img/signal.png"' +
				'style="height: 100px; width: 100px; position: relative;' +
				'left:' + signalLeft + 'px;' +
				'">'

			//Initialise middle divs
			display_element.querySelector('#ship-img-box').innerHTML = '<div id="ship-img-div" ' + 
				'style="position:relative; top:0px; border: 0px; ' +
				'height: ' + trial.ship_height  + 'px ;' +
				'width: ' + trial.ship_width + 'px;" ' +
				'draggable="false" ' +				
				'> ' +
				'</div>' + 
				'<div id="ship-attack-text" style="height:80px;width:300px;line-height:80px"></div>'+
				'<div id="ship-status-text" style="height:50px;width:300px;"></div>';

			var statusDiv = display_element.querySelector('#ship-status-text');
			statusDiv.style.fontSize = '25px'
			var statusmsg = 'Attempting trade with ' + trial.prompt[choice]
			var statusclr = '#b4ba38' //some shade of yellow
			updateStatus(statusmsg,statusclr )
			logIDonMouseDown(statusDiv)
			
			//Disable selection of images
			for (var i = 0; i < trial.stimulus.length; i++) {
				display_element.querySelector('#planet-' + i).addEventListener('click', function(e){
				});
			}
			
			// Run gamble
			gamble_success = Math.random() < trial.probability_win[choice] //Might want to set this as variable?
			if (gamble_success){
				//Add and display reward
				response.gain = trial.rewards[choice]
				displayScore = trial.rewards[choice]
				scoreColor = 'green'
				var statusmsg = 'Traded with ' + trial.prompt[choice] + ', gained ' + displayScore + ' points'
				var statusclr = 'green' //some shade of green				
				
			} else {
				//Display some fail state
				response.gain = 0;
				displayScore = 0;
				scoreColor = 'red'
				var statusmsg = 'Trade attempt failed'
				var statusclr = 'yellow' //some shade of green

			}
			trial.points += response.gain
			// Wait before showing outcome
			setTimeout(function(){
				//display_element.querySelector('#planet-score-box-'+choice).innerHTML = '<div id="scoreDiv">' + displayScore + '</div>'
				//var scoreDiv = display_element.querySelector('#scoreDiv')
				//scoreDiv.style.fontSize = "50px"
				//scoreDiv.style.color = scoreColor
				//var scoreDivWidth = scoreDiv.getBoundingClientRect().width
				//scoreDiv.style.position = 'relative'
				//scoreDiv.style.left = planetWidth/2 - scoreDivWidth/2 + 'px'
				updateScore(trial.points)
				updateStatus(statusmsg,statusclr)
				
				//Proceed to next step (ship or end trial)
				if (trial.show_ship){
					setTimeout(function(){
						show_ship(choice);
					},trial.show_ship_delay);
							   
				} else {
					end_trial()
					//setTimeout(end_trial,1000)
				}
			},time)		  
			
		}
		
		// function to show ship
		function show_ship(choice) {
			//Put stuff into the ship divs
			var shipDiv = display_element.querySelector('#ship-img-div');
			shipDiv.innerHTML = '<img src="' + trial.ship_stimulus[choice] +  '" ' +
				'id="ship-img" ' + 
				'height="' + trial.ship_height +'" ' +
				'width="' + trial.ship_width +'" ' +
				'style="position:relative; top:0px; border: 0px" ' + 
				'draggable="false" ' +				
				'> ' 
			logIDonMouseDown(shipDiv)
			
			var shipAtTxt = display_element.querySelector('#ship-attack-text');
			shipAtTxt.style.fontSize = '25px'
			shipAtTxt.style.color = 'red'
			var attack_int_id = setInterval(attframe,1000)
			var attack_countdown = trial.ship_attack_time/1000
			shipAtTxt.innerHTML = 'Encounter imminent ' + attack_countdown + ' s' //Show first frame
			function attframe() {
				if (attack_countdown <= 0) {
					clearInterval(attack_int_id);
				} else {
					attack_countdown --
					shipAtTxt.innerHTML = 'Encounter imminent ' + attack_countdown + ' s'
				}
			}
			logIDonMouseDown(shipAtTxt)
			
			var shieldBoxDiv = display_element.querySelector('#ship-shield-box');
			shieldBoxDiv.innerHTML = '<div id = "ship-shield-text"></div>' +
				'<div id = "ship-shield-button"></div>' +
				'<div id = "ship-shield-charger"></div>';
			//Style the text div
			var shieldTxtDiv = display_element.querySelector('#ship-shield-text');
			shieldTxtDiv.innerHTML = 'CHARGING SHIELD';
			shieldTxtDiv.style.fontSize = "25px";
			shieldTxtDiv.style.color = 'green';
			shieldTxtDiv.style.position = 'relative';
			shieldTxtDiv.style.top = '100px';
			logIDonMouseDown(shieldTxtDiv)

			//Style the button
			var shieldButton = display_element.querySelector('#ship-shield-button');
			//shieldButton.style.borderRadius = "10px"
			shieldButton.style.border = "2px solid green"
			shieldButton.draggable = false
			shieldButton.style.position = 'relative';
			shieldButton.style.top = '100px';			
			shieldButton.style.fontSize = "40px";
			shieldButton.style.height = '50px';
			shieldButton.style.lineHeight = '50px';
			shieldButton.style.zIndex = '10';
			//shieldButton.style.verticalAlign = 'middle';
			logIDonMouseDown(shieldButton)

			//Style the charger div
			var shieldChgDiv = display_element.querySelector('#ship-shield-charger');
			shieldChgDiv.style.color = 'green';
			shieldChgDiv.style.backgroundColor = 'green';
			//shieldChgDiv.style.borderRadius = "10px"
			shieldChgDiv.style.border = "2px solid green"
			shieldChgDiv.draggable = false
			//Get button location and move chgdiv there
			var buttonrect = shieldButton.getBoundingClientRect()			
			shieldChgDiv.style.position = 'absolute';
			shieldChgDiv.style.top = buttonrect.top + 1 + 'px';
			shieldChgDiv.style.left = buttonrect.left + 1 + 'px';
			shieldChgDiv.style.height = buttonrect.height - 5 + 'px';
			shieldChgDiv.style.width = 0 //buttonrect.width - 5 + 'px';
			shieldChgDiv.style.opacity = .5
			shieldButton.style.zIndex = '1';
			


			//Set shield charging timer and animation
			setTimeout(function(){
				proceed_shield();
			},trial.shield_charging_time)

			var int_steps = 5; //ms
			var charge_int_id = setInterval(chargeframe, int_steps);
			var chgwidth = 0
			var charge_nsteps = trial.shield_charging_time / int_steps
			var charge_stepwidth = buttonrect.width / charge_nsteps
			function chargeframe() {
				if (shieldChgDiv.getBoundingClientRect().width > buttonrect.width) {
					clearInterval(charge_int_id);
				} else {
					chgwidth += charge_stepwidth
					//console.log('frame')
					shieldChgDiv.style.width = chgwidth + 'px'
					/* code to change the element style */
				}
			}

			//Start timer for ship to attack and timeout
			setTimeout(ship_attack,trial.ship_attack_time)
		}
		
		// function to update state of shield
		var shield_start_time = null
		function proceed_shield(){
			var shieldTxtDiv = display_element.querySelector('#ship-shield-text');
			var shieldButton = display_element.querySelector('#ship-shield-button');
			// Run shield gamble
			shield_success = Math.random() < trial.probability_shield
			if (shield_success){
				shieldTxtDiv.innerHTML = 'SHIELD AVAILABLE'
				// shieldButton.style.borderRadius = "10px"
				// shieldButton.style.border = "2px solid blue"
				// shieldButton.draggable = false
				shieldButton.innerHTML = 'ACTIVATE!'
				//shieldDiv.innerHTML = '<div id="ship-shield-button" style="border-radius:10px; border: 2px solid blue;" draggable="false">' +
				//	'ACTIVATE! </div>';
				var shieldButton = display_element.querySelector('#ship-shield-button')
				var conditionStr = 'response.shield_activated==null'
				var styleDef = ['background-color: ;','color: green;'];
				var styleChange = ['background-color: green;','color: black;'];
				var result = activate_shields;
				var clickOnMouseDown = false;
				cond_click(shieldButton,result,conditionStr,styleDef,styleChange,clickOnMouseDown)
				shield_start_time = performance.now();
			} else {
				shieldTxtDiv.innerHTML = 'SHIELD UNAVAILABLE'
				shieldButton.innerHTML = 'NO SHIELD'
				shieldButton.style.opacity = '.5'
				//shieldDiv.innerHTML = '<div id="ship-shield-button" style="border-radius:10px; border: 2px solid blue; opacity:.5;"> NO SHIELD </div>';

			}
			//var shieldButton = display_element.querySelector('#ship-shield-button')

		}

		function activate_shields(){
			//Log data
			var end_time = performance.now();
			var rt = end_time - shield_start_time;
			response.shield_activated = true;
			response.rt_shield = rt;

			//Modify Shieldbutton text
			shieldButton = display_element.querySelector('#ship-shield-button')
			shieldButton.innerHTML = 'ACTIVE'
			shieldButton.style.color = '#1eff19'
			shieldButton.style.backgroundColor = '#196d17'
		}
		// function for ship to attack
		function ship_attack(){
			//Disable button if no response
			if (response.shield_activated==null){
				response.shield_activated = false
			}
			var might_lose = Math.round(trial.points * trial.ship_attack_damage)
			if (response.option==1 || trial.ship_attack_damage==0){
					var statusmsg = 'Ship passed by without incident'
					var statusclr = 'green' //some shade of green								
			} else if (!response.shield_activated && response.option==0){
				// 20% of points
				response.loss = might_lose
				trial.points -= response.loss
				// Display and add to points

				var shipDiv = display_element.querySelector('#ship-status-text')
				shipDiv.innerHTML = '<div class="clickid" id="ship-scoreDiv"> -' + response.loss + '</div>'
				var shipWidth = shipDiv.getBoundingClientRect().width

				// var scoreDiv = display_element.querySelector('#ship-scoreDiv')
				// scoreDiv.style.fontSize = "50px"
				// scoreDiv.style.color = 'red'
				// logIDonMouseDown(scoreDiv)
				
				// var scoreDivWidth = scoreDiv.getBoundingClientRect().width
				// scoreDiv.style.position = 'relative'				
				// scoreDiv.style.left = shipWidth/2 - scoreDivWidth/2 + 'px'

				
				//Update score
				updateScore(trial.points)

				//Update status
				var statusmsg = 'Ship attacked: lost ' + response.loss + ' points'
				var statusclr = 'red' //some shade of green
			} else if (response.shield_activated) {
				var statusmsg = 'Shield successfully deflected attack'
				var statusclr = 'yellow'
			}
			updateStatus(statusmsg,statusclr)
			//Visually disable button
			var shieldDiv = display_element.querySelector('#ship-shield-text')
			//shieldDiv.style.opacity = .5
			var shieldButton = display_element.querySelector('#ship-shield-button')
			if (!response.shield_activated){
				shieldButton.style.opacity = .5
				shieldButton.style.backgroundColor = ''
				shieldButton.style.color = 'green'				
			} 
			//End trial
			end_trial()
		}


		//After everything has loaded, loop through all elements and add an eventlistener to fetch id on mousedown
		var allDOM = display_element.getElementsByClassName("clickid");
		for (var i=0, max=allDOM.length; i < max; i++) {
			element = allDOM[i]
			logIDonMouseDown(element)
		}
		// Add function to log id on mousedown
		function logIDonMouseDown(element){
			element.addEventListener('mousedown', function(e){
				console.log(e.currentTarget.id)
				clicks.element[clickcnt] = e.currentTarget.id
				//clicks.element.push(e.currentTarget.id)
			});			
		}
		// function to end trial when it is time
		function end_trial() {
			setTimeout(function(){
				// kill any remaining setTimeout handlers
				jsPsych.pluginAPI.clearAllTimeouts();

				//Remove tracking and logging of mouseclicks
				document.removeEventListener('mousedown', getPositions)
				document.removeEventListener('mouseup',resetCursor)
				//Reset styles				
				display_element.style.cursor = 'default'
				display_wrapper.style.backgroundColor = '#FFFFFF'
				display_element.style.color = "black"
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
					"trial_number": trial.data.trial_number,
					"trial_clicks": clicks
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
