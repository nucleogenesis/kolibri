import store from 'kolibri.coreVue.vuex.store';
import QtiExerciseRenderer from './views/QtiExerciseRenderer';
import qtiModule from './modules';
import ContentRendererModule from 'content_renderer_module';

class QtiExerciseRendererModule extends ContentRendererModule {
  get rendererComponent() {
    QtiExerciseRenderer.contentModule = this;
    return QtiExerciseRenderer;
  }

  get store() {
    return store;
  }

  ready() {
    this.store.registerModule('qti_exercise', qtiModule);
  }
}

const qtiExerciseRenderer = new QtiExerciseRendererModule();

export { qtiExerciseRenderer as default };
