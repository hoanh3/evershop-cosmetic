import React from 'react';
import PropTypes from 'prop-types';
import { Field } from '@components/common/form/Field';

export default function GreetingWidgetSetting({
  greetingWidget: { text, className }
}) {
  return (
    <div>
        <p>Configure your greeting widget</p>
        <Field
            type="text"
            name="settings[className]"
            label="Custom css classes"
            value={className}
            placeholder="Custom css classes"
        />
        <Field
            type="textarea"
            name="settings[text]"
            label="Greeting text"
            value={text}
        />
    </div>
  );
}

GreetingWidgetSetting.propTypes = {
  greetingWidget: PropTypes.shape({
    text: PropTypes.string,
    className: PropTypes.string
  })
};

GreetingWidgetSetting.defaultProps = {
  greetingWidget: {
    text: 'Hello, welcome to our store!',
    className: ''
  }
};

export const query = `
  query Query($settings: JSON) {
    greetingWidget(settings: $settings) {
      text
      className
    }
  }
`;

export const variables = `{
  settings: getWidgetSetting()
}`;