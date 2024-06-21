/**
 * Asynchronously loads the component for Dashboard
 */

import { lazyLoad } from 'utils/loadable';

export const Dashboard = lazyLoad(
  () => import('./dashboard/Dashboard'),
  module => module.default,
);

export const QuizOverview = lazyLoad(
  () => import('./quiz-overview/QuizOverview'),
  module => module.default,
);

export const AdminPage = lazyLoad(
  () => import('./adminpage/AdminPage'),
  module => module.default,
);

export const Masquerade = lazyLoad(
  () => import('./masquerade/Masquerade'),
  module => module.default,
);
