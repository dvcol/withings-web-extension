<script lang="ts">
  import { onMount } from 'svelte';
  import Router, { push } from 'svelte-spa-router';

  import HeaderComponent from '~/components/header/HeaderComponent.svelte';
  import ProgressComponent from '~/components/progress/ProgressComponent.svelte';
  import { routeDefinition, RoutePath } from '~/router/routes';
  import { WithingsService } from '~/service/withings.service';

  import '~/styles/base.scss';

  onMount(async () => {
    (window as any).WithingsService = WithingsService;
    await WithingsService.listen();
    if (!WithingsService.isAuthorized) return;
    await push(RoutePath.Subscriptions);
  });
</script>

<main class="app-container">
  <ProgressComponent />
  <article class="content-container">
    <HeaderComponent />
    <section class="router-container">
      <Router routes={routeDefinition} />
    </section>
  </article>
</main>

<style lang="scss">
  .app-container {
    --loading-bar-height: 0.2rem;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .content-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      height: calc(100vh - var(--loading-bar-height));
      overflow-y: auto;
    }

    .router-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
    }
  }
</style>
