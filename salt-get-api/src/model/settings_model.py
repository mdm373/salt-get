class SettingsModel:
    warn_at = None
    webhook_url = None
    recovery_delta = None

    def union_default(self):
        defaulted = SettingsModel()
        defaulted.warn_at = self.warn_at is None and 40 or self.warn_at
        defaulted.recovery_delta = self.recovery_delta is None and 10 or self.recovery_delta
        defaulted.webhook_url = self.webhook_url
        return defaulted
