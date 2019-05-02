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
    this.resolution = {x: options.resx || 400, y: options.resy || 400}
    this.size = {x: options.ssx || 1, y: options.ssy || 1}
    this.normal = new vec3(0,0,1)

    this.fov = ( (options.fov || 0)/180)*Math.PI

    this.rmat = new mat3(new vec3(1,0,0),new vec3(0,1,0),new vec3(0,0,1))
  }

  generateCameraRays(){
    let rays = []

    //calculate 'virtual origin' point from the sensor size and the fov.
    let vpz = (this.fov !== 0)? (this.size.x/2)/Math.tan(this.fov) : 10000000000000
    let virtual_origin = new vec3(0,0,-vpz);

    let dx, dy;
    console.log(`generating rays: ${this.resolution.x}x${this.resolution.y} [${this.resolution.x*this.resolution.y} total rays]. \nFOV is ${(this.fov*180)/Math.PI} deg [vpz ${vpz}]`)
    for( let y=0; y<this.resolution.y; y++ ){
      for( let x=0; x<this.resolution.x; x++ ){

        dx = (x/this.resolution.x) - 0.5
        dy = (y/this.resolution.y) - 0.5
        dx *= this.size.x
        dy *= this.size.y

        let ray_origin = new vec3(dx,dy,0)
        let ray_normal = ray_origin.sub(virtual_origin).nrm()

        rays.push( new rb_ray(ray_origin, ray_normal) )
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

    let t1, t2
    t1 = p0.sub(p1)
    t2 = p2.sub(p1)

    this.sl1 = t1.length()
    this.sl2 = t2.length()

    this.e1 = t1.nrm()
    this.e2 = t2.nrm()

    this.norm = this.e1.cross(this.e2)

    this.center = p0.add(p1).add(p2).add(p3).scl(1/4)

    this.tmat = new mat3(this.e1,this.e2,this.norm).inverse()
  }

  normal(point){
    return this.norm
  }

  __aabb(point){
    let lb, ub
    let inside

    //x-axis
    lb = p0.x
    ub = p3.x
    if(point.x < lb || point.x > ub) return false

    //y-axis
    lb = p0.y
    ub = p1.y
    if(point.y < lb || point.y > ub) return false

    //z-axis
    lb = p0.x
    ub = p3.x
    if(point.z < lb || point.z > ub) return false
  }

  containsPoint(point){
    let tmp, l
    tmp = point.sub(this.p1)
    tmp = this.tmat._mult_vec(tmp)

    if(tmp.x >= 0 && tmp.x <= this.sl1){
      return (tmp.y >= 0 && tmp.y <= this.sl2)
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
