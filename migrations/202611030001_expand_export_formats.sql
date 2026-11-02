alter table public.exports drop constraint if exists exports_format_check;
alter table public.exports
  add constraint exports_format_check
  check (format in ('svg', 'png', 'pdf', 'dxf', 'eps', 'gcode', 'dst', 'pes', 'jef'));
