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

    position: relative;
    top: 0;
    left: 0;
    width: 100%;
    height: var(--height);
    overflow: hidden;
    background-color: var(--rail-color);

    .bar {
      position: absolute;
      height: var(--height);
      opacity: 0;
      transition: opacity 0.5s;
      animation-duration: var(--speed);
      animation-timing-function: ease-in-out;
      animation-iteration-count: infinite;

      &.error {
        width: 0;
        background-color: red;
      }

      &.success {
        width: 0;
        background-color: var(--color-primary);
      }

      &.start {
        background-color: var(--color-primary);
        animation-name: loading-bar-grow;
      }

      &.end {
        background-color: var(--color-secondary);
        animation-name: loading-bar-shrink;
        animation-delay: 0.9s;
      }
    }

    &.visible .bar {
      opacity: 1;
    }

    &.error .bar.error {
      width: 100%;
      transition:
        opacity 2s,
        width 1s;
    }

    &:not(.error, .visible) .bar.success {
      width: 100%;
      transition:
        opacity 2s,
        width 1s;
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
