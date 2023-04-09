const axios = require('axios')
const fs = require('fs')
const path = require('path')
const { SiteMapGenerator } = require('@igortrindade/lazyfy')

const getArticles = () => {
  const query = `
    { 
      articles {
        id
        title
        slug
      }
    }
  `
  return axios.post('https://api.calculoeprevidencia.com/api/graphql/query', { query })
    .then(({ data }) => data.data.articles)
}

module.exports = ( async () => {
  
  const articles = await getArticles()

  const sitemapGenerator = new SiteMapGenerator('https://calculoeprevidencia.com')

  sitemapGenerator.setXmlStyleSheetPath('/sitemap/sitemap_stylesheet.xsl')

  sitemapGenerator.addItem({ url: '/' })
  sitemapGenerator.addItem({ url: 'calcule-sua-aposentadoria' })
  sitemapGenerator.addItem({ url: 'artigos' })
  
  for(const article of articles) {
    sitemapGenerator.addItem({ url: `artigos/${article.slug}` })
  }

  const sitemap = sitemapGenerator.generate()

  const sitemapPath = path.join(__dirname, '../public/sitemap/sitemap.xml')

  fs.writeFileSync(sitemapPath, sitemap)

})()