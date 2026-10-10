export const DAILY_TIP_DEFAULT = true;

export async function resolveDailyTipEnabled(
  fetchValue: () => Promise<boolean>,
  runningInExpoGo = false,
): Promise<boolean> {
  if (runningInExpoGo) return DAILY_TIP_DEFAULT;

  try {
    return await fetchValue();
  } catch (error) {
    console.error("Erro no Remote Config:", error);
    return DAILY_TIP_DEFAULT;
  }
}

export async function getDailyTipEnabled(): Promise<boolean> {
  const { isRunningInExpoGo } = await import("expo");
  const isExpoGo = isRunningInExpoGo();

  if (isExpoGo) return DAILY_TIP_DEFAULT;

  return resolveDailyTipEnabled(async () => {
    const remoteConfigModule = await import("@react-native-firebase/remote-config");
    const remoteConfig = remoteConfigModule.default;
    
    await remoteConfig().setDefaults({
      show_daily_tip: DAILY_TIP_DEFAULT,
    });

    await remoteConfig().setConfigSettings({
      minimumFetchIntervalMillis: __DEV__ ? 0 : 43200000,
    });

    await remoteConfig().fetchAndActivate();

    return remoteConfig().getBoolean("show_daily_tip");
  }, isExpoGo);
}