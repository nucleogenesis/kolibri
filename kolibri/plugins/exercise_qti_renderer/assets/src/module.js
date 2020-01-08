import QtiExerciseRenderer from './views/QtiExerciseRenderer';
import ContentRendererModule from 'content_renderer_module';

class QtiExerciseRendererModule extends ContentRendererModule {
  get rendererComponent() {
    ExerciseQTIRenderer.contentModule = this;
    return ExerciseQTIRenderer;
  }
}

const qtiExerciseRenderer = new QtiExerciseRendererModule();

export { qtiExerciseRenderer as default };
