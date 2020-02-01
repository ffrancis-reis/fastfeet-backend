import * as Yup from 'yup';
import DeliveryMan from '../models/DeliveryMan';
import File from '../models/File';

class DeliveryManController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      avatar_id: Yup.number(),
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
      attributes: ['id', 'name', 'email', 'avatar_id'],
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['name', 'path', 'url'],
        },
      ],
      order: ['name'],
    });

    return res.json(deliveryMen);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      avatar_id: Yup.number(),
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

    await deliveryMan.update(req.body);

    return res.json(deliveryMan);
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
