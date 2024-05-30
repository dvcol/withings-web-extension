<script lang="ts">
  import Router from 'svelte-spa-router';

  import { routeDefinition } from '~/router/routes';

  import '~/styles/base.scss';
  import ProgressComponent from '~/components/progress/ProgressComponent.svelte';

  import { onMount } from 'svelte';

  import { WithingsService } from '~/service/withings.service';

  onMount(() => {
    (window as any).WithingsService = WithingsService;
    WithingsService.listen();
  });
</script>

<main class="app-container">
  <ProgressComponent />
  <section class="router-container">
    <Router routes={routeDefinition} />
  </section>
</main>

<style lang="scss">
  .app-container {
    --loading-bar-height: 0.2rem;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .router-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      height: calc(100vh - var(--loading-bar-height));
    }
  }
</style>
