import Sequelize from 'sequelize';
import mongoose from 'mongoose';
import User from '../app/models/User';
import Recipient from '../app/models/Recipient';
import DeliveryMan from '../app/models/DeliveryMan';
import Package from '../app/models/Package';
import File from '../app/models/File';
import DeliveryProblem from '../app/models/DeliveryProblem';
import databaseConfig from '../config/database';

const models = [User, Recipient, DeliveryMan, Package, File, DeliveryProblem];

class Database {
  constructor() {
    this.init();
    this.mongo();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }

  mongo() {
    this.mongoConnection = mongoose.connect(
      'mongodb://localhost:27017/fastfeet',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: true,
      }
    );
  }
}

export default new Database();
