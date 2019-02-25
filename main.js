//raytracer works as follows:
//camera shoots rays into scene -> hit smth, bounce, if n bounces == limit -> ray to light, check if ok.

class vec3{
  constructor(x,y,z){
    this.x = x;
    this.y = y;
    this.z = z;
  }

  add(a){
    if( a instanceof vec3) return this.addv(a)
    let x,y,z;
    x = this.x + x;
    y = this.y + y;
    z = this.z + z;
    return new vec3(x,y,z)
  }

  addv(v){
    let x,y,z;
    x = this.x + v.x;
    y = this.y + v.y;
    z = this.z + v.z;
    return new vec3(x,y,z)
  }

  scl(a){
    if( a instanceof vec3) return this.dot(a)
    let x,y,z;
    x = this.x * a;
    y = this.y * a;
    z = this.z * a;
    return new vec3(x,y,z)
  }

  dot(v){
    let x,y,z;
    x = this.x * v.x;
    y = this.y * v.y;
    z = this.z * v.z;
    return new vec3(x,y,z)
  }

  cross(v){
    let x,y,z;
    x = (this.y * v.z) - (this.z * v.y);
    y = (this.z * v.x) - (this.x * v.z);
    z = (this.x * v.y) - (this.y * v.x);
    return new vec3(x,y,z)
  }

}

class mat3{

  constructor(e1,e2,e3){
    this.e1 = e1;
    this.e2 = e2;
    this.e3 = e3;
  }

  mult(c){
    if( typeof(c) == 'number' ) return this._mult_scl(c)
    if( c instanceof mat3 ) return this._mult_mat(c)
    if( c instanceof vec3 ) return this._mult_vec(c)
  }

  _mult_vec(v){
    let vec;
    vec = e1.scl(v.x).add(e2.scl(v.y)).add(e3.scl(v.z));
    return vec;
  }

  _mult_mat(m){
    let c11,c12,c13,c21,c22,c23,c31,c32,c33;
    c11 = (this.e1.x * m.ei.x) + this.e2.x * m.e1.y + this.e3.x * m.e1.z;
    c12 = this.e1.x * m.e2.x + this.e2.x * m.e2.y + this.e3.x * m.e2.z;
    c13 = this.e1.x * m.e3.x + this.e2.x * m.e3.y + this.e3.x * m.e3.z;
    c21 = this.e3.x * m.e1.x + this.e2.y * m.e1.y + this.e3.y * m.e1.z;
    c22 = this.e1.y * m.e2.x + this.e2.y * m.e2.y + this.e3.y * m.e2.z;
    c23 = this.e1.y * m.e3.x + this.e2.y * m.e3.y + this.e3.y * m.e3.z;
    c31 = this.e1.z * m.e1.x + this.e2.z * m.e1.y + this.e3.z * m.e1.z;
    c32 = this.e1.z * m.e2.x + this.e2.z * m.e2.y + this.e3.z * m.e2.z;
    c33 = this.e1.z * m.e3.x + this.e2.z * m.e3.y + this.e3.z * m.e3.z;

    let e1,e2,e3;
    e1 = new vec3(c11,c21,c31)
    e2 = new vec3(c12,c22,c32)
    e3 = new vec3(c13,c23,c33)

    return new mat3(e1,e2,e3)
  }

  _mult_scl(a){
    let e1, e2, e3;
    e1 = this.e1.scl(a);
    e2 = this.e2.scl(a);
    e3 = this.e3.scl(a);
    return new mat3(e1,e2,e3)
  }

}

class rbObject{
  constructor(){}
}

class rbLight{
  constructor(options){
    // super()
    this.radius = options.radius;
    this.position = options.position;
    this.color = options.color;
  }
}

class rbSphere extends rbObject{
  constructor(options){
    super()
    this.radius = options.radius;
    this.position = options.position;
    this.color = options.color;
  }
}

class RayBan_Scene{

  constructor(){
    this.objects = []
    this.lights = []
  }

  addObject(rbObject){
    this.objects.push(rbObject);
  }

  addLight(rbLight){
    this.lights.push(rbLight)
  }

}

class RayBan{

  constructor(options){
    console.log(options)
    this.bounces = options.bounces | 1;
    this.scene = this._loadScene(options.fname);
  }

  _loadScene(fname){
    //this should, one day, load a scene from a file.

    let scene = new RayBan_Scene();
    scene.addObject(new rbSphere({color:'0xfff',position:[0,0,0], radius: 10}))
    scene.addLight (new rbLight( {color:'0xfff',position:[0,0,10], radius: 5}))
    return scene;
  }

  setCameraPos(vecpos){
    this.camPos = vecpos;
  }

  setCameraResolution(xr, yr, pixelsize = 0.1){
    this.camRes = [xr,yr];
    this.camSensorSize = [xr*pixelsize,yr*pixelsize]
  }

  setCameraNormal(vecNorm){
    this.camNorm = vecNorm;
  }

}

_savePPM(fname, data){
  
}

_rcStep = (rays,rayban) =>{

}

let runRaycast = (rb) =>{

}

//integrated testbench:

let rb = new RayBan({bounces: 1, fname: 'none'})

runRaycast(rb, 'out.ppm')
