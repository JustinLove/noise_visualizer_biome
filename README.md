# Noise Visualizer Biome

Tool for biome modders to edit the files and look at noise patterns

Defines a custom biome with a 20-step (0.05 noise range) blue-green-pink color scale.  Edit the noise definition on layer 0 and see how the various definitions change the noise output.

Recommended mod: [System Editor Reset](https://forums.uberent.com/threads/rel-system-editor-reset.63165/)

## Observations

### Shared parameters

Appear to work on very noise type.

- `zoom`: large numbers produce extremes, small numbers keep it around 0.5

### type: `simplex`

Smooth noise across planet

- `scale`: large numbers produce fine detail, small numbers make large flat fields

These parameters only appear on an unused layer in the mountain biome:

- `simplex_octaves`: small values (1) produce smooth round gradients, large values (5+) produce more detailed crenelations.  Reading suggests that this is the number of successively higher-frequency passes added.
- `simplex_persistence`: small values (< 0.5) produce smooth round gradients, large values (> 0.5) produce more extremes and islands.  Reading suggests that this is a multiplier on each octave, large values give the higher frequency noise more weight.
- `simplex_scale`: similar but not quite the same as `scale`

### type: `grid`

Same quadrilateral symmetric noise on each face of cube-mapped sphere.  Results similar but not identical across seeds.  Apply a large zoom factor to get a crude checkerboard pattern 

- `grid_size`: large values make larger squares; default seems to be around 200 (meters?)

### type: `constant`

- `constant_value`: added to 0.5, so 0 = noise 0.5, 0.5 = noise 1

### type: `ring`

Produces a pole-pole grid effect, which can be turned into strips, rings, or swirls using the parameters

- `ring_latitude_period`: Meters period from period from 0.5-0.5. Larger values stretch the grid elements towards the poles. If undefined, produces a grid effect (default ~250?)  0 produces a strong oscillating stripe effect.
- `ring_longitude_peroid`[sic]: correctly spelled in stock biomes; game uses typo.  Large values stretch elements around the equator.
- `ring_twist`:  twists longitude lines, default is around 1. Units seem to be longitude-periods

### type: `metal`

Appears only in the base biome and is likely derelict.  The example parameters `ring_even_period` and `ring_even_twist` have no effect.  Produces evenly distributed noise at each sample - so it hits the extreme high and low values more often than simplex without zoom.  It does respond to zoom.

### type: `ring_even`

With default values, results similar to metal, possibly related as the use above suggests.  Gets weird near poles; appears to be processed individually for each cube face.

- `grid_size`: large values make larger squares; default seems to be around 20 (meters?)
- `ring_even_twist`: does something like you'd expect, but I haven't formed a mental model of just what that is.
- `ring_even_period`: no effect that I've observed

## Extras

There is also a 10-step grey scale in the gruntfile.

Gruntfile is set up with a task to copy to a server mod, but these are pretty boring biomes, just colorful.

## Development

The generated project includes a `package.json` that lists the dependencies, but you'll need to run `npm install` to download them.

PA will upload **all files** in the mod directory, including `node_modules` and maybe even `.git` - you probably don't want to use this in `server_mods` directly, unless you really like waiting.  The template is set up run to run as a project within a peer directory of `server_mods` - I use `server_mods_dev/mod_name`.  The task `grunt copy:mod` will copy the mod files to `../../server_mods/identifier`, you can change the `modPath` in the Gruntfile if you want to run it from somewhere else.

### Available Tasks

- copy:mod - copy the mod files into server_mods
- copy:modinfo - repo is configured for client, this makes the server modinfo
- clean - remove the mods pa directory and server instance to avoid leftover files
- proc - read one or more files from PA and munge into one in the mod.
- jsonlint - verify file syntax
- client - proc, jsonlint
- server - copy:mod, copy:modinfo
- default - client
