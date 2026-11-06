-- Expand the allowed export / conversion formats for the formats the engine now
-- renders: embroidery (DST, PES, JEF), CNC (G-code), 3D (3MF, STL, OBJ) and
-- colour separation (stored as a ZIP archive).
--
-- `ai`, `cdr` and `lottie` stay allowed so historical rows keep validating;
-- no exporter produces them, so new requests cannot ask for them.

alter table public.exports drop constraint if exists exports_format_check;
alter table public.exports
  add constraint exports_format_check
  check (format in (
    'svg', 'png', 'pdf', 'dxf', 'eps', 'gcode',
    'dst', 'pes', 'jef',
    '3mf', 'stl', 'obj',
    'color-separation'
  ));

alter table public.conversions drop constraint if exists conversions_output_format_check;
alter table public.conversions
  add constraint conversions_output_format_check
  check (output_format in (
    'svg', 'dxf', 'eps', 'ai', 'pdf', 'cdr', 'lottie', 'gcode',
    'dst', 'pes', 'jef',
    '3mf', 'stl', 'obj',
    'color-separation'
  ));