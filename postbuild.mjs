
import fs from 'fs'
import path from 'path'
import astroConfig from './astro.config.mjs'


const PUBLIC_DIR = astroConfig.dist || "dist"
const argvs = process.argv.slice(2);

if ((argvs[0] === '--p' || argvs[0] === '-path') && argvs[1]) {
    let files = [];
    const extensions = ['.html', '.css', '.js', '.json']
    const PRODUCTION_URL = argvs[1]


    const replaceUrlsInFiles = function(dirPath, arrayOfFiles) {
        files = fs.readdirSync(dirPath)

        files.forEach(function(file) {
            const current = fs.statSync(dirPath + "/" + file)
            if (current.isDirectory()) {
                replaceUrlsInFiles(dirPath + "/" + file, arrayOfFiles)
            } else {
                const filePath = path.join(
                    path.dirname(
                        (
                            import.meta.url).replace(/file\:/, '')), dirPath, "/", file)
                if (extensions.includes(path.extname(filePath))) {
                    //let content = fs.readFileSync(filePath)
                    let content = fs.readFileSync(dirPath + "/" + file)

                    content = String(content).replace(/src="\//g, `src="${PRODUCTION_URL}`)
                    content = String(content).replace(/href="\//g, `href="${PRODUCTION_URL}`)
                    content = String(content).replace(/url\("\//g, `url("${PRODUCTION_URL}`)

                    content = String(content).replace(/src='\//g, `src='${PRODUCTION_URL}`)
                    content = String(content).replace(/href='\//g, `href='${PRODUCTION_URL}`)
                    content = String(content).replace(/url\('\//g, `url('${PRODUCTION_URL}`)
                    fs.writeFileSync(dirPath + "/" + file, content)
                }
            }
        })
    }

 
    //replaceUrlsInFiles(PUBLIC_DIR, files)
    if (PRODUCTION_URL && process.env.NODE_ENV === 'production') {
        replaceUrlsInFiles(PUBLIC_DIR, files)
    } else {
        console.log('skip postbuild')
        process.exit(0)
    }
} else {
    console.error('please provide a path argument "-path", "--p"')
    process.exit(1)
}