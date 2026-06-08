# ADR 0001: Validation i18n via static keys in schemas

## Status

Accepted

## Context

Request validation uses Zod. Failed parses become `UnprocessableEntityError` with field-level messages that must be:

- **Localized** in API responses (`Accept-Language` / i18next)
- **Stable** in logs and observability (language-neutral identifiers, not client-facing copy)

Several approaches were considered:

| Approach                                                      | Problem                                                                                                          |
| ------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Zod built-in locales (`z.config(z.locales.tr())`) per request | Localizes at parse time → localized strings in logs; `z.config()` is process-global and unsafe under concurrency |
| `req.t()` in dynamic schema factories                         | Same as above: translated strings stored before the error handler; couples schemas to HTTP/i18next               |
| Custom keys in schemas + `req.t()` in error handler           | Keys in internal layer; translation only at the presentation edge                                                |

Most validators (Zod, Valibot, Joi, Yup) expose a single `message` string that conflates error identity with user-facing copy. Separating those concerns is an application-level choice, not something libraries enforce.

## Decision

1. **Schemas store i18n translation keys only** — use `ParseKeys` and `'validation.*'` keys in Zod error params, not rendered text.
2. **Translate once in the error handler** — `error-handler.middleware.ts` calls `req.t()` on `detail` and `errors[].message` before sending `application/problem+json`.
3. **Do not use Zod locales or per-request `z.config()`** in validate middleware.
4. **Log before translation** — `res.locals.error` and structured logs retain keys; clients receive translated responses.

Example:

```ts
name: z.string('validation.sample.nameRequired' satisfies ParseKeys).min(
  1,
  'validation.sample.nameRequired' satisfies ParseKeys,
);
```

Keys live in `locales/{lang}/translation.json`.

## Consequences

### Positive

- Single presentation layer for validation copy (error handler)
- Logs and alerts use stable keys regardless of request language
- No global Zod locale mutation per request
- Schemas remain usable outside HTTP (tests, scripts) without injecting `TFunction`

### Negative

- Every user-facing failure path needs an explicit key in the schema (or a shared Zod issue → key map)
- Native Zod default messages are not used; omitting a key can leak English fallback text
- Slightly more boilerplate than relying on Zod locales for generic rules (`min`, `max`, `invalid_type`)

## Alternatives considered

- **Structured field errors** (`{ field, code, params }`) with translation from issue metadata — better for logging/search, but a larger type and API change; deferred.
- **Per-parse Zod `error` map with `req.t()`** — still pre-localizes messages unless the map returns keys; does not fix logging on its own.

## References

- [Zod error customization](https://zod.dev/error-customization)
- `src/middleware/validate.middleware.ts`
- `src/middleware/error-handler.middleware.ts`
- `src/schemas/sample.schema.ts`
