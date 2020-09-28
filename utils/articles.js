const description = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis sit amet diam urna. Mauris id diam dapibus, pharetra urna at, cursus eros. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Mauris aliquet leo purus, ut rhoncus leo tempor nec. Aliquam consectetur consectetur urna, sed posuere sapien semper non. Maecenas diam enim, cursus id elementum sit amet, pulvinar vitae metus. Aenean nisi massa, ultrices at varius non, vehicula consectetur tortor. Donec nulla risus, dapibus quis tristique eget, pharetra tristique libero. Aliquam elit magna, convallis ut leo eu, ultricies suscipit purus. Maecenas vitae eleifend quam.`

const titles = [
    'Clé usb',
    'Ventilateur',
    'Chaussettes',
    'Aspirateur',
    'Casserole',
    'Carte graphique',
    'Cartable',
    'Stylo Plume'
]

const articles = titles.map(title => ({
    title,
    description,
    stock: Math.ceil(Math.random() * 100),
    price: Math.ceil(Math.random() * 100),
    category_id: 1 + Math.floor(Math.random() * 3)
}))

const fs = require('fs')

fs.writeFileSync('./articles.json', JSON.stringify(articles, null, 2))