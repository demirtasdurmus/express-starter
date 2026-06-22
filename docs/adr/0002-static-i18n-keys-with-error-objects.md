# ADR 0002: Static i18n keys with error objects

## Status

Accepted

## Context

Application-thrown errors (`NotFoundError`, `BadRequestError`, etc.) must be:

- **Localized** in API responses (`Accept-Language` / i18next)
- **Stable** in logs and observability (language-neutral keys, not client-facing copy)

Several approaches were considered:

| Approach                                                              | Problem                                                                       |
| --------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| `req.t()` at throw sites                                              | Couples controllers/middleware to request language; localized strings in logs |
| Dynamic / computed translation keys on errors                         | No compile-time safety; harder to grep and alert on                           |
| `ParseKeys` + interpolation params on `BaseError`                     | Couples the error domain to sentence shape and locale templates               |
| Static `ParseKeys` on error constructors + translate in error handler | Keys in internal layer; translation only at the presentation edge             |

Validation field messages follow the same static-key model in schemas ([ADR 0001](./0001-validation-i18n-keys.md)); Zod still requires `satisfies ParseKeys` because its message params are typed as `string`.

## Decision

1. **Client-facing 4XX error constructors accept `ParseKeys` only** — enforced in `baseError.ts`; no `satisfies` at throw sites.
2. **Static keys only on error objects** — no interpolation or `req.t` options on `BaseError`; locale strings for errors are fixed phrases.
3. **Translate once in the error handler** — `req.t()` on `detail` and `errors[].message` (422 field errors); log before translation.
4. **`extensions` are optional machine-readable facts** — exposed on the problem response, not passed into `req.t()` unless a future locale explicitly needs it.
5. **`InternalServerError` keeps `message: string`** — 5XX messages may be technical and are masked in production.
6. **Rich i18n (interpolation, dynamic copy) belongs in controllers** — for success and non-error responses, use `req.t()` with full options there.

Example:

```ts
throw new NotFoundError('samples.notFound');

// error handler (presentation edge)
problemDetail.detail = req.t(error.message as ParseKeys);
```

Keys live in `locales/{lang}/translation.json`.

## Consequences

### Positive

- Compile-time key checks at error construction sites
- Single presentation layer for error copy (error handler)
- Logs and alerts use stable keys regardless of request language
- Error objects stay free of locale, `TFunction`, and sentence assembly

### Negative

- Error copy cannot include dynamic values from the server (e.g. retry countdown) without revisiting this ADR
- Validation bounds and similar values are static in locale strings (e.g. “at most 100”) unless ADR 0001 field-error params are extended later

## Alternatives considered

- **Domain error codes + mapper to `ParseKeys` at the edge** — cleaner domain model; deferred as extra boilerplate for a starter template.
- **Interpolation via `extensions` in `req.t(error.message, extensions)`** — rejected to keep facts separate from copy.

## References

- [ADR 0001: Validation i18n via static keys in schemas](./0001-validation-i18n-keys.md)
- `src/lib/error/baseError.ts`
- `src/middleware/error-handler.middleware.ts`
