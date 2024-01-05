const nodeHtmlToImage = require('node-html-to-image')
const fs = require('fs')
const { exec } = require("child_process")
const express = require('express')
var cors = require('cors')
const app = express()
const port = 3120
const ejs = require('ejs')

app.use(cors())
app.use(express.json())
app.post('/printlabel', (req, res) => {

    console.log(req.body)
    res.sendStatus(200)

    final_html = ejs.render(fs.readFileSync("label.html", "utf8"), {data: req.body})

    nodeHtmlToImage({
        output: './image.png',
        html: final_html
    }).then(() => {
        console.log('The image was created successfully!')
        command = 'i_view64 image.png /print="Brother QL-570"'
        console.log("Command:", command)

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
                //console.log(`stdout: ${stdout}`)
            })
        }
    })
})
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
