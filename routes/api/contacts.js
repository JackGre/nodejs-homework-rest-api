const express = require('express')
// const createError = require('http-errors')
const { NotFound } = require('http-errors')
const Joi = require('joi')

const contactsShema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
})
const contactsOperation = require('../../model')

const router = express.Router()

router.get('/', async (req, res, next) => {
  try {
    const contacts = await contactsOperation.listContacts()
    res.json({
      status: 'success',
      code: 200,
      data: {
        result: contacts
      }
    })
  } catch (error) {
    next(error)
  }
  const contacts = await contactsOperation.listContacts()
  res.json(contacts)
})

router.get('/:contactId', async (req, res, next) => {
  try {
    const { contactId } = req.params
    const result = await contactsOperation.getContactById(contactId)
    if (!result) {
      throw new NotFound(`Contacts with id=${contactId} not found`)
    }
    res.json({
      status: 'success',
      code: 200,
      data: {
        result
      }
    })
  } catch (error) {
    next(error)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const { error } = contactsShema.validate(req.body)
    if (error) {
      error.status = 400
      throw error
    }
    const result = await contactsOperation.addContact(req.body)
    res.status(201).json({
      status: 'success',
      code: 201,
      data: {
        result
      }
    })
  } catch (error) {
    next(error)
  }
})

router.put('/:contactId', async (req, res, next) => {
  try {
    const { error } = contactsShema.validate(req.body)
    if (error) {
      error.status = 400
      throw error
    }
    const { contactId } = req.params
    const result = await contactsOperation.updateContact(contactId, req.body)
    if (!result) {
      throw new NotFound(`Contacts with id=${contactId} not found`)
    }
    res.json({
      status: 'success',
      code: 200,
      data: {
        result
      }
    })
  } catch (error) {
    next(error)
  }
})

router.delete('/:contactId', async (req, res, next) => {
  try {
    const { id } = req.params
    const result = await contactsOperation.removeContact(id)
    if (!result) {
      throw new NotFound(`Contacts with id=${id} not found`)
    }
    res.json({
      status: 'success',
      code: 200,
      message: 'contacts delete',
      data: {
        result
      }
    })
  } catch (error) {
    next(error)
  }
})

module.exports = router
