import QtiExerciseRenderer from './views/QtiExerciseRenderer';
import ContentRendererModule from 'content_renderer_module';

class QtiExerciseRendererModule extends ContentRendererModule {
  get rendererComponent() {
    QtiExerciseRenderer.contentModule = this;
    return QtiExerciseRenderer;
  }
}

const qtiExerciseRenderer = new QtiExerciseRendererModule();

export { qtiExerciseRenderer as default };
