const {vec3, mat3} = require('./linear');

class rb_ray {
  constructor(origin,direction){
    this.origin = origin
    this.direction = direction
  }

}

class rb_sphere {
  constructor(center, radius){
    this.center = center
    this.radius = radius
  }

  normal(point){
    return point.sub(this.center).scl(1/this.radius)
  }

  intersect(ray){
    let b,c,det
    b = 2*ray.direction.dot(ray.origin.sub(this.center))
    c = this.center.len2() + ray.origin.len2() - 2*(this.center.dot(ray.origin)) - (this.radius*this.radius)

    det = (b*b)-(4*c)

    //ignore just touching rays :)
    if( det < 0.004 ){ return false; }

    let t,t0,t1
    det = Math.sqrt(det)
    t0 = (-b + det)/2
    t1 = (-b - det)/2

    t = (t0 < t1)? t0 : t1

    return t;
  }

}

class rb_material {
  constructor(options){
    this.roughness    = 0
    this.transparency = 0
    this.ior          = 0
    this.translucency = 0
    this.emission     = 0

    this.color = new vec3()

  }
}

class rb_camera {

  constructor(options){
    this.resolution = {x: options.resx | 400, y: options.resy | 400}
    this.size = {x: options.ssx | 1, y: options.ssy | 1}
  }

  generateCameraRays(){
    let rays = []

    let dx, dy;
    for( let x=0; x<this.resolution.x; x++ ){
      for( let y=0; y<this.resolution.y; y++ ){
        dx = (x/this.resolution.x) - 0.5
        dy = (y/this.resolution.y) - 0.5

        dx *= this.size.x
        dy *= this.size.y

        rays.push( new rb_ray(new vec3(dx,dy,0), new vec3(0,0,1)) )
      }
    }

    return rays
  }

}

class rb_plane {

  constructor(p0,p1,p2,p3){
    this.p0 = p0
    this.p1 = p1
    this.p2 = p2
    this.p3 = p3

    let e1,e2
    this.e1 = p1.sub(p0).nrm()
    this.e2 = p2.sub(p0).nrm()

    this.norm = this.e1.cross(this.e2)

    this.center = p0
  }

  normal(point){
    return this.norm
  }

  containsPoint(point){
    //x-y check:
    let pmat = new mat3(this.e1,this.e2,new vec3())
    let tmp = pmat._mult_vec(point.sub(this.p2))

    // console.log(tmp.x,tmp.y,tmp.z)

    if(tmp.x <= this.p2.sub(this.p0).length()){
      return ( tmp.y <= this.p1.sub(this.p0).length() )
    }

    return false
  }

  intersect(ray){
    let den = this.norm.dot(ray.direction);
    if (Math.abs(den) > 0.0001){
      //means the ray will hit the plane eventually.
      let t, dif
      dif = this.center.sub(ray.origin)
      t = this.norm.dot(dif)/den

      //check if this intersection point is inside the plane:
      let point = ray.origin.add(ray.direction.scl(t))
      if(this.containsPoint(point)){
        return t
      }

    }
    return false;
  }

}


module.exports = {
  rb_ray: rb_ray,
  rb_sphere: rb_sphere,
  rb_material: rb_material,
  rb_camera: rb_camera,
  rb_plane: rb_plane
}
