// file upload with multer:
//  - https://code.tutsplus.com/tutorials/file-upload-with-multer-in-node--cms-32088
//  - https://codeforgeek.com/file-uploads-using-node-js/
//  - http://cangaceirojavascript.com.br/express-realizando-upload-multer/

const express = require('express')
const path = require('path')
const multer = require('multer')
const bodyParser = require('body-parser')
const crypto = require('crypto')
const mongoose = require('mongoose')
const Hash = require('./models/hash')

mongoose.connect('mongodb://pizza:mozzarella123@ds355357.mlab.com:55357/file-hashes', {
    useNewUrlParser: true
}, function(err) {
    if(err) {
        console.log('There was an error connecting to the database: ', err)
    } else {
        console.log('We are connected to the database')
    }
})

const app = express()

// Set store engine (memory storage)
const storage = multer.memoryStorage()

// Init upload
const upload = multer({
    storage: storage
}).single('fileToRegister')

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(express.static(path.join(__dirname, 'public')))

console.log(path.join(__dirname, 'public'))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))

app.get('/', (req, res) => {
    Hash.countDocuments({}, (err, num) => {
        if(err) {
            console.log('There was an error retrieving the hashes from database: ', err)
        } else {
            console.log('Number of hashes registered: ' + num)
        }
    })

    res.render('index', {
        digest: ''
    })
})

app.get('/notarization', (req, res) => {
    res.render('notarization', {
        digest: ''
    })
})

// sha256 file online: https://emn178.github.io/online-tools/sha256_checksum.html
// article: https://blog.ajduke.in/2016/05/28/creating-a-hash-in-node-js/
app.post('/upload', (req, res) => {
    upload(req, res, (err) => {
        if(err) {
            res.render('index', {
                msg: err
            })
        } else if(req.file) {
            // console.log('req.body.name: ', req.body.name)

            var fileData = req.file.buffer
            var hash = crypto.createHash('sha256')
            var digest = hash.update(fileData, 'utf8').digest('hex')

            console.log('sha256 hash: ', digest)

            res.render('index', {
                digest: digest
            })
        } else {
            // res.render('index', {
            //     digest: ''
            // })
            res.redirect('/')
        }
    })
})

app.post('/register', (req, res) => {
    var data = req.body
    console.log(data)

    // save hash on database
    // Hash.create({
    //     hash: digest,
    //     txLink: '',
    //     date: String(Date.now())
    // }, (err, data) => {
    //     if(err) {
    //         console.log('There was an error saving data on database: ', err)
    //     } else {
    //         console.log('Data successfully saved: ', data)
    //     }
    // })

    res.render('index', {
        digest: ''
    })
})

const port = 3020
app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})
