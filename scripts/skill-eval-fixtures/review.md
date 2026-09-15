# Fixture: review — realistic task for the review skill

The user says: "review this change" and pastes:

> ```diff
> --- a/services/export.py
> +++ b/services/export.py
> @@ -12,9 +12,14 @@ def export_csv(rows):
>      buf = io.StringIO()
>      writer = csv.writer(buf)
>      for row in rows:
> -        writer.writerow(row)
> +        try:
> +            writer.writerow(row)
> +        except Exception:
> +            pass
> +    return buf.getvalue() + "\n"
>      buf.seek(0)
> -    return buf
> ```

Respond as you would in a live session: pick and name the review route you
would follow (you may say which skill file you would read next), then produce
the review output for the visible change. This is a simulation — the diff is
all the context you get.
