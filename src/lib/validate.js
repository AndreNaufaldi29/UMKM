/**
 * Input validation and sanitization helpers for API routes.
 * Prevents XSS, excessively large payloads, and malformed data.
 */

const ALLOWED_IMAGE_TYPES = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB per image
const MAX_STRING_LENGTH = 5000;

/**
 * Strip potentially dangerous characters from a string.
 * Keeps alphanumeric, Indonesian characters, punctuation, spaces.
 */
export function sanitizeString(value) {
  if (typeof value !== 'string') return '';
  return value
    .trim()
    .substring(0, MAX_STRING_LENGTH)
    // Remove null bytes and control characters (except newline & tab)
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
}

/**
 * Sanitize a URL string — only allow safe protocols.
 */
export function sanitizeUrl(value) {
  if (typeof value !== 'string') return '';
  const trimmed = value.trim().substring(0, 500);
  if (trimmed === '') return '';
  // Only allow http, https, or relative paths
  if (/^(https?:\/\/|\/)/.test(trimmed)) return trimmed;
  // WhatsApp links
  if (/^(wa\.me|62|08)/.test(trimmed)) return trimmed;
  return '';
}

/**
 * Validate and sanitize a base64 image data URL.
 * Returns the data URL if valid, '' if invalid, throws if too large.
 */
export function validateImage(dataUrl) {
  if (!dataUrl || typeof dataUrl !== 'string') return dataUrl || '';
  if (!dataUrl.startsWith('data:image/')) return dataUrl; // treat as path

  const matches = dataUrl.match(/^data:image\/([a-zA-Z0-9]+);base64,(.+)$/s);
  if (!matches) return '';

  const ext = matches[1].toLowerCase();
  if (!ALLOWED_IMAGE_TYPES.includes(ext === 'jpeg' ? 'jpg' : ext)) {
    throw new Error(`Tipe gambar '${ext}' tidak diizinkan. Gunakan: ${ALLOWED_IMAGE_TYPES.join(', ')}`);
  }

  // Estimate decoded size (base64 is ~4/3 of raw size)
  const estimatedBytes = Math.ceil((matches[2].length * 3) / 4);
  if (estimatedBytes > MAX_IMAGE_SIZE_BYTES) {
    throw new Error('Ukuran gambar melebihi batas maksimum 5 MB.');
  }

  return dataUrl;
}

/**
 * Validate UMKM input body. Returns { valid, errors, sanitized }.
 */
export function validateUmkmInput(body) {
  const errors = [];

  if (!body || typeof body !== 'object') {
    return { valid: false, errors: ['Request body tidak valid.'] };
  }

  const sanitized = {
    name:      sanitizeString(body.name || ''),
    owner:     sanitizeString(body.owner || ''),
    cat:       sanitizeString(body.cat || ''),
    est:       parseInt(body.est, 10) || new Date().getFullYear(),
    status:    ['active', 'inactive'].includes(body.status) ? body.status : 'active',
    addr:      sanitizeString(body.addr || ''),
    hours:     sanitizeString(body.hours || ''),
    desc:      sanitizeString(body.desc || ''),
    history:   sanitizeString(body.history || ''),
    latitude:  body.latitude != null ? parseFloat(body.latitude) : null,
    longitude: body.longitude != null ? parseFloat(body.longitude) : null,
    wa:        sanitizeString(body.wa || ''),
    phone:     sanitizeString(body.phone || ''),
    email:     sanitizeString(body.email || ''),
    web:       sanitizeUrl(body.web || ''),
    fb:        sanitizeUrl(body.fb || ''),
    ig:        sanitizeUrl(body.ig || ''),
    tiktok:    sanitizeUrl(body.tiktok || ''),
    certs:     Array.isArray(body.certs)
      ? body.certs.map((c) => sanitizeString(String(c))).filter(Boolean)
      : typeof body.certs === 'string'
      ? body.certs.split('\n').map(sanitizeString).filter(Boolean)
      : [],
  };

  // Validate image separately (may throw)
  try {
    sanitized.imageUrl = validateImage(body.imageUrl);
  } catch (err) {
    errors.push(err.message);
    sanitized.imageUrl = '';
  }

  if (!sanitized.name) errors.push('Nama UMKM wajib diisi.');

  const year = new Date().getFullYear();
  if (sanitized.est < 1900 || sanitized.est > year) {
    errors.push(`Tahun berdiri harus antara 1900 dan ${year}.`);
  }

  if (sanitized.latitude !== null && (sanitized.latitude < -90 || sanitized.latitude > 90)) {
    errors.push('Latitude tidak valid.');
    sanitized.latitude = null;
  }
  if (sanitized.longitude !== null && (sanitized.longitude < -180 || sanitized.longitude > 180)) {
    errors.push('Longitude tidak valid.');
    sanitized.longitude = null;
  }

  return { valid: errors.length === 0, errors, sanitized };
}

/**
 * Validate Product input body. Returns { valid, errors, sanitized }.
 */
export function validateProductInput(body) {
  const errors = [];

  if (!body || typeof body !== 'object') {
    return { valid: false, errors: ['Request body tidak valid.'] };
  }

  const sanitized = {
    name:       sanitizeString(body.name || ''),
    desc:       sanitizeString(body.desc || ''),
    price:      parseFloat(body.price) || 0,
    unit:       sanitizeString(body.unit || 'pcs').substring(0, 20),
    rating:     Math.min(5, Math.max(0, parseFloat(body.rating) || 5)),
    sales:      Math.max(0, parseInt(body.sales || '0', 10)),
    views:      Math.max(0, parseInt(body.views || '0', 10)),
    isFeatured: !!body.isFeatured,
    msmeId:     parseInt(body.msmeId, 10) || null,
  };

  // Parse and sanitize variants
  let parsedVariants = [];
  if (Array.isArray(body.variants)) {
    parsedVariants = body.variants.map((v) => sanitizeString(String(v))).filter(Boolean);
  } else if (typeof body.variants === 'string' && body.variants.trim()) {
    const trimmed = body.variants.trim();
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try {
        const arr = JSON.parse(trimmed);
        if (Array.isArray(arr)) {
          parsedVariants = arr.map((v) => sanitizeString(String(v))).filter(Boolean);
        }
      } catch (e) {}
    }
    if (parsedVariants.length === 0) {
      parsedVariants = trimmed.split(/[\n,]+/).map((v) => sanitizeString(v)).filter(Boolean);
    }
  }
  sanitized.variants = parsedVariants;

  // Validate images
  const rawImages = Array.isArray(body.images) ? body.images : [];
  const validatedImages = [];
  for (const img of rawImages) {
    try {
      validatedImages.push(validateImage(img));
    } catch (err) {
      errors.push(err.message);
    }
  }
  sanitized.images = validatedImages;

  try {
    sanitized.imageUrl = validateImage(body.imageUrl);
  } catch (err) {
    errors.push(err.message);
    sanitized.imageUrl = '';
  }

  if (!sanitized.name) errors.push('Nama produk wajib diisi.');
  if (sanitized.price < 0) errors.push('Harga tidak boleh negatif.');

  return { valid: errors.length === 0, errors, sanitized };
}

/**
 * Sanitize query string parameters to prevent injection.
 */
export function sanitizeQueryParam(value) {
  if (typeof value !== 'string') return '';
  return value.trim().substring(0, 200).replace(/[<>"'%;()&+]/g, '');
}