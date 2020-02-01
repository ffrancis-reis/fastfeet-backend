import * as Yup from 'yup';
import { format, parseISO } from 'date-fns';
import Package from '../models/Package';
import DeliveryProblem from '../models/DeliveryProblem';
import DeliveryMan from '../models/DeliveryMan';
import Notification from '../schemas/Notification';
import Mail from '../../lib/Mail';

class DeliveryProblemController {
  async indexAll(req, res) {
    const deliveries = await DeliveryProblem.findAll({
      attributes: [
        'id',
        'description',
        'delivery_id',
        'created_at',
        'updated_at',
      ],
      include: [
        {
          model: Package,
          as: 'package',
          attributes: ['product', 'start_date', 'end_date', 'canceled_at'],
        },
      ],
      order: ['id'],
    });

    return res.json(deliveries);
  }

  async index(req, res) {
    const { delivery_id } = req.params;

    const deliveries = await DeliveryProblem.findAll({
      where: { delivery_id },
      attributes: [
        'id',
        'description',
        'delivery_id',
        'created_at',
        'updated_at',
      ],
      include: [
        {
          model: Package,
          as: 'package',
          attributes: ['product', 'start_date', 'end_date', 'canceled_at'],
        },
      ],
      order: ['id'],
    });

    return res.json(deliveries);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      description: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'validation failed' });
    }

    const { delivery_id } = req.params;
    const packageObj = await Package.findByPk(delivery_id);

    if (!packageObj) {
      return res.status(401).json({ error: 'package does not exists' });
    }

    const { description } = req.body;

    const deliveryProblem = await DeliveryProblem.create({
      description,
      delivery_id,
    });

    return res.json(deliveryProblem);
  }

  async cancelDelivery(req, res) {
    const schema = Yup.object().shape({
      canceled_at: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'validation failed' });
    }

    const { delivery_id } = req.params;
    const packageObj = await Package.findByPk(delivery_id);

    if (!packageObj) {
      return res.status(401).json({ error: 'package does not exists' });
    }

    const { canceled_at } = req.body;

    packageObj.canceled_at = canceled_at;

    packageObj.save();

    if (packageObj.deliveryman_id) {
      await Notification.create({
        content: `the package: "${packageObj.product}" has been canceled`,
        user: packageObj.deliveryman_id,
      });

      const deliveryman = await DeliveryMan.findByPk(packageObj.deliveryman_id);

      const formattedDate = format(
        parseISO(canceled_at),
        "'day' dd 'of' MMMM', at' hh:mm'h'"
      );

      await Mail.sendMail({
        to: `${deliveryman.name} <${deliveryman.email}>`,
        subject: 'canceled package',
        template: 'cancellation',
        context: {
          deliveryman: deliveryman.name,
          package: packageObj.product,
          cancelation: formattedDate,
        },
      });
    }

    return res.json(packageObj);
  }
}

export default new DeliveryProblemController();
