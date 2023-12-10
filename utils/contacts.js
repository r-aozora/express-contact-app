const fs = require('fs')

// Membuat folder data jika belum ada
const dirPath = './data'

if(!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath)
}

// Membuat file contacts.json jika belum ada
const dataPath = './data/contacts.json'

if(!fs.existsSync(dataPath)) {
    fs.writeFileSync(dataPath, '[]', 'utf-8')
}

// Index
const loadContact = () => {
    const file = fs.readFileSync('data/contacts.json', 'utf-8')
    const contacts = JSON.parse(file)

    return contacts
}

// Unique (cek duplikat)
const uniqueCheck = (nama) => {
    const contacts = loadContact()
    
    const result = contacts.some((contact) => contact.nama == nama)

    return result
}

// Save
const saveContact = (contacts) => {
    fs.writeFileSync('data/contacts.json', JSON.stringify(contacts))
}

// Create
const storeContact = (contact) => {
    const contacts = loadContact()

    contacts.push(contact)

    saveContact(contacts)
}

// Show
const showContact = (nama) => {
    const contacts = loadContact()

    const contact = contacts.find((contact) => contact.nama.toLowerCase() === nama.toLowerCase())

    return contact
}

// Update
const updateContact = (contactBaru) => {
    const contacts = loadContact()

    const newContacts = contacts.filter((contact) => contact.nama.toLowerCase() !== contactBaru.id.toLowerCase())

    delete contactBaru.id

    newContacts.push(contactBaru)

    saveContact(newContacts)
}

// Delete
const deleteContact = (nama) => {
    const contacts = loadContact()

    const newContacts = contacts.filter((contact) => contact.nama.toLowerCase() !== nama.toLowerCase())

    saveContact(newContacts)
}

module.exports = { 
    loadContact, 
    uniqueCheck, 
    storeContact, 
    showContact, 
    updateContact,
    deleteContact 
}