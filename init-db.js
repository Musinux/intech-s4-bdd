const User = require('./models/user.model')
const Cart = require('./models/cart.model')
const Article = require('./models/article.model')
const ArticleCart = require('./models/article-cart.model')
const Category = require('./models/category.model')

const PostgresStore = require('./PostgresStore')
const fakeUsers = require('./utils/users.json')
const fakeArticles = require('./utils/articles.json')
const fakeCategories = require('./utils/categories.json')


async function dropEverything () {
    const result = await PostgresStore.client.query(
        `select 'drop table if exists "' || tablename || '" cascade;' AS query
        from pg_tables where schemaname = 'public';`
    )

    for (const row of result.rows) {
        console.log(row.query)
        await PostgresStore.client.query(row.query)
    }
}

async function createEverything () {
    const models = [
        User,
        Category,
        Article,
        Cart,
        ArticleCart
    ]

    for (const model of models) {
        const sql = model.toSQLTable()
        await PostgresStore.client.query(sql)
    }
}

async function createFakeData () {
    for (const user of fakeUsers) {
        await User.create(user)
    }

    for (const category of fakeCategories) {
        await Category.create(category)
    }

    for (const article of fakeArticles) {
        await Article.create(article)
    }
}

async function run () {
    await PostgresStore.init()

    await dropEverything()
    await createEverything()

    await createFakeData()
 
    console.log('terminé')
}

run()
