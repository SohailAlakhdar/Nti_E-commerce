const AboutPage = require("../models/aboutPage.model");
const { cache, CACHE_KEYS } = require("../cache/nodeCache");

const getAboutPage = async () => {
  const cached = cache.get(CACHE_KEYS.ABOUT_PAGE);
  if (cached) return cached;

  let about = await AboutPage.findOne();
  if (!about) about = await AboutPage.create({});

  cache.set(CACHE_KEYS.ABOUT_PAGE, about);
  return about;
};

const updateAboutPage = async ({ title, content }, adminId) => {
  let about = await AboutPage.findOne();
  if (!about) about = new AboutPage();

  if (title !== undefined) about.title = title;
  if (content !== undefined) about.content = content;
  about.updatedBy = adminId;
  await about.save();

  cache.del(CACHE_KEYS.ABOUT_PAGE);
  return about;
};

module.exports = { getAboutPage, updateAboutPage };
