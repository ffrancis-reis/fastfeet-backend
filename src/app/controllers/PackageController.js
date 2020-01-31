import * as Yup from 'yup';
import Package from '../models/Package';
import Recipient from '../models/Recipient';
import DeliveryMan from '../models/DeliveryMan';

class PackageController {
  async store(req, res) {
    const schema = Yup.object().shape({
      product: Yup.string().required(),
      recipient_id: Yup.string(),
      deliveryman_id: Yup.string(),
      signature_id: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'validation failed' });
    }

    const { product, recipient_id, deliveryman_id, signature_id } = req.body;

    const packageObj = await Package.create({
      product,
      recipient_id,
      deliveryman_id,
      signature_id,
    });

    return res.json(packageObj);
  }

  async index(req, res) {
    const packages = await Package.findAll({
      attributes: [
        'id',
        'product',
        'recipient_id',
        'deliveryman_id',
        'signature_id',
        'canceled_at',
        'start_date',
        'end_date',
      ],
      order: ['product'],
    });

    return res.json(packages);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      product: Yup.string(),
      recipient_id: Yup.string(),
      deliveryman_id: Yup.string(),
      signature_id: Yup.string(),
      canceled_at: Yup.date(),
      start_date: Yup.date(),
      end_date: Yup.date(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'validation failed' });
    }

    const packageObj = await Package.findByPk(req.params.id);

    if (!packageObj) {
      return res.status(401).json({ error: 'package does not exists' });
    }

    const { recipient_id, deliveryman_id } = req.body;

    const recipientExists = await Recipient.findByPk(recipient_id);

    if (!recipientExists) {
      return res.status(401).json({ error: 'recipient does not exists' });
    }

    const deliveryManExists = await DeliveryMan.findByPk(deliveryman_id);

    if (!deliveryManExists) {
      return res.status(401).json({ error: 'delivery man does not exists' });
    }

    const {
      product,
      signature_id,
      canceled_at,
      start_date,
      end_date,
    } = await packageObj.update(req.body);

    return res.json({
      product,
      recipient_id,
      deliveryman_id,
      signature_id,
      canceled_at,
      start_date,
      end_date,
    });
  }

  async delete(req, res) {
    const packageObj = await Package.findByPk(req.params.id);

    if (!packageObj) {
      return res.status(401).json({ error: 'package does not exists' });
    }

    await packageObj.destroy();

    return res.status(200).json(packageObj);
  }
}

export default new PackageController();
