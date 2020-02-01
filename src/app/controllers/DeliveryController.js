import * as Yup from 'yup';
import { parseISO, getHours, getMinutes } from 'date-fns';
import Package from '../models/Package';

class DeliveryController {
  async index(req, res) {
    const { deliveryman_id } = req.params;

    const deliveries = await Package.findAll({
      where: { deliveryman_id },
      attributes: [
        'id',
        'product',
        'recipient_id',
        'canceled_at',
        'start_date',
        'end_date',
      ],
      order: ['product'],
    });

    return res.json(deliveries);
  }

  async indexNewPackages(req, res) {
    const { deliveryman_id } = req.params;

    const deliveries = await Package.findAll({
      where: { deliveryman_id, end_date: null, canceled_at: null },
      attributes: [
        'id',
        'product',
        'recipient_id',
        'canceled_at',
        'start_date',
        'end_date',
      ],
      order: ['product'],
    });

    return res.json(deliveries);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      signature_id: Yup.number(),
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

    const { start_date } = req.body;
    const hours = getHours(parseISO(start_date) - 1); // horário de verão será?
    const minutes = getMinutes(parseISO(start_date));

    if (hours < 8 || hours > 18 || (hours === 18 && minutes > 0)) {
      return res
        .status(400)
        .json({ error: 'start date is not between 08:00h and 18:00h' });
    }

    await packageObj.update(req.body);

    return res.json(packageObj);
  }
}

export default new DeliveryController();
