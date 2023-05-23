import logger from 'kolibri.lib.logging';
import { TaskResource } from 'kolibri.resources';
import RootVue from './views/SetupWizardIndex';
import pluginModule from './modules/pluginModule';
import routes from './routes';
import router from 'kolibri.coreVue.router';

import KolibriApp from 'kolibri_app';

const logging = logger.getLogger(__filename);

class SetupWizardModule extends KolibriApp {
  get RootVue() {
    return RootVue;
  }
  get routes() {
    return routes;
  }
  get pluginModule() {
    return pluginModule;
  }
  ready() {
    // Fix for https://github.com/learningequality/kolibri/issues/3852
    // Override the base ready method, so that we don't start the session
    // heartbeat checks.
    // Don't call beat because it may cause a save in the session endpoint
    // while the device provisioning is in progress
    this.setupVue();
    logging.info('Clearing facility tasks created in previous sessions...');
    TaskResource.clearAll('facility_task');
    this.startRootVue();

    router.beforeResolve((to, from, next) => {
      console.log('beforeResolve', to, from);
      if(from.meta.noBackAction) {
        // TODO Figure out how to ensure we also account for FORWARD here
        console.log("Has noBackAction, so we bail out");
        next(false);
      }
      if(from.meta.wizardRouted) {
        console.log("was wizardRouted, so we're just moving along...")
        next();
      }
      // If we're here, we're dealing with a browser-based action,
      // so let's short-circuit it here and just send the event to the wizard,
      // which ought to then trigger the SetupWizardIndex's
      console.log("sending event to wizardService", to.meta.eventOnGoBack);
      from.meta.wizardService.send(to.meta.eventOnGoBack);
      return next(false);
    });
  }
}

export default new SetupWizardModule();
