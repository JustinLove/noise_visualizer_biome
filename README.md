# Noise Visualizer Biome

Tool for biome modders to edit the files and look at noise patterns

Defines a custom biome with a 20-step (0.05 noise range) blue-green-pink color scale.  Edit the noise definition on layer 1 and see how the various definitions change the noise output.

Recommended mod: [System Editor Reset](https://forums.uberent.com/threads/rel-system-editor-reset.63165/)

There is also a 10-step grey scale in the gruntfile.

Gruntfile is set up with a tas  to copy to a server mod, but these are pretty boring biomes, just colorful.

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
