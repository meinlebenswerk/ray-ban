class vec3 {
  constructor(x=0,y=0,z=0){
    this.x = x
    this.y = y
    this.z = z
  }

  //base-operands
  add(v){
    let x,y,z
    x = this.x + v.x
    y = this.y + v.y
    z = this.z + v.z
    return new vec3(x,y,z)
  }

  sub(v){
    let x,y,z
    x = this.x - v.x
    y = this.y - v.y
    z = this.z - v.z
    return new vec3(x,y,z)
  }

  mul(v){
    let x,y,z
    x = this.x * v.x
    y = this.y * v.y
    z = this.z * v.z
    return new vec3(x,y,z)
  }

  div(v){
    let x,y,z
    x = this.x / v.x
    y = this.y / v.y
    z = this.z / v.z
    return new vec3(x,y,z)
  }

  //vector specific operands
  scl(a){
    let x,y,z
    x = this.x * a
    y = this.y * a
    z = this.z * a
    return new vec3(x,y,z)
  }

  nrm(){
    let len = Math.sqrt(this.x*this.x + this.y*this.y + this.z*this.z)
    return new vec3(this.x/len,this.y/len,this.z/len)
  }

  dot(v){
    let x,y,z;
    x = this.x * v.x
    y = this.y * v.y
    z = this.z * v.z
    return x+y+z
  }

  cross(v){
    let x,y,z;
    x = (this.y * v.z) - (this.z * v.y);
    y = (this.z * v.x) - (this.x * v.z);
    z = (this.x * v.y) - (this.y * v.x);
    return new vec3(x,y,z)
  }

  len2(){
    return (this.x*this.x + this.y*this.y + this.z*this.z)
  }

  length(){
    return Math.sqrt(this.len2())
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
    vec = this.e1.scl(v.x).add(this.e2.scl(v.y)).add(this.e3.scl(v.z));
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


module.exports = {
  vec3: vec3,
  mat3: mat3
}
