<script lang="ts">
  import Router, { link } from 'svelte-spa-router';

  import { routeDefinition, routeMap } from '~/router/routes';
  import { WithingsService } from '~/service/withings.service';

  (window as any).WithingsService = WithingsService;
</script>

<main class="app-container">
  {#each routeMap as route}
    <a href={null} use:link={route.path}>{route.name}</a>
  {/each}

  <Router routes={routeDefinition} />
</main>

<style lang="scss">
  .app-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
</style>
