from pypika import Query, Table
from model import SettingsModel

SETTINGS = Table("settings")


def append_settings_row(row, model):
    key = row["key"]
    value = row["value"]
    if key == "warn_at":
        model.warn_at = float(value)
    elif key == "recovery_delta":
        model.recovery_delta = float(value)
    elif key == "webhook_url":
        model.webhook_url = value


def select_settings(con):
    statement = Query.from_(SETTINGS).select(SETTINGS.key, SETTINGS.value).get_sql()
    model = SettingsModel()
    for row in con.cursor().execute(statement):
        append_settings_row(row, model)
    return model


def upsert_setting(con, key, value):
    statement = Query.from_(SETTINGS).select(SETTINGS.value).where(SETTINGS.key == key).get_sql()
    con.cursor().execute(statement)
    current_value = None
    for row in con.cursor().execute(statement):
        current_value = row["value"]
    if current_value is not None:
        statement = Query.update(SETTINGS).set(SETTINGS.value, value).where(SETTINGS.key == key).get_sql()
        con.cursor().execute(statement)
        return

    statement = Query.into(SETTINGS).columns('key', 'value').insert(key, value).get_sql()
    con.cursor().execute(statement)


def update_settings(con, model):
    if model.warn_at is not None:
        upsert_setting(con, "warn_at", model.warn_at)
    if model.recovery_delta is not None:
        upsert_setting(con, "recovery_delta", model.recovery_delta)
    if model.webhook_url is not None:
        upsert_setting(con, "webhook_url", model.webhook_url)
    con.commit()
