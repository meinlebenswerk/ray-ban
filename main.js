const fs = require('fs');
const {vec3, mat3} = require('./linear');
const {rb_ray, rb_sphere, rb_camera, rb_plane} = require('./rayban');

let _clamp255 = (color) => {
  color.x = (color.x > 255) ? 255 : (color.x < 0) ? 0 : color.x;
  color.y = (color.y > 255) ? 255 : (color.y < 0) ? 0 : color.y;
  color.z = (color.z > 255) ? 255 : (color.z < 0) ? 0 : color.z;
  return color
}

const H = 400
const W = 400

const white = new vec3(255,255,255)
const black = new vec3(0,0,0)
const red   = new vec3(255,0,0)

let objects = []


objects.push( new rb_plane( new vec3(-50,-50,50), new vec3(50,-50 ,50), new vec3(50,50,50), new vec3(-50,50,50)) )
//objects.push( new rb_plane( new vec3(-50,-50,50), new vec3(50,-50 ,50), new vec3(50,-50,0), new vec3(-50,-50,0)) )
//objects.push( new rb_plane( new vec3(-50,-50,50), new vec3(50,-50 ,50), new vec3(50,50,50), new vec3(-50,50,50)) )
//objects.push( new rb_plane( new vec3(-50,-50,50), new vec3(50,-50 ,50), new vec3(50,50,50), new vec3(-50,50,50)) )

// objects.push(new rb_plane(new vec3(0, 0, 0),new vec3(50, 0, 0),new vec3(50, 50, 0),new vec3(0, 50, 0)))
// objects.push(new Sphere(new vec3(W*0.5, H*0.8, 50),50))

let lights = []
lights.push(new rb_sphere(new vec3(200, 200, 50), 1));
lights.push(new rb_sphere(new vec3(-200, -200, 50), 1));

let cam = new rb_camera({ resx: H, resy: W, ssx: 500, ssy: 500})

function runRaycast(options) {
  ({fname, objects, lights, camera} = options)

  let wstream = fs.createWriteStream(`${fname}.ppm`);
  wstream.write(`P6 ${W} ${H} 255 `)
  let pix_col = new vec3(0,0,0)

  let rays = camera.generateCameraRays()

  for( let ri=0; ri<rays.length; ri++ ){

    console.log(`raycast ${(ri*100)/rays.length}%`)

    pix_col = black;
    var r = rays[ri]
    let n = 0

    for( let obj of objects ){
      for( let light of lights ){

        n++
        var t = obj.intersect(r, t)

        if (t) {
          let pi = r.origin.add(r.direction.scl(t))
          let l  = light.center.sub(pi);
          //console.log(obj)
          let n  = obj.normal(pi);

          let dt = l.nrm().dot(n.nrm())
          pix_col = pix_col.add( (red.add(white.scl(dt))) )
        }
      }
    }
    pix_col = pix_col.scl(1/n)
    pix_col = _clamp255(pix_col)
    let arr = [pix_col.x,pix_col.y,pix_col.z]
    let buf = new Uint8Array(arr)
    wstream.write(buf)
  }

  wstream.end();
}

runRaycast({fname: 'out', objects: objects, lights: lights, camera: cam })
