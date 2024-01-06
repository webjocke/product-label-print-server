const nodeHtmlToImage = require('node-html-to-image')
const fs = require('fs')
const { exec } = require("child_process")
const express = require('express')
var cors = require('cors')
const app = express()
const port = 3120
const ejs = require('ejs')
var crypto = require('crypto')


app.use(cors())
app.use(express.json())
app.use(express.static('public'))
app.get('/', (req, res) => {
    console.log("Hello request")
    res.send("Hello from the printer")
})
app.post('/print', async (req, res) => {

    /** req.body has:
     * 
     * title
     * variant
     * id
     * amount
     * amount_of_labels
     * 
     */

    var shasum = crypto.createHash('sha1')
    shasum.update(JSON.stringify(req.body))
    const filename = shasum.digest('hex')
    const filenameShort = filename.slice(0, 10)

    console.log("["+filename+"] "+"New request: ", JSON.stringify(req.body))
    

    if (!fs.existsSync(`./images/${filename}.png`)) {
        console.log("["+filenameShort+"] "+"No cached image, need to generate")
        await nodeHtmlToImage({
            output: `./images/${filename}.png`,
            html: ejs.render(fs.readFileSync("label.html", "utf8"), {data: {...req.body, fontLink:`http://localhost:${port}/Geist-Regular.woff2`}})
        })
    
        while (!fs.existsSync(`./images/${filename}.png`)) {
            await new Promise(r => setTimeout(r, 50));
        }
    } else {
        console.log("["+filenameShort+"] "+"Found cached file")
    }
    console.log("["+filenameShort+"] "+"Printing")

    command = `"C:\\Program Files\\IrfanView\\i_view64" "C:\\Users\\Print Server\\Documents\\GitHub\\product-label-print-server\\images\\${filename}.png" /print="Brother QL-570"`

    for(let i = 0; i < req.body.antal_labels; i++) {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`)
                return
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`)
                return
            }
        })
    }s
    
    res.sendStatus(200)
})
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
