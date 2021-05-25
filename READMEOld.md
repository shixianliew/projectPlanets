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
 - `stimulus` - Image files for the planets.
 - `stimulus_height` - Height of image file (in pixels).
 - `stimulus_height` - Width of image file (in pixels).
 - `maintain-aspect-ratio` - Maintain aspect ratio of image.
 - `stimulus_select` - Stimulus selection image on mouseover.
