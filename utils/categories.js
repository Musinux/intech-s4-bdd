const categories = [{
    id: 1,
    name: 'Catégorie 1'
}, {
    id: 2,
    name: 'Catégorie 2'
}, {
    id: 3,
    name: 'Catégorie 3'
}]


const fs = require('fs')

fs.writeFileSync('./categories.json', JSON.stringify(categories, null, 2))