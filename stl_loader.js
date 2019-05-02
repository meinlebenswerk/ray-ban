const fs = require('fs');
const {vec3, mat3} = require('./linear');

let readFloatVector = (buffer, offset) => {
  let x,y,z
  x = buffer.readFloatLE(offset + 0)
  y = buffer.readFloatLE(offset + 4)
  z = buffer.readFloatLE(offset + 8)
  return new vec3(x,y,z)
}

let importSTL = (filename) => {
  file = fs.readFileSync(filename)
  fstring = file.toString()
  isASCII = fstring.startsWith('solid')
  if(isASCII){
    console.log('ASCII loading not implemented, yet :)')
    return
  }

  delete fstring, isASCII
  header = file.slice(0,80)
  console.log(header.toString())
  data = file.slice(80)
  n_triangles = data.readUInt32LE(0)

  console.log('found', n_triangles, 'triangles.')
  offset = 4
  mesh = {
    triangles : []
  }
  for(let i=0; i< n_triangles; i++){
    let tri = {
      nrm:  readFloatVector(data, offset + 0),
      vertices: [ readFloatVector(data, offset + 12), readFloatVector(data, offset + 24), readFloatVector(data, offset + 36)],
      // attrib_byte_cnt: data.readUInt16LE(offset + 48)
    }
    offset += 50
    mesh.triangles.push(tri)
  }
  console.log(mesh)
  return mesh
}



//built-in test:
importSTL('test.stl')
