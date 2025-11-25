import User from './User.js';
import Meeting from './Meeting.js';
import Convention from './Convention.js';
import ConventionRegistration from './ConventionRegistration.js';
import Test from './Test.js';
import Payment from './Payment.js';
import Feedback from './Feedback.js';

// Associations
User.belongsToMany(Meeting, { through: 'UserMeetings' });
Meeting.belongsToMany(User, { through: 'UserMeetings' });

User.belongsToMany(Convention, { through: ConventionRegistration });
Convention.belongsToMany(User, { through: ConventionRegistration });

User.hasMany(Payment);
Payment.belongsTo(User);

Convention.hasMany(Payment);
Payment.belongsTo(Convention);

User.hasMany(Feedback);
Feedback.belongsTo(User);

export { User, Meeting, Convention, Test, Payment, Feedback, ConventionRegistration };
