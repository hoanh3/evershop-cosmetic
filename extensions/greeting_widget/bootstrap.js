module.exports = () => {
  const config = require('config');

  const greetingWidget = {
    greeting_widget: {
      setting_component: require.resolve(
        './components/widget/GreetingWidgetSetting.jsx'
      ),
      component: require.resolve(
        './components/widget/GreetingWidget.jsx'
      ),
      name: 'My greeting Widget',
      description: 'A simple greeting widget',
      default_settings: {},
      enabled: true
    }
  };

  config.util.setModuleDefaults('widgets', greetingWidget);
};
