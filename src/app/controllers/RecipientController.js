import * as Yup from 'yup';
import Recipient from '../models/Recipient';

class RecipientController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      street: Yup.string().required(),
      number: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'validation failed' });
    }

    const { name, street, number } = req.body;
    const recipientExists = await Recipient.findOne({
      where: { name, street, number },
    });

    if (recipientExists) {
      return res.status(401).json({ error: 'recipient already exists' });
    }

    const { id, complement, state, city, zipcode } = await Recipient.create({
      name,
      street,
      number,
    });

    return res.json({
      user: {
        id,
        name,
        street,
        number,
        complement,
        state,
        city,
        zipcode,
      },
    });
  }

  async index(req, res) {
    const recipients = await Recipient.findAll({
      attributes: ['id', 'name', 'street', 'number'],
      order: ['name'],
    });

    return res.json(recipients);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      street: Yup.string(),
      number: Yup.string(),
      complement: Yup.string(),
      state: Yup.string(),
      city: Yup.string(),
      zipcode: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'validation failed' });
    }

    const recipient = await Recipient.findByPk(req.userId);

    if (!recipient) {
      return res.status(401).json({ error: 'recipient does not exists' });
    }

    const {
      name,
      street,
      number,
      complement,
      state,
      city,
      zipcode,
    } = await recipient.update(req.body);

    return res.json({ name, street, number, complement, state, city, zipcode });
  }

  async delete(req, res) {
    const recipient = await Recipient.findByPk(req.params.id);

    if (!recipient) {
      return res.status(401).json({ error: 'recipient does not exists' });
    }

    recipient.destroy();

    return res.status(200).json(recipient);
  }
}

export default new RecipientController();
