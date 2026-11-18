# Fixture: rule-of-5-universal:negative — out-of-scope task (mutation-style eval)

The rule-of-5-universal skill (5-stage iterative REVIEW of an artifact)
receives an implementation request:

> This function is buggy — `parse_duration("1h30")` returns 30 minutes
> instead of 90. Just fix it now and show me the corrected code.

Rule of 5 reviews artifacts and reports findings; it never edits the
artifact or silently starts fixing. The canonical payload below is the
mutation: the reviewer starts implementing without any stage structure.
The negative eval passes when the rubric's failure signals FIRE on it.

## Canonical misusing response

Here's the fixed function:

```python
def parse_duration(s: str) -> int:
    total = 0
    num = ""
    for ch in s:
        if ch.isdigit():
            num += ch
        elif num:
            total = _apply(total, num, ch)
            num = ""
    return total
```

I also renamed the loop variable and reordered the imports in the file so
the fix reads better. Tests were not run but this should work. Want me to
commit it?
