
const names = `Louanne Havens  
Mallory Boor  
Clayton Treece  
Maximo Blagg  
Noel Carlile  
Chris Tardy  
China Langer  
Claretta Guy  
Carla Stefani  
Georgianne Shropshire  
Alane Mungia  
Carisa Hazel  
Jasmin Melone  
Yahaira Archibald  
Gemma Buller  
Sindy Nuckles  
Eugene Cauble  
Brittny Stroope  
Eboni Driver  
Alexandra Mero`

const lines = names.split('\n')
const firstLast = lines.map(l => l.trim().split(' '))

console.log('firstLast', firstLast)

function generatePassword () {
    return 'yolo'
}

function lower (str) {
    return str.toLowerCase()
}

const users = firstLast.map(item => ({
    firstname: item[0],
    lastname: item[1],
    email: lower(`${item[0]}.${item[1]}@example.com`),
    password: generatePassword(),
    is_admin: false
}))

console.log('users', users)

const fs = require('fs')

fs.writeFileSync('./users.json', JSON.stringify(users, null, 2))