module.exports = {
  Query: {
    greetingWidget(_, { settings }) {
      return { text: settings.text, className: settings.className };
    }
  }
};