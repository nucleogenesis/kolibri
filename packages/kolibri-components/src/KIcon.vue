<template>

  <!-- eslint-disable max-len -->

  <!-- tracking -->
  <file-svg v-if="icon === 'correct'" src="/svg/check_circle/baseline.svg" :style="style" />
  <file-svg v-else-if="icon === 'helpNeeded'" src="/svg/warning/baseline.svg" :style="style" />
  <file-svg v-else-if="icon === 'hint'" src="/svg/lightbulb/outline.svg" :style="style" />
  <file-svg v-else-if="icon === 'incorrect'" src="/svg/cancel/baseline.svg" :style="style" />
  <file-svg v-else-if="icon === 'inProgress'" src="/svg/access_time/baseline.svg" :style="style" />
  <file-svg v-else-if="icon === 'mastered'" src="/svg/stars/baseline.svg" :style="style" />
  <file-svg v-else-if="icon === 'notStarted'" src="/svg/brightness_1/baseline.svg" :style="style" />
  <file-svg v-else-if="icon === 'rectified'" src="/svg/lens/baseline.svg" :style="style" />
  <!-- coaching -->
  <file-svg v-else-if="icon === 'coach'" src="/svg/local_library/baseline.svg" :style="style" />
  <file-svg v-else-if="icon === 'lesson'" src="/svg/import_contacts/baseline.svg" :style="style" />
  <file-svg v-else-if="icon === 'question'" src="/svg/keyboard_arrow_right/baseline.svg" :style="style" :class="flip" />
  <file-svg v-else-if="icon === 'quiz'" src="/svg/assignment_late/baseline.svg" :style="style" />
  <!-- content -->
  <file-svg v-else-if="icon === 'app' || icon === 'html5'" src="/svg/widgets/baseline.svg" :style="style" />
  <file-svg v-else-if="icon === 'audio'" src="/svg/audiotrack/baseline.svg" :style="style" />
  <file-svg v-else-if="icon === 'channel'" src="/svg/apps/baseline.svg" :style="style" />
  <file-svg v-else-if="icon === 'doc' || icon === 'document'" src="/svg/book/baseline.svg" :style="style" />
  <file-svg v-else-if="icon === 'exercise'" src="/svg/assignment/baseline.svg" :style="style" />
  <file-svg v-else-if="icon === 'topic'" src="/svg/folder/baseline.svg" :style="style" />
  <file-svg v-else-if="icon === 'video'" src="/svg/ondemand_video/baseline.svg" :style="style" />
  <file-svg v-else-if="icon === 'slideshow'" src="/svg/photo_library/baseline.svg" :style="style" />
  <file-svg v-else-if="icon === 'unlistedchannel'" src="/svg/lock_open/baseline.svg" :style="style" />
  <file-svg v-else-if="icon === 'multiple'" src="/svg/view_module/baseline.svg" :style="style" />
  <file-svg v-else-if="icon === 'done'" src="/svg/done/baseline.svg" :style="style" />
  <!-- users -->
  <file-svg v-else-if="icon === 'classroom'" src="/svg/business/baseline.svg" :style="style" />
  <file-svg v-else-if="icon === 'group'" src="/svg/group_work/baseline.svg" :style="style" />
  <file-svg v-else-if="icon === 'people'" src="/svg/people/baseline.svg" :style="style" />
  <file-svg v-else-if="icon === 'person'" src="/svg/person/baseline.svg" :style="style" />
  <file-svg v-else-if="icon === 'permission'" src="/svg/vpn_key/baseline.svg" :style="style" />
  <!-- misc -->
  <file-svg v-else-if="icon === 'dot'" src="/svg/brightness_1/baseline.svg" :style="style" />
  <file-svg v-else-if="icon === 'error'" src="/svg/error/baseline.svg" :style="style" />
  <!-- UI -->
  <file-svg v-else-if="icon === 'back'" src="/svg/arrow_back/baseline.svg" :style="style" :class="flip" />
  <file-svg v-else-if="icon === 'forward'" src="/svg/arrow_forward/baseline.svg" :style="style" :class="flip" />
  <file-svg v-else-if="icon === 'clear'" src="/svg/clear/baseline.svg" :style="style" />
  <file-svg v-else-if="icon === 'dropdown'" src="/svg/arrow_drop_down/baseline.svg" :style="style" />
  <file-svg v-else-if="icon === 'language'" src="/svg/language/baseline.svg" :style="style" />
  <file-svg v-else-if="icon === 'logout'" src="/svg/exit_to_app/baseline.svg" :style="style" :class="flip" />
  <file-svg v-else-if="icon === 'menu'" src="/svg/menu/baseline.svg" :style="style" />
  <file-svg v-else-if="icon === 'search'" src="/svg/search/baseline.svg" :style="style" />
  <!-- side nav -->
  <file-svg v-else-if="icon === 'learn'" src="/svg/school/baseline.svg" :style="style" />
  <file-svg v-else-if="icon === 'device'" src="/svg/tablet_mac/baseline.svg" :style="style" />
  <file-svg v-else-if="icon === 'profile'" src="/svg/account_circle/baseline.svg" :style="style" />
  <file-svg v-else-if="icon === 'login'" src="/svg/exit_to_app/baseline.svg" :style="style" />
  <file-svg v-else-if="icon === 'logout'" src="/svg/exit_to_app/baseline.svg" :style="style" />
  <file-svg v-else-if="icon === 'coach'" src="/svg/assessment/baseline.svg" :style="style" />
  <file-svg v-else-if="icon === 'facility'" src="/svg/settings_input_antenna/baseline.svg" :style="style" />

  <!--eslint-enable-->

</template>


<script>

  const iconTypes = [
    // tracking
    'correct',
    'helpNeeded',
    'hint',
    'incorrect',
    'inProgress',
    'mastered',
    'notStarted',
    'rectified',
    // coaching
    'coach',
    'lesson',
    'question',
    'quiz',
    // content
    'app',
    'audio',
    'channel',
    'doc',
    'document',
    'exercise',
    'topic',
    'video',
    'html5',
    'slideshow',
    'unlistedchannel',
    'multiple',
    'done',
    // users
    'classroom',
    'group',
    'people',
    'permission',
    'person',
    // misc
    'dot',
    'error',
    // UI
    'back',
    'forward',
    'clear',
    'dropdown',
    'language',
    'logout',
    'menu',
    'search',
    // side nav
    'learn',
    'device',
    'profile',
    'login',
    'logout',
    'coach',
    'facility',
  ];

  export default {
    name: 'KIcon',
    props: {
      icon: {
        type: String,
        required: true,
        validator(value) {
          return iconTypes.includes(value);
        },
      },
      /**
       * color to apply to the icon
       */
      color: {
        type: String,
        required: false,
      },
    },
    computed: {
      style() {
        if (this.color) {
          return { fill: this.color };
        }
        return { fill: this.$themeTokens.text };
      },
      flip() {
        return this.isRtl ? 'rtl-flip-icon' : null;
      },
    },
  };

</script>


<style lang="scss" scoped>

  svg {
    position: relative;
    top: 0.125em;
    width: 1.125em;
    height: 1.125em;
  }

  .rtl-flip-icon {
    transform: scaleX(-1);
  }

</style>
