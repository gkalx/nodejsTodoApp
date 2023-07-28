let express = require('express')
const mongodb = require('mongodb')
const { MongoClient } = require('mongodb')
let sanitizeHTML = require('sanitize-html')

let app = express()
let db

app.use(express.static('public'))

let port = process.env.PORT
if (port == null || port ==""){
    port = 3000
}

const username = encodeURIComponent("todoAppUser");
const password = encodeURIComponent("V0ul0s@");

//Connection String for PC Saloni
let conncectionString = `mongodb+srv://todoAppUser:${password}@cluster0.atqzmyg.mongodb.net/?retryWrites=true&w=majority`

//Connection String for PC Sofita
//let conncectionString = `mongodb://todoAppUser:${password}@ac-l5ivvup-shard-00-00.atqzmyg.mongodb.net:27017,ac-l5ivvup-shard-00-01.atqzmyg.mongodb.net:27017,ac-l5ivvup-shard-00-02.atqzmyg.mongodb.net:27017/?ssl=true&replicaSet=atlas-dsa1nc-shard-0&authSource=admin&retryWrites=true&w=majority`

async function main(){
    const uri = `mongodb+srv://todoAppUser:${password}@cluster0.atqzmyg.mongodb.net/?retryWrites=true&w=majority`

    const clientNew = new MongoClient(uri)

    try{
        await clientNew.connect()
        console.log('connected')
        db = clientNew.db("TodoApp")
        app.listen(port)
    } catch(e){
        console.error(e)
    }finally{
        //await clientNew.close()
    }
    

}

main().catch(console.error)

app.use(express.json())
app.use(express.urlencoded({ extended: false }))


/* ----Security----------- */
function passwordProtected(req, res, next){
    console.log(req.headers.authorization)
    res.set('WWW-Authenticate', 'Basic ralm="Simple Todo App"')
    if(req.headers.authorization == 'Basic QWxleDpKdSR0NFQzJHQhbmc='){
        next()
    }else{
        res.status(401).send("Authentication required before we go ahead.")
    }
}


app.use(passwordProtected)


app.get('/', function (req, res) {
    db.collection('items').find().toArray().then((items) => {
        res.send(`
    <!DOCTYPE html>
        <html>
        <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Simple To-Do App</title>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
        </head>
        <body>
        <div class="container">
            <h1 class="display-4 text-center py-1">To-Do App</h1>
            
            <div class="jumbotron p-3 shadow-sm">
                <form id="create-form" action="/create-item" method="POST">
                    <div class="d-flex align-items-center">
                    <input id="create-field" name="item" autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;">
                    <button class="btn btn-primary" >Add New Item</button>
                    </div>
                </form>
            </div>
            
            <ul id="item-list" class="list-group pb-5">
            </ul>
            
        </div>
        <script>
        let items = ${JSON.stringify(items)}
        </script>
        <script src="https://unpkg.com/axios@1.1.2/dist/axios.min.js"></script>
        <script src="/browser.js"></script>
        </body>
        </html>
    `)
    })

})

app.post('/create-item', function (req, res) {
    let safeText = sanitizeHTML(req.body.text, {allowedTags: [], allowedAttributes: {}})
    db.collection('items').insertOne({ text: safeText }).then((info) => {
        console.log(info)
        returnedObject = { _id: info.insertedId, text: req.body.text }
        res.json(returnedObject)
    })
})


app.post("/update-item", function (req, res) {
    let safeText = sanitizeHTML(req.body.text, {allowedTags: [], allowedAttributes: {}})
    db.collection('items').findOneAndUpdate({ _id: new mongodb.ObjectId(req.body.id) }, { $set: { text: safeText } }).then( function () {
        res.send("Success")
    })
})


app.post("/delete-item", function (req, res) {
    db.collection('items').deleteOne({ _id: new mongodb.ObjectId(req.body.id) }).then( function () {
        res.send("Success")
    })
})

