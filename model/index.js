
const fs = require('fs/promises')
const path = require('path')
const { v4 } = require('uuid')
const contactsPath = path.join(__dirname, './contacts.json')

const listContacts = async () => {
  const contacts = await fs.readFile(contactsPath)
  const parsedContacts = JSON.parse(contacts)
  return parsedContacts
}

const getContactById = async (contactId) => {
  const contacts = await listContacts()
  const result = contacts.find(item => item.id === contactId)
  if (!result) {
    return null
  }
  return result
}

const addContact = async (body) => {
  const contacts = await listContacts()
  const newContacts = { id: v4(), body }
  contacts.push(newContacts)
  await fs.writeFile(contactsPath, JSON.stringify(contacts))
  return newContacts
}

const updateContact = async (contactId, body) => {
  const contacts = await listContacts()
  const idx = contacts.findIndex(item => item.id === contactId)
  if (idx === -1) {
    return null
  }
  contacts[idx] = { ...body, contactId }
  await fs.writeFile(contactsPath, JSON.stringify(contacts))
  return contacts[idx]
}

const removeContact = async (contactId) => {
  const contacts = await listContacts()

  const idx = contacts.findIndex(item => item.id === contactId)
  if (idx === -1) {
    return null
  }

  const newProducts = contacts.filter((_, index) => index !== idx)
  await fs.writeFile(contactsPath, JSON.stringify(newProducts))
  return contacts[idx]
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
