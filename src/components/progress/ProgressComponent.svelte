<script lang="ts">
  import { LoadingBarService } from '~/service/loading-bar.service';

  const loading$ = LoadingBarService.isLoading;
  const error$ = LoadingBarService.hasError;
</script>

<div class="container" class:visible={$loading$} class:error={$error$}>
  <div class="bar start" />
  <div class="bar end" />
  <div class="bar error" />
  <div class="bar success" />
</div>

<style lang="scss">
  .container {
    --height: var(--loading-bar-height, 0.2rem);
    --speed: var(--loading-bar-speed, 2s);
    --rail-color: transparent;

    width: 100%;
    left: 0;
    top: 0;
    position: relative;
    overflow: hidden;
    height: var(--height);
    background-color: var(--rail-color);

    &.visible .bar {
      opacity: 1;
    }

    &.error .bar.error {
      width: 100%;
      transition: opacity 2s, width 1s;
    }

    &:not(.error):not(.visible) .bar.success {
      width: 100%;
      transition: opacity 2s, width 1s;
    }

    .bar {
      position: absolute;
      height: var(--height);
      animation-duration: var(--speed);
      animation-timing-function: ease-in-out;
      animation-iteration-count: infinite;

      opacity: 0;
      transition: opacity 0.5s;

      &.error {
        background-color: red;
        width: 0;
      }

      &.success {
        background-color: var(--color-primary);
        width: 0;
      }

      &.start {
        animation-name: loading-bar-grow;
        background-color: var(--color-primary);
      }

      &.end {
        animation-name: loading-bar-shrink;
        animation-delay: 0.9s;
        background-color: var(--color-secondary);
      }
    }
  }

  @keyframes loading-bar-grow {
    0% {
      left: -5%;
      width: 5%;
    }
    100% {
      left: 130%;
      width: 150%;
    }
  }

  @keyframes loading-bar-shrink {
    0% {
      left: -90%;
      width: 90%;
    }
    100% {
      left: 110%;
      width: 10%;
    }
  }

  @keyframes loading-bar-fill {
    0% {
      left: 0;
      width: 0;
      opacity: 0;
    }
    100% {
      left: 100%;
      width: 100%;
      opacity: 1;
    }
  }
</style>
