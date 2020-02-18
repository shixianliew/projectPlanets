/**
 * Adapted from jspsych-image-button-response
 * Original author: Josh de Leeuw
 *
 * plugin for displaying a stimulus and getting a mouseclick response (in the indexed order of displayed images)
 *
 * documentation: docs.jspsych.org
 *
 **/

jsPsych.plugins["image-mouseclick-response"] = (function() {

  var plugin = {};

  jsPsych.pluginAPI.registerPreload('image-mouseclick-response', 'stimulus', 'image');

  plugin.info = {
    name: 'image-mouseclick-response',
    description: '',
    parameters: {
      stimulus: {
        type: jsPsych.plugins.parameterType.IMAGE,
          pretty_name: 'Stimulus',
		  array: true,
        default: undefined,
        description: 'The images to be displayed'
      },
      mousedown: {
        type: jsPsych.plugins.parameterType.IMAGE,
          pretty_name: 'Stimulus on Mouse Down',
		  array: true,
        default: undefined,
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
      button_html: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Button HTML',
        default: '<button class="jspsych-btn">%choice%</button>',
        array: true,
        description: 'The html of the button. Can create own style.'
      },
      prompt: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Prompt',
        default: null,
        description: 'Any content here will be displayed under the button.'
      },
      stimulus_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Stimulus duration',
        default: null,
        description: 'How long to hide the stimulus.'
      },
      trial_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Trial duration',
        default: null,
        description: 'How long to show the trial.'
      },
      margin_vertical: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Margin vertical',
        default: '0px',
        description: 'The vertical margin of the button.'
      },
      margin_horizontal: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Margin horizontal',
        default: '8px',
        description: 'The horizontal margin of the button.'
      },
      response_ends_trial: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Response ends trial',
        default: true,
        description: 'If true, then trial will end when user responds.'
      },
    }
  }

  plugin.trial = function(display_element, trial) {

      // display stimulus
	  var html = '<div id="jspsych-image-mouseclick-response-stimulus">' 
	  
	  if (Array.isArray(trial.stimulus)){
		  for (var i = 0; i < trial.stimulus.length; i ++){
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
			  html += 'data-choice="'+i + '"'
			  html +='></img>';
		  }
	  }

	  html += '</div>'
	  
    //display buttons
    // var buttons = [];
    // if (Array.isArray(trial.button_html)) {
    //   if (trial.button_html.length == trial.choices.length) {
    //     buttons = trial.button_html;
    //   } else {
    //     console.error('Error in image-button-response plugin. The length of the button_html array does not equal the length of the choices array');
    //   }
    // } else {
    //   for (var i = 0; i < trial.choices.length; i++) {
    //     buttons.push(trial.button_html);
    //   }
    // }
    // html += '<div id="jspsych-image-mouseclick-response-btngroup">';

    // for (var i = 0; i < trial.choices.length; i++) {
    //   var str = buttons[i].replace(/%choice%/g, trial.choices[i]);
    //   html += '<div class="jspsych-image-mouseclick-response-stimulus-old" style="display: inline-block; margin:'+trial.margin_vertical+' '+trial.margin_horizontal+'" id="jspsych-image-mouseclick-response-button-' + i +'" data-choice="'+i+'">'+str+'</div>';
    // }
    // html += '</div>';

    //show prompt if there is one
    if (trial.prompt !== null) {
      html += trial.prompt;
    }

    display_element.innerHTML = html;

    // start timing
    var start_time = performance.now();

    for (var i = 0; i < trial.stimulus.length; i++) {
      display_element.querySelector('#jspsych-image-mouseclick-response-stimulus-' + i).addEventListener('click', function(e){
          var choice = e.currentTarget.getAttribute('data-choice'); // don't use dataset for jsdom compatibility		  
        after_response(choice);
      });
		// Also do one for mousedown events
      display_element.querySelector('#jspsych-image-mouseclick-response-stimulus-' + i).addEventListener('mousedown', function(e){
          var choice = e.currentTarget.getAttribute('data-choice'); // don't use dataset for jsdom compatibility		  
          mousedown(choice);
      });		
      display_element.querySelector('#jspsych-image-mouseclick-response-stimulus-' + i).addEventListener('mouseleave', function(e){
          var choice = e.currentTarget.getAttribute('data-choice'); // don't use dataset for jsdom compatibility		  
          mouseleave(choice);
      });		
    }

    // store response
    var response = {
      rt: null,
      button: null
    };

	  // function to handle transition to/from mousedown	  
	  function mousedown(choice){
		//Handle mousedown?
		display_element.querySelector('#jspsych-image-mouseclick-response-stimulus-' + choice).src = trial.mousedown[choice];

	  }
	  function mouseleave(choice){
		//Handle mousedown?
		display_element.querySelector('#jspsych-image-mouseclick-response-stimulus-' + choice).src = trial.stimulus[choice];

	  }
	  
    // function to handle responses by the subject
    function after_response(choice) {
		
      // measure rt
      var end_time = performance.now();
      var rt = end_time - start_time;
      response.button = choice;
      response.rt = rt;

      // after a valid response, the stimulus will have the CSS class 'responded'
      // which can be used to provide visual feedback that a response was recorded
      display_element.querySelector('#jspsych-image-mouseclick-response-stimulus').className += ' responded';

      // disable all the buttons after a response
      var btns = document.querySelectorAll('.jspsych-image-mouseclick-response-button button');
      for(var i=0; i<btns.length; i++){
        //btns[i].removeEventListener('click');
        btns[i].setAttribute('disabled', 'disabled');
      }

      if (trial.response_ends_trial) {
        end_trial();
      }
    };

    // function to end trial when it is time
    function end_trial() {

      // kill any remaining setTimeout handlers
      jsPsych.pluginAPI.clearAllTimeouts();

      // gather the data to store for the trial
      var trial_data = {
        "rt": response.rt,
        "stimulus": trial.stimulus,
        "button_pressed": response.button
      };

      // clear the display
      display_element.innerHTML = '';

      // move on to the next trial
      jsPsych.finishTrial(trial_data);
    };



    // hide image if timing is set
    if (trial.stimulus_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function() {
        display_element.querySelector('#jspsych-image-button-response-stimulus').style.visibility = 'hidden';
      }, trial.stimulus_duration);
    }

    // end trial if time limit is set
    if (trial.trial_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function() {
        end_trial();
      }, trial.trial_duration);
    }

  };

  return plugin;
})();
