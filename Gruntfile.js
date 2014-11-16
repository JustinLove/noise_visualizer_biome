var spec = require('./lib/spec')
var prompt = require('prompt')
prompt.start()

var modPath = '../../server_mods/com.wondible.pa.noise_visualizer_biome/'
var stream = 'stable'
var media = require('./lib/path').media(stream)

module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    copy: {
      mod: {
        files: [
          {
            src: [
              'modinfo.json',
              'LICENSE.txt',
              'README.md',
              'CHANGELOG.md',
              'ui/**',
              'pa/**'],
            dest: modPath,
          },
        ],
      },
      modinfo: {
        files: [
          {
            src: ['modinfo.json'],
            dest: modPath,
          },
        ],
        options: {
          process: function(content, srcpath) {
            var info = JSON.parse(content)
            info.date = require('dateformat')(new Date(), 'yyyy/mm/dd')
            info.identifier = info.identifier.replace('client', 'server')
            info.context = 'server'
            delete(info.scenes)
            delete(info.priority)
            console.log(info.identifier, info.version, info.date)
            return JSON.stringify(info, null, 2)
          }
        }
      },
    },
    clean: ['pa', modPath],
    jsonlint: {
      all: {
        src: [
          'pa/terrain/**/*.json',
          'modinfo.json',
        ]
      },
    },
    // copy files from PA, transform, and put into mod
    proc: {
      biome_type: {
        src: [
          'pa/terrain/sandbox.json'
        ],
        cwd: media,
        dest: 'pa/terrain/noise_visualizer.json',
        process: function(spec) {
          spec.name = 'noise_visualizer'
          spec.biomes[0].spec = "/pa/terrain/noise_visualizer/noise_visualizer.json"
          delete spec.water
          delete base_biome
          spec.lighting.sun.diffuse = [0.1, 0.1, 0.1]
          spec.lighting.ambient.day_sky = [0.9, 0.9, 0.9]
          spec.lighting.ambient.night_sky = [0.8, 0.8, 0.8]
          return spec
        }
      },
      biome: {
        src: [
          'pa/terrain/sandbox/sandbox.json'
        ],
        cwd: media,
        dest: 'pa/terrain/noise_visualizer/noise_visualizer.json',
        process: function(spec) {
          spec.name = 'noise_visualizer'
          var blueGreenPink20 = [
            "/pa/terrain/lava/decals/lava_decal_02.json", // large black spot
            "/pa/terrain/ice/decals/ice_decal_water_03.json", // dark blue with faded edges
            "/pa/terrain/grass/decals/grass_decal_water_02.json", // deep blue
            "/pa/terrain/sand/decals/sand_decal_water_03.json", // dark greenish-blue
            "/pa/terrain/ice/decals/ice_decal_water_02.json", // blue with faded edges
            "/pa/terrain/ice/decals/ice_decal_water_01.json", // baby blue with faded edges
            "/pa/terrain/sand/decals/sand_decal_water_02.json", // bluish-green
            "/pa/terrain/grass/decals/grass_decal_water_01.json", // dark cyan
            "/pa/terrain/grass/decals/grass_decal_01.json", // solid dark green
            "/pa/terrain/grass/decals/grass_decal_03.json", // solid richer green 
            "/pa/terrain/jungle/decals/jungle_decal_01.json", // mottled greens
            "/pa/terrain/jungle/decals/jungle_decal_03.json", // dark fuzzy mottled greens
            "/pa/terrain/desert/decals/desert_rock_decal_02.json", // sandy dense spots
            "/pa/terrain/desert/decals/desert_cracks_decal_01.json",  //pink
            "/pa/terrain/desert/decals/desert_sand_decal_02.json", // slightly smaller mottled flesh
            "/pa/terrain/desert/decals/desert_sand_decal_01.json", // solid flesh
            "/pa/terrain/sand/decals/sand_decal_shore_01.json", // medium sand
            "/pa/terrain/sand/decals/sand_decal_01.json", // bright sand
            "/pa/terrain/lava/decals/lava_decal_03.json", // bright orange splotch with faint aura
            "/pa/terrain/ice/decals/ice_decal_01.json", // bright white
          ]
          var grey10 = [
            "/pa/terrain/lava/decals/lava_decal_02.json", // large black spot
            "/pa/terrain/mountain/decals/mountain_decal_03.json", // dark grey/black
            "/pa/terrain/mountain/decals/mountain_decal_01.json", // dark grey mottled
            "/pa/terrain/lava/decals/lava_decal_05.json", // dark grey
            "/pa/terrain/metal/decals/metal_decal_02.json", // square dark grey with hole
            "/pa/terrain/metal/decals/metal_decal_01.json", // square grey base texture
            "/pa/terrain/moon/decals/moon_decal_02.json", // flat darker grey
            "/pa/terrain/moon/decals/moon_decal_01.json", // flat medium grey
            "/pa/terrain/moon/decals/moon_decal_04.json", // single light grey crater
            "/pa/terrain/ice/decals/ice_decal_01.json", // bright white
          ]
          var decals = blueGreenPink20

          spec.layers.shift()
          spec.layers[0].note = "0 - edit me"
          for (var i = 1;i <= decals.length;i++) {
            spec.layers[i] = {
              "note": i.toString(),
              "inherit_noise": true
            }
          }
          spec.decals = decals.map(function(d, i) {
            return {
              "layer": i,
              "bias": 100,
              "noise_range": [
                i/decals.length,
                (i+1)/decals.length
              ],
              "pole_orient": true, 
              "pos_range": [ 0, 0 ],
              "elevation_range": [ -1, 1 ],
              "scale": [ 30, 30, 1 ],
              "scale_variation": 0,
              "count": 1,
              "material_spec": decals[i]
            }
          })
          return spec
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-jsonlint');

  grunt.registerMultiTask('proc', 'Process unit files into the mod', function() {
    if (this.data.targets) {
      var specs = spec.copyPairs(grunt, this.data.targets, media)
      spec.copyUnitFiles(grunt, specs, this.data.process)
    } else {
      var specs = this.filesSrc.map(function(s) {return grunt.file.readJSON(media + s)})
      var out = this.data.process.apply(this, specs)
      grunt.file.write(this.data.dest, JSON.stringify(out, null, 2))
    }
  })

  grunt.registerTask('client', ['proc', 'jsonlint']);
  grunt.registerTask('server', ['copy:mod', 'copy:modinfo']);

  // Default task(s).
  grunt.registerTask('default', ['client']);
};

