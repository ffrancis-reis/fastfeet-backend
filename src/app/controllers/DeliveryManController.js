import * as Yup from 'yup';
import DeliveryMan from '../models/DeliveryMan';

class DeliveryManController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      avatar_id: Yup.string(),
      email: Yup.string()
        .email()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'validation failed' });
    }

    const { name, avatar_id, email } = req.body;
    const deliveryManExists = await DeliveryMan.findOne({
      where: { email },
    });

    if (deliveryManExists) {
      return res.status(401).json({ error: 'delivery man already exists' });
    }

    const deliveryMan = await DeliveryMan.create({
      name,
      avatar_id,
      email,
    });

    return res.json(deliveryMan);
  }

  async index(req, res) {
    const deliveryMen = await DeliveryMan.findAll({
      attributes: ['id', 'name', 'email'],
      order: ['name'],
    });

    return res.json(deliveryMen);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      avatar_id: Yup.string(),
      email: Yup.string().email(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'validation failed' });
    }

    const deliveryMan = await DeliveryMan.findByPk(req.params.id);

    if (!deliveryMan) {
      return res.status(401).json({ error: 'delivery man does not exists' });
    }

    const { email } = req.body;

    const deliveryManByEmail = await DeliveryMan.findOne({ where: { email } });

    if (deliveryManByEmail && deliveryManByEmail === deliveryMan) {
      return res
        .status(401)
        .json({ error: 'delivery man already exists with this email' });
    }

    const { name, avatar_id } = await deliveryMan.update(req.body);

    return res.json({ name, avatar_id, email });
  }

  async delete(req, res) {
    const deliveryMan = await DeliveryMan.findByPk(req.params.id);

    if (!deliveryMan) {
      return res.status(401).json({ error: 'delivery man does not exists' });
    }

    deliveryMan.destroy();

    return res.status(200).json(deliveryMan);
  }
}

export default new DeliveryManController();