
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../src/models/user.model");
const ROLES = require("../src/enums/roles.enum");
const logger = require("../src/logger/logger");

const {
  MONGO_URI,
  SEED_ADMIN_NAME,
  SEED_ADMIN_EMAIL,
  SEED_ADMIN_PHONE,
  SEED_ADMIN_PASSWORD,
} = process.env;

const run = async () => {
  if (!SEED_ADMIN_EMAIL || !SEED_ADMIN_PASSWORD) {
    console.error(
      "SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD must be set in your environment before seeding."
    );
    process.exit(1);
  }

  await mongoose.connect(MONGO_URI);

  let admin = await User.findOne({ email: SEED_ADMIN_EMAIL.toLowerCase() });

  if (admin) {
    admin.role = ROLES.ADMIN;
    await admin.save();
    console.log(`Existing user ${admin.email} promoted to ADMIN.`);
  } else {
    admin = await User.create({
      name: SEED_ADMIN_NAME || "Admin",
      email: SEED_ADMIN_EMAIL,
      phone: SEED_ADMIN_PHONE || "0000000000",
      password: SEED_ADMIN_PASSWORD,
      role: ROLES.ADMIN,
    });
    console.log(`Admin user created: ${admin.email}`);
  }

  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  logger.error("Admin seed failed", { error: err.message });
  console.error(err);
  process.exit(1);
});
