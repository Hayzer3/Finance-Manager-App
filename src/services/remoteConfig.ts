export const DAILY_TIP_DEFAULT = true;

export async function resolveDailyTipEnabled(
  fetchValue: () => Promise<boolean>,
  runningInExpoGo = false,
): Promise<boolean> {
  if (runningInExpoGo) return DAILY_TIP_DEFAULT;

  try {
    return await fetchValue();
  } catch {
    return DAILY_TIP_DEFAULT;
  }
}

export async function getDailyTipEnabled(): Promise<boolean> {
  const { isRunningInExpoGo } = await import("expo");

  if (isRunningInExpoGo()) return DAILY_TIP_DEFAULT;

  return resolveDailyTipEnabled(async () => {
    const remoteConfig = await import("@react-native-firebase/remote-config");
    const config = remoteConfig.getRemoteConfig();
    config.defaultConfig = { show_daily_tip: DAILY_TIP_DEFAULT };
    await remoteConfig.fetchAndActivate(config);
    return remoteConfig.getValue(config, "show_daily_tip").asBoolean();
  });
}
