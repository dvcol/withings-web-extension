<script lang="ts">
  import { WithingsNotifyAppliCode } from '@dvcol/withings-http-client/models';
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';

  import type { WithingsNotify } from '@dvcol/withings-http-client/models';

  import { WithingsService } from '~/service/withings.service';
  import { useI18n } from '~/utils/i18n.utils';

  const i18n = useI18n('subscriptions');

  const subscriptions = writable([]);

  const fetchSubscriptions = async () => {
    subscriptions.set(await WithingsService.subscriptions());
  };

  const error = {};
  const success = {};

  const revokeSubscription = async (sub: WithingsNotify, index: number) => {
    success[index] = false;
    error[index] = false;
    try {
      await WithingsService.revoke(sub);
      success[index] = true;
    } catch (e) {
      error[index] = true;
    }

    return fetchSubscriptions();
  };

  onMount(() => {
    fetchSubscriptions();
  });

  const WithingsNotifyAppliCodeMap = {
    [WithingsNotifyAppliCode.Weight]: 'Weight',
    [WithingsNotifyAppliCode.Temperature]: 'Temperature',
    [WithingsNotifyAppliCode.Pressure]: 'Pressure',
    [WithingsNotifyAppliCode.Activity]: 'Activity',
    [WithingsNotifyAppliCode.Sleep]: 'Sleep',
    [WithingsNotifyAppliCode.UserInfo]: 'UserInfo',
    [WithingsNotifyAppliCode.BedIn]: 'BedIn',
    [WithingsNotifyAppliCode.BedOut]: 'BedOut',
    [WithingsNotifyAppliCode.InflateDone]: 'InflateDone',
    [WithingsNotifyAppliCode.NoAccountAssociated]: 'NoAccountAssociated',
    [WithingsNotifyAppliCode.ECGData]: 'ECGData',
    [WithingsNotifyAppliCode.ECGMeasureFailed]: 'ECGMeasureFailed',
    [WithingsNotifyAppliCode.Glucose]: 'Glucose',
  } as const;
</script>

<div class="container">
  {#if $subscriptions.length === 0}
    <div>{i18n('no_subscriptions')}</div>
  {:else}
    <table>
      <thead>
        <tr>
          <th scope="col">{i18n('appli')}</th>
          <th scope="col">{i18n('callback')}</th>
          <th scope="col">{i18n('comment')}</th>
          <th scope="col">{i18n('delete')}</th>
        </tr>
      </thead>
      <tbody>
        {#each $subscriptions as subscription, i}
          <tr>
            <td>
              <div>{WithingsNotifyAppliCodeMap[subscription.appli]}</div>
              <div>({subscription.appli})</div>
            </td>
            <td>{subscription.callbackurl}</td>
            <td>{subscription.comment}</td>
            <td>
              <button class="button" class:error={error[i]} class:success={success[i]} on:click={() => revokeSubscription(subscription, i)}
                >{i18n('delete')}</button
              >
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}
</div>

<style lang="scss">
  .container {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    align-items: center;
    align-self: center;
    justify-content: center;
    padding: 4rem;

    table {
      width: 100%;
      height: 100%;

      th,
      td {
        padding: 1rem;
        text-align: center;
      }
    }
  }
</style>
