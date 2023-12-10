const express = require('express')
const expressLayoouts = require('express-ejs-layouts')
const {
    loadContact,
    uniqueCheck,
    storeContact,
    showContact,
    updateContact,
    deleteContact
} = require('./utils/contacts')
const { 
    query, 
    validationResult, 
    check 
} = require('express-validator');
const session = require('express-session')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')

const app = express()
const port = 3000

app.set('view engine', 'ejs')

app.use(expressLayoouts)

app.use(express.static('public'))

// Parse URL-encoded
app.use(express.urlencoded({ extended: true }))

app.use(cookieParser('secret'))

app.use(session({
    cookie: { maxAge: 6000 },
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))

app.use(flash())

app.get('/', (req, res) => {
    res.render('home', {
        layout: 'layouts/main',
        title: 'Home',
    })
})

// Contact
// Index
app.get('/contact', (req, res) => {
    const contacts = loadContact()

    res.render('contact/index', {
        layout: 'layouts/main',
        title: 'Kontak',
        contacts,
        msg: req.flash('msg'),
    })
})

// Create
app.get('/contact/create', (req, res) => {
    res.render('contact/create', {
        layout: 'layouts/main',
        title: 'Tambah Kontak',
    })
})

// Store
app.post('/contact', [
    query('nama').custom((value, { req }) => {
        const duplikat = uniqueCheck(req.body.nama)
        if (duplikat) {
            throw new Error('Nama sudah terdaftar')
        }
        return true
    }),
    check('email', 'Email tidak valid').isEmail(),
    check('telepon', 'Nomor telepon tidak valid').isMobilePhone('id-ID'),
], (req, res) => {
    const result = validationResult(req)

    if (result.isEmpty()) {
        storeContact(req.body)

        req.flash('msg', 'Data kontak berhasil ditambahkan')
        res.redirect('/contact')
    } else {
        res.render('contact/create', {
            layout: 'layouts/main',
            title: 'Tambah Kontak',
            errors: result.array(),
        })
    }
})

// Delete
app.get('/contact/delete/:nama', (req, res) => {
    const contact = showContact(req.params.nama)

    if (!contact) {
        res.status(404)
        res.send('<h1>404 Not Found</h1>')
    } else {
        deleteContact(req.params.nama)

        req.flash('msg', 'Data kontak berhasil dihapus')
        res.redirect('/contact')
    }
})

// Edit
app.get('/contact/edit/:nama', (req, res) => {
    const contact = showContact(req.params.nama)

    res.render('contact/edit', {
        layout: 'layouts/main',
        title: `Edit Kontak: ${req.params.nama}`,
        contact,
    })
})

// Update
app.post('/contact/update', [
    query('nama').custom((value, { req }) => {
        const duplikat = uniqueCheck(req.body.nama)
        const result = req.body.nama !== req.body.id && duplikat
        if (result) {
            throw new Error('Nama sudah terdaftar')
        }
        return true
    }),
    check('email', 'Email tidak valid').isEmail(),
    check('telepon', 'Nomor telepon tidak valid').isMobilePhone('id-ID'),
], (req, res) => {
    const result = validationResult(req)

    if (result.isEmpty()) {
        updateContact(req.body)

        req.flash('msg', 'Data kontak berhasil diedit')
        res.redirect('/contact')
    } else {
        res.render('contact/edit', {
            layout: 'layouts/main',
            title: 'Edit Kontak',
            errors: result.array(),
            contact: req.body
        })
    }
})

// Show
app.get('/contact/:nama', (req, res) => {
    const contact = showContact(req.params.nama)

    res.render('contact/detail', {
        layout: 'layouts/main',
        title: `Detail Kontak: ${req.params.nama}`,
        contact,
    })
})

// End Contact

app.use((req, res) => {
    res.status(404)
    res.send('<h1>Page Not Found</h1>')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})