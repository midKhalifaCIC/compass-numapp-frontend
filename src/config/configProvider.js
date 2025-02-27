import defaultThemeValues from '../theme/theme';
import defaultAppConfigValues from './appConfig';

import customThemeValues from '../CUSTOMIZATION/customTheme';
import customAppConfigValues from '../CUSTOMIZATION/customAppConfig';

const exportValues = {
  /** provides variables controlling the style of the application */
  theme: {
    ...defaultThemeValues,
    ...customThemeValues,
  },

  /** provides options to alter the behaviour of the app */
  appConfig: {
    ...defaultAppConfigValues,
    ...customAppConfigValues,
  },
};

/** combine the default values with the custom values */
export default exportValues;
