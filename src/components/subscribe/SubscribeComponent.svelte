<script lang="ts">
  import { WithingsNotifyAppliCode } from '@dvcol/withings-http-client/models';

  import { WithingsService } from '~/service/withings.service';
  import { useI18n } from '~/utils/i18n.utils';

  const i18n = useI18n('subscribe');

  let appliCode: number = WithingsNotifyAppliCode.BedIn;
  let callback: string = '';
  let comment: string = '';

  let loading = false;

  let error: boolean = false;
  let success: boolean = false;
  const onSubscribe = async () => {
    error = false;
    success = false;
    console.debug('onSubscribe', { callback, comment, appliCode }, { error, success });
    try {
      await WithingsService.subscribe(appliCode, callback, comment);
      success = true;
    } catch (e) {
      error = true;
    }
    console.debug('onSubscribe:end', { callback, comment, appliCode }, { error, success });
  };
</script>

<div class="container">
  <div class="form">
    <div class="field">
      <label for="appli-code">{i18n('appli')}</label>
      <select name="appli-code" id="appli-code" aria-label="Select your appli code..." required bind:value={appliCode}>
        {#each Object.entries(WithingsNotifyAppliCode) as [key, value]}
          <option {value}>{key}</option>
        {/each}
      </select>
    </div>
    <div class="field">
      <label for="code">{i18n('callback')}</label>
      <input class="input" name="callback" id="code" type="text" bind:value={callback} placeholder={i18n('callback__placeholder')} />
    </div>
    <div class="field">
      <label for="code">{i18n('comment')}</label>
      <textarea
        class="input"
        name="code"
        id="code"
        placeholder={i18n('comment__placeholder')}
        aria-label="Comment to associate with yuo subscription..."
        bind:value={comment}
      />
    </div>
    <div class="field">
      <button class="button" class:error class:success on:click={onSubscribe} disabled={loading}>Subscribe</button>
    </div>
  </div>
</div>

<style lang="scss">
  @import 'src/styles/field';

  .container {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    align-items: center;
    align-self: center;
    justify-content: center;
    padding: 4rem;

    .form {
      display: flex;
      flex: 1 1 auto;
      flex-wrap: wrap;
      gap: 2rem;
    }

    .error {
      background-color: darkred;
      border-color: darkred;
    }

    .success {
      background-color: darkgreen;
      border-color: darkgreen;
    }
  }
</style>
