Repo for planets project.

To test the website, go here: [https://raw.githack.com/shixianliew/projectPlanets/master/Experiment/index.html](https://raw.githack.com/shixianliew/projectPlanets/master/Experiment/index.html)

Data for the experimental blocks have a JSON structure:

- `all_outcomes` -  Object containing gains/losses obtained and at what time.
  - `all_outcomes.outcome` - Array containing results of each outcome (wins or nothing from trades, losses or nothing
    from ships).
  - `all_outcomes.time_outcome` - Array containing timestampt of each outcome.
  - `all_outcomes.total` - Running total of points.
- `all_clicks` - Object containing details on every mousedown during a block.
  - `all_clicks.element` - ID of element if mousedown on visible element.
  - `all_clicks.idx` - Index of each mousedown. 
  - `all_clicks.loc` - Location of cursor on mousedown in px, from topleft corner of viewport.
  - `all_clicks.timestamp` - Timestamp of mousedown.
- `block_type` - String specifying what kind of block it is. Currently it's probably either set to 'planet_noship' or
  'planet_ship'.
- `block_number` - Index of current block.
- `display_loc` - Location of experiment display div (the space that contains the experiment elements) in px. Subtract this from cursor location to get relative position of
  cursor on the experiment display.
- `planets` - Object containing details on every planet mousedown with some outcome.
  - `planets.click_idx` - Index of mousedown, corresponding to the main list in all_clicks.idx.
  - `planets.select` - Index of selected planet (currently 0 is blue planet on left, 1 is yellow/orange planet on right).
  - `planets.time_select` - Timestamp at mousedown on planet.
  - `planets.outcome` - Trade reward associated with that mousedown.
  - `planets.time_outcome` - Timestamp at delivery of reward information.
- `points_total` - Current total number of points at end of block. Should be same as last element in all_outcomes.outcome.
- `ships` - Object containing details on every ship appearance and shield status/click.
  - `ships.type` - Index of ship that appeared (currently 0 for Ship I from left blue planet, 1 for Ship II from right
    orange planet.)	
  - `ships.time_appear` - Timestamp at appearance of ship.
  - `ships.shield_available` - Shield availability (after charging) at the appearance of ship. (`true`/`false`)
  - `ships.shield_activated` - Shield activation status (`true`/`false`; is `null` when shield is not available)
  - `ships.rt_shield_activated` - Response time (between appearance of shield activated button and clicking it).
  - `ships.outcome` - Outcome associated with ship encounter.
  - `ships.time_outcome` - Timestamp of ship encounter.
- `stimuli` - Information on the stimuli assignments.
  - `stimuli.planets` - Filenames of the planet images, in order from left to right.
  - `stimuli.ships` - Filenames of the ship images, in order from left to right.
  - `stimuli.ship_hostile_idx` - Integer indicating the assignment of hostile (punishing) ship. 0: left, 1: right.
- `trial_number` - Index of current trial. Probably not very useful with continuousResp set to true.
- `viewport_size` - Size of viewport (the browser window) in px.

Parameters for the planet-response plugin:

 - `stimulus` - Image files for the planets. Img file array. Default: `undefined`
 - `stimulus_height` - Height of image file (in px). Integer. Default: `null`
 - `stimulus_width` - Width of image file (in px). Integer. Default: `null`
 - `maintain-aspect-ratio` - Maintain aspect ratio of image. Boolean. Default: `true`
 - `stimulus_select` - Stimulus selection image on mouseover. Img file. Default: `undefined`
 - `prompt` - Text labels for each choice. String array. Default: `['Planet A','Planet B']`
 - `show_total_points` - Toggle presentation of total points on the top of the screen. Boolean. Default: `true`
 - `ship_space` - Space between stimuli (and consequently the width of ship div) in px. Integer. Default: `300`
 - `block_duration` - Duration of each continuous block in ms. Integer. Default: `240*1000`
 - `feedback_duration` - Duration of trade(planet) and ship feedback. Integer. Default: `3000`
 - `end_trial_wait` - How long before the block ends after some final action, in ms. Integer. Default: `1000`
 - `signal_time` - Duration of trade signal before reward delivery in ms. Integer. Default: `2000`
 - `signal_height` - Height of signal image in px. Integer. Default: `100`
 - `signal_width` - Width of signal image in px. Integer. Default: `80`
 - `signal_padding` - Blank space (padding) around signal image. Integer. Default: `10`
 - `probability_win` - Probability of successful trade for each planet. Integer array. Default: `[.5, .5]`
 - `rewards` - Rewards for each successful trade for each planet in points. Integer array. Default: `[100, 100]`
 - `show_ship` - Toggle ship appearance on this block. Boolean. Default: `false`
 - `show_ship_delay` - Duration between trade attempt mouseclick and appearance of ship in ms. Integer. Default: `2000`
 - `probability_ship` - Probability of ship appearing after trade attempt on respective planet. Float array. Default: `[.2, .2]`
 - `ship_stimulus` - Image files for each ship. Img file array. Default: `null`
 - `ship_height` - Height of ship image in px. Integer. Default: `200`
 - `ship_width` - Width of ship image in px. Integer. Default: `300`
 - `ship_attack_time` - Time between ship appearance and ship encounter (attack or passing by) in ms. Integer. Default: `400`
 - `ship_attack_damage` - Proportion of total points an undefended ship attack removes. Float. Default: `.2`
 - `ship_hostile_idx` - Specifies index of hostile ship, can be 0 (ship I) or 1 (ship II). Integer. Default: `0`
 - `shield_charging_time` - Time it takes for shield to charge in ms. Integer. Default: `2000`
 - `probability_shield` - Probability of shield availability after charging. Float. Default: `.5`
 - `shield_prevent_trading` - Toggle prevention of trading when shield is active. Boolean. Default: `true`
 - `shield_cost_toggle` - Toggle shield activation cost. Boolean. Default: `true`
 - `shield_cost_amount` - Shield activation cost in points. Integer. Default: 50
 - `cursor` - Cursor image files, [default cursor, mousedown cursor]. Img file array. Default: `['img/cursor.png','img/cursordark.png']`
